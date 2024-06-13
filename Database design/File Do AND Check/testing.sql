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
