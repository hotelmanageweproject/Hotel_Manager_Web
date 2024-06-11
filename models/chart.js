import pool from '../config/db.js';

const getRevenueData = async (period) => {
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
        SELECT p.paymentdate, SUM(p.totalamount) as totalamount
        FROM payment p
        WHERE p.paymentdate BETWEEN current_date - INTERVAL '7 days' AND current_date
        AND p.paymentstatus = 'paid'
        GROUP BY p.paymentdate
        ORDER BY p.paymentdate;
      `;
      break;
    case 'month':
      query = `
        SELECT p.paymentdate, SUM(p.totalamount) as totalamount
        FROM payment p
        WHERE p.paymentdate BETWEEN date_trunc('month', current_date) - INTERVAL '1 month' AND current_date
        AND p.paymentstatus = 'paid'
        GROUP BY p.paymentdate
        ORDER BY p.paymentdate;
      `;
      break;
    case 'year':
      query = `
        SELECT date_trunc('month', p.paymentdate) as month, SUM(p.totalamount) as totalamount
        FROM payment p
        WHERE p.paymentdate BETWEEN current_date - INTERVAL '1 year' AND current_date
        AND p.paymentstatus = 'paid'
        GROUP BY month
        ORDER BY month;
      `;
      break;
    default:
      throw new Error('Invalid period');
  }

  const result = await pool.query(query);
  return result.rows;
};

export default {
  getRevenueData
};