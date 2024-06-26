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
  let {serviceid, servicename, note, departmentid, departmentname, manager, descrpition, page, search,sort} = req.query;
  let url = req.originalUrl;
  let parts = url.split("&page");
  let urlBeforePage = parts[0];
  const searchQuery = req.query.search;
  page = req.query.page ? parseInt(req.query.page) : 0;
  const limit = 10;
  const offset = page * limit;
  try {
    const data = await serviceModel.getService(serviceid, servicename, note, departmentid, departmentname, manager, descrpition,search, limit, offset, sort);
    res.render('browse/service/index.ejs', { data, page, urlBeforePage, search});
  } catch (err) {
    console.error(err);
    res.redirect('/browse/service?err=-1'); 
   }
});

router_service.get('/api/service-details/:serviceid', async (req, res) => {
  const serviceid = req.params.serviceid;
  try {
      const details = await serviceModel.getServiceDetails(serviceid);
      res.json(details);
  } catch (error) {
      console.error('Error fetching customer details', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router_service.post('/addService', async (req, res) => {
  const {serviceid, servicename, note, departmentid, departmentname,manager, description} = req.body;
  try {
    const service1 = await serviceModel.addService(serviceid, servicename, note, departmentid, departmentname,manager, description);
    if (serviceid != '') {
      res.redirect(`/browse/service?success=trueadd&serviceid=${service1}`);
    } else {
      res.redirect(`/browse/service?success=trueadd&departmentid1=${service1}`);
    }
  } catch (err) {
    res.redirect(`/browse/service?success=falseadd&err=${err}`);
    console.error('Error adding service', err);
  }
});

router_service.post('/deleteService',async (req, res) => {
  const {serviceid,departmentid} = req.body;
  try {
    const service2 = await serviceModel.deleteService(serviceid,departmentid);
    if (serviceid != '') {
      res.redirect(`/browse/service?success=truedel&serviceid=${serviceid}`);
    } else {
      res.redirect(`/browse/service?success=truedel&departmentid1=${departmentid}`);
    }
  } catch (err) {
    res.redirect(`/browse/service?success=falsedel&err=${err}`);
    console.error('Error deleting service', err);
  }
});

router_service.post('/updateService', async (req, res) => {
  const {serviceid, servicename,  note,departmentid,departmentname,manager,description} = req.body;
  try {
    const service3 = await serviceModel.updateService(serviceid, servicename,note,departmentid,departmentname,manager,description);
    if (serviceid != '') {
      res.redirect(`/browse/service?success=trueupdate&serviceid=${service3}`);
    } else {
      res.redirect(`/browse/service?success=trueupdate&departmentid1=${service3}`);
    }
  } catch (err) {
    res.redirect(`/browse/service?success=falseupdate&err=${err}`);
    console.error('Error update service', err);
  }
});

export default router_service;