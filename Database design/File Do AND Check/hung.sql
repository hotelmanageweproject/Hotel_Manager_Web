CREATE FUNCTION count_room(OUT cnt int)
RETURNS int
AS
$$
BEGIN
	SELECT count(roomid) INTO cnt
	FROM rooms;
END
$$

	LANGUAGE plpgsql;	
explain analyze---TRUY VẤN NÓI HIỆU NAWG CỦA HƯNG
SELECT count(bk.bkid) AS occupied_room, count_room() AS number_of_room
FROM booking_rooms bk
WHERE current_date BETWEEN bk.checkin AND bk.checkout;
