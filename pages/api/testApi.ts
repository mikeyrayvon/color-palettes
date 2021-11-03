import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1', {
      method: 'get',
      headers: {'Content-Type': 'application/json'}
    })
    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    res.status(405).json(error)
  }
}
