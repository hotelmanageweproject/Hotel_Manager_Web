import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import employeeModel from '../../../models/employee.js';
import moment from 'moment';

const router_employee = express.Router();
router_employee.use(express.static(path.join(__dirname, 'public/browse/employee')));
router_employee.use(express.urlencoded({ extended: true }));

router_employee.get('/', async (req, res) => {
  let {staffid, departmentname, personalid, firstname, lastname, birthday, gender, email, phone, address,currentsal, startdate, enddate,page,search,sort} = req.query;
  let url = req.originalUrl;
  let parts = url.split("&page");
  let urlBeforePage = parts[0]; // "/browse/customer/?date=&search=&customer_id=&cccd_passport=&first_name=&last_name=&birthday=&gender=&email=&phone=&address="
  page = req.query.page ? parseInt(req.query.page) : 0;
  const limit = 10;
  const offset = page * limit;
  try {
    const data = await employeeModel.getStaff(staffid, departmentname, personalid, firstname, lastname, birthday, gender, email, phone, address,currentsal, startdate, enddate,search, limit, offset,sort);
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
    data.forEach(i => {
      i.startdate = moment(i.startdate).format('ddd MMM DD YYYY');
      if (i.enddate === null) {
        i.enddate = 'N/A';
      } else {
        i.enddate = moment(i.enddate).format('ddd MMM DD YYYY');
      }
    });
    res.render('browse/employee/index.ejs', { data, page, urlBeforePage, search});
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router_employee.get('/api/staff-details/:staffid', async (req, res) => {
  const staffid = req.params.staffid;
  try {
      const details = await employeeModel.getStaffDetails(staffid);
      console.log(details);
      res.json(details);
  } catch (error) {
      console.error('Error fetching staff details', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router_employee.post('/addEmployee', async (req, res) => {
  const {departmentid, personalid, firstname, lastname, birthday, gender, email, phone, address, currentsal, startdate, enddate} = req.body;
  console.log("Add staff: ",req.body);
  try {
    const staffid = await employeeModel.addStaff(departmentid, personalid, firstname, lastname, birthday, gender, email, phone, address, currentsal, startdate, enddate);
    res.redirect(`/browse/employee?success=trueadd&staffid=${staffid}`);  
  } catch (err) {
    res.redirect(`/browse/employee?success=falseadd&err=${err}`);  
    console.error('Error adding staff', err);
  }
});

router_employee.post('/deleteEmployee',async (req, res) => {
  const {staffid} = req.body;
  console.log("Delete staff: ",req.body);
  try {
    const staffid2 = await employeeModel.deleteStaff(staffid);
    res.redirect(`/browse/employee?success=truedel&staffid=${staffid2}`);
  } catch (err) {    
    res.redirect(`/browse/employee?success=falsedel&err=${err}`);
    console.error('Error deleting staff', err);
  }
});

router_employee.post('/updateEmployee', async (req, res) => {
  const { staffid,departmentid, personalid, firstname, lastname, birthday, gender, email, phone, address, currentsal, startdate, enddate} = req.body;
  console.log("Update staff: ",req.body);
  try {
    const staffid3 = await employeeModel.updateStaff(staffid,departmentid, personalid, firstname, lastname, birthday, gender, email, phone, address, currentsal, startdate, enddate);
    res.redirect(`/browse/employee?success=trueupdate&staffid=${staffid3}`);
  } catch (err) {
    res.redirect(`/browse/employee?success=falseupdate&err=${err}`);
    console.error('Error update employee', err);
  }
});

export default router_employee;