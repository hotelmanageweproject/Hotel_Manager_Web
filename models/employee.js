// bookingModel.js
import db from '../config/db.js'; // Đảm bảo rằng bạn đã import db từ file đúng

// Query hiển thị dữ liệu ra màn hình
const getStaff = async (staffid, departmentname, personalid, firstname, lastname, birthday, gender, email, phone, address,currentsal, startdate, enddate,search, limit, offset,sort) => {
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
  
  if (sort === 'AtoZ') {
    query += `ORDER BY e.staffid ASC `;
  } else if (sort === 'ZtoA') {
    query += `ORDER BY e.staffid DESC `;
  } 
  query += `LIMIT ${limit} OFFSET ${offset}`;  
};
  const result = await db.query(query);
  return result.rows;
};

const getStaffDetails = async(staffid) => {
  const query = `SELECT s.staffid ,dpt.*
FROM staff s, departments dpt
WHERE s.departmentid = dpt.departmentid AND s.staffid = $1::bigint
`;
  const values = [staffid];
  const result = await db.query(query, values);
  return result.rows;
};
// Query thêm dữ liệu
const addStaff = (departmentid, personalid, firstname, lastname, birthday, gender, email, phone, address, currentsal, startdate, enddate) => {
    return new Promise((resolve, reject) => {
      if (enddate === '' || enddate === null) enddate = null;
      const query = `
        INSERT INTO staff (departmentID, personalID, firstName, lastName, birthdate, gender, email, phone, address, currentSal, startDate, endDate)
        VALUES ($1, $2, $3, $4, $5::date, $6, $7, $8, $9, $10, $11::date, $12::date)
        RETURNING staffid
      `;
      // ADD staff: INPUT (ALL Varchar) : staffID,departmentID, personalID, firstName, lastName, birthday, gender, email, phone, address, currentSal, startDate, endDate
    // OUTPUT: firstName + lastName vừa in sẽ được trả về 
      const values = [departmentid, personalid, firstname, lastname, birthday, gender, email, phone, address, currentsal, startdate, enddate];
      db.query(query, values, (err, result) => {
        if (err) {
          console.error('Error executing query', err.stack);
          reject(err);
        } else {
          console.log('Staff added successfully');
          if (result.rowCount > 0) {
            resolve(result.rows[0].staffid);
          } else {
            reject(new Error('It seems the value you entered does not exist.'));
          }
    }});
    });
  };

// Query xóa dữ liệu
const deleteStaff = (staffID) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM staff WHERE staffID = $1 RETURNING staffID`;
    // Xóa staff: INPUT (staffID) : staffID
    // OUTPUT: staffID vừa xóa sẽ được trả về
    db.query(query, [staffID], (err, result) => {
          if (err) {
              console.error('Error executing query', err.stack);
              reject(err);
          } else {
              console.log('Staff deleted successfully');
              if (result.rowCount > 0) {
                resolve(staffID);
              } else {
                reject(new Error('It seems the value you entered does not exist.'));
              }
          }
      });
  });
};
// Query cập nhật dữ liệu
const updateStaff = (staffid, departmentid, personalid, firstname, lastname, birthday, gender, email, phone, address, currentsal, startdate, enddate) => {
    return new Promise((resolve, reject) => {
      const fields = {departmentid, personalid, firstname, lastname, birthdate : birthday, gender, email, phone, address, currentsal, startdate, enddate };
      const updates = [];
      for (let key in fields) {
        if (fields[key] !== undefined && fields[key] !== '') {
          updates.push(`${key} = '${fields[key]}'`);
        }
      }
    //  if (updates.length > 0) {
        const query = `UPDATE staff SET ${updates.join(', ')} WHERE staffid = '${staffid}'`;

        db.query(query, (err, result) => {
          if (err) {
          console.error('Error executing query', err.stack);
          reject(err);
          } else {
          console.log('Staff updated successfully');
          if (result.rowCount > 0) {
            resolve(staffid);
          } else {
            reject(new Error('It seems the value you entered does not exist.'));
          }          
          }
        });
      
    });
  };


// Export module
export default {
    getStaff,
    getStaffDetails,
    deleteStaff,
    updateStaff,
    addStaff,
};