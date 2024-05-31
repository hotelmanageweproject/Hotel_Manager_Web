import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import serviceModel from '../../../models/service.js';

const router_service = express.Router();
router_service.use(express.static(path.join(__dirname, 'public/browse/service')));
router_service.use(express.urlencoded({ extended: true }));

router_service.get('/', async (req, res) => {
  let {serviceid, servicename, note, departmentid, departmentname, manager, descrpition, page, search} = req.query;
  let url = req.originalUrl;
  let parts = url.split("&page");
  let urlBeforePage = parts[0];
  const searchQuery = req.query.search;
  page = req.query.page ? parseInt(req.query.page) : 0;
  const limit = 10;
  const offset = page * limit;
  try {
    const data = await serviceModel.getService(serviceid, servicename, note, departmentid, departmentname, manager, descrpition,search, limit, offset);
    console.log("Url: ",urlBeforePage);
    console.log("page: ",page)
    res.render('browse/service/index.ejs', { data, page, urlBeforePage, search});
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router_service.post('/addService', async (req, res) => {
  const {serviceID, name, departmentID, note} = req.body;
  console.log("Add service: ",req.body);
  try {
    await serviceModel.addService(serviceID, name, departmentID, note);
    res.redirect('/browse/service');
  } catch (err) {
    console.error('Error adding service', err);
    res.status(500).send('Error adding service');
  }
});

router_service.post('/deleteService',async (req, res) => {
  const {serviceID} = req.body;
  console.log("Delete service: ",req.body);
  try {
    await serviceModel.deleteService(serviceID);
    res.redirect('/browse/service');
  } catch (err) {
    console.error('Error deleting service', err);
    res.status(500).send('Error deleting service');
  }
});

router_service.post('/updateService', async (req, res) => {
  const {serviceID, name, departmentID, note} = req.body;
  console.log("Update service: ",req.body);
  try {
    await serviceModel.updateService(serviceID, {name, departmentID, note});
    res.redirect('/browse/service');
  } catch (err) {
    console.error('Error update service', err);
    res.status(500).send('Error updating service');
  }
});

export default router_service;