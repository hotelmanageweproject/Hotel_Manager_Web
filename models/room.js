// bookingModel.js
import db from '../config/db.js'; // Đảm bảo rằng bạn đã import db từ file đúng

// Query hiển thị dữ liệu ra màn hình
const getRoom = async (roomid, roomtype, status, pricepernight, maxadult, maxchild, roomstate,search, limit, offset) => {
  let whereConditions = [];
  let query = '';
  console.log(status);
  if (roomid) whereConditions.push(`r.roomid LIKE '%${roomid}%'`);
  if (status) whereConditions.push(`r.status LIKE '%${status}%'`);
  if (roomtype) whereConditions.push(`rt.name LIKE '%${roomtype}%'`);
  if (pricepernight) whereConditions.push(`rt.pricepernight = ${pricepernight}`);
  if (maxadult) whereConditions.push(`rt.maxadult = ${maxadult}`);
  if (maxchild) whereConditions.push(`rt.maxchild = ${maxchild}`);
  if (roomstate) whereConditions.push(`rt.roomstate LIKE '%${roomstate}%'`);
  // Thêm các điều kiện tương tự cho các tham số khác nếu chúng không phải là NULL
  if (search) {
    query = `
    select r.roomid,r.status,rt.name AS roomtype,rt.pricepernight, rt.maxadult,rt.maxchild , search_status_room(r.roomid, current_date) AS roomstate
from rooms r
join roomtype rt on rt.roomtypeid = r.roomtype
WHERE r.roomid LIKE '%${search}%' OR rt.name LIKE '%${search}%' OR rt.pricepernight::text LIKE '%${search}%' OR rt.maxadult::text = '%${search}%' OR rt.maxchild::text = '%${search}%'
ORDER BY r.roomid ASC LIMIT ${limit} OFFSET ${offset}
    `;
  } else {
    query = `
    select r.roomid,r.status,rt.name AS roomtype,rt.pricepernight, rt.maxadult,rt.maxchild , search_status_room(r.roomid, current_date) AS roomstate
from rooms r
join roomtype rt on rt.roomtypeid = r.roomtype
  `;

  if (whereConditions.length > 0) {
    query += 'WHERE ' + whereConditions.join(' AND ') + ' ';
  }
  
  query += `ORDER BY r.roomid ASC LIMIT ${limit} OFFSET ${offset}`;
  };
  console.log(query);
  const result = await db.query(query);
  return result.rows;
};

// Query thêm dữ liệu
const addRoom = (roomID, roomType, status) => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO rooms (roomID, roomType, status)
        VALUES ($1, $2, $3)
      `;
      const values = [roomID, roomType, status];
      db.query(query, values, (err, result) => {
        if (err) {
          console.error('Error executing query', err.stack);
          reject(err);
        } else {
          console.log('Room added successfully');
          resolve(result);
        }
      });
    });
  };

// Query xóa dữ liệu
const deleteRoom = (roomID) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM rooms WHERE roomID = $1`;
    db.query(query, [roomID], (err, result) => {
          if (err) {
              console.error('Error executing query', err.stack);
              reject(err);
          } else {
              console.log('Room deleted successfully');
              resolve(result);
          }
      });
  });
};
// Query cập nhật dữ liệu
const updateRoom = (roomID, { roomType, status}) => {
    return new Promise((resolve, reject) => {
      const fields = { roomType, status };
      const updates = [];
      for (let key in fields) {
        if (fields[key] !== undefined && fields[key] !== '') {
          updates.push(`${key} = '${fields[key]}'`);
        }
      }
      if (updates.length > 0) {
        const query = `UPDATE rooms SET ${updates.join(', ')} WHERE roomid = '${roomID}'`;
        db.query(query, (err, result) => {
          if (err) {
          console.error('Error executing query', err.stack);
          reject(err);
          } else {
          console.log('Room updated successfully');
          resolve(result);
          }
        });
      }
    });
  };
// Export module
export default {
    getRoom,
    deleteRoom,
    updateRoom,
    addRoom,
};