import Link from 'next/link'

import type { NextPage } from 'next'

import Layout from '../components/Layout'
import Container from '../components/Container'

const Landing: NextPage = () => {
  return (
    <Layout>
      <Container>
        
      </Container>
    </Layout>
  )
}

export const getStaticProps = async () => {
  const docs = await getClient(true).fetch(query)
  const config = await getClient().fetch(configQuery)
  return {
    props: { docs, config } // will be passed to the page component as props
  }
}

export default Landing
