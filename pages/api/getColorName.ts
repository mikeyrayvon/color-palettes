import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const ENDPOINT = 'https://colornames.org/search/json/?hex='

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await axios(ENDPOINT + req.body.hex);
    console.log(response)
    if (response.status === 200) {
      res.statusCode = 200
      res.json(response.data)
    } else { 
      console.log('fetch error', error)
      res.statusCode = response.status
      res.json(response.data)
    }
  } catch (err) {
    res.statusCode = 500
    console.log('catch error', err)
    res.json(err)
  } 
}
