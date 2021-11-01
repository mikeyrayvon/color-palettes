// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'

const ENDPOINT = 'https://colornames.org/search/json/?hex='

export default async (
  req: NextApiRequest, 
  res: NextApiResponse
) => {
  try {
    const response = await fetch(ENDPOINT + req.body.hex);
    if (response.status === 200) {
      const data: any = await response.json();
      res.statusCode = 200
      res.json(data)
    } else { 
      const error: any = await response.json();
      res.statusCode = response.status
      res.json(error)
    }
  } catch (err) {
    res.statusCode = 500
    res.json(err)
  }
  
  
}
