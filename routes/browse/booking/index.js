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
  let {bookingid,customerid,bookingdate,bookingtype,totaladult,totalchild,roomid,checkin,checkout,numofchild,numofadult,page,searchQuery,sort} = req.query;
  let url = req.originalUrl;
  let parts = url.split("&page");
  let urlBeforePage = parts[0];
  page = page ? parseInt(page) : 0;
  const limit = 10;
  const offset = page * limit;
  try {
    const data = await bookingModel.getBooking(bookingid,customerid,bookingdate,bookingtype,totaladult,totalchild,roomid,checkin,checkout,numofchild,numofadult,page,searchQuery, limit, offset,sort);
    data.forEach(booking => {
      booking.bookingdate = moment(booking.bookingdate).format('ddd MMM DD YYYY');
      booking.checkin = moment(booking.checkin).format('ddd MMM DD YYYY');
      booking.checkout = moment(booking.checkout).format('ddd MMM DD YYYY');
    });
   
    res.render('browse/booking/index.ejs', { data, page, urlBeforePage, searchQuery});
  } catch (err) {
    console.error(err);
    res.redirect('/browse/booking?err=-1');
  }
});

router_booking.get('/api/booking-details/:bookingid', async (req, res) => {
  const bookingid = req.params.bookingid;
  try {
      const details = await bookingModel.getBookingDetails(bookingid);
      res.json(details);
  } catch (error) {
      console.error('Error fetching booking details', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router_booking.post('/addBooking', async (req, res) => {
  const { bookingid, customerid, bookingdate, bookingtype, totaladult, totalchild, new_bkrooms, numofchild, numofadult, checkin, checkout } = req.body;
  try {
    const booking1 = await bookingModel.addBooking(bookingid, customerid, bookingdate, bookingtype, totaladult, totalchild, new_bkrooms, numofchild, numofadult, checkin, checkout);
    if (new_bkrooms === '' && bookingid === '') {
      res.redirect(`/browse/booking?success=trueadd&bookingid=${booking1}`);
    } else if (booking1 === 2) {
      res.redirect(`/browse/booking?success=trueadd&bookingid=${bookingid}`);
    } else if (booking1 === 0) {
      res.redirect(`/browse/booking?success=falseadd&bookingid=0&roomid=0`);
    }
  } catch (err) {
    res.redirect(`/browse/booking?success=falseadd&err=${encodeURIComponent(err)}`);
    console.error('Error adding booking', err);
  }
});

router_booking.post('/deleteBooking',async (req, res) => {
  const {bookingid,roomid} = req.body;
  try {
    const booking2 = await bookingModel.deleteBooking(bookingid,roomid);
    if (booking2 === 1) {
      res.redirect(`/browse/booking?success=truedel&bookingid=${bookingid}`);
    } else if (booking2 === 2) {
      res.redirect(`/browse/booking?success=truedel&bookingid=${bookingid}&roomid=${roomid}`);
    }  else if (booking2 === 0){
      res.redirect(`/browse/booking?success=falsedel&bookingid=0&roomid=0`);
    }
  } catch (err) {
    res.redirect(`/browse/booking?success=falsedel&err=${encodeURIComponent(err)}`);
    console.error('Error deleting booking', err);
  }
});

router_booking.post('/updateBooking', async (req, res) => {
  const {bookingid, customerid, bookingdate, bookingtype, totaladult, totalchild, roomid, numofchild, numofadult, checkin, checkout} = req.body;
  try {
    const booking3 = await bookingModel.updateBooking(bookingid, customerid, bookingdate, bookingtype, totaladult, totalchild, roomid, numofchild, numofadult, checkin, checkout);
    if (booking3 === 2) {
      res.redirect(`/browse/booking?success=trueupdate&bookingid=${bookingid}&roomid=${roomid}`);
    } else if (booking3 === 1) {
      res.redirect(`/browse/booking?success=trueupdate&bookingid=${bookingid}`);
    }  else if (booking3 === 0){
      res.redirect(`/browse/booking?success=falseupdate&bookingid=0&roomid=0`);
    }
  } catch (err) {
    res.redirect(`/browse/booking?success=falseupdate&err=${encodeURIComponent(err)}`);
    console.error('Error update booking', err);
  }
});

export default router_booking;