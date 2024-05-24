// bookingModel.js
import db from '../config/db.js'; // Đảm bảo rằng bạn đã import db từ file đúng

// Query hiển thị dữ liệu ra màn hình
const getCustomers = async (searchQuery, limit, offset) => {
  let query = `SELECT * FROM Customers WHERE customerID::text LIKE '%${searchQuery}%' ORDER BY customerID ASC LIMIT ${limit} OFFSET ${offset} `;
  if (!searchQuery) {
    query = `SELECT * FROM Customers ORDER BY customerID ASC LIMIT ${limit} OFFSET ${offset}`;
  }
  const result = await db.query(query);
  return result.rows;
};

// Query thêm dữ liệu
const addCustomer = (customerID, rankID, personalID, firstName, lastName, birthday, gender, email, phone, address) => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO Customers (customerID, rankID, personalID, firstName, lastName, birthday, gender, email, phone, address)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `;
      const values = [customerID, rankID, personalID, firstName, lastName, birthday, gender, email, phone, address];
      db.query(query, values, (err, result) => {
        if (err) {
          console.error('Error executing query', err.stack);
          reject(err);
        } else {
          console.log('Customer added successfully');
          resolve(result);
        }
      });
    });
  };

// Query xóa dữ liệu
const deleteCustomer = (customerID) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM Customers WHERE customerID = $1`;
    db.query(query, [customerID], (err, result) => {
          if (err) {
              console.error('Error executing query', err.stack);
              reject(err);
          } else {
              console.log('Customer deleted successfully');
              resolve(result);
          }
      });
  });
};
// Query cập nhật dữ liệu
const updateCustomer = (booking_id, { customerID, bookingDate, bookingType, totalAdult, totalChild}) => {
    return new Promise((resolve, reject) => {
      const fields = { customerID, bookingDate, bookingType, totalAdult, totalChild };
      const updates = [];
      for (let key in fields) {
        if (fields[key] !== undefined && fields[key] !== '') {
          updates.push(`${key} = '${fields[key]}'`);
        }
      }
      if (updates.length > 0) {
        const query = `UPDATE Customers SET ${updates.join(', ')} WHERE customerid = '${booking_id}'`;
        db.query(query, (err, result) => {
          if (err) {
          console.error('Error executing query', err.stack);
          reject(err);
          } else {
          console.log('Customer updated successfully');
          resolve(result);
          }
        });
      }
    });
  };
// Export module
export default {
    getCustomers,
    deleteCustomer,
    updateCustomer,
    addCustomer,
};