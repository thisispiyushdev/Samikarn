import { supabase } from '../config/supabase.js';

export const listCauses = async (req, res) => {
  const { data: causes, error } = await supabase.from('causes').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.status(200).json({ success: true, causes });
};

export const createCause = async (req, res) => {
  const { data: cause, error } = await supabase.from('causes').insert([req.body]).select().single();
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.status(201).json({ success: true, cause });
};

export const updateCause = async (req, res) => {
  const { id } = req.params;
  const { data: cause, error } = await supabase.from('causes').update(req.body).eq('id', id).select().single();
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.status(200).json({ success: true, cause });
};

export const deleteCause = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('causes').delete().eq('id', id);
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.status(200).json({ success: true });
};
