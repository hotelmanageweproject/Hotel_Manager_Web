import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import staticModel from '../../models/static.js';
import { format, addHours } from 'date-fns'; // Import hàm format và addHours từ date-fns


const router = express.Router();
router.use(express.static(path.join(__dirname, 'public/static')));
router.use(express.urlencoded({ extended: true }));

// Define your routes here
router.get('/', (req, res) => {
    res.render('static/index.ejs');
});

router.get('/searchPayment', async (req, res) => {
    const { bookingid } = req.query;
    try {
      const payment = await staticModel.getPaymentByBookingId(bookingid);
      console.log(payment);
      if (payment) {
        payment.paymentdate = format(new Date(payment.paymentdate), 'EEEE, dd/MM/yyyy');
        res.json(payment);
      } else {
        res.status(404).json({ error: 'Booking not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
router.get('/serviceRanking', async (req, res) => {
    try {
      const ranking = await staticModel.getServiceRanking();
      res.json(ranking);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/customerRanking', async (req, res) => {
    try {
      const ranking = await staticModel.getCustomerRanking();
      res.json(ranking);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/serviceRankingFull', async (req, res) => {
    try {
      const ranking = await staticModel.getServiceRankingFull();
      res.json(ranking);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/customerRankingFull', async (req, res) => {
    try {
      const ranking = await staticModel.getCustomerRankingFull();
      res.json(ranking);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/hotelStatistic', async (req, res) => {
    const { period, date } = req.query;
    try {
      const statistic = await staticModel.getHotelStatistic(period, date);
      res.json(statistic);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/chart-data', async (req, res) => {
    const { period } = req.query;
    try {
      const data = await staticModel.getRevenueData(period);
      // Điều chỉnh múi giờ của dữ liệu sang UTC+7
    console.log(data);
      res.json(data);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  

router.post('/addPayment',async (req, res) => {
  let { bookingid, totalamount,additionalcharge, paymentmethod, paymentdate, note} = req.body;
  
  totalamount = totalamount.replace(/[.,\sVND]/g, '');
    additionalcharge = additionalcharge.replace(/[.,\sVND]/g, '');
  // Chuyển đổi giá trị đã xử l thành số
  totalamount = parseFloat(totalamount);
  additionalcharge = parseFloat(additionalcharge);
  console.log(paymentmethod);
  try {
    const payment = await staticModel.addPayment(bookingid, totalamount,additionalcharge, paymentmethod, paymentdate, note);
    
    if (payment === 1) {
      res.redirect('/static');
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router;


