import type { Color } from '../utils/types'

interface Props {
  color: Color
  updateColor(color: Color, hex: string): void
  updateName(color: Color): void
}

const ColorPicker: React.FC<Props> = ({ color, updateColor, updateName }) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateColor(color, e.target.value)
  }

  return (
    <div className='flex flex-col text-center items-center py-4 w-32'>
      <label className='block w-24 h-24 rounded-full shadow-xl mb-4' style={{
        backgroundColor: color?.hex
      }} htmlFor='color' onBlur={() => updateName(color)}>
        <input 
          className='w-24 h-24 opacity-0' 
          type='color' 
          name='color'
          value={color?.hex} 
          onInput={handleChange} 
          />
      </label>
      <div className='text-xs flex flex-col'>
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