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
  const searchQuery = req.query.search;
  const page = req.query.page ? parseInt(req.query.page) : 0;
  const limit = 10;
  const offset = page * limit;
  let query = `SELECT * FROM services WHERE service_id::text LIKE '%${searchQuery}%' OR CCCD LIKE '%${searchQuery}%' OR first_name LIKE '%${searchQuery}%' OR last_name LIKE '%${searchQuery}%' OR position LIKE '%${searchQuery}%' OR department_id LIKE '%${searchQuery}%' OR email LIKE '%${searchQuery}%' OR phone LIKE '%${searchQuery}%' OR address LIKE '%${searchQuery}%' OR salary LIKE '%${searchQuery}%' OR start_date LIKE '%${searchQuery}%' OR end_date LIKE '%${searchQuery}%' LIMIT ${limit} OFFSET ${offset}`;
  if (!searchQuery) {
    query = `SELECT * FROM services LIMIT ${limit} OFFSET ${offset}`;
  }
  try {
      const result = await db.query(query);
      res.render('browse/service/index.ejs', { data: result.rows, page: page, searchQuery: searchQuery });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
});

router_service.post('/addEmployee', (req, res) => {
  const {service_id, CCCD, first_name, last_name, position, department_id , email , phone, address, salary, start_date, end_date} = req.body;

  const query = `
    INSERT INTO services (service_id, CCCD, first_name, last_name, position, department_id , email , phone, address, salary, start_date, end_date)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  `;

  const values = [service_id, CCCD, first_name, last_name, position, department_id , email , phone, address, salary, start_date, end_date];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error executing query', err.stack);
      res.status(500).send('Error adding service');
    } else {
      console.log('Employee added successfully');
      res.redirect('/browse/service');
    }
  });
});

router_service.post('/deleteEmployee', (req, res) => {
  const {service_id} = req.body;
  const query = `DELETE FROM services WHERE service_id = $1`;
  db.query(query, [service_id], (err, result) => {
    if (err) {
      console.error('Error executing query', err.stack);
      res.status(500).send('Error deleting service');
    } else {
      console.log('Employee deleted successfully');
      res.redirect('/browse/service');
    }
  });
});

router_service.post('/updateEmployee', async (req, res) => {
  const { service_id, CCCD, first_name, last_name, position, department_id , email , phone, address, salary, start_date, end_date} = req.body;
  console.log('Updating service:', req.body);
  try {
    await updateBook(service_id, {CCCD, first_name, last_name, position, department_id , email , phone, address, salary, start_date, end_date});
    res.redirect('/browse/service');
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).send('Error updating service');
  }
});

async function updateBook(service_id, fields) {
  const updates = [];
  for (let key in fields) {
    if (fields[key] !== undefined && fields[key] !== '') {
      updates.push(`${key} = '${fields[key]}'`);
    }
  }
  if (updates.length > 0) {
    const query = `UPDATE services SET ${updates.join(', ')} WHERE service_id = '${service_id}'`;
    await db.query(query);
  }
}

export default router_service;