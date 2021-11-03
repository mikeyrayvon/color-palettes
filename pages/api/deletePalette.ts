import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL ?? ''
const supabaseKey = process.env.SUPABASE_KEY ?? ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try{
    const { data, error } = await supabase
    .from('Palettes')
    .delete()
    .match({ id: req.body.id })

    if (error) {
      res.statusCode = 500
      res.json(error)
    } else {
      res.statusCode = 200
      res.json(data)
    }
  } catch (err) {
    console.error(err)
    res.statusCode = 500
    res.json(err)
  }
}