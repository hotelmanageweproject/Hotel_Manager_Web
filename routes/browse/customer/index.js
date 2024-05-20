import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import db from '../../../config/db.js';
import { getCustomers } from '../../../models/customer.js';
import { Parser } from 'json2csv';
import multer from 'multer';
import csvParser from 'csv-parser';
import fs from 'fs';

const router_cus = express.Router();
router_cus.use(express.static(path.join(__dirname, 'public/browse/customer')));
router_cus.use(express.urlencoded({ extended: true }));



router_cus.get('/', async (req, res) => {
  const searchQuery = req.query.search;
  console.log('searchQuery:', searchQuery);
  const page = req.query.page ? parseInt(req.query.page) : 0;
  try {
    const data = await getCustomers(searchQuery, page);
    res.render('browse/customer/index.ejs', { data: data, page: page, searchQuery: searchQuery });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router_cus.get('/export', async (req, res) => {
  try {
    const searchQuery = req.query.search;
    const page = req.query.page ? parseInt(req.query.page) : 0;
    const data = await getCustomers(searchQuery, page);
    const json2csv = new Parser();
    const csv = json2csv.parse(data);
    res.header('Content-Type', 'text/csv');
    res.attachment('customers.csv');
    return res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router_cus.post('/addCustomer', (req, res) => {
  const {customer_id, cccd_passport, first_name, last_name, birthday, gender, email, phone, address } = req.body;

  const query = `
    INSERT INTO customers (customer_id, cccd_passport, first_name, last_name, birthday, gender, email, phone, address)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  `;

  const values = [customer_id, cccd_passport, first_name, last_name, birthday, gender, email, phone, address];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error executing query', err.stack);
      res.status(500).send('Error adding customer');
    } else {
      console.log('Customer added successfully');
      res.redirect('/browse/customer');
    }
  });
});

router_cus.post('/deleteCustomer', (req, res) => {
  const {customer_id} = req.body;

  const query = `DELETE FROM customers WHERE customer_id = $1`;
  db.query(query, [customer_id], (err, result) => {
    if (err) {
      console.error('Error executing query', err.stack);
      res.status(500).send('Error deleting customer');
    } else {
      console.log('Customer deleted successfully');
      res.redirect('/browse/customer');
    }
  });
});

router_cus.post('/updateCustomer', async (req, res) => {
  const { customer_id, cccd_passport, first_name, last_name, birthday, gender, email, phone, address } = req.body;
  console.log('Updating customer:', req.body);
  try {
    await updateCustomer(customer_id, { cccd_passport, first_name, last_name, birthday, gender, email, phone, address });
    res.redirect('/browse/customer');
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).send('Error updating customer');
  }
});

async function updateCustomer(customer_id, fields) {
  const updates = [];
  for (let key in fields) {
    if (fields[key] !== undefined && fields[key] !== '') {
      updates.push(`${key} = '${fields[key]}'`);
    }
  }
  if (updates.length > 0) {
    const query = `UPDATE customers SET ${updates.join(', ')} WHERE customer_id = '${customer_id}'`;
    await db.query(query);
  }
}
export default router_cus;