import { NextApiRequest, NextApiResponse } from 'next'
const fetch = require('node-fetch')

const ENDPOINT = 'https://colornames.org/search/json/?hex='

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await fetch(ENDPOINT + req.body.hex);
    if (response.status === 200) {
      const data = await response.json();
      res.statusCode = 200
      res.json(data)
    } else { 
      const error = await response.json();
      console.log('fetch error', error)
      res.statusCode = response.status
      res.json(error)
    }
  } catch (err) {
    res.statusCode = 500
    console.log('catch error', err)
    res.json(err)
  } 
}
