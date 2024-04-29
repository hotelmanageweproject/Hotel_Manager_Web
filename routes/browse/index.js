import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import browse_customerRoute from './customer/index.js';
import browse_roomRoute from './room/index.js';
import browse_bookingRoute from './booking/index.js';
import browse_serviceRoute from './service/index.js';
import browse_employeeRoute from './employee/index.js';

const router = express.Router();
router.use(express.static(path.join(__dirname, 'public/browse')));
router.use(express.urlencoded({ extended: true }));

// Define your routes here
router.get('/', (req, res) => {
    res.render('browse/index.ejs');
});

router.use('/customer', browse_customerRoute);
router.use('/room', browse_roomRoute);
router.use('/booking', browse_bookingRoute);
router.use('/service', browse_serviceRoute);
router.use('/employee', browse_employeeRoute);
export default router;

