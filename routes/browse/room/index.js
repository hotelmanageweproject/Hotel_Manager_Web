import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import db from '../../../config/db.js';

const router_room = express.Router();
router_room.use(express.static(path.join(__dirname, 'public/browse/room')));
router_room.use(express.urlencoded({ extended: true }));

router_room.get('/', async (req, res) => {
  const searchQuery = req.query.search;
  const page = req.query.page ? parseInt(req.query.page) : 0;
  const limit = 10;
  const offset = page * limit;
  let query = `SELECT * FROM rooms WHERE room_id::text LIKE '%${searchQuery}%' OR CCCD LIKE '%${searchQuery}%' OR first_name LIKE '%${searchQuery}%' OR last_name LIKE '%${searchQuery}%' OR position LIKE '%${searchQuery}%' OR department_id LIKE '%${searchQuery}%' OR email LIKE '%${searchQuery}%' OR phone LIKE '%${searchQuery}%' OR address LIKE '%${searchQuery}%' OR salary LIKE '%${searchQuery}%' OR start_date LIKE '%${searchQuery}%' OR end_date LIKE '%${searchQuery}%' LIMIT ${limit} OFFSET ${offset}`;
  if (!searchQuery) {
    query = `SELECT * FROM rooms LIMIT ${limit} OFFSET ${offset}`;
  }
  try {
      const result = await db.query(query);
      res.render('browse/room/index.ejs', { data: result.rows, page: page, searchQuery: searchQuery });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
});

router_room.post('/addEmployee', (req, res) => {
  const {room_id, CCCD, first_name, last_name, position, department_id , email , phone, address, salary, start_date, end_date} = req.body;

  const query = `
    INSERT INTO rooms (room_id, CCCD, first_name, last_name, position, department_id , email , phone, address, salary, start_date, end_date)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  `;

  const values = [room_id, CCCD, first_name, last_name, position, department_id , email , phone, address, salary, start_date, end_date];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error executing query', err.stack);
      res.status(500).send('Error adding room');
    } else {
      console.log('Employee added successfully');
      res.redirect('/browse/room');
    }
  });
});

router_room.post('/deleteEmployee', (req, res) => {
  const {room_id} = req.body;
  const query = `DELETE FROM rooms WHERE room_id = $1`;
  db.query(query, [room_id], (err, result) => {
    if (err) {
      console.error('Error executing query', err.stack);
      res.status(500).send('Error deleting room');
    } else {
      console.log('Employee deleted successfully');
      res.redirect('/browse/room');
    }
  });
});

router_room.post('/updateEmployee', async (req, res) => {
  const { room_id, CCCD, first_name, last_name, position, department_id , email , phone, address, salary, start_date, end_date} = req.body;
  console.log('Updating room:', req.body);
  try {
    await updateBook(room_id, {CCCD, first_name, last_name, position, department_id , email , phone, address, salary, start_date, end_date});
    res.redirect('/browse/room');
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).send('Error updating room');
  }
});

async function updateBook(room_id, fields) {
  const updates = [];
  for (let key in fields) {
    if (fields[key] !== undefined && fields[key] !== '') {
      updates.push(`${key} = '${fields[key]}'`);
    }
  }
  if (updates.length > 0) {
    const query = `UPDATE rooms SET ${updates.join(', ')} WHERE room_id = '${room_id}'`;
    await db.query(query);
  }
}

export default router_room;