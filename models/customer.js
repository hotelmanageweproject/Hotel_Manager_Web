// bookingModel.js
import db from '../config/db.js'; // Đảm bảo rằng bạn đã import db từ file đúng

// Query hiển thị dữ liệu ra màn hình
const getCustomers = async (customerid,personalid,firstname,lastname,birthday,gender,email,phone,address,rank,search, limit, offset) => {
  let whereConditions = [];
  let query = '';
  if (customerid) whereConditions.push(`c.customerid = ${customerid}`);
  if (personalid) whereConditions.push(`c.personalid LIKE ${personalid}::text`);
  if (firstname) whereConditions.push(`c.firstname LIKE '%${firstname}%'`);
  if (lastname) whereConditions.push(`c.lastname LIKE '%${lastname}%'`);
  if (birthday) whereConditions.push(`c.birthdate = '%${birthday}%'`);
  if (gender) whereConditions.push(`c.gender LIKE '%${gender}%'`);
  if (email) whereConditions.push(`c.email LIKE '%${email}%'`);
  if (phone) whereConditions.push(`c.phone LIKE '%${phone}%'`);
  if (address) whereConditions.push(`c.address LIKE '%${address}%'`);
  if (rank) whereConditions.push(`cr.namerank LIKE '%${rank}%'`);
  // Thêm các điều kiện tương tự cho các tham số khác nếu chúng không phải là NULL
  if (search) {
    query = `
    SELECT c.customerid, c.personalid, c.firstname, c.lastname, c.birthdate, c.gender, c.email, c.phone, c.address, cr.namerank
    FROM customers c
    JOIN customer_ranking cr ON c.rankid = cr.rankid
    WHERE c.customerid LIKE '%${search}%' OR c.personalid LIKE '%${search}%' OR c.firstname LIKE '%${search}%' OR c.lastname LIKE '%${search}%' OR c.birthdate LIKE '%${search}%' OR c.phone LIKE '%${search}%' OR c.address LIKE '%${search}%' OR cr.namerank LIKE '%${search}%'
    ORDER BY c.customerid ASC LIMIT ${limit} OFFSET ${offset}`;
  } else {
    query = `
    SELECT c.customerid, c.personalid, c.firstname, c.lastname, c.birthdate, c.gender, c.email, c.phone, c.address, cr.namerank
    FROM customers c
    JOIN customer_ranking cr ON c.rankid = cr.rankid
  `;

  if (whereConditions.length > 0) {
    query += 'WHERE ' + whereConditions.join(' AND ') + ' ';
  }
  
  query += `ORDER BY c.customerid ASC LIMIT ${limit} OFFSET ${offset}`;
  };

  const result = await db.query(query);
  return result.rows;
};

// Query thêm dữ liệu
const addCustomer = (customerid, personalid, firstname, lastname, birthdate, gender, email, phone, address, namerank) => {
    return new Promise((resolve, reject) => {
      const query = ` 
      INSERT INTO customers (customerid, personalid, firstname, lastname, birthdate, gender, email, phone, address, rankid)
    SELECT $1::bigint, $2, $3, $4, $5::DATE, $6, $7, $8, $9, cr.rankid
    FROM (
        SELECT $1::bigint AS customerid, $2 AS personalid, $3 AS firstname, $4 AS lastname, $5::date AS birthdate, $6 AS gender, $7 AS email, $8 AS phone, $9 AS address, $10 AS namerank
    ) AS new_customer
    JOIN customer_ranking cr ON new_customer.namerank = cr.namerank;
    `;
    // ADD customers: INPUT (ALL Varchar) : customerid, personalid, firstname, lastname, birthdate, gender, email, phone, address, namerank
    // OUTPUT: customerid vừa in sẽ được trả về 
      const values = [customerid, personalid, firstname, lastname, birthdate, gender, email, phone, address, namerank];
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
const deleteCustomer = (customerid) => {
  return new Promise((resolve, reject) => {
    console.log("customerid: ",customerid);
    const query = `DELETE FROM customers WHERE customerid::bigint = $1`;
    // DELETE customers: INPUT (customerid) : Thực hiện xoá bản ghi có customerid
    // OUTPUT: customerid vừa xóa sẽ được trả về
    const values = [customerid];
    db.query(query, values, (err, result) => {
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

    if (updates.length > 0) {
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