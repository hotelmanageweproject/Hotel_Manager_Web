import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import roomModel from '../../../models/room.js';

const router_room = express.Router();
router_room.use(express.static(path.join(__dirname, 'public/browse/room')));
router_room.use(express.urlencoded({ extended: true }));

router_room.get('/', async (req, res) => {
  let {roomid, status, roomtype, pricepernight, maxadult, maxchild, roomstate,page,search} = req.query;
  let url = req.originalUrl;
  let parts = url.split("&page");
  let urlBeforePage = parts[0]; 
  page = req.query.page ? parseInt(req.query.page) : 0;
  const limit = 10;
  const offset = page * limit;
  try {
    const data = await roomModel.getRoom(roomid, roomtype, status, pricepernight, maxadult, maxchild, roomstate,search, limit, offset);
    res.render('browse/room/index.ejs', { data, page, urlBeforePage, search});
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router_room.post('/addRoom', async (req, res) => {
  const {roomID, roomType, status} = req.body;
  console.log("Add room: ",req.body);
  try {
    await roomModel.addRoom(roomID, roomType, status);
    res.redirect('/browse/room');
  } catch (err) {
    console.error('Error adding room', err);
    res.status(500).send('Error adding room');
  }
});

router_room.post('/deleteRoom',async (req, res) => {
  const {roomID} = req.body;
  console.log("Delete room: ",req.body);
  try {
    await roomModel.deleteRoom(roomID);
    res.redirect('/browse/room');
  } catch (err) {
    console.error('Error deleting room', err);
    res.status(500).send('Error deleting room');
  }
});

router_room.post('/updateRoom', async (req, res) => {
  const {roomID, roomType, status} = req.body;
  console.log("Update room: ",req.body);
  try {
    await roomModel.updateRoom(roomID, {roomType, status});
    res.redirect('/browse/room');
  } catch (err) {
    console.error('Error update room', err);
    res.status(500).send('Error updating room');
  }
});

export default router_room;