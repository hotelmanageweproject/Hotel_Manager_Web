----TRUY VẤN TÌM KIẾM QUẢN LÝ CỦA 1 DỊCH VỤ (THÔNG QUA BAN PHÒNG LÀM DỊCH VỤ ĐÓ)----------

explain analyze
SELECT s.serviceid, s.name AS service_name, d.manager AS managerid, st.firstname||st.lastname AS manager_name
FROM services s
JOIN departments d ON d.departmentid = s.departmentid
JOIN staff st ON st.staffid = d.manager
WHERE s.serviceid = 1


---------------------------------------------------------------
------TRUY VẤN TÌM PHÒNG BAN 1 NHÂN VIÊN LÀM VIỆC------------

SELECT s.staffid, d.departmentid, d.name AS department_name, d.manager, d.description
FROM departments d, staff s
WHERE s.departmentid = d.departmentid AND s.staffid = 4


-------------------------------------------------------------------

-----TRUY VẤN TÌM HÓA ĐƠN PAYMENT CỦA 1 BOOKING--------------

SELECT *
FROM payment
WHERE bookingid = 1;

-------------------------------------------------------------------

----------------------Hiển thị Customers---------------------

SELECT c.*, cr.namerank 
FROM customers c, customer_ranking cr
WHERE c.rankid = cr.rankid
limit 10

----- Hiển thị Rooms---------------------

SELECT r.roomid, 
	r.status, 
	rt.name AS roomtype, 
	rt.pricepernight, 
	rt.maxadult, 
	rt.maxchild, 
	search_status_room(r.roomid, current_date) AS roomstate
FROM rooms r, roomtype rt
WHERE r.roomtype = rt.roomtypeid
limit 10 offset 0;

--------Hiển thị Bookings --------------
explain analyze
SELECT b.bookingid, 
	b.customerid, 
	b.bookingdate, 
	b.bookingtype, 
	b.totaladult,
	b.totalchild,
	bkr.roomid,
	bkr.checkin,
	bkr.checkout,
	bkr.numofadult,
	bkr.numofchild
FROM booking b, booking_rooms bkr
WHERE b.bookingid = bkr.bookingid
order by b.bookingid ASC
limit 10;


-- Count phòng của đơn
explain analyze
SELECT count(bkr.bkid)
FROM booking b, booking_rooms bkr

WHERE b.bookingid = bkr.bookingid
AND b.bookingid = 1

group by b.bookingid;

--------Hiển thị Services----------

SELECT s.serviceid, s.name AS servicename, s.note, s.departmentid, dpt.name AS departmentname, dpt.manager, dpt.description
FROM services s, departments dpt
WHERE s.departmentid = dpt.departmentid
order by s.serviceid asc;


----------Hiển thị Staff-----------

SELECT st.staffid, dpt.name AS departmentname, st.personalid, st.firstname, st.lastname, st.birthdate, st.gender, st.email, st.phone, st.address, st.currentsal, st.startdate, st.enddate
FROM staff st, departments dpt
WHERE st.departmentid = dpt.departmentid
ORDER BY st.staffid ASC
limit 10;


-------Hiển thị popup Customers-----------

SELECT b.bookingid, cr.namerank, cr.discount, cr.note
FROM booking b
JOIN customers c ON c.customerid = b.customerid
JOIN customer_ranking cr ON cr.rankid = c.rankid
JOIN booking_rooms bkr ON bkr.bookingid = b.bookingid
WHERE c.customerid = 1000 AND current_date BETWEEN bkr.checkin AND bkr.checkout;


----------Hiển thị popup Booking---------

SELECT paymentid, bookingid, discount, totalamount, additionalcharge, paymentmethod, paymentdate, paymentstatus, note 
from payment
where bookingid = 700026;

--------------Hiển thị popup Rooms--------------

SELECT rs.receiptid ,bkrms.bookingid, bkrms.roomid, rs.serviceid, s.name AS servicename, rs.total, rs.date, rs.staffid
FROM booking_rooms bkrms
JOIN room_service rs ON rs.bkid = bkrms.bkid
JOIN services s ON s.serviceid = rs.serviceid
WHERE bkrms.roomid = '0101' AND current_date >= rs.date 
AND current_date BETWEEN bkrms.checkin AND bkrms.checkout;

-----------Hiển thị popup Services--------------

SELECT sv.serviceid ,s.staffid AS managerid, s.departmentid, s.personalid, s.firstname, s.lastname, s.birthdate, s.gender, s.email, s.phone, s.address, s.currentsal, s.startdate, s.enddate
FROM staff s
JOIN departments dpt ON dpt.manager = s.staffid
JOIN services sv ON sv.departmentid = dpt.departmentid
WHERE sv.serviceid = 3;

-------Hiển thị popup Employees----------------

SELECT s.staffid ,dpt.*
FROM staff s, departments dpt
WHERE s.departmentid = dpt.departmentid AND s.staffid = 3;

---------------------------------------------------------------------

-----------Tính số lượng bookingid trong 1 ngày cụ thể tháng năm------------
----Đã xóa index ở bookingdate chạy dùng sang index_cid_bkdate
----Không có index thời gian tăng đáng kể
--Theo ngày cụ thể
explain analyze
SELECT count(b.bookingid)
FROM booking b
WHERE b.bookingdate = current_date;

--Theo năm Cách 1
explain analyze
SELECT count(b.bookingid)
FROM booking b
WHERE extract(YEAR FROM b.bookingdate) = 2024

CREATE INDEX ix_bkdate_year ON booking (extract(year from bookingdate));

--Theo năm Cách 2 nhanh hơn Cách 1 tận dụng được index trên bookingdate
explain analyze
SELECT count(b.bookingid)
FROM booking b
WHERE  b.bookingdate BETWEEN '2024-01-01' AND '2024-12-31';

--Theo tháng 
explain analyze
SELECT count(b.bookingid)
FROM booking b
WHERE  b.bookingdate BETWEEN '2024-01-01' AND '2024-12-31' 
	AND extract(month from b.bookingdate) = 1;

CREATE INDEX ix_bkdate_month ON booking (extract(month from bookingdate));

--------Tính số lượng khách trong 1 ngày cụ thể tháng năm------------
---Theo ngày cụ thể
explain analyze
SELECT SUM(b.totaladult) + SUM(b.totalchild) AS total_customer
FROM booking b
WHERE b.bookingdate = current_date;

---Theo năm 
explain analyze
SELECT SUM(b.totaladult) + SUM(b.totalchild) AS total_customer
FROM booking b
WHERE extract(YEAR FROM b.bookingdate) = 2024;

CREATE INDEX ix_bkdate_year ON booking (extract(year from bookingdate));

--Theo tháng
explain analyze
SELECT SUM(b.totaladult) + SUM(b.totalchild) AS total_customer
FROM booking b
WHERE  b.bookingdate BETWEEN '2024-01-01' AND '2024-12-31' 
	AND extract(month from b.bookingdate) = 3;

CREATE INDEX ix_bkdate_month ON booking (extract(month from bookingdate));

------Tính số lượng Room được đặt trong 1 ngày cụ thể----------

SELECT count(br.roomid)
FROM booking_rooms br
WHERE current_date BETWEEN br.checkin AND br.checkout;

-------------------------Doanh thu lấy từ PAYMENT--------------------------
WITH subquery AS(
	SELECT SUM(p.totalamount) AS total_paid, p.paymentdate
	FROM payment p
	WHERE p.paymentdate = '2024-06-01' AND p.paymentstatus = 'paid'
	group by p.paymentdate
)
SELECT s.total_paid + SUM(rs.total) AS tong_tien
FROM room_service rs, subquery s
WHERE rs.date = current_date
group by rs.date

select * from payment
order by paymentid;

select * from booking_rooms 
where bookingid = 700027

select * from room_service
where bkid = 4027523


	SELECT SUM(rs.total) 
	FROM room_service rs
	WHERE bkid IN (
		SELECT bkid FROM booking_rooms
			WHERE bookingid = 700000
	);	

UPDATE payment
SET totalamount = 300, additionalcharge = 100,paymentstatus = 'paid', paymentmethod = 'Card', paymentdate = '2024-07-01', note = 'note vớ va vớ vẩn'
WHERE bookingid = 700028

select * from cust_hist

SELECT * FROM search_rmsservice (700000, null)

--Doanh thu của ngày hiện tại và ngày hiện tại - 1
SELECT p.paymentdate, p.totalamount FROM payment p
WHERE paymentdate BETWEEN current_date - INTERVAL '1 day' AND current_date
AND paymentstatus = 'paid'
ORDER BY p.paymentdate;

--Doanh thu của 1 tuần lùi từ ngày hiện tại
SELECT p.paymentdate, p.totalamount FROM payment p
WHERE paymentdate BETWEEN current_date - INTERVAL '7 days' AND current_date
AND paymentstatus = 'paid'
ORDER BY p.paymentdate;

--Doanh thu của 1 tháng lùi từ ngày hiện tại. Có thể thay ['2024-07-01'::date] = current_date
SELECT p.paymentdate, p.totalamount FROM payment p
WHERE paymentdate BETWEEN '2024-07-01'::date - INTERVAL '1 month' AND '2024-07-01'::date
AND paymentstatus = 'paid'
ORDER BY p.paymentdate;

--Doanh thu của 1 tháng cụ thể trong 1 năm cụ thể
SELECT p.paymentdate, p.totalamount FROM payment p
WHERE extract (month from p.paymentdate) = 6 AND extract (year from p.paymentdate) = 2025
AND paymentstatus = 'paid'
ORDER BY p.paymentdate;

--Doanh thu từ năm trước tới năm hiện tại
SELECT p.paymentdate, p.totalamount FROM payment p
WHERE p.paymentdate BETWEEN current_date - INTERVAL '1 year' AND current_date
AND paymentstatus = 'paid'
ORDER BY p.paymentdate;

--Doanh thu từ một ngày cụ thể đến một ngày cụ thể
SELECT p.paymentdate, p.totalamount FROM payment p
WHERE p.paymentdate BETWEEN '2024-01-01' AND '2024-12-31'
AND paymentstatus = 'paid'
ORDER BY p.paymentdate;



---------RANKING-----------
-----RANKING dịch vụ theo số receipt sử dụng trong khoảng thời gian 1 năm đổ lại từ ngày hiện tại-----------
----Không thể tạo updatable view nên thiết kế hãy sử dụng 1 nút bấm để bấm vào là chạy lại QUERY này----
explain analyze
WITH subquery AS(
	SELECT rs.serviceid, count(rs.receiptid) AS numofreceipt
	FROM room_service rs
	WHERE rs.date BETWEEN current_date - INTERVAL '1 year' AND current_date
	GROUP BY rs.serviceid
)
SELECT s.name AS servicename, sqr.numofreceipt , RANK () OVER ( ORDER BY sqr.numofreceipt DESC ) ranking
FROM subquery sqr
JOIN services s ON s.serviceid = sqr.serviceid
limit 5;


------RANKING Khách hàng---------
----RANK OVER ở đây vẫn còn vấn đề nhưng vẫn đúng theo top 5
WITH subquery AS(
	SELECT bk.customerid, count(bk.bookingid) AS numofbooking
	FROM booking bk
	WHERE bk.bookingdate BETWEEN current_date - INTERVAL '1 year' AND current_date
	GROUP BY bk.customerid
)
SELECT c.personalid ,c.firstname ||' '|| c.lastname AS customername, sqr.numofbooking , RANK () OVER ( ORDER BY sqr.numofbooking DESC ) ranking
FROM subquery sqr
JOIN customers c ON c.customerid = sqr.customerid
limit 5;







