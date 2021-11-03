import React, { useState } from "react";
import { useAppContext } from "../utils/store";
import { Color, Palette } from "../utils/types"
import ColorPicker from "./ColorPicker";
import NewColor from "./NewColor";

interface Props {
  palette: Palette
}

const ColorPalette: React.FC<Props> = ({ palette }) => {
  const { 
    colors, 
    handleDroppedColor 
  } = useAppContext()

  const [dragId, setDragId] = useState<null | number>(null)
  
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

  const renderColors = () => {
    const paletteColors = palette?.colors?.map(colorId => {
      return colors.find(c => c.id === colorId)
    })
    const paletteOrdered = paletteColors?.sort((a, b) => {
      if (a && b)
        return a.order - b.order
      return 0
    })
    return (
      paletteOrdered?.map(c => {
        if (c !== undefined) {
          return (
            <ColorPicker 
              key={`${c.id}`}
              paletteId={palette.id}
              color={c} 
              handleDrag={handleDrag}
              handleDrop={handleDrop}
              />
          )
        }
        return
      })
    )
  } 
  
  return (
    <div className='flex flex-wrap'>
      <h2>{palette.title}</h2>
      <p>{palette.description}</p>
      {renderColors()}
      <NewColor paletteId={palette.id} />
    </div>
  )
}

export default ColorPalette
