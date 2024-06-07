import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
router.use(express.static(path.join(__dirname, 'public/static')));
router.use(express.urlencoded({ extended: true }));

// Define your routes here
router.get('/', (req, res) => {
    res.render('static/index.ejs');
});

export default router;


