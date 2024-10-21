/*
===============================================================
To run this file execute the below commands:
set PGPASSWORD=root
psql -f init_script.sql -U postgres
===============================================================
*/


\c postgres

DROP DATABASE IF EXISTS quiz WITH (FORCE);

CREATE DATABASE quiz;
\l
\c quiz

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
\dx


/*
===================================================
 Table - Question
===================================================
*/
CREATE TABLE IF NOT EXISTS question (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	text TEXT UNIQUE NOT NULL,
	options VARCHAR[] NOT NULL,
	correct_option INT NOT NULL
);

\dt

\d question


INSERT INTO question (id, text, options, correct_option) VALUES
	('550e8400-e29b-41d4-a716-446655440000', '1 + 1 = ?', ARRAY[2, 3, 4, 0], 1),
	('550e8400-e29b-41d4-a716-446655440001', '8 + 4 = ?', ARRAY[10, 11, 12, 13], 3),
	('550e8400-e29b-41d4-a716-446655440002', '9 - 3 = ?', ARRAY[5, 6, 7, 8], 1),
	('550e8400-e29b-41d4-a716-446655440003', '5 * 5 = ?', ARRAY[20, 25, 30, 35], 1),
	('550e8400-e29b-41d4-a716-446655440004', '16 / 2 = ?', ARRAY[6, 7, 8, 9], 3),
	('550e8400-e29b-41d4-a716-446655440005', '2 + 6 = ?', ARRAY[7, 8, 9, 10], 1),
	('550e8400-e29b-41d4-a716-446655440006', '14 - 7 = ?', ARRAY[5, 6, 7, 8], 1),
	('550e8400-e29b-41d4-a716-446655440007', '3 * 4 = ?', ARRAY[10, 11, 12, 13], 3),
	('550e8400-e29b-41d4-a716-446655440008', '18 / 3 = ?', ARRAY[5, 6, 7, 8], 1),
	('550e8400-e29b-41d4-a716-446655440009', '20 + 5 = ?', ARRAY[24, 25, 26, 27], 2),
	('550e8400-e29b-41d4-a716-44665544000A', '30 - 15 = ?', ARRAY[10, 11, 12, 13], 1),
	('550e8400-e29b-41d4-a716-44665544000B', '4 * 6 = ?', ARRAY[20, 22, 24, 26], 3),
	('550e8400-e29b-41d4-a716-44665544000C', '24 / 8 = ?', ARRAY[2, 3, 4, 5], 3),
	('550e8400-e29b-41d4-a716-44665544000D', '7 + 9 = ?', ARRAY[15, 16, 17, 18], 1),
	('550e8400-e29b-41d4-a716-44665544000E', '10 - 4 = ?', ARRAY[5, 6, 7, 8], 2),
	('550e8400-e29b-41d4-a716-44665544000F', '8 * 2 = ?', ARRAY[14, 15, 16, 17], 3),
	('550e8400-e29b-41d4-a716-446655440010', '27 / 3 = ?', ARRAY[8, 9, 10, 11], 2),
	('550e8400-e29b-41d4-a716-446655440011', '11 + 2 = ?', ARRAY[12, 13, 14, 15], 1),
	('550e8400-e29b-41d4-a716-446655440012', '6 - 2 = ?', ARRAY[2, 3, 4, 5], 1),
	('550e8400-e29b-41d4-a716-446655440013', '9 * 2 = ?', ARRAY[16, 17, 18, 19], 1),
	('550e8400-e29b-41d4-a716-446655440014', '36 / 6 = ?', ARRAY[5, 6, 7, 8], 2),
	('550e8400-e29b-41d4-a716-446655440015', '13 + 7 = ?', ARRAY[19, 20, 21, 22], 1),
	('550e8400-e29b-41d4-a716-446655440016', '15 - 5 = ?', ARRAY[8, 9, 10, 11], 1),
	('550e8400-e29b-41d4-a716-446655440017', '3 * 3 = ?', ARRAY[8, 9, 10, 11], 2),
	('550e8400-e29b-41d4-a716-446655440018', '28 / 4 = ?', ARRAY[6, 7, 8, 9], 3),
	('550e8400-e29b-41d4-a716-446655440019', '4 + 4 = ?', ARRAY[6, 7, 8, 9], 3),
	('550e8400-e29b-41d4-a716-44665544001A', '22 - 11 = ?', ARRAY[9, 10, 11, 12], 1),
	('550e8400-e29b-41d4-a716-44665544001B', '5 * 7 = ?', ARRAY[30, 31, 32, 33], 2),
	('550e8400-e29b-41d4-a716-44665544001C', '40 / 5 = ?', ARRAY[5, 6, 7, 8], 1),
	('550e8400-e29b-41d4-a716-44665544001D', '10 + 10 = ?', ARRAY[15, 20, 25, 30], 2),
	('550e8400-e29b-41d4-a716-44665544001E', '19 - 8 = ?', ARRAY[10, 11, 12, 13], 1),
	('550e8400-e29b-41d4-a716-44665544001F', '6 * 5 = ?', ARRAY[28, 30, 32, 34], 2);


SELECT * FROM question;


/*
===================================================
 Table - Quiz
===================================================
*/
CREATE TABLE IF NOT EXISTS quiz (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR NOT NULL
);

INSERT INTO quiz (id, title) VALUES
    ('111e8400-e29b-41d4-a716-446655440000', 'Quiz 1');


SELECT * FROM quiz;


/*
===================================================
Table - Quiz_Questions
===================================================
*/
CREATE TABLE IF NOT EXISTS quiz_questions (
	quiz_id UUID REFERENCES quiz(id) ON DELETE CASCADE,
    question_id UUID REFERENCES question(id) ON DELETE CASCADE,
    PRIMARY KEY (quiz_id, question_id)
);

INSERT INTO quiz_questions(quiz_id,question_id) VALUES
	('111e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000'),
	('111e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440004'),
	('111e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440008'),
	('111e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440009'),
	('111e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440018');


SELECT * FROM quiz_questions;


/*
===================================================
 Table - quiz_user
===================================================
*/
CREATE TABLE IF NOT EXISTS quiz_user (
	id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid() ,
	username VARCHAR UNIQUE NOT NULL,
	email VARCHAR UNIQUE DEFAULT NULL ,
	password VARCHAR NOT NULL
);

INSERT INTO quiz_user(id, username, email, password) VALUES
	('faa17cb7-dcd7-4fd0-bc4d-0c4bfeaa9001', 'monica', 'monica@quiz.com', 'asdfg'),
	('faa17cb7-dcd7-4fd0-bc4d-0c4bfeaa9002','phoebe', 'phoebe@quiz.com', 'qwerty');


SELECT * FROM quiz_user;


CREATE TYPE user_attempt_status AS ENUM('COMPLETED', 'INPROGESS', 'INCOMPLETE');
ALTER TYPE user_attempt_status OWNER TO postgres;

/*
===================================================
 Table - user_attempt
===================================================
*/
CREATE TABLE IF NOT EXISTS user_attempt (
	user_id  UUID REFERENCES quiz_user(id) ON DELETE CASCADE,
	quiz_id  UUID REFERENCES quiz(id) ON DELETE CASCADE,
	attempt_no INT NOT NULL,
	score INT NOT NULL DEFAULT 0,
	answers JSONB NOT NULL,
	status user_attempt_status NOT NULL DEFAULT 'INPROGESS',
	PRIMARY KEY (user_id,quiz_id, attempt_no),
	start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	end_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


