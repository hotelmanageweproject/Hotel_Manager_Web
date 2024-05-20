import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router_static = express.Router();
router_room.use(express.static(path.join(__dirname, 'public/static')));
router_room.use(express.urlencoded({ extended: true }));

router_static.get('/', async (req, res) => {
  
  res.render('static/index.ejs');
});