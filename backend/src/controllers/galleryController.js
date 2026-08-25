import { supabase } from '../config/supabase.js';

export const listGallery = async (req, res) => {
  const { data: gallery, error } = await supabase.from('moments_gallery').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: false });
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.status(200).json({ success: true, gallery });
};

export const createGallery = async (req, res) => {
  const { data: gallery, error } = await supabase.from('moments_gallery').insert([req.body]).select().single();
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.status(201).json({ success: true, gallery });
};

export const updateGallery = async (req, res) => {
  const { id } = req.params;
  const { data: gallery, error } = await supabase.from('moments_gallery').update(req.body).eq('id', id).select().single();
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.status(200).json({ success: true, gallery });
};

export const deleteGallery = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('moments_gallery').delete().eq('id', id);
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.status(200).json({ success: true });
};
