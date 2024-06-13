
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

CREATE FUNCTION trigger_auto_custhist()
RETURNS TRIGGER 
AS
$$
BEGIN

		INSERT INTO cust_hist
		SELECT c.personalid, c.firstname, c.lastname, c.birthdate, c.gender, c.email, c.phone, c.address, bk.bookingdate, new.totalamount AS totalspending 
		FROM payment p 
		JOIN booking bk ON bk.bookingid = p.bookingid
		JOIN customers c ON c.customerid = bk.customerid
		WHERE p.bookingid = new.bookingid;
	
	return NEW;
END
$$

	LANGUAGE plpgsql;

CREATE TRIGGER auto_to_custhist
AFTER UPDATE ON payment
FOR EACH ROW
WHEN (new.paymentstatus LIKE 'paid')
EXECUTE FUNCTION trigger_auto_custhist();

-----------------------------------------------------


