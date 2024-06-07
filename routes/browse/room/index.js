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
  let {roomid, status, roomtype, pricepernight, maxadult, maxchild, roomstate, page, search, sort} = req.query;
  let url = req.originalUrl;
  let parts = url.split("&page");
  let urlBeforePage = parts[0]; 
  page = req.query.page ? parseInt(req.query.page) : 0;
  const limit = 10;
  const offset = page * limit;
  try {
    const data = await roomModel.getRoom(roomid, roomtype, status, pricepernight, maxadult, maxchild, roomstate, search, limit, offset, sort);
    res.render('browse/room/index.ejs', { data, page, urlBeforePage, search, sort });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router_room.get('/api/room-details/:roomid', async (req, res) => {
  const roomid = req.params.roomid;
  console.log("Kick: " + roomid);
  try {
      const details = await roomModel.getRoomDetails(roomid);
      console.log(details);
      res.json(details);
  } catch (error) {
      console.error('Error fetching customer details', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router_room.post('/addRoom', async (req, res) => {
  const {roomid, roomtype, status, name, pricepernight, maxadult, maxchild, bookingid, serviceid,total_in,date,staffid} = req.body;
  console.log("Add room: ",req.body);
  try {
    const roomid1 = await roomModel.addRoom(roomid, roomtype, status, name, pricepernight, maxadult, maxchild, bookingid, serviceid,total_in,date,staffid);
    res.redirect(`/browse/room?success=trueadd&roomid=${roomid1}`);  
  } catch (err) {
    console.error('Error adding room', err);
    res.status(500).send('Error adding room');
  }
});

router_room.post('/deleteRoom',async (req, res) => {
  const {roomtypeid,roomid,receiptid} = req.body;
  console.log("Delete room: ",req.body);
  try {
    const roomid2 = await roomModel.deleteRoom(roomtypeid,roomid,receiptid);
    res.redirect(`/browse/room?success=truedel&roomid=${roomid2}`);
  } catch (err) {
    console.error('Error deleting room', err);
    res.status(500).send('Error deleting room');
  }
});

router_room.post('/updateRoom', async (req, res) => {
  const {roomid, roomtype, status, name, pricepernight, maxadult, maxchild, receiptid, serviceid,total_in,date,staffid} = req.body;
  console.log("Update room: ",req.body);
  try {
    const roomid3 = await roomModel.updateRoom(roomid, roomtype, status, name, pricepernight, maxadult, maxchild, receiptid, serviceid,total_in,date,staffid);
    if (roomid !== '') {
      res.redirect(`/browse/room?success=trueupdate&roomid=${roomid3}`);
    } else if (roomtype !== '') {
      res.redirect(`/browse/room?success=trueupdate&roomtype=${roomid3}`);
    } else if (receiptid !== '') {
      res.redirect(`/browse/room?success=trueupdate&receiptid=${roomid3}`);
    } else if (roomid3 === 0){
      res.redirect(`/browse/room?success=trueupdate&roomid=${roomid3}`);
    }
  } catch (err) {
    console.error('Error update room', err);
    res.status(500).send('Error updating room');
  }
});

export default router_room;