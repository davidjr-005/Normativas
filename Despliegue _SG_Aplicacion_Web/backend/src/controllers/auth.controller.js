const { supabase, supabaseAdmin } = require('../services/supabase');

exports.register = async (req, res) => {
  const { email, password, full_name } = req.body;
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email, password,
    user_metadata: { full_name }
  });
  if (error) return res.status(400).json({ error: error.message });

  await supabaseAdmin.from('profiles').insert({
    id: data.user.id, email, full_name, role: 'cliente'
  });

  res.json({ message: 'Usuario creado', user: data.user });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email y contraseña requeridos' });

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return res.status(401).json({ error: error.message });

  res.json({
    message: 'Login correcto',
    token: data.session.access_token,
    user: data.user
  });
};

exports.getProfile = async (req, res) => {
  const { data } = await supabaseAdmin
    .from('profiles').select('*').eq('id', req.user.id).single();
  res.json(data);
};

exports.getUsers = async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}
exports.registerOAuth = async (req, res) => {
  const { id, email, full_name } = req.body

  // Verificar si ya existe
  const { data: existing } = await supabaseAdmin
    .from('profiles')
    .select('*').eq('id', id).single()

  if (existing) return res.json(existing)

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .insert({ id, email, full_name, role: 'cliente' })
    .select()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
}