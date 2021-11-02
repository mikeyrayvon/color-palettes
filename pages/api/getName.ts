import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await fetch('https://colornames.org/search/json/?hex=' + req.body.hex, {
      method: 'post',
      headers: {'Content-Type': 'application/json'}
    })
    console.log('response', response)
    const data = await response.json()
    console.log('data', data)
    res.json(JSON.stringify(data))
    res.status(200)
  } catch (error) {
    res.json(error)
    res.status(405)
  }
}
