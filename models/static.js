import db from '../config/db.js'; // Đảm bảo rằng bạn đã import db từ file đúng

const addPayment = (bookingid, totalamount, additionalcharge, paymentmethod, paymentdate, note) => {
  return new Promise((resolve, reject) => {
    let query = '';
    let values = [];
    const fields = { totalamount, additionalcharge, paymentmethod, paymentdate, note }; // Loại bỏ paymentstatus khỏi fields
    const updates = [];
    for (let key in fields) {
      if (fields[key] !== undefined && fields[key] !== null && fields[key] !== '') {
        updates.push(`${key} = '${fields[key]}'`);
      }
    }
    updates.push(`paymentstatus = 'paid'`); // Thêm paymentstatus = 'paid' vào cuối
    query = `UPDATE payment SET ${updates.join(', ')} WHERE bookingid = $1::bigint`;
    console.log(query);
    values = [bookingid];
    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error executing query', err.stack);
        reject(err);
      } else {
        console.log('Payment updated successfully');
        if (result.rowCount !== 0 && result.rowCount !== null && result.rowCount !== '0') {
          resolve(1);
        } else {
          console.log('Booking not found');
          resolve(0);
        }
      }
    });
  });
};
const getPaymentByBookingId = (bookingid) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT payment.*, customers.personalid 
      FROM payment 
      JOIN booking ON payment.bookingid = booking.bookingid
      JOIN customers ON booking.customerid = customers.customerid
      WHERE payment.bookingid = $1`;
      const values = [bookingid];
      db.query(query, values, (err, result) => {
        if (err) {
          console.error('Error executing query', err.stack);
          reject(err);
        } else {
          if (result.rowCount > 0) {
            resolve(result.rows[0]);
          } else {
            resolve(null);
          }
        }
      });
    });
  };

  const getServiceRanking = () => {
    return new Promise((resolve, reject) => {
      const query = `
        WITH subquery AS (
          SELECT rs.serviceid, count(rs.receiptid) AS numofreceipt
          FROM room_service rs
          WHERE rs.date BETWEEN current_date - INTERVAL '1 year' AND current_date
          GROUP BY rs.serviceid
        )
        SELECT s.name AS servicename, sqr.numofreceipt, RANK() OVER (ORDER BY sqr.numofreceipt DESC) ranking
        FROM subquery sqr
        JOIN services s ON s.serviceid = sqr.serviceid
        LIMIT 5;
      `;
      db.query(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.rows);
        }
      });
    });
  };
export default {
  addPayment,
  getPaymentByBookingId,
  getServiceRanking
};
