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
    console.error('getPets error:', e);
    res.status(500).json({ error: e.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { data: adoptions, error: adoptionsError } = await supabaseAdmin
      .from('adoptions')
      .select('*');

    if (adoptionsError) {
      console.error('getAll adoptions error:', adoptionsError);
      return res.status(500).json({ error: adoptionsError.message });
    }

    const petIds = [...new Set((adoptions || []).map(a => a.pet_id).filter(Boolean))];

    let petsMap = {};

    if (petIds.length > 0) {
      const { data: pets, error: petsError } = await supabaseAdmin
        .from('pets')
        .select('id, name, species, breed, age, status, description')
        .in('id', petIds);

      if (petsError) {
        console.error('getAll pets error:', petsError);
        return res.status(500).json({ error: petsError.message });
      }

      petsMap = Object.fromEntries((pets || []).map(p => [p.id, p]));
    }

    const result = (adoptions || []).map(adoption => ({
      ...adoption,
      pets: petsMap[adoption.pet_id] || null
    }));

    return res.json(result);
  } catch (e) {
    console.error('getAll catch error:', e);
    return res.status(500).json({ error: e.message });
  }
};

exports.adopt = async (req, res) => {
  try {
    const { pet_id } = req.body;
    const user_id = req.user.id;

    if (!pet_id) return res.status(400).json({ error: 'Falta pet_id' });

    const { error: petError } = await supabaseAdmin
      .from('pets')
      .update({ status: 'adoptado' })
      .eq('id', pet_id);

    if (petError) return res.status(500).json({ error: petError.message });

    const { data, error } = await supabaseAdmin
      .from('adoptions')
      .insert({ pet_id, user_id, adopted_at: new Date() })
      .select();

    if (error) return res.status(500).json({ error: error.message });

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ is_adoptant: true })
      .eq('id', user_id);

    if (profileError) {
      console.error('profiles update error:', profileError);
    }

    return res.json({ message: '¡Adopción completada!', adoption: data?.[0] });
  } catch (e) {
    console.error('adopt catch error:', e);
    return res.status(500).json({ error: e.message });
  }
};
