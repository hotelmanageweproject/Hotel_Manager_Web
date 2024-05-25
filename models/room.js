// bookingModel.js
import db from '../config/db.js'; // Đảm bảo rằng bạn đã import db từ file đúng

// Query hiển thị dữ liệu ra màn hình
const getRoom = async (searchQuery, limit, offset) => {
  let query = `SELECT * FROM rooms WHERE roomID::text LIKE '%${searchQuery}%' ORDER BY roomID ASC LIMIT ${limit} OFFSET ${offset} `;
  if (!searchQuery) {
    query = `SELECT * FROM rooms ORDER BY roomID ASC LIMIT ${limit} OFFSET ${offset}`;
  }
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