// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'

const ENDPOINT = 'https://colornames.org/search/json/?hex='

export default async (
  req: NextApiRequest, 
  res: NextApiResponse
) => {
  const response = await fetch(ENDPOINT + req.body.hex);
  const data: any = await response.json();
  res.statusCode = 200
  res.json(data)
}
