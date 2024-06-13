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

----

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

--------------TESTING---------------


------------------------------------------------------------------








