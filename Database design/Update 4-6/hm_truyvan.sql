---CUSTOMERS---
--Add customer---
CREATE or replace FUNCTION new_customer(rankid_in varchar, personalid_in varchar, firstname_in varchar, lastname_in varchar, birthdate_in varchar, gender_in char, email_in varchar, phone_in varchar, address_in varchar, OUT custadded_out BIGINT)
	RETURNS bigint 
	AS $$
	DECLARE find int;
	BEGIN
		SELECT count(*) INTO find
		FROM customers WHERE personalid = personalid_in;
		IF find = 0 THEN
		INSERT INTO 
			customers(rankid, 
					 personalid,
					 firstname,
					 lastname,
					 birthdate,
					 gender,
					 email,
					 phone,
					 address)
		VALUES (rankid_in::bigint,
			   personalid_in,
			   firstname_in,
			   lastname_in,
			   birthdate_in::date,
			   gender_in,
			   email_in,
			   phone_in,
			   address_in);
		SELECT currval(pg_get_serial_sequence('customers', 'customerid')) INTO custadded_out;
		
		ELSE
		custadded_out = 0;
		END IF;
	END
	$$
	LANGUAGE plpgsql;	
---
--TESTING--
select new_customer('3', '202259', 'Khanh Nam', 'Nguyen', '2004-02-21', 'M',null, '113', 'Hanoi')

select * from customers
	where customerid >= 500000
---

--Delete customer---
CREATE FUNCTION delete_customer(s_customerid bigint, s_personalid varchar, OUT res_del bigint)
	RETURNS bigint
	AS $$
	DECLARE row_returns int;
	BEGIN
		SELECT count(*) INTO row_returns
		FROM customers WHERE customerid = s_customerid OR personalid = s_personalid;
		IF row_returns = 1 THEN
			res_del = s_customerid;
			DELETE FROM customers
			WHERE customerid = s_customerid OR personalid = s_personalid;
			
		ELSE 
			res_del = 0;
		
		END IF;
		END
		$$
	LANGUAGE plpgsql;

---

--TESTING---
select delete_customer(500013, '20225749')
----
-------------Add staff---------------------------
CREATE or replace FUNCTION new_staff(departmentid_in varchar, personalid_in varchar, firstname_in varchar, lastname_in varchar, birthdate_in date, gender_in char, email_in varchar, phone_in varchar, address_in varchar, currentsal_in bigint, startdate_in date, enddate_in date,OUT staffid_out BIGINT)
	RETURNS bigint 
	AS $$
	DECLARE find int;
	BEGIN
		SELECT count(*) INTO find
		FROM staff WHERE personalid = personalid_in;
		IF find = 0 THEN
		INSERT INTO 
			staff(departmentid, 
					 personalid,
					 firstname,
					 lastname,
					 birthdate,
					 gender,
					 email,
					 phone,
					 address,
				 	currentsal,
				 	startdate,
					 enddate)
		VALUES (departmentid_in,
			   personalid_in,
			   firstname_in,
			   lastname_in,
			   birthdate_in,
			   gender_in,
			   email_in,
			   phone_in,
			   address_in,
			   currentsal_in,
			   startdate_in,
			   enddate_in);
		SELECT currval(pg_get_serial_sequence('staff', 'staffid')) INTO staffid_out;
		
		ELSE
		staffid_out = 0;
		END IF;
	END
	$$
	LANGUAGE plpgsql;	
---
--TESTING--

select new_staff('SPA','20225749', 'Nam', 'Nguyen', '2004-02-21','M' , null, null, null, 100000000, current_date, null  );

select * from staff
where staffid = 102;
---

--Delete staff---
CREATE OR REPLACE FUNCTION delete_staff(s_staffid bigint, s_personalid varchar, OUT res_del bigint)
	RETURNS bigint
	AS $$
	DECLARE row_returns bigint;
	BEGIN
		SELECT staffid INTO row_returns
		FROM staff WHERE staffid = s_staffid OR personalid = s_personalid;
		IF row_returns > 0 THEN
			res_del = row_returns;
		
			DELETE FROM staff
			WHERE staffid = s_staffid OR personalid = s_personalid;
			
		ELSE 
			res_del = 0;
		
		END IF;
		END
		$$
	LANGUAGE plpgsql;

---------------------------------
----------TESTING-----------------
select delete_staff(null, '20225749');


-----------------------------------------
--Search customerID with pid or (name and phone)--
	CREATE FUNCTION search_customer(s_personalid varchar, s_fname varchar, s_lname varchar, s_phone varchar, OUT found_out bigint)
		RETURNS bigint 
		AS $$
		DECLARE row_returns int;
		BEGIN
			IF (s_fname IS NULL) AND (s_lname IS NULL) AND (s_phone IS NULL) AND (s_personalid IS NOT NULL) THEN
			
				SELECT count(*) INTO row_returns
				FROM customers WHERE personalid = s_personalid;
				
				IF row_returns = 1 THEN
				
				SELECT customerid INTO found_out
				FROM customers WHERE personalid = s_personalid;
				
				ELSE
				
				found_out = 0;
				
				END IF;
				
				
			ELSIF (s_fname IS NOT NULL) AND (s_lname IS NOT NULL) AND (s_phone IS NOT NULL) AND (s_personalid IS NULL) THEN
			
				SELECT count(*) INTO row_returns
				FROM customers 
				WHERE firstname = s_fname AND lastname = s_lname AND phone = s_phone;
				
				IF row_returns = 1 THEN
				
				SELECT customerid INTO found_out
				FROM customers 
				WHERE firstname = s_fname AND lastname = s_lname AND phone = s_phone;
				
				ELSE
				
				found_out = 0;
				
				END IF;
			ELSE
				--Khong thoa man tat ca
				found_out = 0;
				
			END IF;
		
		END
		$$
	LANGUAGE plpgsql;
	
------------------------
----------NOTE---------
--
--Phone nên để unique và mỗi khách có 1 sđt riêng 
--mới có thể sử dụng function search_customer trong TH không có personalID
--
------------------------

---TESTING---------------

select * from customers
	where customerid >= 500000

select count(customerid) as cnt from customers
	group by personalid
	having count(customerid) > 0;

--here--
explain analyze
select search_customer('202215', null,null,null);

---!!! INDEX KHONG SU DUNG TRONG FUNCTIONNN 
explain analyze
select customerid from customers
where personalid = '202215';


---

--Search customer by customerID OR with PersonalID from above function
CREATE FUNCTION show_customer(pid_in varchar)
	RETURNS TABLE(	
	customerIDf bigint,
	rankIDf int,
	personalIDf varchar ,
	firstnamef varchar ,
	lastnamef varchar ,
	birthdatef date,
	genderf char,
	emailf varchar,
	phonef varchar,
	addressf varchar)
	AS
	$$
	DECLARE cid bigint;
	BEGIN
		cid = search_customer(pid_in, null, null, null);
		RETURN QUERY 
		SELECT * FROM customers
		WHERE customerid = cid;
	
	END
	$$
	LANGUAGE plpgsql;

---------
-----TESTING--------
explain analyze --FASTEST
SELECT * FROM customers
	WHERE customerid = 500017;

--TH này rất lâu lâu hơn nhiều so với TH trên
explain analyze
SELECT * FROM customers
	WHERE customerid = search_customer('202215', null,null,null);
	
--dùng như sau nhanh hơn
explain analyze
select * from show_customer('202216');

-------------------

------Edit customer--------

--dùng UPDATE cho từng thuộc tính cần chỉnh sửa

-----------------------

-----BOOKING------

------ADD BOOKING-------
	CREATE FUNCTION new_booking(customerid_in bigint, bookingdate_in date, bookingtype_in varchar, totaladult_in int, totalchild_in int, OUT add_bk bigint)
		RETURNS bigint
		AS
		$$
		DECLARE	check_cust int;
		BEGIN
		
			SELECT count(*) INTO check_cust
			FROM customers WHERE customerid = customerid_in;
			
			IF check_cust = 1 THEN
			
			INSERT INTO booking(
						customerid,
						bookingdate,
						bookingtype,
						totaladult,
						totalchild)
			VALUES (customerid_in,
				   	bookingdate_in,
				    bookingtype_in,
					totaladult_in,
					totalchild_in);
					
				SELECT currval(pg_get_serial_sequence('booking', 'bookingid')) INTO add_bk;
				
				--Tính số đơn đã đặt từ trước giờ của khách đó nếu chưa đặt đơn nào 0 thì phải tạo mới CUSTOMER
				--SELECT COUNT(bookingid) INTO count_bk
				--FROM booking 
				--GROUP BY customerid
				--HAVING customerid = customerid_in;
				
				--numberofbooking = count_bk;
				
			ELSE
				add_bk = 0;
				
			END IF;
		END
		$$
		LANGUAGE plpgsql;


-----TESTING--------

select * from booking
	where bookingid > 700000;
	
select * from customers
	where customerid >= 500000;

explain analyze
INSERT INTO booking(customerid, bookingdate, bookingtype, totaladult, totalchild)
VALUES (500016, current_date, 'pre ordered', 2,2);

explain analyze
SELECT new_booking(500016, current_date,'đặt tại chỗ',10,0);

--------------------

----Delete booking-----
	CREATE FUNCTION delete_booking(bookingid_in bigint, OUT res_del bigint)
	RETURNS bigint
	AS
	$$
	DECLARE row_return int;
	BEGIN
		SELECT COUNT(*) INTO row_return
		FROM booking WHERE bookingid = bookingid_in;
		
		IF row_return = 1 THEN 
		DELETE FROM booking WHERE bookingid = bookingid_in;
		
		res_del = bookingid_in;
		
		ELSE 
			
		res_del = 0;
		
		END IF;
	
	END
	$$
	LANGUAGE plpgsql;

------------TESTING-----------
select * from booking
	where bookingid > 700000;
	
SELECT delete_booking(700015);

------------

-----Search for booking by customerid + bookingdate
	CREATE FUNCTION search_booking(customerid_in bigint, bookingdate_in date)
	RETURNS TABLE(
				bookingid_s bigint)
	AS
	$$
	
	BEGIN
		IF EXISTS(SELECT customerid FROM customers WHERE customerid = customerid_in) AND bookingdate_in IS NOT NULL THEN
		
			RETURN QUERY SELECT bookingid FROM booking
			WHERE customerid = customerid_in AND bookingdate = bookingdate_in;
			
		ELSIF NOT EXISTS(SELECT customerid FROM customers WHERE customerid = customerid_in) THEN
		
			RETURN QUERY SELECT 0::bigint AS not_found;
		
		ELSE 
		
			RETURN QUERY SELECT 0::bigint AS not_found;
			
		END IF;
	
	END
	$$
	LANGUAGE plpgsql;

-----TESTING------
select * from booking
	where bookingid > 700000;
select * from customers
	where customerid > 500000;
	
explain analyze
SELECT * FROM search_booking(500003, '2024-05-26');

--FUNCTION KHONG SU DUNG INDEX
explain analyze
select * from booking
where customerid = 500003 and bookingdate = '2024-05-26';
	
--COUNT SỐ BOOKING-----
explain analyze
SELECT count(*) FROM search_booking(500003, current_date);

-------------------

-----Add new booking_rooms------

CREATE OR REPLACE FUNCTION new_bkrooms (bookingid_in bigint, roomid_in varchar, checkin_in date, checkout_in date, numofadult_in int, numofchild_in int)
RETURNS record
AS
$$
DECLARE add_bkid bigint;
DECLARE add_rid varchar;
DECLARE add_bookingid bigint;
	BEGIN
	--KIỂM TRA BOOKINGID ĐÓ ĐÃ TỒN TẠI PHÒNG ADD VÀO CHƯA. MỖI BOOKINGID CHỈ ĐẶT 1 PHÒNG 1 LẦN
		IF NOT EXISTS(SELECT bkid FROM booking_rooms WHERE bookingid = bookingid_in AND roomid = roomid_in) THEN
		INSERT INTO booking_rooms(
								bookingid,
								roomid,
								checkin,
								checkout,
								numofadult,
								numofchild)
		VALUES(bookingid_in,
			  roomid_in,
			  checkin_in,
			  checkout_in,
			  numofadult_in,
			  numofchild_in);
			  
		
		SELECT currval(pg_get_serial_sequence('booking_rooms', 'bkid')) INTO add_bkid;
		add_rid = roomid_in;
		add_bookingid = bookingid_in;
		
		END IF;
		
		return (add_bkid, add_bookingid, add_rid);
		
	END
$$
	LANGUAGE plpgsql;
	
	
----------------------
select * from booking
	where bookingid > 700000;
select * from customers
	where customerid > 500000;

select * from booking_rooms
	where bookingid >= 700000;

--CÁCH SỬ DỤNG HÀM
select * from new_bkrooms(700022, '0107', current_date, '2024-06-05', 2, 0) AS (bkid bigint, bookingid bigint ,roomid varchar);

------------------
------Delete booking_rooms-----------
CREATE OR REPLACE FUNCTION delete_bkrooms(bookingid_in bigint, roomid_in varchar)
RETURNS record
AS
$$
DECLARE del_bookingid bigint;
DECLARE del_roomid varchar;
DECLARE res_del bigint;
BEGIN
		SELECT bkid INTO res_del
		FROM booking_rooms
		WHERE bookingid = bookingid_in AND roomid = roomid_in;
		
		IF (res_del IS NOT NULL) THEN
		DELETE FROM booking_rooms 
		WHERE bkid = res_del;
		
		del_bookingid = bookingid_in;
		del_roomid = roomid_in;
		
		END IF;
		
		RETURN (res_del, del_bookingid, del_roomid);
		
	
END
$$
	LANGUAGE plpgsql;
------------------
----TESTING-------
select * from booking_rooms
	where bookingid >= 700000;

--CÁCH SỬ DỤNG
explain analyze
SELECT * FROM delete_bkrooms(700022, '0103') AS (bkid bigint, bookingid bigint, roomid varchar);

-----------------
-------Search bkrooms by bookingid-------
CREATE FUNCTION search_bkrooms (bookingid_in bigint)
RETURNS TABLE(
			s_bkid bigint,
			s_roomid varchar,
			s_checkin date,
			s_checkout date,
			s_numofadult int,
			s_numofchild int)
AS
$$
BEGIN
		RETURN QUERY SELECT bkid, roomid, checkin, checkout, numofadult, numofchild
		FROM booking_rooms
		WHERE bookingid = bookingid_in;
		
END
$$
	LANGUAGE plpgsql;

----------------------
------TESTING----------
select * from booking_rooms
	where bookingid >= 700000;

explain analyze 
SELECT * FROM search_bkrooms(700000);


--Sử dụng truy vấn thuần ko dùng function nhanh hơn !!!!!!
explain analyze
SELECT bkid, roomid, checkin, checkout, numofadult, numofchild
		FROM booking_rooms
		WHERE bookingid = 700022;

-------------------------

-----------ROOM_SERVICE------------
--------ADD ROOM USING SERVICE-------
CREATE or REPLACE FUNCTION new_rmservice(bookingid_in bigint, roomid_in varchar, serviceid_in bigint, total_in bigint, date_in date, staffid_in bigint)
RETURNS record
AS
$$
DECLARE bkid_to_add bigint;
DECLARE add_receiptid bigint;
DECLARE add_bookingid bigint;
DECLARE add_roomid varchar;
DECLARE add_serviceid bigint;
DECLARE add_servicename varchar;

BEGIN
		SELECT bkid INTO bkid_to_add 
		FROM booking_rooms 
		WHERE bookingid = bookingid_in AND roomid = roomid_in;
		IF bkid_to_add is not NULL THEN
		INSERT INTO room_service (bkid, 
								 serviceid,
								 total,
								 date,
								 staffid)
		VALUES (bkid_to_add,
			   serviceid_in,
			   total_in,
			   date_in,
			   staffid_in);
			  --Trong TH nhảy ra lỗi INSERT thì chỉ có thể lỗi ở staffid và serviceid do vi phạm FK
			  
			SELECT currval(pg_get_serial_sequence('room_service', 'receiptid')) INTO add_receiptid;
			add_bookingid = bookingid_in;
			add_roomid = roomid_in;
			add_serviceid = serviceid_in;
			SELECT ser.name INTO add_servicename
			FROM services ser
			WHERE serviceid = serviceid_in;
			
			END IF;
			
			RETURN (add_receiptid, add_bookingid, add_roomid, add_serviceid, add_servicename);


END
$$

	LANGUAGE plpgsql;
---------------------------------
------------TESTING------------------
select * from staff
where departmentid = 'SPA';


select * from services;
select * from room_service 
where receiptid >= 6039806;

select * from booking_rooms
	where bookingid >= 700000;


select * from booking_rooms
where bkid = 4027506;


--CÁCH SỬ DỤNG
select * from new_rmservice(700022, '0107', 4, 100000, current_date, 84) 
AS (receiptid bigint, bookingid bigint, roomid varchar, serviceid bigint, servicename varchar);

--------------------------
----------------DELETE ROOM SERVICE-------
CREATE OR REPLACE FUNCTION delete_rmservice (receiptid_in bigint)
RETURNS record
AS
$$
DECLARE del_receiptid bigint;
DECLARE del_bkid bigint;
DECLARE del_serviceid bigint;
DECLARE del_total bigint;
DECLARE del_date date;
DECLARE del_staffid bigint;


BEGIN
	IF EXISTS(SELECT receiptid FROM room_service WHERE receiptid = receiptid_in) THEN
		
	SELECT * INTO del_receiptid, del_bkid, del_serviceid, del_total, del_date, del_staffid
	FROM room_service
	WHERE receiptid = receiptid_in;
	
	DELETE FROM room_service
	WHERE receiptid = receiptid_in;
	
	END IF;
	
	RETURN (del_receiptid, del_bkid, del_serviceid, del_total, del_date, del_staffid);
	
	
END
$$
	LANGUAGE plpgsql;

----------------------------
-------------TESTING-------------
select * from services;
select * from room_service 
where receiptid >= 6039806;

--CÁCH SỬ DỤNG
SELECT * FROM delete_rmservice(6039817) 
AS (receiptid_del bigint, bkid_del bigint, serviceid_del bigint, total_del bigint, date_del date, staffid_del bigint);

--------------------------------
---------SEARCH FOR RECEIPTS BY bookingid + rooms = bkid----------
CREATE FUNCTION search_rmsservice(bookingid_in bigint, roomid_in varchar)
RETURNS TABLE (
				receiptid_out bigint,
				serviceid_out bigint,
				servicename_out varchar,
				total_out bigint,
				date_out date,
				staffid_out bigint)
AS
$$
BEGIN

	RETURN QUERY
	SELECT rs.receiptid, rs.serviceid, s.name, rs.total, rs.date, rs.staffid
	FROM room_service rs
	JOIN services s ON s.serviceid = rs.serviceid
	WHERE rs.bkid IN (
		SELECT bkid FROM booking_rooms
		WHERE bookingid = bookingid_in AND roomid = roomid_in
	);
	

END
$$
	LANGUAGE plpgsql;


----------------------------------------
------------------TRUY VẤN THUẦN------------------------
	SELECT rs.receiptid, rs.serviceid, s.name, rs.total, rs.date, rs.staffid
	FROM room_service rs
	JOIN services s ON s.serviceid = rs.serviceid
	WHERE rs.bkid IN (
		SELECT bkid FROM booking_rooms
		WHERE bookingid = 700022 AND roomid = '0107'
	);

--------------TESTING---------------
select * from room_service 
where receiptid >= 6039806;

select * from booking_rooms
	where bookingid >= 700000;

select * from services;
select * from room_service 
where receiptid >= 6039806;

---CÁCH SỬ DỤNG HÀM
SELECT * FROM search_rmsservice (700022, '0107');


------------------------------------------------------------------

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





