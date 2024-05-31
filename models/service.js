// bookingModel.js
import db from '../config/db.js'; // Đảm bảo rằng bạn đã import db từ file đúng

// Query hiển thị dữ liệu ra màn hình
const getService = async (serviceid, servicename, note, departmentid, departmentname, manager, description,search, limit, offset) => {
  let whereConditions = [];
  let query = '';
  if (serviceid) whereConditions.push(`s.serviceid = ${serviceid}`);
  if (servicename) whereConditions.push(`s.name LIKE '%${servicename}%'`);
  if (note) whereConditions.push(`s.note LIKE '%${note}%'`);
  if (departmentid) whereConditions.push(`d.departmentid = ${departmentid}`);
  if (departmentname) whereConditions.push(`d.name LIKE '%${departmentname}%'`);
  if (manager) whereConditions.push(`d.manager LIKE '%${manager}%'`);
  if (description) whereConditions.push(`d.description LIKE '%${description}%'`);
  // Thêm các điều kiện tương tự cho các tham số khác nếu chúng không phải là NULL
  if (search) {
    query = `
    SELECT s.serviceid, s.name AS servicename, s.note, d.departmentid, d.name AS departmentname, d.manager, d.description
    FROM services s
    JOIN departments d ON s.departmentid = d.departmentid
    WHERE s.serviceid::text LIKE '%${search}%' OR s.name LIKE '%${search}%' OR s.note LIKE '%${search}%' OR d.departmentid::text LIKE '%${search}%' OR d.name LIKE '%${search}%' OR d.manager LIKE '%${search}%' OR d.description LIKE '%${search}%'
    ORDER BY s.serviceid ASC LIMIT ${limit} OFFSET ${offset}`;
  } else {
    query = `
    SELECT s.serviceid, s.name AS servicename, s.note, d.departmentid, d.name AS departmentname, d.manager, d.description
    FROM services s
    JOIN departments d ON s.departmentid = d.departmentid
  `;
  if (whereConditions.length > 0) {
    query += 'WHERE ' + whereConditions.join(' AND ') + ' ';
  }
  query += `ORDER BY s.serviceid ASC LIMIT ${limit} OFFSET ${offset}`;
  };
  console.log(query);
  
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