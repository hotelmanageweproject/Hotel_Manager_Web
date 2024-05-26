// bookingModel.js
import db from '../config/db.js'; // Đảm bảo rằng bạn đã import db từ file đúng

// Query hiển thị dữ liệu ra màn hình
const getStaff = async (searchQuery, limit, offset) => {
  let query = `SELECT * FROM staff WHERE staffID::text LIKE '%${searchQuery}%' ORDER BY staffID ASC LIMIT ${limit} OFFSET ${offset} `;
  if (!searchQuery) {
    query = `SELECT * FROM staff ORDER BY staffID ASC LIMIT ${limit} OFFSET ${offset}`;
  }
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