import type { NextPage } from 'next'
import { useStore } from '../utils/store'
import Layout from '../components/Layout'
import Container from '../components/Container'
import { Color } from '../utils/types'
import ColorPicker from '../components/ColorPicker'
import NewColor from '../components/NewColor'
import { initialColor } from '../utils/constants'
import { hexToRGB } from '../utils/tools'
import { postData } from '../utils/api'

const Landing: NextPage = () => {
  const { state, dispatch } = useStore()

  const addColor = (): void => {
    dispatch({type: 'add color', payload: {
      ...initialColor,
      order: state.colors.length + 1
    }})
  }

  const updateColor = async (color: Color, hex: string) => {
    const rgb: number[] | boolean = hexToRGB(hex.slice(1))
    const updated: Color = {
      ...color,
      name: '...',
      hex,
      rgb: rgb ? rgb.toString() : ''
    }
    dispatch({type: 'update color', payload: updated})
  }

  const updateName = async (color: Color) => {
    const colorName = await postData('api/getColorName', {
      hex: color.hex.slice(1)
    })
    const updated: Color = {
      ...color,
      name: colorName.name ? colorName.name : 'No name',
    }
    dispatch({type: 'update color', payload: updated})
  }

  return (
    <Layout>
      <Container>
        <div className='flex flex-wrap'>
          {state?.colors.map(color => <ColorPicker 
            color={color} 
            updateColor={updateColor} 
            updateName={updateName}
            />)}
          <NewColor addColor={addColor} />
        </div>
      </Container>
    </Layout>
  )
}

export const getStaticProps = async () => {
  return {
    props: {}
  }
}

export default Landing
