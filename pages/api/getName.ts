import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await fetch('https://colornames.org/search/json/?hex=' + req.body.hex, {
      method: 'post',
      headers: {'Content-Type': 'application/json'}
    })
    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    res.status(405).json(error)
  }
}
