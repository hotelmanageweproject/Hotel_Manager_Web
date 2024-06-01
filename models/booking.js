// bookingModel.js
import db from '../config/db.js'; // Đảm bảo rằng bạn đã import db từ file đúng

// Query hiển thị dữ liệu ra màn hình
const getBooking = async (bookingid,customerid,bookingdate,bookingtype,totaladult,totalchild,roomid,checkin,checkout,numofchild,numofadult,page,searchQuery, limit, offset) => {
  let whereConditions = [];
  let query = '';
  if (bookingid) whereConditions.push(`b.bookingid = ${bookingid}`);
  if (customerid) whereConditions.push(`b.customerid = ${customerid}`);
  if (bookingdate) whereConditions.push(`b.bookingdate = '%${bookingdate}%'`);
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
 
  const result = await db.query(query);
  return result.rows;
};

// Query thêm dữ liệu
const addBooking = (bookingID, customerID, bookingDate, bookingType, totalAdult, totalChild) => {
    return new Promise((resolve, reject) => {
      if (roomid === undefined) {
        const query = `INSERT INTO Booking (bookingID, customerID, bookingDate, bookingType, totalAdult, totalChild) VALUES ($1, $2, $3, $4, $5, $6)`;
        // ADD Booking vào bảng booking: INPUT (ALL Varchar)  : bookingID, customerID, bookingDate, bookingType, totalAdult, totalChild
        // OUTPUT: bookingID vừa thêm sẽ được trả về
      } else if (roomid !== undefined && bookingID !== undefined){
        const query = `INSERT INTO Booking (bookingID, customerID, bookingDate, bookingType, totalAdult, totalChild) VALUES ($1, $2, $3, $4, $5, $6)`;
        // ADD vào bảng booking_room: INPUT (ALL Varchar) : bookingID, roomID, checkIn, checkOut, numOfAdult, numOfChild
        // OUTPUT: bookingID và roomID vừa thêm sẽ được trả về
        // 1 Thắc mắc nhỏ nếu bookingID đó đã tồn tại phòng đó thì sao ? Và có thao tác nào để kiểm tra hiện tại không có bookingID nào khác dùng roomID đó không ?
      }
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
    if (roomid === undefined) {
      const query = `DELETE FROM booking WHERE bookingID = $1`;
      // DELETE Booking: INPUT (bookingID) : Thực hiện xoá bản ghi có bookingID ở bảng booking và toàn bộ bản ghi ở bản booking_room có bookingID đó
      // OUTPUT : bookingID vừa xoá sẽ được trả về (Có hoặc không)
    } else if (roomid !== undefined && bookingID !== undefined){
      // DELETE Booking: INPUT (bookingID, roomID) : Thực hiện xoá bản ghi có bookingID và roomID ở bảng booking_room
      // OUTPUT : bookingID và roomID vừa xoá sẽ được trả về (Có hoặc không)
      const query = `DELETE FROM Booking WHERE bookingID = $1`;
    }
    
    db.query(query, [bookingID,roomID], (err, result) => {
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
      let query = '';
      if (roomid === undefined) {
         query = `UPDATE Booking_Room SET roomID = $1, checkIn = $2, checkOut = $3, numOfAdult = $4, numOfChild = $5 WHERE bookingID = $6`;
        // UPDATE Booking: INPUT (ALL Varchar) : bookingID, customerID, bookingDate, bookingType, totalAdult, totalChild
        // Lưu ý chỉ những giá trị nào khác null hoặc '' mới thực hiện thay đổi Nếu không được thì skip
        // OUTPUT: bookingID vừa cập nhật sẽ được trả về (Có hoặc không)
      } else if (roomid !== undefined && bookingID !== undefined){
        query = `UPDATE Booking SET customerID = $1, bookingDate = $2, bookingType = $3, totalAdult = $4, totalChild = $5 WHERE bookingID = $6`;
        // UPDATE booking_room: INPUT (ALL Varchar) : bookingID, roomID, checkIn, checkOut, numOfAdult, numOfChild
        // OUTPUT: bookingID và roomID vừa cập nhật sẽ được trả về (Có hoặc không)
      }
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