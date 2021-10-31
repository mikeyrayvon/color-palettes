interface Props {
  addColor(): void
}

const NewColor: React.FC<Props> = ({ addColor }) => {
  return (
    <div className='pb-12'>
      <button className='m-4 w-24 h-24 rounded-full bg-gray-200 text-3xl font-bold text-gray-500 flex justify-center items-center shadow-xl' onClick={addColor}>+</button>
    </div>
  )
}

export default NewColor