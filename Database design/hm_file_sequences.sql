--File này chỉ chạy SAU KHI add data vào các bảng NẾU muốn chạy trước thì phải không ADD các cột ID khóa chính

CREATE SEQUENCE auto_increment_booking owned by booking.bookingid;

ALTER TABLE booking alter column bookingid set default nextval('auto_increment_booking');

SELECT setval('auto_increment_booking', COALESCE((SELECT MAX(bookingid) + 1 FROM booking), 1), false);

CREATE SEQUENCE auto_increment_customers owned by customers.customerid;

ALTER TABLE customers alter column customerid set default nextval('auto_increment_customers');

SELECT setval('auto_increment_customers', COALESCE((SELECT MAX(customerid) + 1 FROM customers), 1), false);

CREATE SEQUENCE auto_increment_payment owned by payment.paymentid;

ALTER TABLE payment alter column paymentid set default nextval('auto_increment_payment');

SELECT setval('auto_increment_payment', COALESCE((SELECT MAX(paymentid) FROM payment), 1), false);

CREATE SEQUENCE auto_increment_bkrooms owned by booking_rooms.bkid;

ALTER TABLE booking_rooms alter column bkid set default nextval('auto_increment_bkrooms');

SELECT setval('auto_increment_bkrooms', COALESCE((SELECT MAX(bkid) + 1 FROM booking_rooms), 1), false);

CREATE SEQUENCE auto_increment_rservices owned by room_service.receiptid;

ALTER TABLE room_service alter column receiptid set default nextval('auto_increment_rservices');

SELECT setval('auto_increment_rservices', COALESCE((SELECT MAX(receiptid) + 1 FROM room_service), 1), false);

CREATE SEQUENCE auto_increment_staff owned by staff.staffid;

ALTER TABLE staff alter column staffid set default nextval('auto_increment_staff');

SELECT setval('auto_increment_staff', COALESCE((SELECT MAX(staffid) + 1 FROM staff), 1), false);

