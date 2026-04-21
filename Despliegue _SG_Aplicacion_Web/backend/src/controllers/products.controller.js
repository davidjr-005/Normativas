const { supabase, supabaseAdmin } = require('../services/supabase');

exports.getAll = async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

exports.getWithDiscount = async (req, res) => {
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('is_adoptant')
    .eq('id', req.user.id)
    .single()

  if (!profile?.is_adoptant) {
    return res.status(403).json({ error: 'Solo disponible para adoptantes' })
  }

  const { data, error } = await supabaseAdmin
    .from('products')
    .select('id, name, description, category, stock, price, discounted_price')

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

exports.create = async (req, res) => {
  const { name, description, price, discounted_price, stock, category } = req.body
  const { data, error } = await supabaseAdmin
    .from('products')
    .insert([{ name, description, price, discounted_price, stock, category }])
    .select()

  if (error) return res.status(400).json({ error: error.message })
  res.json(data[0])
}