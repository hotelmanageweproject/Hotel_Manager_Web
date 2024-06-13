CREATE TABLE TEST1(
	id serial,
	note text

);

select * from test1

INSERT INTO test
VALUES (1,'test1'),
	   (2,'test2');
	   
--Tạo auto_increment
CREATE SEQUENCE auto_increment owned by test.id

ALTER TABLE test alter column id set default nextval('auto_increment');

SELECT setval('auto_increment', COALESCE((SELECT MAX(id) + 1 FROM test), 1), false);

INSERT INTO test1(note)
VALUES ('test3'),
	   ('test4');
select * from test1;

DELETE FROM TEST1
	where id IN (5,6,7)

ALTER TABLE test
	alter column id TYPE serial

