import db from "../config/db.js"; // Đảm bảo rằng bạn đã import db từ file đúng

const addPayment = (
  bookingid,
  totalamount,
  additionalcharge,
  paymentmethod,
  paymentdate,
  note
) => {
  return new Promise((resolve, reject) => {
    let query = "";
    let values = [];
    const fields = {
      totalamount,
      additionalcharge,
      paymentmethod,
      paymentdate,
      note,
    }; // Loại bỏ paymentstatus khỏi fields
    const updates = [];
    for (let key in fields) {
      if (
        fields[key] !== undefined &&
        fields[key] !== null &&
        fields[key] !== ""
      ) {
        updates.push(`${key} = '${fields[key]}'`);
      }
    }
    updates.push(`paymentstatus = 'paid'`); // Thêm paymentstatus = 'paid' vào cuối
    query = `UPDATE payment SET ${updates.join(
      ", "
    )} WHERE bookingid = $1::bigint`;
    values = [bookingid];
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error executing query", err.stack);
        reject(err);
      } else {
        console.log("Payment updated successfully");
        if (
          result.rowCount !== 0 &&
          result.rowCount !== null &&
          result.rowCount !== "0"
        ) {
          resolve(1);
        } else {
          console.log("Booking not found");
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
        console.error("Error executing query", err.stack);
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

const getCustomerRanking = () => {
  return new Promise((resolve, reject) => {
    const query = `
        WITH subquery AS (
          SELECT bk.customerid, count(bk.bookingid) AS numofbooking
          FROM booking bk
          WHERE bk.bookingdate BETWEEN current_date - INTERVAL '1 year' AND current_date
          GROUP BY bk.customerid
        )
        SELECT c.personalid, c.firstname || ' ' || c.lastname AS customername, sqr.numofbooking, RANK() OVER (ORDER BY sqr.numofbooking DESC) ranking
        FROM subquery sqr
        JOIN customers c ON c.customerid = sqr.customerid
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

const getServiceRankingFull = () => {
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
        JOIN services s ON s.serviceid = sqr.serviceid;
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

const getCustomerRankingFull = () => {
  return new Promise((resolve, reject) => {
    const query = `
        WITH subquery AS (
          SELECT bk.customerid, count(bk.bookingid) AS numofbooking
          FROM booking bk
          WHERE bk.bookingdate BETWEEN current_date - INTERVAL '1 year' AND current_date
          GROUP BY bk.customerid
        )
        SELECT c.personalid, c.firstname || ' ' || c.lastname AS customername, sqr.numofbooking, RANK() OVER (ORDER BY sqr.numofbooking DESC) ranking
        FROM subquery sqr
        JOIN customers c ON c.customerid = sqr.customerid;
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

const getHotelStatistic = (period, date) => {
    return new Promise((resolve, reject) => {
      let query = '';
      switch (period) {
        case 'today':
          query = `
          SELECT 
          (SELECT count(b.bookingid) FROM booking b WHERE b.bookingdate = $1) AS bookings,
          (SELECT SUM(b.totaladult) + SUM(b.totalchild) AS total_customer FROM booking b WHERE b.bookingdate = $1) AS customers,
          (SELECT count(br.roomid) FROM booking_rooms br WHERE $1 BETWEEN br.checkin AND br.checkout) AS rooms
          `;
          break;
        case 'week':
          query = `
          SELECT 
          (SELECT COUNT(*) FROM booking WHERE bookingdate BETWEEN $1::date - INTERVAL '6 days' AND $1::date) AS bookings,
          (SELECT COUNT(DISTINCT customerid) FROM booking WHERE bookingdate BETWEEN $1::date - INTERVAL '6 days' AND $1::date) AS customers,
          (SELECT COUNT(DISTINCT roomid) FROM booking_rooms WHERE $1::date BETWEEN checkin AND checkout) AS rooms
          `;
          break;
        case 'month':
          query = `
          SELECT 
          (SELECT COUNT(*) FROM booking WHERE date_trunc('month', bookingdate) = date_trunc('month', $1::date)) AS bookings,
          (SELECT COUNT(DISTINCT customerid) FROM booking WHERE date_trunc('month', bookingdate) = date_trunc('month', $1::date)) AS customers,
          (SELECT COUNT(DISTINCT roomid) FROM booking_rooms WHERE $1::date BETWEEN checkin AND checkout) AS rooms
          `;
          break;
        case 'year':
          query = `
          SELECT 
          (SELECT COUNT(*) FROM booking WHERE date_trunc('year', bookingdate) = date_trunc('year', $1::date)) AS bookings,
          (SELECT COUNT(DISTINCT customerid) FROM booking WHERE date_trunc('year', bookingdate) = date_trunc('year', $1::date)) AS customers,
          (SELECT COUNT(DISTINCT roomid) FROM booking_rooms WHERE $1::date BETWEEN checkin AND checkout) AS rooms
          `;
          break;
        default:
          reject(new Error('Invalid period'));
          return;
      }
  
      db.query(query, [date], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.rows[0]);
        }
      });
    });
  };
  const getRevenueData = (period) => {
    return new Promise((resolve, reject) => {
      let query = '';
      switch (period) {
        case 'today':
          query = `
            SELECT p.paymentdate, SUM(p.totalamount) as totalamount
            FROM payment p
            WHERE p.paymentdate BETWEEN current_date - INTERVAL '1 day' AND current_date
            AND p.paymentstatus = 'paid'
            GROUP BY p.paymentdate
            ORDER BY p.paymentdate;
          `;
          break;
        case 'week':
          query = `
          WITH this_week AS (
            SELECT p.paymentdate AT TIME ZONE 'UTC' AT TIME ZONE 'UTC+7' as paymentdate, SUM(p.totalamount) as totalamount, 'this_week' as week_type
            FROM payment p
            WHERE p.paymentdate >= date_trunc('week', current_date) AND p.paymentdate < date_trunc('week', current_date) + INTERVAL '7 days'
            AND p.paymentstatus = 'paid'
            GROUP BY p.paymentdate
          ),
          last_week AS (
            SELECT p.paymentdate AT TIME ZONE 'UTC' AT TIME ZONE 'UTC+7' as paymentdate, SUM(p.totalamount) as totalamount, 'last_week' as week_type
            FROM payment p
            WHERE p.paymentdate >= date_trunc('week', current_date) - INTERVAL '7 days' AND p.paymentdate < date_trunc('week', current_date)
            AND p.paymentstatus = 'paid'
            GROUP BY p.paymentdate
          )
          SELECT * FROM this_week
          UNION ALL
          SELECT * FROM last_week
          ORDER BY paymentdate;
          `;
          break;
        case 'month':
          query = `
            SELECT p.paymentdate AT TIME ZONE 'UTC' AT TIME ZONE 'UTC+7' as paymentdate, SUM(p.totalamount) as totalamount
            FROM payment p
            WHERE p.paymentdate BETWEEN date_trunc('month', current_date) - INTERVAL '1 month' AND current_date
            AND p.paymentstatus = 'paid'
            GROUP BY p.paymentdate
            ORDER BY p.paymentdate;
          `;
          break;
        case 'year':
          query = `
            SELECT date_trunc('month', p.paymentdate AT TIME ZONE 'UTC' AT TIME ZONE 'UTC+7') as month, SUM(p.totalamount) as totalamount
            FROM payment p
            WHERE p.paymentdate BETWEEN current_date - INTERVAL '1 year' AND current_date
            AND p.paymentstatus = 'paid'
            GROUP BY month
            ORDER BY month;
          `;
          break;
        default:
          reject(new Error('Invalid period'));
          return;
      }
  
      db.query(query, (err, result) => {
        if (err) {
          console.error("Error executing query", err.stack);
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
  getServiceRanking,
  getCustomerRanking,
  getServiceRankingFull,
  getCustomerRankingFull,
  getHotelStatistic,
  getRevenueData
};

