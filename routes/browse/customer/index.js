import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import db from '../../../config/db.js';

const router_cus = express.Router();
router_cus.use(express.static(path.join(__dirname, 'public/browse/customer')));
router_cus.use(express.urlencoded({ extended: true }));

router_cus.get('/', async(req, res) => {
  const query = `SELECT * FROM customers LIMIT 10`;
    try {
        const result = await db.query(query);
        res.render('browse/customer/index.ejs', { data: result.rows});
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


export default router_cus;