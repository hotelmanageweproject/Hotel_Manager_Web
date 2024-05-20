// models/customer.js
import db from '../config/db.js';

export const getCustomers = async (searchQuery, page) => {
  const limit = 10;
  const offset = page * limit;
  let query = `SELECT * FROM customers WHERE customer_id::text LIKE '%${searchQuery}%' OR cccd_passport LIKE '%${searchQuery}%' OR first_name LIKE '%${searchQuery}%' OR last_name LIKE '%${searchQuery}%' OR email LIKE '%${searchQuery}%' OR phone LIKE '%${searchQuery}%' OR address LIKE '%${searchQuery}%' LIMIT ${limit} OFFSET ${offset}`;
  if (!searchQuery) {
    query = `SELECT * FROM customers LIMIT ${limit} OFFSET ${offset}`;
  }
  try {
    const result = await db.query(query);
    return result.rows;
  } catch (err) {
    console.error(err);
    throw err;
  }
};