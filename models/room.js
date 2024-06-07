// bookingModel.js
import db from '../config/db.js'; // Đảm bảo rằng bạn đã import db từ file đúng

// Query hiển thị dữ liệu ra màn hình
const getRoom = async (roomid, roomtype, status, pricepernight, maxadult, maxchild, roomstate,search, limit, offset, sort) => {
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

  if (sort === 'AtoZ') {
    query += `ORDER BY r.roomid ASC `;
  } else if (sort === 'ZtoA') {
    query += `ORDER BY r.roomid DESC `;
  } 
  query += `LIMIT ${limit} OFFSET ${offset}`;
  };
  console.log(query);
  const result = await db.query(query);
  return result.rows;
};

const getRoomDetails = async(roomid) => {
  const query = `WITH subquery AS(
	SELECT bkid, bookingid, roomid, checkin, checkout
	FROM booking_rooms 
	WHERE roomid = $1 AND current_date BETWEEN checkin and checkout
)
SELECT rs.receiptid, rs.bkid, sq.bookingid, sq.roomid, s.serviceid, s.name AS servicename, rs.total, rs.date , rs.staffid
FROM room_service rs
JOIN subquery sq ON sq.bkid = rs.bkid
JOIN services s ON s.serviceid = rs.serviceid
Where rs.date <= current_date;;
`;
  const values = [roomid];
  console.log("roomid:",roomid);
  const result = await db.query(query, values);
  return result.rows;
};

// Query thêm dữ liệu
const addRoom = (roomid, roomtype, status, name, pricepernight, maxadult, maxchild, bookingid, serviceid,total_in,date,staffid) => {
  return new Promise((resolve, reject) => {
    let query = '';
    let values = [];
    if (roomid !== '' && roomtype !== '' && status !== '')  {
      query = `INSERT INTO rooms (roomid, roomtype, status) VALUES ($1, $2, $3)`;
      values = [roomid, roomtype, status];
    } else if (roomid === '' && roomtype !== '' && name !== '' && pricepernight !== '' && maxadult !== '' && maxchild !== ''){
      query = `INSERT INTO roomtype (roomtypeid, name, pricepernight, maxadult, maxchild) VALUES ($1::bigint, $2, $3::bigint, $4::int, $5::int)`;
      values = [roomtype, name, pricepernight, maxadult, maxchild];
    } else if (roomid !== '' && bookingid !== '' && serviceid !== ''){
      query = `SELECT new_rmservice($1, $2, $3, $4, $5, $6)`;
      values = [bookingid, roomid, serviceid, total_in, date, staffid];
    }
    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error executing query', err.stack);
        reject(err);
      } else {
        console.log('Room added successfully');
        resolve(roomid);
      }
    });
  });
};


// Query xóa dữ liệu
const deleteRoom = (roomtypeid,roomid,receiptid) => {
  return new Promise((resolve, reject) => {
    let query = ``;
    let values = [];
    if (roomtypeid !== '' && roomid === '' && receiptid === '') {
        query = `Delete from roomtype where roomtypeid = $1::bigint`;
        values = [roomtypeid];
        // DELETE bảng rooms: INPUT (roomID) : Thực hiện xoá bản ghi có roomID ở bảng rooms
        // OUTPUT : roomID vừa xoá sẽ được trả về (Có hoặc không)
    } else if (roomtypeid === '' && roomid !== '' && receiptid === '') {
        query = `Delete from rooms where roomid = $1`;
        values = [roomid];
    } else if (roomtypeid === '' && roomid === '' && receiptid !== '') {
        query = `Delete from room_service where receiptid = $1`;
        values = [receiptid];
        // DELETE bảng room_service: INPUT (roomID, serviceID) : Thực hiện xoá bản ghi có roomID và serviceID ở bảng room_service
        // OUTPUT : roomID và serviceID vừa xoá sẽ được trả về (Có hoặc không)
    }
    db.query(query, values, (err, result) => {
          if (err) {
              console.error('Error executing query', err.stack);
              reject(err);
          } else {
              console.log('Room, room type or reciept deleted successfully');
              resolve(roomid);
            }
      });
  });
};
// Query cập nhật dữ liệu
const updateRoom = (roomid, roomtype, status, name, pricepernight, maxadult, maxchild, receiptid, serviceid,total_in,date,staffid) => {
  return new Promise((resolve, reject) => {
    let query = '';
    let values = [];
    if (roomid !== '' && (status !== '' || roomtype !== '') && receiptid === '' && serviceid === '') {
      const fields = { roomtype, status };
      const updates = [];
      for (let key in fields) {
        if (fields[key] !== '') {
          updates.push(`${key} = $${updates.length + 1}`);
          values.push(fields[key]);
        }
      }
      query = `UPDATE rooms SET ${updates.join(', ')} WHERE roomid = $${updates.length + 1}`;
      values.push(roomid);
    } else if (roomid === '' && roomtype !== ''){
      const fields = { name, pricepernight, maxadult, maxchild };
      const updates = [];
      for (let key in fields) {
        if (fields[key] !== '') {
          updates.push(`${key} = $${updates.length + 1}`);
          values.push(fields[key]);
        }
      }
      query = `UPDATE roomtype SET ${updates.join(', ')} WHERE roomtypeid = $${updates.length + 1}`;
      values.push(roomtype);
    } else if (roomid === '' && roomtype === '' && receiptid !== '' && (serviceid !== '' || total_in !== '' || date !== '' || staffid !== '')){
      const fields = {serviceid, total_in, date, staffid };
      const updates = [];
      for (let key in fields) {
        if (fields[key] !== '') {
          updates.push(`${key} = $${updates.length + 1}`);
          values.push(fields[key]);
        }
      }
      query = `UPDATE room_service SET ${updates.join(', ')} WHERE receiptid = $${updates.length + 1}`;
      values.push(receiptid);
    } 
    
    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error executing query', err.stack);
        reject(err);
      } else {
        console.log('Room updated successfully');
        if (roomid !== '' && roomtype === '' && receiptid === '') {
          resolve(roomid);
        } else if (roomtype !== '') {
          resolve(roomtype);
        } else if (receiptid !== '') {
          resolve(receiptid);
        } else if (result.rowCount === 0){
          resolve(0);
        }
      }
    });
  });
};

// Export module
export default {
    getRoom,
    deleteRoom,
    updateRoom,
    addRoom,
    getRoomDetails
};