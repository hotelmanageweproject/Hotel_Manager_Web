import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import db from '../../../config/db.js';

const router_employee = express.Router();
router_employee.use(express.static(path.join(__dirname, 'public/browse/employee')));
router_employee.use(express.urlencoded({ extended: true }));

router_employee.get('/', async (req, res) => {
  const searchQuery = req.query.search;
  const page = req.query.page ? parseInt(req.query.page) : 0;
  const limit = 10;
  const offset = page * limit;
  let query = `SELECT * FROM employees WHERE employee_id::text LIKE '%${searchQuery}%' OR CCCD LIKE '%${searchQuery}%' OR first_name LIKE '%${searchQuery}%' OR last_name LIKE '%${searchQuery}%' OR position LIKE '%${searchQuery}%' OR department_id LIKE '%${searchQuery}%' OR email LIKE '%${searchQuery}%' OR phone LIKE '%${searchQuery}%' OR address LIKE '%${searchQuery}%' OR salary LIKE '%${searchQuery}%' OR start_date LIKE '%${searchQuery}%' OR end_date LIKE '%${searchQuery}%' LIMIT ${limit} OFFSET ${offset}`;
  if (!searchQuery) {
    query = `SELECT * FROM employees LIMIT ${limit} OFFSET ${offset}`;
  }
  try {
      const result = await db.query(query);
      res.render('browse/employee/index.ejs', { data: result.rows, page: page, searchQuery: searchQuery });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
});

router_employee.post('/addEmployee', (req, res) => {
  const {employee_id, CCCD, first_name, last_name, position, department_id , email , phone, address, salary, start_date, end_date} = req.body;

  const query = `
    INSERT INTO employees (employee_id, CCCD, first_name, last_name, position, department_id , email , phone, address, salary, start_date, end_date)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  `;

  const values = [employee_id, CCCD, first_name, last_name, position, department_id , email , phone, address, salary, start_date, end_date];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error executing query', err.stack);
      res.status(500).send('Error adding employee');
    } else {
      console.log('Employee added successfully');
      res.redirect('/browse/employee');
    }
  });
});

router_employee.post('/deleteEmployee', (req, res) => {
  const {employee_id} = req.body;
  const query = `DELETE FROM employees WHERE employee_id = $1`;
  db.query(query, [employee_id], (err, result) => {
    if (err) {
      console.error('Error executing query', err.stack);
      res.status(500).send('Error deleting employee');
    } else {
      console.log('Employee deleted successfully');
      res.redirect('/browse/employee');
    }
  });
});

router_employee.post('/updateEmployee', async (req, res) => {
  const { employee_id, CCCD, first_name, last_name, position, department_id , email , phone, address, salary, start_date, end_date} = req.body;
  console.log('Updating employee:', req.body);
  try {
    await updateBook(employee_id, {CCCD, first_name, last_name, position, department_id , email , phone, address, salary, start_date, end_date});
    res.redirect('/browse/employee');
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).send('Error updating employee');
  }
});

async function updateBook(employee_id, fields) {
  const updates = [];
  for (let key in fields) {
    if (fields[key] !== undefined && fields[key] !== '') {
      updates.push(`${key} = '${fields[key]}'`);
    }
  }
  if (updates.length > 0) {
    const query = `UPDATE employees SET ${updates.join(', ')} WHERE employee_id = '${employee_id}'`;
    await db.query(query);
  }
}

export default router_employee;