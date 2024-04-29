import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import db from '../../../config/db.js';

const router_employee = express.Router();
router_employee.use(express.static(path.join(__dirname, 'public/browse/employee')));
router_employee.use(express.urlencoded({ extended: true }));

router_employee.get('/',async (req, res) => {
  const query = `SELECT * FROM employees LIMIT 10`;
  try {
      const result = await db.query(query);
      res.render('browse/employee/index.ejs', { data: result.rows});
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
});

export default router_employee;