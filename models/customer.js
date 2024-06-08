// bookingModel.js
import db from '../config/db.js'; // Đảm bảo rằng bạn đã import db từ file đúng

const getCustomerDetails = async(customerid) => {
  const query = `SELECT Booking.bookingID,
  booking_rooms.roomID,
  booking_rooms.checkin,
  booking_rooms.checkout,
  Customer_Ranking.discount,
  roomType.pricepernight
FROM Customers
JOIN Booking ON Customers.customerId = Booking.customerId
JOIN booking_rooms ON Booking.bookingID = booking_rooms.bookingID
JOIN Customer_Ranking ON Customers.RankId = Customer_Ranking.RankId
JOIN Rooms ON booking_rooms.roomID = Rooms.roomID
JOIn RoomType ON Rooms.roomType = RoomType.roomTypeid
WHERE Customers.customerId = $1
ORDER BY booking.bookingdate DESC;
`;
  const values = [customerid];
  const result = await db.query(query, values);
  return result.rows;
};
// Query hiển thị dữ liệu ra màn hình
const getCustomers = async (customerid, personalid, firstname, lastname, birthday, gender, email, phone, address, rank, search, limit, offset, sort) => {
  let whereConditions = [];
  let params = [];
  let paramIndex = 1;

  if (customerid) {
    whereConditions.push(`c.customerid = $${paramIndex}`);
    params.push(customerid);
    paramIndex++;
  }
  if (personalid) {
    whereConditions.push(`c.personalid = $${paramIndex}`);
    params.push(personalid);
    paramIndex++;
  }
  if (firstname) {
    whereConditions.push(`c.firstname = $${paramIndex}`);
    params.push(firstname);
    paramIndex++;
  }
  if (lastname) {
    whereConditions.push(`c.lastname = $${paramIndex}`);
    params.push(lastname);
    paramIndex++;
  }
  if (birthday) {
    whereConditions.push(`c.birthdate = $${paramIndex}`);
    params.push(birthday);
    paramIndex++;
  }
  if (gender) {
    whereConditions.push(`c.gender = $${paramIndex}`);
    params.push(gender);
    paramIndex++;
  }
  if (email) {
    whereConditions.push(`c.email = $${paramIndex}`);
    params.push(email);
    paramIndex++;
  }
  if (phone) {
    whereConditions.push(`c.phone = $${paramIndex}`);
    params.push(phone);
    paramIndex++;
  }
  if (address) {
    whereConditions.push(`c.address = $${paramIndex}`);
    params.push(address);
    paramIndex++;
  }
  if (rank) {
    whereConditions.push(`cr.namerank = $${paramIndex}`);
    params.push(rank);
    paramIndex++;
  }

  let query = `
    SELECT c.customerid, c.personalid, c.firstname, c.lastname, c.birthdate, c.gender, c.email, c.phone, c.address, cr.namerank
    FROM customers c
    JOIN customer_ranking cr ON c.rankid = cr.rankid
  `;

  if (search) {
    query = `
    SELECT c.customerid, c.personalid, c.firstname, c.lastname, c.birthdate, c.gender, c.email, c.phone, c.address, cr.namerank
    FROM customers c
    JOIN customer_ranking cr ON c.rankid = cr.rankid
    WHERE c.customerid::text LIKE '%${search}%' OR c.personalid::text LIKE '%${search}%' OR c.firstname LIKE '%${search}%' OR c.lastname LIKE '%${search}%' OR c.birthdate::text LIKE '%${search}%' OR c.phone LIKE '%${search}%' OR c.address LIKE '%${search}%' OR cr.namerank LIKE '%${search}%'
    ORDER BY c.customerid ASC LIMIT ${limit} OFFSET ${offset}`;
  }

  if (whereConditions.length > 0) {
    query += 'WHERE ' + whereConditions.join(' AND ') + ' ';
  }
  if (sort === 'AtoZ') {
    query += `ORDER BY c.customerid ASC `;
  } else if (sort === 'ZtoA') {
    query += `ORDER BY c.customerid DESC `;
  } 
  query += `LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  const result = await db.query(query, params);
  return result.rows;
};

// Query thêm dữ liệu
const addCustomer = (rankid, personalid, firstname, lastname, birthdate, gender, email, phone, address) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM new_customer($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
    const values = [rankid, personalid, firstname, lastname, birthdate, gender, email, phone, address];
    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error executing query', err.stack);
        reject(err.detail);
      } else {
        console.log('Customer added successfully');
        resolve(result.rows[0].custadded_out);
      }
    });
  });
};

// Query xóa dữ liệu
const deleteCustomer = (customerid, personalid) => {
  return new Promise((resolve, reject) => {
    console.log("customerid: ", customerid, "personalid: ", personalid);
    const query = `SELECT * FROM delete_customer($1, $2)`;
    const values = [customerid || null, personalid || null]; // Sử dụng null nếu giá trị là undefined
    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error executing query', err.stack);
        reject(err);
      } else {
        console.log('Customer deleted successfully');
        resolve(result.rows[0].res_del);
      }
    });
  });
};
// Query cập nhật dữ liệu
const updateCustomer = (customerid, { personalid, firstname, lastname, birthdate, gender, email, phone, address, namerank }) => {
  return new Promise((resolve, reject) => {
    const fields = { personalid, firstname, lastname, birthdate, gender, email, phone, address };
    console.log("fields: ",fields);
    const updates = [];
    for (let key in fields) {
      if (fields[key] !== undefined && fields[key] !== '') {
        updates.push(`${key} = '${fields[key]}'`);
      }
    }

    // Update rankid based on the provided namerank
    if (namerank !== undefined && namerank !== '') {
      updates.push(`rankid = (SELECT rankid FROM customer_ranking WHERE namerank = '${namerank}')`);
    }

      const query = `UPDATE customers SET ${updates.join(', ')} WHERE customerid = $1`;
      // UPDATE customers: INPUT (customerid, personalid, firstname, lastname, birthdate, gender, email, phone, address, namerank )
      // Thực hiện cập nhật thông tin khách hàng có customerid với các cột có chứa thông tin ở input (Tóm lại giá trị nào khác '' hoặc null thì sửa)
      // Nếu function trong sql làm được thì tốt không được thì thôi, phần này skip
      // OUTPUT: customerid vừa cập nhật sẽ được trả về
      db.query(query, [customerid], (err, result) => {
        if (err) {
          console.error('Error executing query', err.stack);
          reject(err);
        } else {
          console.log('Customer updated successfully');
          if (result.rowCount === 0) {
            resolve(0);
          } else {
            resolve(customerid);
          }
        }
      });
    });
};

// Export module
export default {
    getCustomers,
    deleteCustomer,
    updateCustomer,
    addCustomer,
    getCustomerDetails,
};