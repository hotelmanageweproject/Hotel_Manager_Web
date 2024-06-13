SELECT * FROM cust_hist;


select b.bookingid from booking b
JOIN customers c ON c.customerid = b.customerid
where bookingdate = '2024-06-01' AND c.personalid = '202259'

SELECT * FROM payment
WHERE bookingid = 700027

--RA BKID
SELECT * FROM booking_rooms
WHERE bookingid IN (
select b.bookingid from booking b
JOIN customers c ON c.customerid = b.customerid
where bookingdate = '2024-06-01' AND c.personalid = '202259'
);

--
SELECT * FROM room_service
WHERE bkid = 4027523

--

--CUST_HIST GIÚP TRUY VẤN ổn định hơn dù không nhanh hơn mấy cho với ko có cust_hist NHƯNG thời gian execute ổn định hơn
explain analyze
select * from cust_hist
WHERE personalid = '202259'
AND paymentdate = '2024-06-01'

explain analyze
WITH subservice_cal AS(
	SELECT SUM(rs.total) AS total_service
		FROM room_service rs
		WHERE rs.bkid IN (
			SELECT bkid FROM booking_rooms
			WHERE bookingid = 700027
		)
	)
	SELECT p.totalamount + sc.total_service AS total_paid
	FROM payment p, subservice_cal sc
	WHERE p.bookingid = 700027;

