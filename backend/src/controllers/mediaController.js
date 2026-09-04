import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, '../../data/media.json');

const readData = () => {
  try {
    if (!fs.existsSync(dataFilePath)) return [];
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};
const writeData = (data) => {
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing media.json', err);
  }
};

export const listMedia = async (req, res) => {
  try {
    const media = readData();
    res.json({ success: true, media });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createMedia = async (req, res) => {
  try {
    const { title, type, description, mainImage, gallery, link, date } = req.body;
    const mediaList = readData();
    const newMedia = {
      id: crypto.randomUUID(),
      title, type, description, mainImage, gallery: gallery || [], link,
      date: date || new Date().toISOString(),
      created_at: new Date().toISOString()
    };
    mediaList.unshift(newMedia);
    writeData(mediaList);
    res.status(201).json({ success: true, media: newMedia, message: 'Media created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, description, mainImage, gallery, link, date } = req.body;
    const mediaList = readData();
    const index = mediaList.findIndex(m => m.id === id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Not found' });
    mediaList[index] = { ...mediaList[index], title, type, description, mainImage, gallery, link, date };
    writeData(mediaList);
    res.json({ success: true, media: mediaList[index], message: 'Media updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const mediaList = readData();
    const newMedia = mediaList.filter(m => m.id !== id);
    writeData(newMedia);
    res.json({ success: true, message: 'Media deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
