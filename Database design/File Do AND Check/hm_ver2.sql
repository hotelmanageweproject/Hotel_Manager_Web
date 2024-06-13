CREATE TABLE booking(
	bookingID bigint not null,
	customerID bigint not null,
	bookingDate date not null,
	bookingType varchar not null,
	totalAdult int not null,
	totalChild int not null

);

CREATE SEQUENCE auto_increment_booking owned by booking.bookingid;

ALTER TABLE booking alter column bookingid set default nextval('auto_increment_booking');

SELECT setval('auto_increment_booking', COALESCE((SELECT MAX(bookingid) + 1 FROM booking), 1), false);

CREATE TABLE customers(
	customerID bigint not null,
	rankID int not null,
	personalID varchar UNIQUE not null,
	firstname varchar NOT NULL,
	lastname varchar NOT NULL,
	birthdate date,
	gender char,
	email varchar,
	phone varchar,
	address varchar

);

CREATE SEQUENCE auto_increment_customers owned by customers.customerid;

ALTER TABLE customers alter column customerid set default nextval('auto_increment_customers');

SELECT setval('auto_increment_customers', COALESCE((SELECT MAX(customerid) + 1 FROM customers), 1), false);

CREATE TABLE cust_hist(
	personalID varchar not null,
	bookingdate date not null,
	totalSpending bigint not null

);

CREATE TABLE payment(
	paymentID bigint not null,
	bookingID bigint UNIQUE,
	discount int ,
	totalAmount bigint , 
	additionalCharge bigint ,
	paymentMethod varchar,
	paymentDate date,
	paymentStatus varchar ,
	note text
);

CREATE SEQUENCE auto_increment_payment owned by payment.paymentid;

ALTER TABLE payment alter column paymentid set default nextval('auto_increment_payment');

SELECT setval('auto_increment_payment', COALESCE((SELECT MAX(paymentid) FROM payment), 1), false);

CREATE TABLE customer_ranking(
	rankID bigint not null,
	nameRank varchar not null,
	discount int not null,
	note text

);

CREATE TABLE booking_rooms(
	bkID bigint not null,
	bookingID bigint not null,
	roomID varchar not null,
	checkIn date not null,
	checkOut date not null,
	numOfAdult int not null,
	numOfChild int not null
);

CREATE SEQUENCE auto_increment_bkrooms owned by booking_rooms.bkid;

ALTER TABLE booking_rooms alter column bkid set default nextval('auto_increment_bkrooms');

SELECT setval('auto_increment_bkrooms', COALESCE((SELECT MAX(bkid) + 1 FROM booking_rooms), 1), false);

CREATE TABLE rooms(
	roomID varchar not null,
	roomType bigint not null,
	status varchar not null
);

CREATE TABLE roomType(
	roomTypeID bigint not null,
	name varchar not null,
	pricePerNight bigint not null,
	maxAdult int not null,
	maxChild int not null

);

CREATE TABLE room_service(
	receiptID bigint not null,
	bkID bigint,
	serviceID bigint not null,
	total bigint not null,
	date date not null,
	staffID bigint

);

CREATE SEQUENCE auto_increment_rservices owned by room_service.receiptid;

ALTER TABLE room_service alter column receiptid set default nextval('auto_increment_rservices');

SELECT setval('auto_increment_rservices', COALESCE((SELECT MAX(receiptid) + 1 FROM room_service), 1), false);


CREATE TABLE services(
	serviceID bigint not null,
	name varchar not null,
	departmentID varchar not null,
	note text

);

CREATE TABLE departments(
	departmentID varchar not null,
	name varchar not null,
	manager bigint,
	description text

);

CREATE TABLE staff(
	staffID bigint not null,
	departmentID varchar not null,
	personalID varchar not null unique,
	firstname varchar,
	lastname varchar,
	birthdate date,
	gender char,
	email varchar,
	phone varchar,
	address varchar,
	currentSal bigint not null,
	startDate date not null,
	endDate date

);

CREATE SEQUENCE auto_increment_staff owned by staff.staffid;

ALTER TABLE staff alter column staffid set default nextval('auto_increment_staff');

SELECT setval('auto_increment_staff', COALESCE((SELECT MAX(staffid) + 1 FROM staff), 1), false);

---KEYS
ALTER TABLE booking 
	ADD PRIMARY KEY (bookingID);
ALTER TABLE customers
	ADD PRIMARY KEY (customerID);
ALTER TABLE customer_ranking 
	ADD PRIMARY KEY (rankID);
ALTER TABLE payment 
	ADD PRIMARY KEY (paymentID);
ALTER TABLE booking_rooms 
	ADD PRIMARY KEY (bkID);
ALTER TABLE rooms
	ADD PRIMARY KEY (roomID);
ALTER TABLE roomtype
	ADD PRIMARY KEY (roomTypeID);
ALTER TABLE room_service
	ADD PRIMARY KEY (receiptID);
ALTER TABLE services
	ADD PRIMARY KEY (serviceID);
ALTER TABLE departments 
	ADD PRIMARY KEY (departmentID);
ALTER TABLE staff 
	ADD PRIMARY KEY (staffID);
	
---foreign key
ALTER TABLE booking
	ADD FOREIGN KEY (customerID) references customers(customerID) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE customers
	ADD FOREIGN KEY (rankID) references customer_ranking(rankID) ON DELETE RESTRICT ON UPDATE RESTRICT;
	
ALTER TABLE payment
	ADD FOREIGN KEY (bookingID) references booking(bookingID) ON DELETE SET NULL ON UPDATE RESTRICT;

ALTER TABLE booking_rooms
	ADD FOREIGN KEY (bookingID) references booking(bookingID) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE booking_rooms
	ADD FOREIGN KEY (roomID) references rooms(roomID) ON DELETE RESTRICT ON UPDATE RESTRICT;
	
ALTER TABLE rooms
	ADD FOREIGN KEY (roomType) references roomtype(roomTypeID) ON DELETE RESTRICT ON UPDATE RESTRICT;
--
ALTER TABLE cust_hist 
	ADD FOREIGN KEY (personalid) references customers (personalid) ON DELETE CASCADE ON UPDATE CASCADE;
--
ALTER TABLE room_service
	ADD FOREIGN KEY (bkID) references booking_rooms ON DELETE SET NULL ON UPDATE RESTRICT;

ALTER TABLE room_service
	ADD FOREIGN KEY (serviceID) references services ON DELETE RESTRICT ON UPDATE RESTRICT;
	
ALTER TABLE room_service
	ADD FOREIGN KEY (staffID) references staff ON DELETE SET NULL ON UPDATE RESTRICT;
	
ALTER TABLE services
	ADD FOREIGN KEY (departmentID) references departments ON DELETE SET DEFAULT ON UPDATE RESTRICT;

--Tắt 1 trong 2 FK sau để import data vào staff hoặc departments
ALTER TABLE departments
	ADD FOREIGN KEY (manager) references staff ON DELETE SET NULL ON UPDATE RESTRICT;

ALTER TABLE staff
	ADD FOREIGN KEY (departmentID) references departments ON DELETE RESTRICT ON UPDATE RESTRICT;

--	
--INDEX
CREATE INDEX ix_bookingid on booking using btree (bookingid);

CREATE INDEX ix_bookingdate on booking using btree (bookingDate);

CREATE INDEX ix_cid_bkdate on booking (bookingDate, customerid);

CREATE INDEX ix_cid on booking (customerid);

CREATE INDEX ix_bkType on booking (bookingType);

--
explain analyze 
	select * from booking
		order by bookingtype -- ko nen
		where customerid = 11;
--
CREATE INDEX ix_c_cid on customers (customerid);

CREATE INDEX ix_fullname on customers(lastname, firstname); --rat hieu qua

CREATE INDEX ix_rankid on customers(rankid);

CREATE INDEX ix_pid_bdate on customers(personalID, birthdate);

CREATE INDEX ix_phone on customers(phone);

--
explain analyze
select * from customers
	where personalid like '280339098649';
	
--

CREATE INDEX ix_ch_bkdate on cust_hist (bookingdate);

CREATE INDEX ix_ch_pid on cust_hist (personalID);

CREATE INDEX ix_ttspending on cust_hist (totalSpending);

--
CREATE INDEX ix_pm_bkID on payment (bookingid);

CREATE INDEX ix_pm_ttamount on payment (totalAmount);

CREATE INDEX ix_pm_pmid_date on payment (paymentID, paymentDate);

--

CREATE INDEX ix_br_bkid_rid on booking_rooms (bookingID, roomid);

CREATE INDEX ix_br_date on booking_rooms (checkIn, checkOut);

--
explain analyze
select * from booking
	order by bookingid
	limit 100
	
explain analyze	
select * from booking_rooms
	where bookingid IN (1,2,3,4);

explain analyze
select * from booking b
	join booking_rooms br
	on br.bookingid = b.bookingid
	order by br.bkid asc
	limit 1000
--
CREATE INDEX ix_rs_bkid on room_service (bkID, serviceid);

CREATE INDEX ix_rs_date on room_service (date);

CREATE INDEX ix_rs_sid on room_service (serviceid);
--không bao giờ dùng hash 

--
explain analyze
select rs.bkid from room_service rs
 where rs.serviceid =  2 and bkid = 2;
--

CREATE INDEX ix_sf_fullname on staff (firstname, lastname);

CREATE INDEX ix_sf_dept on staff (departmentid);

CREATE INDEX ix_sf_date on staff (startdate, enddate);

CREATE INDEX ix_sf_sal on staff (currentSal);

CREATE INDEX ix_sf_pid on staff (personalID);
--
explain analyze 
select * from staff
	where currentsal between 5000000 and 10000000;
--

--Check
ALTER TABLE booking
	add check (totalAdult >= 0 AND totalChild >= 0 AND (totaladult + totalchild > 0));








