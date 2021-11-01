import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { supabaseUrl } from '../../utils/constants'

const supabaseKey = process.env.SUPABASE_KEY ?? ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try{
    const { data, error } = await supabase
    .from('Palette')
    .insert([req.body.color], { upsert: true })

    if (error) {
      res.statusCode = 500
      res.json(error)
    } else {
      res.statusCode = 200
      res.json(data)
    }
  } catch (err) {
    res.statusCode = 500
    res.json(err)
  }
}