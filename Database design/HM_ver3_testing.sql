	explain analyze		--NAM
	SELECT rs.receiptid, rs.serviceid, s.name, rs.total, rs.date, rs.staffid
	FROM room_service rs
	JOIN services s ON s.serviceid = rs.serviceid
	WHERE rs.bkid IN (
		SELECT bkid FROM booking_rooms
		WHERE bookingid = 1 AND roomid = '0105'
	);
	
	explain analyze
		WITH subquery AS( -- QUANG
		SELECT customerid FROM booking b
		WHERE bookingid = 3
	)
	SELECT s.customerid,cr.discount
	FROM customers c
	JOIN subquery s on s.customerid = c.customerid
	JOIN customer_ranking cr ON cr.rankid = c.rankid;
	
	select * from customers
	where customerid = 884
	

explain analyze
WITH subquery AS(	--Đưa ra hóa đơn ĐÃ sử dụng dịch vụ của 1 phòng 
	SELECT bkid, bookingid, roomid, checkin, checkout
	FROM booking_rooms 
	WHERE roomid = '0101' AND current_date BETWEEN checkin and checkout
)
SELECT sq.bookingid, sq.roomid, s.serviceid, s.name AS servicename, rs.total, rs.date
FROM room_service rs
JOIN subquery sq ON sq.bkid = rs.bkid
JOIN services s ON s.serviceid = rs.serviceid
Where rs.date <= current_date;

select new_customer(3, '20225749', 'Nguyen', 'Nam', '2004-02-21', 'M', 'namnk@gmail.com', '113', 'Hanoi')
select new_booking(1000, current_date, 'Đặt tại chỗ', 1, 0)
select new_bkrooms(2001, '0102', current_date, '2024-06-18', 1,0);
select new_rmservice(2001, '0101', 1, 100000, '2024-06-12', 12);


----------QUANG_TT-------------
explain analyze
SELECT count(bkid)
FROM booking_rooms
where bookingid = 100

select * from booking_rooms
where bookingid = 100
