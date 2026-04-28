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
    console.log('USER EN GETALL:', req.user);

    const { data, error } = await supabaseAdmin
      .from('adoptions')
      .select('*');

    if (error) {
      console.error('getAll supabase error:', error);
      return res.status(500).json({
        error: error.message,
        details: error.details,
        hint: error.hint
      });
    }

    return res.json(data || []);
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
