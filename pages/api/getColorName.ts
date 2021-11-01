import axios from 'axios'

const ENDPOINT = 'https://colornames.org/search/json/?hex='

export default async (req, res) => {
  try {
    const response = await axios.get(ENDPOINT + req.body.hex);
    if (response.status === 200) {
      res.statusCode = 200
      res.json(response.data)
    } else { 
      console.log('fetch error', response.data)
      res.statusCode = response.status
      res.json(response.data)
    }
  } catch (err) {
    res.statusCode = 500
    console.log('catch error', err)
    res.json(err)
  } 
}
