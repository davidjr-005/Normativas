const { supabase, supabaseAdmin } = require('../services/supabase');

exports.getPets = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('pets')
      .select('*')
      .eq('status', 'disponible');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getAll = async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('adoptions')
    .select('*, pets(name, species, breed)');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.adopt = async (req, res) => {
  const { pet_id } = req.body;
  const user_id = req.user.id;

  if (!pet_id) return res.status(400).json({ error: 'Falta pet_id' });

  const { error: petError } = await supabaseAdmin
    .from('pets')
    .update({ status: 'adoptado' })
    .eq('id', pet_id)

  if (petError) return res.status(500).json({ error: petError.message })

  const { data, error } = await supabaseAdmin
    .from('adoptions')
    .insert({ pet_id, user_id, adopted_at: new Date() }) // ← adopted_at
    .select()

  if (error) return res.status(500).json({ error: error.message })

  await supabaseAdmin
    .from('profiles')
    .update({ is_adoptant: true })
    .eq('id', user_id)

  res.json({ message: '¡Adopción completada!', adoption: data[0] })
}