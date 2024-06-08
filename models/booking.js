// bookingModel.js
import db from '../config/db.js'; // Đảm bảo rằng bạn đã import db từ file đúng

const getBookingDetails = async(bookingid) => {
  const query = `SELECT payment.* FROM payment WHERE bookingid = $1`;
  const values = [bookingid];
  const result = await db.query(query, values);
  return result.rows;
}
// Query hiển thị dữ liệu ra màn hình
const getBooking = async (bookingid,customerid,bookingdate,bookingtype,totaladult,totalchild,roomid,checkin,checkout,numofchild,numofadult,page,searchQuery, limit, offset,sort) => {
  let whereConditions = [];
  let query = '';
  if (bookingid) whereConditions.push(`b.bookingid = ${bookingid}`);
  if (customerid) whereConditions.push(`b.customerid = ${customerid}`);
  if (bookingdate) whereConditions.push(`b.bookingdate = '%${bookingdate}%'`);
  if (bookingtype) whereConditions.push(`b.bookingtype LIKE '%${bookingtype}%'`);
  if (totaladult) whereConditions.push(`b.totaladult = ${totaladult}`);
  if (totalchild) whereConditions.push(`b.totalchild = ${totalchild}`);
  if (roomid) whereConditions.push(`br.roomid = '${roomid}'`);
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
  if (sort === 'AtoZ') {
    query += `ORDER BY b.bookingid ASC `;
  } else if (sort === 'ZtoA') {
    query += `ORDER BY b.bookingid DESC `;
  } 
  query += `LIMIT ${limit} OFFSET ${offset}`;
  };
  const result = await db.query(query);
  return result.rows;
};

// Query thêm dữ liệu
const addBooking = (bookingid, customerid, bookingdate, bookingtype, totaladult, totalchild, new_bkrooms,numofchild,numofadult,checkin, checkout) => {
    return new Promise((resolve, reject) => {
      let query = '';
      let values = [];
      if (new_bkrooms === '' && bookingid === '') {
        query = `SELECT new_booking($1::bigint, $2::date, $3, $4::int, $5::int)`; // Thêm dữ liệu vào bảng booking và booking_room
        values = [customerid, bookingdate, bookingtype, totaladult, totalchild];
        // ADD Booking vào bảng booking: INPUT (ALL Varchar)  : bookingID, customerID, bookingDate, bookingType, totalAdult, totalChild
        // OUTPUT: bookingID vừa thêm sẽ được trả về
      } else if (new_bkrooms !== '' && bookingid !== ''){
        query = `SELECT new_bkrooms($1::bigint, $2, $3::date, $4::date, $5::int , $6::int)`; // Thêm dữ liệu vào bảng booking_room
        values = [bookingid, new_bkrooms,  checkin, checkout ,numofadult, numofchild]
        console.log(values);
        // ADD vào bảng booking_room: INPUT (ALL Varchar) : bookingID, roomID, checkIn, checkOut, numOfAdult, numOfChild
        // OUTPUT: bookingID và roomID vừa thêm sẽ được trả về
        // 1 Thắc mắc nhỏ nếu bookingID đó đã tồn tại phòng đó thì sao ? Và có thao tác nào để kiểm tra hiện tại không có bookingID nào khác dùng roomID đó không ?
      }
      db.query(query, values, (err, result) => {
        console.log(result);
        if (err) {
          console.error('Error executing query', err.stack);
          reject(err);
        } else {
          console.log('Booking added successfully');
          if (result.rowCount !== 0 || result.rowCount !== null || result.rowCount !== '0') {
            if (new_bkrooms === '' && bookingid === '') {
              resolve(result.rows[0].new_booking);
            } else if (new_bkrooms !== '' && bookingid !== '') {
              resolve(2);
            } 
          } else {
              resolve(0);
            }
        }
      });
    });
  };

// Query xóa dữ liệu
const deleteBooking = (bookingid,roomid) => {
  return new Promise((resolve, reject) => {
    let query = '';
    let values = [];
    if (roomid === '') {
      query = `SELECT delete_booking($1::bigint)`;
      values = [bookingid];
      // DELETE Booking: INPUT (bookingID) : Thực hiện xoá bản ghi có bookingID ở bảng booking và toàn bộ bản ghi ở bản booking_room có bookingID đó
      // OUTPUT : bookingID vừa xoá sẽ được trả về (Có hoặc không)
    } else if (roomid !== '' && bookingid !== ''){
      // DELETE Booking: INPUT (bookingID, roomID) : Thực hiện xoá bản ghi có bookingID và roomID ở bảng booking_room
      // OUTPUT : bookingID và roomID vừa xoá sẽ được trả về (Có hoặc không)
      query = `SELECT delete_bkrooms($1::bigint, $2)`;
      values = [bookingid, roomid];
    }
    
    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error executing query', err.stack);
        reject(err);
      } else {
        console.log('Booking deleted successfully');
        
        if (result.rowCount !== 0 && result.rowCount !== null && result.rowCount !== '0' ) {
          if (roomid === '' && bookingid !== '') {
            if (result.rows[0].delete_booking[0] !== '0') {
            resolve(1);
            } else {
              resolve(0);
            }
          } 
          if (roomid !== '' && bookingid !== '') {
            if (result.rows[0].delete_bkrooms !== '(,,)') {
            resolve(2);
            } else {
              resolve(0);
            }
          } 
        } else {
          console.log('Booking not found');
            resolve(0);
          }
      }
      });
  });
};
// Query cập nhật dữ liệu
const updateBooking = (bookingid, customerid, bookingdate, bookingtype, totaladult, totalchild, roomid, numofchild, numofadult, checkin, checkout) => {
  return new Promise((resolve, reject) => {
    let query = '';
    let values = [];
    const fields = {customerid, bookingdate, bookingtype, totaladult, totalchild, numofchild, numofadult, checkin, checkout};
    const updates = [];
    for (let key in fields) {
      if (fields[key] !== undefined && fields[key] !== null && fields[key] !== '') {
        updates.push(`${key} = '${fields[key]}'`);
      }
    }
    
    
    if (roomid !== '' && bookingid !== '') {
      query = `UPDATE Booking_Rooms SET ${updates.join(', ')} WHERE bookingid = $1::bigint AND roomid = $2`;
      values = [bookingid, roomid];
      // UPDATE Booking: INPUT (ALL Varchar) : bookingID, customerID, bookingDate, bookingType, totalAdult, totalChild
      // Lưu ý chỉ những giá trị nào khác null hoặc '' mới thực hiện thay đổi Nếu không được thì skip
      // OUTPUT: bookingID vừa cập nhật sẽ được trả về (Có hoặc không)
    } else if (roomid === '' && bookingid !== '') {
      query = `UPDATE Booking SET ${updates.join(', ')} WHERE bookingID = $1::bigint`;
      values = [bookingid];
      // UPDATE booking_room: INPUT (ALL Varchar) : bookingID, roomID, checkIn, checkOut, numOfAdult, numOfChild
      // OUTPUT: bookingID và roomID vừa cập nhật sẽ được trả về (Có hoặc không)
    }
    
    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error executing query', err.stack);
        reject(err);
      } else {
        console.log('Booking updated successfully');
        if (result.rowCount !== 0 && result.rowCount !== null && result.rowCount !== '0' ) {
          if (roomid === '' && bookingid !== '') {
            
            resolve(1);
            } 
         
          if (roomid !== '' && bookingid !== '') {
            resolve(2);
            }
          } 
          else {
          console.log('Booking not found');
            resolve(0);
          }
      }
    });
  });
};
// Export module
export default {
    getBooking,
    deleteBooking,
    updateBooking,
    addBooking,
    getBookingDetails
};