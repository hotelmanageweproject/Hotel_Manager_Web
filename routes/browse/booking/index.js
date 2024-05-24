import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import bookingModel from '../../../models/booking.js';

const router_book = express.Router();
router_book.use(express.static(path.join(__dirname, 'public/browse/booking')));
router_book.use(express.urlencoded({ extended: true }));

router_book.get('/', async (req, res) => {
  const searchQuery = req.query.search;
  const page = req.query.page ? parseInt(req.query.page) : 0;
  const limit = 10;
  const offset = page * limit;
  try {
    const data = await bookingModel.getBookings(searchQuery, limit, offset);
    res.render('browse/booking/index.ejs', { data, page, searchQuery });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router_book.post('/addBooking', async (req, res) => {
  const {bookingID, customerID, bookingDate, bookingType, totalAdult, totalChild} = req.body;
  console.log("Add booking: ",req.body);
  try {
    await bookingModel.addBooking(bookingID, customerID, bookingDate, bookingType, totalAdult, totalChild);
    res.redirect('/browse/booking');
  } catch (err) {
    console.error('Error adding booking', err);
    res.status(500).send('Error adding booking');
  }
});

router_book.post('/deleteBooking', async (req, res) => {
  const {bookingID} = req.body;
  console.log("Delete booking: ",req.body);
  try {
    await bookingModel.deleteBooking(bookingID);
    res.redirect('/browse/booking');
  } catch (err) {
    console.error('Error deleting booking', err);
    res.status(500).send('Error deleting booking');
  }
});

router_book.post('/updateBooking', async (req, res) => {
  const { booking_id, customerID, bookingDate, bookingType, totalAdult, totalChild} = req.body;
  console.log("Update booking: ",req.body);
  try {
    await bookingModel.updateBooking(booking_id, { customerID, bookingDate, bookingType, totalAdult, totalChild});
    res.redirect('/browse/booking');
  } catch (err) {
    console.error('Error update booking', err);
    res.status(500).send('Error updating booking');
  }
});

export default router_book;