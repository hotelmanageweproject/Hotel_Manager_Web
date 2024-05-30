// bookingModel.js
import db from '../config/db.js'; // Đảm bảo rằng bạn đã import db từ file đúng

// Query hiển thị dữ liệu ra màn hình
const getBooking = async (bookingid,customerid,bookingdate,bookingtype,totaladult,totalchild,roomid,checkin,checkout,numofchild,numofadult,page,searchQuery, limit, offset) => {
  let whereConditions = [];
  let query = '';
  if (bookingid) whereConditions.push(`b.bookingid = ${bookingid}`);
  if (customerid) whereConditions.push(`b.customerid = ${customerid}`);
  if (bookingdate) whereConditions.push(`b.bookingdate = ${bookingdate}`);
  if (bookingtype) whereConditions.push(`b.bookingtype LIKE '%${bookingtype}%'`);
  if (totaladult) whereConditions.push(`b.totaladult = ${totaladult}`);
  if (totalchild) whereConditions.push(`b.totalchild = ${totalchild}`);
  if (roomid) whereConditions.push(`br.roomid = ${roomid}`);
  if (checkin) whereConditions.push(`br.checkin = ${checkin}`);
  if (checkout) whereConditions.push(`br.checkout = ${checkout}`);
  if (numofchild) whereConditions.push(`br.numofchild = ${numofchild}`);
  if (numofadult) whereConditions.push(`br.numofadult = ${numofadult}`);
  // Thêm các điều kiện tương tự cho các tham số khác nếu chúng không phải là NULL
  if (searchQuery) {
    query = `
    SELECT b.bookingid, b.customerid, b.bookingdate, b.bookingtype, b.totaladult, b.totalchild, br.roomid, br.checkin, br.checkout, br.numofadult, br.numofchild
    FROM booking b
    JOIN booking_rooms br ON b.bookingid = br.bookingid
    WHERE b.bookingid LIKE '%${searchQuery}%' OR b.customerid LIKE '%${searchQuery}%' OR b.bookingdate LIKE '%${searchQuery}%' OR b.bookingtype LIKE '%${searchQuery}%' OR b.totaladult LIKE '%${searchQuery}%' OR b.totalchild LIKE '%${searchQuery}%' OR br.roomid LIKE '%${searchQuery}%' OR br.checkin LIKE '%${searchQuery}%' OR br.checkout LIKE '%${searchQuery}%' OR br.numofchild LIKE '%${searchQuery}%' OR br.numofadult LIKE '%${searchQuery}%'
    ORDER BY b.bookingid ASC LIMIT ${limit} OFFSET ${offset}`;

  } else {
     query = `
    SELECT b.bookingid, b.customerid, b.bookingdate, b.bookingtype, b.totaladult, b.totalchild, br.roomid, br.checkin, br.checkout, br.numofadult, br.numofchild
    FROM booking b
    JOIN booking_rooms br ON b.bookingid = br.bookingid
  `;

  if (whereConditions.length > 0) {
    query += 'WHERE ' + whereConditions.join(' AND ') + ' ';
  }
  
  query += `ORDER BY b.bookingid ASC LIMIT ${limit} OFFSET ${offset}`;
  };
  console.log(query);
 
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