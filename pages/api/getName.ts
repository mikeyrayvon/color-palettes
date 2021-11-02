import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await axios.get('https://colornames.org/search/json/?hex=' + req.body.hex)
    res.json(response.data)
    res.status(200).end()
  } catch (error) {
    res.json(error)
    res.status(405).end()
  }
}
