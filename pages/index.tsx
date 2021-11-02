import type { NextPage } from 'next'
import { createClient } from '@supabase/supabase-js'
import Layout from '../components/Layout'
import Container from '../components/Container'
import { Color } from '../utils/types'
import ColorPicker from '../components/ColorPicker'
import NewColor from '../components/NewColor'
import { initialColor, supabaseUrl } from '../utils/constants'
import { assignPaletteNewOrder, hexToRGB, sortPaletteByOrder, uniqueId } from '../utils/tools'
import { postData } from '../utils/api'
import { useEffect, useState } from 'react'

const supabaseKey = process.env.SUPABASE_KEY ?? ''
const supabase = createClient(supabaseUrl, supabaseKey)

interface Props {
  data:[]
  error: {}
}

const Landing: NextPage<Props> = ({data, error}) => {
  const [palette, setPalette] = useState<Color[]>([])
  useEffect(() => {
    if (data && data.length > 0) {
      setPalette(sortPaletteByOrder(data))
    }
  }, [])

  const addColor = () => {
    const newColor = {
      ...initialColor,
      id: uniqueId(),
      order: palette.length + 1
    }
    setPalette((prevPalette) => {
      return [
        ...prevPalette,
        newColor
      ]
    })
    postData('api/upsertColor', { color: newColor })
  }

  const updateValues = (color: Color, hex: string) => {
    const rgb: number[] | boolean = hexToRGB(hex.slice(1))
    const updatedColor: Color = {
      ...color,
      name: '...',
      hex,
      rgb: rgb ? rgb.toString() : ''
    }    
    setPalette(prevPalette => {
      return prevPalette.map(c => c.order === updatedColor.order ? updatedColor : c)
    })
  }

  const updateColor = async (color: Color) => {
    const response = await postData('api/getColorName', {
      hex: color.hex.slice(1)
    })
    console.log(response)
    if (response && response.hexCode) {
      const updatedColor = {
        ...color, 
        name: response?.name ? response.name : 'New Color'
      }
      setPalette(prevPalette => {
        return prevPalette.map(c => c.order === updatedColor.order ? updatedColor : c)
      })
      postData('api/upsertColor', { color: updatedColor })
    } else {
      console.error(response)
    }
  }

  const deleteColor = (id: number) => {
    const filtered = palette.filter(color => color.id !== id)
    const updated = assignPaletteNewOrder(filtered)
    setPalette(updated)
    postData('api/deleteColor', { id })
  } 

  const reorderColor = (id: number, oldOrder: number, newOrder: number) => {
    const reordered = palette.map((c): Color => {
      if (c.order === newOrder && c.id !== id) {
        const updatedColor = {
          ...c, 
          order: oldOrder
        }
        postData('api/upsertColor', { color: updatedColor })
        return updatedColor
      } else if (c.id === id) {
        const updatedColor = {
          ...c, 
          order: newOrder
        }
        postData('api/upsertColor', { color: updatedColor })
        return updatedColor
      }
      return c
    })
    const sorted = sortPaletteByOrder(reordered)
    const updated = assignPaletteNewOrder(sorted)
    setPalette(updated)
  }

  return (
    <Layout>
      <Container>
        <div className='py-32'>
          <h1 className='text-3xl font-bold mb-12'>Colors</h1>
          <div className='flex flex-wrap'>
            {palette.length > 0 &&
              palette.map(color => {
                return (<ColorPicker 
                  key={`color_${color.id}`}
                  color={color} 
                  updateValues={updateValues} 
                  updateColor={updateColor}
                  deleteColor={deleteColor}
                  reorderColor={reorderColor}
                  paletteLength={palette.length}
                  />)
              })
            }
            <NewColor addColor={addColor} />
          </div>
        </div>
      </Container>
    </Layout>
  )
}

export const getServerSideProps = async () => {
  let { data: Palette, error } = await supabase
  .from('Palette')
  .select('*')

  return {
    props: {
      data: Palette,
      error
    }
  }
}

export default Landing