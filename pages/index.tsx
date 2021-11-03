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
import ColorPalette from '../components/ColorPalette'
import NewPalette from '../components/NewPalette'

interface Props {
  data: {}
  error: {}
}
const Landing: NextPage<Props> = ({ data, error }) => {
  const { 
    palettes, 
    setInitialData
  } = useAppContext()

  useEffect(() => {
    if (data) {
      setInitialData(data)
    }
  }, [])

  return (
    <Layout>
      <Container>
        <div className='py-20'>
          <h1 className='text-3xl font-bold mb-12'>Colors</h1>
          <div>
            {palettes && palettes.length > 0 &&
              palettes.sort((a, b) => {
                if (a && b && a.created_at && b.created_at) {
                  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                }
                return 0
              })
                .map(p => {
                  return (
                    <ColorPalette key={p.id} palette={p} />
                  )
                })
            }
            <NewPalette />
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

  let { data: Palettes } = await supabase
    .from('Palettes')
    .select('*')
  let { data: Colors } = await supabase
    .from('Colors')
    .select('*')

  return {
    props: {
      data: {
        colors: Colors,
        palettes: Palettes
      }
    }
  }
}

export default Landing