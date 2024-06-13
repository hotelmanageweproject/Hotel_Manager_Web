-------Truy vấn kiếm tra phòng hôm nay đã có sử dụng dịch vụ gì thuộc đơn đặt nào-------
--C1:
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

--C2:
explain analyze
SELECT bkrms.bookingid, bkrms.roomid, rs.serviceid, s.name AS servicename, rs.total, rs.date
FROM booking_rooms bkrms
JOIN room_service rs ON rs.bkid = bkrms.bkid
JOIN services s ON s.serviceid = rs.serviceid
WHERE bkrms.roomid = '0101' AND current_date >= rs.date 
AND current_date BETWEEN bkrms.checkin AND bkrms.checkout;

---------------------------------------------------------------------------------------------
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