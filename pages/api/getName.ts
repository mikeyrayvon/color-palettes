import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios' 

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { hex } = req.body
    const response = await axios('https://api.color.pizza/v1/' + hex)
    res.status(200).json(response.data)
  } catch (error) {
    res.json(error)
  }
}

export default handler
