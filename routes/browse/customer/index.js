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
  let {customerid,personalid,firstname,lastname,birthday,gender,email,phone,address,rank,page,search} = req.query;
  let url = req.originalUrl;
  let parts = url.split("&page");
  let urlBeforePage = parts[0]; // "/browse/customer/?date=&search=&customer_id=&cccd_passport=&first_name=&last_name=&birthday=&gender=&email=&phone=&address="
  page = req.query.page ? parseInt(req.query.page) : 0;
  const limit = 10;
  const offset = page * limit;
  try {
    const data = await customerModel.getCustomers(customerid,personalid,firstname,lastname,birthday,gender,email,phone,address,rank,search, limit, offset);
    for (let obj of data) {
      for (let key in obj) {
        if (typeof obj[key] === 'string') {
          obj[key] = obj[key].trim();
        }
        // Nếu trường hiện tại là 'birthday', chuyển đổi nó thành định dạng ngày
        if (key === 'birthdate') {
          let birthday = new Date(obj[key]);
          obj[key] = birthday.toISOString().split('T')[0];
        }
      }
    }
    res.render('browse/customer/index.ejs', {data, page, urlBeforePage, search});
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router_cus.get('/api/customer-details/:customerid', async (req, res) => {
  const customerid = req.params.customerid;
  console.log("Kick: " + customerid);
  try {
      const details = await customerModel.getCustomerDetails(customerid);
      console.log(details);
      res.json(details);
  } catch (error) {
      console.error('Error fetching customer details', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router_cus.post('/addCustomer', async (req, res) => {
  const {rankid, personalid, firstname, lastname, birthdate, gender, email, phone, address} = req.body;
  try {
    const customerid = await customerModel.addCustomer(rankid, personalid, firstname, lastname, birthdate, gender, email, phone, address);
    res.redirect(`/browse/customer?success=trueadd&customerid=${customerid}`);  
  } catch (err) {
    console.error('Error adding customer', err);
    res.status(500).send('Error adding customer');
  }
});

router_cus.post('/deleteCustomer', async (req, res) => {
  const {customerid,personalid} = req.body;
  try {
    console.log("Delete customer: ",customerid);
    const customerid2 = await customerModel.deleteCustomer(customerid,personalid);
    res.redirect(`/browse/customer?success=truedel&customerid=${customerid2}`);
  } catch (err) {
    console.error('Error deleting customer', err);
    res.status(500).send('Error deleting customer ' + err);
  }
});

router_cus.post('/updateCustomer', async (req, res) => {
  const {customerid, personalid, firstname, lastname, birthdate, gender, email, phone, address, namerank} = req.body;
  console.log("Update customer: ",req.body);
  try {
    await customerModel.updateCustomer(customerid, {personalid, firstname, lastname, birthdate, gender, email, phone, address, namerank});
    res.redirect('/browse/customer');
  } catch (err) {
    console.error('Error update customer', err);
    res.status(500).send('Error updating customer');
  }
});

export default router_cus;