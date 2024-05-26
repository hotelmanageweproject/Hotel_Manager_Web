// bookingModel.js
import db from '../config/db.js'; // Đảm bảo rằng bạn đã import db từ file đúng

// Query hiển thị dữ liệu ra màn hình
const getBooking = async (searchQuery, limit, offset) => {
  let query = `SELECT * FROM Booking WHERE booking_id::text LIKE '%${searchQuery}%' OR customer_id LIKE '%${searchQuery}%' OR room_id LIKE '%${searchQuery}%' OR number_of_adult LIKE '%${searchQuery}%' OR number_of_child LIKE '%${searchQuery}%' OR status LIKE '%${searchQuery}%' OR check_in_date LIKE '%${searchQuery}%' OR check_out_date LIKE '%${searchQuery}%' OR total_price LIKE '%${searchQuery}%' OR reservation_status LIKE '%${searchQuery}%' LIMIT ${limit} OFFSET ${offset}`;
  if (!searchQuery) {
    query = `SELECT * FROM Booking LIMIT ${limit} OFFSET ${offset}`;
  }
  const result = await db.query(query);
  return result.rows;
};

// Query thêm dữ liệu
const addBooking = (bookingID, customerID, bookingDate, bookingType, totalAdult, totalChild) => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO Booking (bookingID, customerID, bookingDate, bookingType, totalAdult, totalChild)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      const values = [bookingID, customerID, bookingDate, bookingType, totalAdult, totalChild];
      db.query(query, values, (err, result) => {
        if (err) {
          console.error('Error executing query', err.stack);
          reject(err);
        } else {
          console.log('Booking added successfully');
          resolve(result);
        }
      });
    });
  };

// Query xóa dữ liệu
const deleteBooking = (bookingID) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM Booking WHERE bookingID = $1`;
    db.query(query, [bookingID], (err, result) => {
          if (err) {
              console.error('Error executing query', err.stack);
              reject(err);
          } else {
              console.log('Booking deleted successfully');
              resolve(result);
          }
      });
  });
};
// Query cập nhật dữ liệu
const updateBooking = (bookingID, { customerID, bookingDate, bookingType, totalAdult, totalChild}) => {
    return new Promise((resolve, reject) => {
      const fields = { customerID, bookingDate, bookingType, totalAdult, totalChild };
      const updates = [];
      for (let key in fields) {
        if (fields[key] !== undefined && fields[key] !== '') {
          updates.push(`${key} = '${fields[key]}'`);
        }
      }
      if (updates.length > 0) {
        const query = `UPDATE Booking SET ${updates.join(', ')} WHERE booking_id = '${bookingID}'`;
        db.query(query, (err, result) => {
          if (err) {
          console.error('Error executing query', err.stack);
          reject(err);
          } else {
          console.log('Booking updated successfully');
          resolve(result);
          }
        });
      }
    });
  };
// Export module
export default {
    getBooking,
    deleteBooking,
    updateBooking,
    addBooking,
};