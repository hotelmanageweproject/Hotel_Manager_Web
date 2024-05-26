// bookingModel.js
import db from '../config/db.js'; // Đảm bảo rằng bạn đã import db từ file đúng

// Query hiển thị dữ liệu ra màn hình
const getService = async (searchQuery, limit, offset) => {
  let query = `SELECT * FROM services WHERE serviceID::text LIKE '%${searchQuery}%' ORDER BY serviceID ASC LIMIT ${limit} OFFSET ${offset} `;
  if (!searchQuery) {
    query = `SELECT * FROM services ORDER BY serviceID ASC LIMIT ${limit} OFFSET ${offset}`;
  }
  const result = await db.query(query);
  return result.rows;
};

// Query thêm dữ liệu
const addService = (serviceID, name, departmentID, note) => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO services (serviceID, name, departmentID, note)
        VALUES ($1, $2, $3, $4)
      `;
      const values = [serviceID, name, departmentID, note];
      db.query(query, values, (err, result) => {
        if (err) {
          console.error('Error executing query', err.stack);
          reject(err);
        } else {
          console.log('Service added successfully');
          resolve(result);
        }
      });
    });
  };

// Query xóa dữ liệu
const deleteService = (serviceID) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM services WHERE serviceID = $1`;
    db.query(query, [serviceID], (err, result) => {
          if (err) {
              console.error('Error executing query', err.stack);
              reject(err);
          } else {
              console.log('Service deleted successfully');
              resolve(result);
          }
      });
  });
};
// Query cập nhật dữ liệu
const updateService = (serviceID, { name, departmentID, note}) => {
    return new Promise((resolve, reject) => {
      const fields = { name, departmentID, note };
      const updates = [];
      for (let key in fields) {
        if (fields[key] !== undefined && fields[key] !== '') {
          updates.push(`${key} = '${fields[key]}'`);
        }
      }
      if (updates.length > 0) {
        const query = `UPDATE services SET ${updates.join(', ')} WHERE serviceID = '${serviceID}'`;
        db.query(query, (err, result) => {
          if (err) {
          console.error('Error executing query', err.stack);
          reject(err);
          } else {
          console.log('Service updated successfully');
          resolve(result);
          }
        });
      }
    });
  };
// Export module
export default {
    getService,
    deleteService,
    updateService,
    addService,
};