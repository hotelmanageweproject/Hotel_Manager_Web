import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import bookingModel from '../../../models/booking.js';
import moment from 'moment';

const router_booking = express.Router();
router_booking.use(express.static(path.join(__dirname, 'public/browse/booking')));
router_booking.use(express.urlencoded({ extended: true }));

router_booking.get('/', async (req, res) => {
  let {bookingid,customerid,bookingdate,bookingtype,totaladult,totalchild,roomid,checkin,checkout,numofchild,numofadult,page,searchQuery} = req.query;
  let url = req.originalUrl;
  let parts = url.split("&page");
  let urlBeforePage = parts[0];
  page = page ? parseInt(page) : 0;
  const limit = 10;
  const offset = page * limit;
  try {
    const data = await bookingModel.getBooking(bookingid,customerid,bookingdate,bookingtype,totaladult,totalchild,roomid,checkin,checkout,numofchild,numofadult,page,searchQuery, limit, offset);
    data.forEach(booking => {
      booking.bookingdate = moment(booking.bookingdate).format('ddd MMM DD YYYY');
      booking.checkin = moment(booking.checkin).format('ddd MMM DD YYYY');
      booking.checkout = moment(booking.checkout).format('ddd MMM DD YYYY');
    });
    console.log("Url: ",urlBeforePage);
    console.log("page: ",page)
    res.render('browse/booking/index.ejs', { data, page, urlBeforePage, searchQuery});
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router_booking.post('/addBooking', async (req, res) => {
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

router_booking.post('/deleteBooking',async (req, res) => {
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

router_booking.post('/updateBooking', async (req, res) => {
  const {bookingID, customerID, bookingDate, bookingType, totalAdult, totalChild} = req.body;
  console.log("Update booking: ",req.body);
  try {
    await bookingModel.updateBooking(bookingID, {customerID, bookingDate, bookingType, totalAdult, totalChild});
    res.redirect('/browse/booking');
  } catch (err) {
    console.error('Error update booking', err);
    res.status(500).send('Error updating booking');
  }
});

export default router_booking;