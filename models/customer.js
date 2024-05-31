// bookingModel.js
import db from '../config/db.js'; // Đảm bảo rằng bạn đã import db từ file đúng

// Query hiển thị dữ liệu ra màn hình
const getCustomers = async (customerid,personalid,firstname,lastname,birthday,gender,email,phone,address,rank,search, limit, offset) => {
  let whereConditions = [];
  let query = '';
  if (customerid) whereConditions.push(`c.customerid = ${customerid}`);
  if (personalid) whereConditions.push(`c.personalid = ${personalid}`);
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
  console.log(query);

  const result = await db.query(query);
  return result.rows;
};

// Query thêm dữ liệu
const addCustomer = (customerid, rankid, personalid, firstname, lastname, birthday, gender, email, phone, address) => {
    return new Promise((resolve, reject) => {
      console.log(customerid);
      const query = `
        INSERT INTO Customers (customerid, rankid, personalid, firstname, lastname, birthday, gender, email, phone, address)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `;
      const values = [customerid, rankid, personalid, firstname, lastname, birthday, gender, email, phone, address];
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
    const query = `DELETE FROM Customers WHERE customerid = $1`;
    db.query(query, [customerid], (err, result) => {
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
const updateCustomer = (customerid, { rankid, personalid, firstname, lastname, birthday, gender, email, phone, address}) => {
    return new Promise((resolve, reject) => {
      const fields = { rankid, personalid, firstname, lastname, birthday, gender, email, phone, address };
      const updates = [];
      for (let key in fields) {
        if (fields[key] !== undefined && fields[key] !== '') {
          updates.push(`${key} = '${fields[key]}'`);
        }
      }
      if (updates.length > 0) {
        const query = `UPDATE Customers SET ${updates.join(', ')} WHERE customerid = '${customerid}'`;
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