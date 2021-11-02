import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await fetch('https://colornames.org/search/json/?hex=' + req.body.hex)
    const data = await response.json()
    res.json(data)
    res.status(200)
  } catch (error) {
    res.json(error)
    res.status(405)
  }
}
