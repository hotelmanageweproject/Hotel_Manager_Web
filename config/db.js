import pg from "pg";

const db = new pg.Client({
  user : 'postgres',
  host : 'localhost',
  database : 'hotel_6',
  password : '0',
  port : 5432,
});

db.connect((err) => {
  if (err) {
    console.error('Connection error', err.stack);
  } else {
    console.log('Connected to the database');
  }
});

export default db;