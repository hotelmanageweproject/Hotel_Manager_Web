import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import customerModel from '../../../models/customer.js';



const router_cus = express.Router();
router_cus.use(express.static(path.join(__dirname, 'public/browse/customer')));
router_cus.use(express.urlencoded({ extended: true }));


router_cus.get('/', async (req, res) => {
  let url = req.originalUrl;
  let parts = url.split("&page");
  let urlBeforePage = parts[0]; // "/browse/customer/?date=&search=&customer_id=&cccd_passport=&first_name=&last_name=&birthday=&gender=&email=&phone=&address="
  const searchQuery = req.query.search;
  const page = req.query.page ? parseInt(req.query.page) : 0;
  const limit = 10;
  const offset = page * limit;
  console.log("Search query: ",req.query.customerid);
  try {
    const data = await customerModel.getCustomers(searchQuery, limit, offset);
    for (let obj of data) {
      for (let key in obj) {
        if (typeof obj[key] === 'string') {
          obj[key] = obj[key].trim();
        }
        // Nếu trường hiện tại là 'birthday', chuyển đổi nó thành định dạng ngày
        if (key === 'birthday') {
          let birthday = new Date(obj[key]);
          obj[key] = birthday.toISOString().split('T')[0];
        }
      }
    }
    console.log("data: ",data);
    res.render('browse/customer/index.ejs', { data, page, urlBeforePage, searchQuery});
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router_cus.post('/addCustomer', async (req, res) => {
  const {customerid, rankid, personalid, firstname, lastname, birthday, gender, email, phone, address} = req.body;
  console.log("Add customer: ",req.body);
  try {
    await customerModel.addCustomer(customerid, rankid, personalid, firstname, lastname, birthday, gender, email, phone, address);
    res.redirect('/browse/customer');
  } catch (err) {
    console.error('Error adding customer', err);
    res.status(500).send('Error adding customer');
  }
});

router_cus.post('/deleteCustomer', async (req, res) => {
  const {customerid} = req.body;
  console.log("Delete customer: ",req.body);
  try {
    await customerModel.deleteCustomer(customerid);
    res.redirect('/browse/customer');
  } catch (err) {
    console.error('Error deleting customer', err);
    res.status(500).send('Error deleting customer');
  }
});

router_cus.post('/updateCustomer', async (req, res) => {
  const { customerid, rankid, personalid, firstName, lastName, birthday, gender, email, phone, address} = req.body;
  console.log("Update customer: ",req.body);
  try {
    await customerModel.updateCustomer(customerid, { rankid, personalid, firstName, lastName, birthday, gender, email, phone, address});
    res.redirect('/browse/customer');
  } catch (err) {
    console.error('Error update customer', err);
    res.status(500).send('Error updating customer');
  }
});

export default router_cus;