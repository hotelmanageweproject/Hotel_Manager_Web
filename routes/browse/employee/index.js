import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import employeeModel from '../../../models/employee.js';

const router_employee = express.Router();
router_employee.use(express.static(path.join(__dirname, 'public/browse/employee')));
router_employee.use(express.urlencoded({ extended: true }));

router_employee.get('/', async (req, res) => {
  let url = req.originalUrl;
  let parts = url.split("&page");
  let urlBeforePage = parts[0]; // "/browse/customer/?date=&search=&customer_id=&cccd_passport=&first_name=&last_name=&birthday=&gender=&email=&phone=&address="
  const searchQuery = req.query.search;
  const page = req.query.page ? parseInt(req.query.page) : 0;
  const limit = 10;
  const offset = page * limit;
  console.log("Search query: ",req.query.staffID);
  try {
    const data = await employeeModel.getStaff(searchQuery, limit, offset);
    console.log("Url: ",urlBeforePage);
    console.log("page: ",page)
    res.render('browse/employee/index.ejs', { data, page, urlBeforePage, searchQuery});
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router_employee.post('/addEmployee', async (req, res) => {
  const {staffID,departmentID, personalID, firstName, lastName, birthday, gender, email, phone, address, currentSal, startDate, endDate} = req.body;
  console.log("Add staff: ",req.body);
  try {
    await employeeModel.addStaff(staffID,departmentID, personalID, firstName, lastName, birthday, gender, email, phone, address, currentSal, startDate, endDate);
    res.redirect('/browse/employee');
  } catch (err) {
    console.error('Error adding staff', err);
    res.status(500).send('Error adding staff');
  }
});

router_employee.post('/deleteEmployee',async (req, res) => {
  const {staffID} = req.body;
  console.log("Delete staff: ",req.body);
  try {
    await employeeModel.deleteStaff(staffID);
    res.redirect('/browse/employee');
  } catch (err) {
    console.error('Error deleting staff', err);
    res.status(500).send('Error deleting staff');
  }
});

router_employee.post('/updateEmployee', async (req, res) => {
  const { staffID,departmentID, personalID, firstName, lastName, birthday, gender, email, phone, address, currentSal, startDate, endDate} = req.body;
  console.log("Update staff: ",req.body);
  try {
    await employeeModel.updateStaff(staffID, { departmentID, personalID, firstName, lastName, birthday, gender, email, phone, address, currentSal, startDate, endDate});
    res.redirect('/browse/employee');
  } catch (err) {
    console.error('Error update employee', err);
    res.status(500).send('Error updating employee');
  }
});

export default router_employee;