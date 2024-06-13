--------------------------------------------------------------------------------------------------------
explain analyze
WITH subquery AS(
	SELECT bkid, bookingid, roomid, checkin, checkout
	FROM booking_rooms 
	WHERE roomid = '0101' AND current_date BETWEEN checkin and checkout
)
SELECT sq.bookingid, sq.roomid, s.serviceid, s.name AS servicename, rs.total, rs.date
FROM room_service rs
JOIN subquery sq ON sq.bkid = rs.bkid
JOIN services s ON s.serviceid = rs.serviceid
Where rs.date <= current_date;

select * from booking_rooms
where bkid = 8005
--------------------------------------------------------------------------------------------------------
	explain analyze
	SELECT rs.receiptid, rs.serviceid, s.name, rs.total, rs.date, rs.staffid
	FROM room_service rs
	JOIN services s ON s.serviceid = rs.serviceid
	WHERE rs.bkid IN (
		SELECT bkid FROM booking_rooms
		WHERE bookingid = 2000 AND roomid = '1912'
	);
explain analyze
	SELECT rs.receiptid, rs.serviceid, s.name, rs.total, rs.date, rs.staffid
	FROM room_service rs
	JOIN services s ON s.serviceid = rs.serviceid
	JOIN booking_rooms bk ON bk.bkid = rs.bkid AND bk.roomid = '1912' AND bk.bookingid = 2000
--------------------------------------------------------------------------------------------------------
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

--------------Hiển thị popup Rooms-------------- HUNG_TT

SELECT rs.receiptid ,bkrms.bookingid, bkrms.roomid, rs.serviceid, s.name AS servicename, rs.total, rs.date, rs.staffid
FROM booking_rooms bkrms
JOIN room_service rs ON rs.bkid = bkrms.bkid
JOIN services s ON s.serviceid = rs.serviceid
WHERE bkrms.roomid = '0101' AND current_date >= rs.date 
AND current_date BETWEEN bkrms.checkin AND bkrms.checkout;



-------Hiển thị popup Customers----------- NAM_TT
explain analyze
SELECT b.bookingid, cr.namerank, cr.discount, cr.note
FROM booking b
JOIN customers c ON c.customerid = b.customerid
JOIN customer_ranking cr ON cr.rankid = c.rankid
JOIN booking_rooms bkr ON bkr.bookingid = b.bookingid
WHERE c.customerid = 1 AND current_date BETWEEN bkr.checkin AND bkr.checkout;


