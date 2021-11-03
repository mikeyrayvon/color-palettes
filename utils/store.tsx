import { createClient } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react'
import { postData } from './api';
import { initialColor } from './constants';
import { assignPaletteNewOrder, hexToRGB, sortPaletteByOrder, uniqueId } from './tools';
import { Color, Palette } from './types'


interface AppContextValue {
  palettes: Palette[] | []
  colors: Color[] | []
  setInitialData(data: {}): void
  addColor(): void
  updateValues(color: Color, hex: string): void
  updateColor(color: Color): void
  deleteColor(id: number): void
  handleDroppedColor(dragColor: Color, dropColor: Color): void | null
}

const AppContext = createContext<AppContextValue>({
  palettes: [],
  colors: [],
  setInitialData: () => {},
  addColor: () => {},
  updateValues: () => {},
  updateColor: () => {},
  deleteColor: () => {},
  handleDroppedColor: () => {},
})

const AppContextProvider: React.FC = ({ children }) => {
  const [palettes, setPalettes] = useState<Palette[]>([])
  const [colors, setColors] = useState<Color[]>([])

  const setInitialData = (data: {
    colors: Color[],
    palettes: Palette[]
  }) => {
    if (data?.colors) {
      setColors(data.colors)
    }
  }

  const addColor = () => {
    const newColor = {
      ...initialColor,
      id: uniqueId(),
      order: colors.length + 1
    }
    setColors((prevColors) => {
      return [
        ...prevColors,
        newColor
      ]
    })
    postData('/api/upsertColor', { color: newColor })
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
      return prevColors.map(c => c.order === updatedColor.order ? updatedColor : c)
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
        return prevColors.map(c => c.order === updatedColor.order ? updatedColor : c)
      })
      postData('/api/upsertColor', { color: updatedColor })
    } else {
      console.error(response)
    }
  }

  const deleteColor = (id: number) => {
    const filtered = colors.filter(c => c.id !== id)
    const updated = assignPaletteNewOrder(filtered)
    setColors(updated)
    postData('/api/deleteColor', { id })
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