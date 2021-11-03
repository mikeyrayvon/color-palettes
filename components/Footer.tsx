import Link from 'next/link'

import Container from './Container'

const Footer: React.FC = () => {
  return (
    <footer className='pb-12'>
      <Container>
        <div>
          <span className='text-xs text-gray-400'>Rudimentary clone of Fronity Color Palette component by Michael Ray-Von</span>
        </div>
      </Container>
    </footer>
  )
};

export default Footer
