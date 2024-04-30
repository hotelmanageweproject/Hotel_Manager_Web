import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import db from '../../../config/db.js';

const router_book = express.Router();
router_book.use(express.static(path.join(__dirname, 'public/browse/booking')));
router_book.use(express.urlencoded({ extended: true }));

router_book.get('/', async (req, res) => {
  const searchQuery = req.query.search;
  const page = req.query.page ? parseInt(req.query.page) : 0;
  const limit = 10;
  const offset = page * limit;
  let query = `SELECT * FROM bookings WHERE booking_id::text LIKE '%${searchQuery}%' OR customer_id LIKE '%${searchQuery}%' OR room_id LIKE '%${searchQuery}%' OR number_of_adult LIKE '%${searchQuery}%' OR number_of_child LIKE '%${searchQuery}%' OR status LIKE '%${searchQuery}%' OR check_in_date LIKE '%${searchQuery}%' OR check_out_date LIKE '%${searchQuery}%' OR total_price LIKE '%${searchQuery}%' OR reservation_status LIKE '%${searchQuery}%' LIMIT ${limit} OFFSET ${offset}`;
  if (!searchQuery) {
    query = `SELECT * FROM bookings LIMIT ${limit} OFFSET ${offset}`;
  }
  try {
      const result = await db.query(query);
      res.render('browse/booking/index.ejs', { data: result.rows, page: page, searchQuery: searchQuery });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
});

router_book.post('/addBooking', (req, res) => {
  const {booking_id, customer_id, room_id, number_of_adult, number_of_child, status , check_in_date, check_out_date, total_price, reservation_status} = req.body;

  const query = `
    INSERT INTO bookings (booking_id, customer_id, room_id, number_of_adult, number_of_child, status , check_in_date, check_out_date, total_price, reservation_status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  `;

  const values = [booking_id, customer_id, room_id, number_of_adult, number_of_child, status , check_in_date, check_out_date, total_price, reservation_status];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error executing query', err.stack);
      res.status(500).send('Error adding booking');
    } else {
      console.log('Booking added successfully');
      res.redirect('/browse/booking');
    }
  });
});

router_book.post('/deleteBooking', (req, res) => {
  const {booking_id} = req.body;

  const query = `DELETE FROM bookings WHERE booking_id = $1`;
  db.query(query, [booking_id], (err, result) => {
    if (err) {
      console.error('Error executing query', err.stack);
      res.status(500).send('Error deleting booking');
    } else {
      console.log('Booking deleted successfully');
      res.redirect('/browse/booking');
    }
  });
});

router_book.post('/updateBooking', async (req, res) => {
  const { booking_id, customer_id, room_id, number_of_adult, number_of_child, status , check_in_date, check_out_date, total_price, reservation_status} = req.body;
  console.log('Updating booking:', req.body);
  try {
    await updateBook(booking_id, { customer_id, room_id, number_of_adult, number_of_child, status , check_in_date, check_out_date, total_price, reservation_status});
    res.redirect('/browse/booking');
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).send('Error updating booking');
  }
});

async function updateBook(booking_id, fields) {
  const updates = [];
  for (let key in fields) {
    if (fields[key] !== undefined && fields[key] !== '') {
      updates.push(`${key} = '${fields[key]}'`);
    }
  }
  if (updates.length > 0) {
    const query = `UPDATE bookings SET ${updates.join(', ')} WHERE booking_id = '${booking_id}'`;
    await db.query(query);
  }
}
export default router_book;