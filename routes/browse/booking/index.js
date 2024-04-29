import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import db from '../../../config/db.js';

const router_book = express.Router();
router_book.use(express.static(path.join(__dirname, 'public/browse/booking')));
router_book.use(express.urlencoded({ extended: true }));

router_book.get('/', async(req, res) => {
  const query = `SELECT * FROM bookings LIMIT 10`;
  try {
      const result = await db.query(query);
      res.render('browse/booking/index.ejs', { data: result.rows});
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
});

export default router_book;