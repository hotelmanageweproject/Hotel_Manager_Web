import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import db from '../../../config/db.js';

const router_service = express.Router();
router_service.use(express.static(path.join(__dirname, 'public/browse/service')));
router_service.use(express.urlencoded({ extended: true }));

router_service.get('/', async (req, res) => {
  const query = `SELECT * FROM services LIMIT 10`;
  try {
      const result = await db.query(query);
      res.render('browse/service/index.ejs', { data: result.rows});
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }});

export default router_service;