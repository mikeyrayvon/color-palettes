import { createContext, useContext, useState } from 'react'
import { postData } from './api'
import { initialColor, initialPalette } from './constants'
import { assignPaletteNewOrder, hexToRGB, sortPaletteByOrder, uniqueId } from './tools'
import { Color, Palette } from './types'

interface AppContextValue {
  palettes: Palette[] | []
  colors: Color[] | []
  setInitialData(data: {}): void
  addColor(paletteId: number): void
  addPalette(): void
  updateValues(color: Color, hex: string): void
  updateColor(color: Color): void
  deleteColor(colorId: number, paletteId: number): void
  handleDroppedColor(dragColor: Color, dropColor: Color): void | null
}

const AppContext = createContext<AppContextValue>({
  palettes: [],
  colors: [],
  setInitialData: () => {},
  addColor: () => {},
  addPalette: () => {},
  updateValues: () => {},
  updateColor: () => {},
  deleteColor: () => {},
  handleDroppedColor: () => {}
})

const AppContextProvider: React.FC = ({ children }) => {
  const [palettes, setPalettes] = useState<Palette[]>([])
  const [colors, setColors] = useState<Color[]>([])

  const setInitialData = (data: {
    colors: Color[],
    palettes: Palette[]
  }) => {
    setColors(data.colors)
    setPalettes(data.palettes)
  }

  const addColor = (paletteId: number) => {
    const palette = palettes.find(p => {
      return p.id === paletteId
    })
    const colorId = uniqueId()
    const color = {
      ...initialColor,
      id: colorId,
      order: palette?.colors ? palette?.colors.length + 1 : 1
    }
    const updatedPalettes = palettes.map(p => {
      if (p.id === paletteId) {
        return {
          ...p, 
          colors: [
            ...p.colors,
            colorId
          ]
        }
      }
      return p
    })

    setColors((prevColors) => {
      return [
        ...prevColors,
        color
      ]
    })
    setPalettes(updatedPalettes)

    postData('/api/upsertPalette', { palette: {
      ...palette,
      colors: [
        ...palette?.colors || [],
        colorId
      ]
    } })
    postData('/api/upsertColor', { color })
  }

  const addPalette = () => {
    const palette = {
      ...initialPalette,
      id: uniqueId(),
      colors: []
    }
    setPalettes((prevPalettes) => {
      return [
        ...prevPalettes,
        palette
      ]
    })
    postData('/api/upsertPalette', { palette })
  }

  const updateValues = (color: Color, hex: string) => {
    const rgb: number[] | boolean = hexToRGB(hex.slice(1))
    const updatedColor: Color = {
      ...color,
      name: '...',
      hex,
      rgb: rgb ? rgb.toString() : ''
    }    
    setColors(prevColors => {
      return prevColors.map(c => c.id === color.id ? updatedColor : c)
    })
  }

  const updateColor = async (color: Color) => {
    const response = await postData('/api/getName', {
      hex: color.hex.slice(1)
    })
    if (response?.colors) {
      const updatedColor = {
        ...color, 
        name: response.colors[0].name
      }
      setColors(prevColors => {
        return prevColors.map(c => c.id === color.id ? updatedColor : c)
      })
      postData('/api/upsertColor', { color: updatedColor })
    } else {
      console.error(response)
    }
  }

  const deleteColor = (colorId: number, paletteId: number) => {
    const updatedColors = colors.filter(c => c.id !== colorId)
    const palette = palettes.find(p => p.id === paletteId)
    const filteredColors = palette?.colors.filter(id => id !== colorId)
    const updatedPalettes = palettes.map(p => {
      if (p.id === paletteId && filteredColors) {
        return {
          ...p,
          colors: filteredColors
        }
      }
      return p
    })
    setColors(updatedColors)
    setPalettes(updatedPalettes)
    postData('/api/deleteColor', { id: colorId })
    postData('/api/upsertPalette', { palette: {
      ...palette,
      colors: filteredColors
    } })
  } 

  const handleDroppedColor = (dragColor: Color, dropColor: Color) => {
    if (dragColor && dropColor) {
      const reordered = colors.map((c): Color => {
        if (c.id === dragColor.id) {
          const updatedColor = {
            ...c, 
            order: dropColor.order
          }
          postData('/api/upsertColor', { color: updatedColor })
          return updatedColor
        }
        if (c.id === dropColor.id) {
          const updatedColor = {
            ...c, 
            order: dragColor.order
          }
          postData('/api/upsertColor', { color: updatedColor })
          return updatedColor
        }
        return c
      })
      const sorted = sortPaletteByOrder(reordered)
      const updated = assignPaletteNewOrder(sorted)
      setColors(updated)
    }
  }

  return (
    <AppContext.Provider
      value={{
        palettes,
        colors,
        setInitialData,
        addColor,
        addPalette,
        updateValues,
        updateColor,
        deleteColor,
        handleDroppedColor
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

const useAppContext = () => useContext(AppContext)

export { AppContext as default, AppContextProvider, useAppContext }