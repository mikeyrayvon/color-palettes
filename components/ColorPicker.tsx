import type { Color } from '../utils/types'

interface Props {
  color: Color
  updateValues(color: Color, hex: string): void
  updateColor(color: Color): void
  deleteColor(id: number): void
  reorderColor(id: number, oldOrder: number, newOrder: number): void
  paletteLength: number
}

const ColorPicker: React.FC<Props> = ({ 
  color, 
  updateColor, 
  updateValues, 
  deleteColor, 
  reorderColor, 
  paletteLength 
}) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateValues(color, e.target.value)
  }

  return (
    <div className='flex flex-col text-center items-center py-4 w-32 relative'>
      <input 
        className='w-0 h-0 opacity-0 absolute left-0' 
        type='color' 
        id={`color_${color.id}`}
        name={`color_${color.id}`}
        value={color?.hex} 
        onInput={handleChange} 
        onBlur={() => updateColor(color)}
        />
      <label 
        className='block w-24 h-24 rounded-full shadow-xl mb-4' 
        style={{
          backgroundColor: color?.hex
        }} 
        htmlFor={`color_${color.id}`} 
        />
      <div className='absolute top-0 right-0 flex'>
        {color?.order > 1 &&
          <button onClick={() => reorderColor(color.id, color.order, color.order - 1)}>&larr;</button>
        }
        {color?.order < paletteLength &&
          <button onClick={() => reorderColor(color.id, color.order, color.order + 1)}>&rarr;</button>
        }
        <button onClick={() => deleteColor(color.id)}>X</button>
      </div>
      <div className='text-xs flex flex-col justify-end'>
        {color?.name && 
          <span className='mb-2 font-bold text-gray-800'>{color.name}</span>
        }
        {color?.hex && 
          <span className='text-gray-500'>{color.hex}</span>
        }
        {color?.rgb && 
          <span className='text-gray-500'>rgb({color.rgb})</span>
        }
      </div>
    </div>
  )
}

export default ColorPicker