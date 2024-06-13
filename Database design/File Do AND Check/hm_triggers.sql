---Trigger tự thêm bookingid và discount của khách vào payment sau khi insert vào Booking
CREATE FUNCTION trigger_auto_paymentinfo()
RETURNS TRIGGER
AS
$$
DECLARE discount_out int;
BEGIN
	WITH subquery AS(
		SELECT c.customerid FROM booking b
		JOIN customers c ON c.customerid = b.customerid
		WHERE bookingid = NEW.bookingid
	)
	SELECT cr.discount INTO discount_out
	FROM customers c
	JOIN subquery s on s.customerid = c.customerid
	JOIN customer_ranking cr ON cr.rankid = c.rankid;
	
	INSERT INTO payment(bookingid, discount)
	VALUES(NEW.bookingid, discount_out);
	
	RETURN NEW;
END
$$
	LANGUAGE plpgsql;


CREATE TRIGGER auto_paymentinfo
AFTER INSERT ON booking
FOR EACH ROW
EXECUTE FUNCTION trigger_auto_paymentinfo();
----

---Trigger tự động thêm thông tin khách vào cust_hist sau khi điền UPDATE paymentstatus là paid của payment
---LƯU Ý: thao tác khi thêm vào payment sẽ sử dụng UPDATE thay cho search. Tìm ra booking rồi UPDATE WHERE bookingid vừa tìm được

CREATE OR REPLACE FUNCTION trigger_auto_custhist()
RETURNS TRIGGER 
AS
$$

BEGIN
	
		INSERT INTO cust_hist
		SELECT c.personalid, bk.bookingdate, p.totalamount 
		FROM payment p 
		JOIN booking bk ON bk.bookingid = p.bookingid
		JOIN customers c ON c.customerid = bk.customerid
		WHERE p.bookingid = new.bookingid;
	
	return NEW;
END
$$

	LANGUAGE plpgsql;
------------------------------------------------------------------
CREATE TRIGGER auto_to_custhist
AFTER UPDATE ON payment
FOR EACH ROW
WHEN (new.paymentstatus LIKE 'paid')
EXECUTE FUNCTION trigger_auto_custhist();

-----------------------------------------------------

---------Trigger tự động cập nhật tổng giá tiền phòng sau discount và additionalcharge và cả tiền service--------
-------------------------khi nhân viên UPDATE vào tổng tiền phòng---------------------------
CREATE OR REPLACE FUNCTION trigger_update_totalamount_payment()
RETURNS TRIGGER
AS
$$
DECLARE service_total bigint;
BEGIN
	
	SELECT SUM(rs.total) INTO service_total
	FROM room_service rs
	WHERE bkid IN (
		SELECT bkid FROM booking_rooms
			WHERE bookingid = new.bookingid
	);	
	
	IF service_total IS NULL THEN
	service_total = 0;
	END IF;
	--Phí phụ thu không discount
	IF new.additionalcharge > 0 THEN
	new.totalamount = (new.totalamount + service_total)  * (100 - old.discount) / 100 + new.additionalcharge;
	ELSE
	new.totalamount = (new.totalamount + service_total) * (100 - old.discount) / 100;
	END IF;


	RETURN NEW;
END
$$
	LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER auto_update_totalamount_payment
BEFORE UPDATE ON payment
FOR EACH ROW
WHEN (new.totalamount IS NOT NULL AND new.totalamount != old.totalamount) --TRÁNH MÂU THUẪN VỚI TRIGGER auto_to_custhist
EXECUTE FUNCTION trigger_update_totalamount_payment();

----------------------------------------------------------------------------
-----------TRIGGER kiểm tra phòng đặt bị chồng chéo ngày với đơn khác đặt cùng phòng------------- NAM_TT
CREATE OR REPLACE FUNCTION trigger_check_bookedroom()
RETURNS TRIGGER
AS
$$
BEGIN
	IF EXISTS (SELECT bkid FROM booking_rooms
				   WHERE roomid = new.roomid AND NOT (new.checkout <= checkin OR new.checkin >= checkout)
				  )
	THEN
	
	RAISE EXCEPTION 'Phong da duoc dat. Khong the them';
	
	
	END IF;
	
	RETURN NEW;
	
	

END
$$
	LANGUAGE plpgsql;

CREATE TRIGGER auto_check_bookedroom
BEFORE INSERT ON booking_rooms
FOR EACH ROW
EXECUTE FUNCTION trigger_check_bookedroom();

-----------------------------------------------------------
