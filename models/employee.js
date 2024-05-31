// bookingModel.js
import db from '../config/db.js'; // Đảm bảo rằng bạn đã import db từ file đúng

// Query hiển thị dữ liệu ra màn hình
const getStaff = async (staffid, departmentname, personalid, firstname, lastname, birthday, gender, email, phone, address,currentsal, startdate, enddate,search, limit, offset) => {
  let whereConditions = [];
  let query = '';
  if (staffid) whereConditions.push(`e.staffid = ${staffid}`);
  if (departmentname) whereConditions.push(`d.name LIKE '%${departmentname}%'`);
  if (personalid) whereConditions.push(`e.personalid = ${personalid}`);
  if (firstname) whereConditions.push(`e.firstname LIKE '%${firstname}%'`);
  if (lastname) whereConditions.push(`e.lastname LIKE '%${lastname}%'`);
  if (birthday) whereConditions.push(`e.birthdate = '%${birthday}%'`);
  if (gender) whereConditions.push(`e.gender LIKE '%${gender}%'`);
  if (email) whereConditions.push(`e.email LIKE '%${email}%'`);
  if (phone) whereConditions.push(`e.phone LIKE '%${phone}%'`);
  if (address) whereConditions.push(`e.address LIKE '%${address}%'`);
  if (currentsal) whereConditions.push(`e.currentsal = '%${currentsal}%'`);
  if (startdate) whereConditions.push(`e.startdate = '%${startdate}%'`);
  if (enddate) whereConditions.push(`e.enddate = '%${enddate}%'`);
  // Thêm các điều kiện tương tự cho các tham số khác nếu chúng không phải là NULL
  if (search) {
    query = `
    SELECT e.staffid, d.name AS departmentname, e.personalid, e.firstname, e.lastname, e.birthdate, e.gender,e.email, e.phone, e.address,e.currentsal, e.startdate, e.enddate
    FROM staff e
    JOIN departments d ON e.departmentid = d.departmentid
    WHERE e.staffid::text LIKE '%${search}%' OR d.name LIKE '%${search}%' OR e.personalid LIKE '%${search}%' OR e.firstname LIKE '%${search}%' OR e.lastname LIKE '%${search}%' OR e.birthdate LIKE '%${search}%' OR e.email LIKE '%${search}%' OR e.phone LIKE '%${search}%' OR e.address LIKE '%${search}%' OR e.currentsal LIKE '%${search}%' OR e.startdate LIKE '%${search}%'
    ORDER BY e.staffid ASC LIMIT ${limit} OFFSET ${offset}`;
  } else {
    query = `
    SELECT e.staffid, d.name AS departmentName, e.personalid, e.firstname, e.lastname, e.birthdate, e.gender,e.email, e.phone, e.address,e.currentsal, e.startdate, e.enddate
    FROM staff e
    JOIN departments d ON e.departmentid = d.departmentid
  `;

  if (whereConditions.length > 0) {
    query += 'WHERE ' + whereConditions.join(' AND ') + ' ';
  }
  
  query += `ORDER BY e.staffid ASC LIMIT ${limit} OFFSET ${offset}`;
  };
  console.log(query);
  const result = await db.query(query);
  return result.rows;
};

// Query thêm dữ liệu
const addStaff = (staffID,departmentID, personalID, firstName, lastName, birthday, gender, email, phone, address, currentSal, startDate, endDate) => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO staff (staffID,departmentID, personalID, firstName, lastName, birthday, gender, email, phone, address, currentSal, startDate, endDate)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `;
      const values = [staffID,departmentID, personalID, firstName, lastName, birthday, gender, email, phone, address, currentSal, startDate, endDate];
      db.query(query, values, (err, result) => {
        if (err) {
          console.error('Error executing query', err.stack);
          reject(err);
        } else {
          console.log('Staff added successfully');
          resolve(result);
        }
      });
    });
  };

// Query xóa dữ liệu
const deleteStaff = (staffID) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM staff WHERE staffID = $1`;
    db.query(query, [staffID], (err, result) => {
          if (err) {
              console.error('Error executing query', err.stack);
              reject(err);
          } else {
              console.log('Staff deleted successfully');
              resolve(result);
          }
      });
  });
};
// Query cập nhật dữ liệu
const updateStaff = (staffID, { departmentID, personalID, firstName, lastName, birthday, gender, email, phone, address, currentSal, startDate, endDate}) => {
    return new Promise((resolve, reject) => {
      const fields = {departmentID, personalID, firstName, lastName, birthday, gender, email, phone, address, currentSal, startDate, endDate };
      const updates = [];
      for (let key in fields) {
        if (fields[key] !== undefined && fields[key] !== '') {
          updates.push(`${key} = '${fields[key]}'`);
        }
      }
      if (updates.length > 0) {
        const query = `UPDATE staff SET ${updates.join(', ')} WHERE staffid = '${staffID}'`;
        db.query(query, (err, result) => {
          if (err) {
          console.error('Error executing query', err.stack);
          reject(err);
          } else {
          console.log('Staff updated successfully');
          resolve(result);
          }
        });
      }
    });
  };
// Export module
export default {
    getStaff,
    deleteStaff,
    updateStaff,
    addStaff,
};