import express from 'express';
import bodyParser from 'body-parser';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import browseRoute from './routes/browse/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = 3000;
const currentDate = new Date();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index.ejs', { currentDate: currentDate });
});

app.use('/browse', browseRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});