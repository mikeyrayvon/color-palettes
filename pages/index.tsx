import type { NextPage } from 'next'
import { createClient } from '@supabase/supabase-js'
import Layout from '../components/Layout'
import Container from '../components/Container'
import { Color, Palette } from '../utils/types'
import ColorPicker from '../components/ColorPicker'
import NewColor from '../components/NewColor'
import { initialColor } from '../utils/constants'
import { assignPaletteNewOrder, hexToRGB, sortPaletteByOrder, uniqueId } from '../utils/tools'
import { postData } from '../utils/api'
import React, { useEffect, useState } from 'react'
import { useAppContext } from '../utils/store'

interface Props {
  data: {}
  error: {}
}
const Landing: NextPage<Props> = ({ data, error }) => {
  const { 
    palettes, 
    colors, 
    setInitialData,
    handleDroppedColor 
  } = useAppContext()
  const [dragId, setDragId] = useState<null | number>(null)

  useEffect(() => {
    if (data) {
      setInitialData(data)
    }
  }, [])

  const handleDrag = (e: React.DragEvent) => {
    setDragId(parseInt(e.currentTarget.id))
  };

  const handleDrop = (e: React.DragEvent) => {
    const dragColor: Color | undefined = colors.find(c => c.id === dragId)
    const dropColor: Color | undefined = colors.find(c => c.id === parseInt(e.currentTarget.id))

    if (dragColor && dropColor) {
      handleDroppedColor(dragColor, dropColor)
    }
  }

  return (
    <Layout>
      <Container>
        <div className='py-20'>
          <h1 className='text-3xl font-bold mb-12'>Colors</h1>
          <div className='flex flex-wrap'>
            {colors.length > 0 &&
              colors.map(c => {
                return (<ColorPicker 
                  key={`color_${c.id}`}
                  color={c} 
                  handleDrag={handleDrag}
                  handleDrop={handleDrop}
                  />)
              })
            }
            <NewColor />
          </div>
        </div>
      </Container>
    </Layout>
  )
}

export const getServerSideProps = async () => {
  const supabaseUrl = process.env.SUPABASE_URL ?? ''
  const supabaseKey = process.env.SUPABASE_KEY ?? ''
  const supabase = createClient(supabaseUrl, supabaseKey)

  let { data: Palette, error } = await supabase
  .from('Palette')
  .select('*')

  return {
    props: {
      data: {
        colors: Palette
      },
      error
    }
  }
}

export default Landing