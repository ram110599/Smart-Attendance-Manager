-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 06, 2020 at 03:22 PM
-- Server version: 10.1.38-MariaDB
-- PHP Version: 7.1.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sam`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` varchar(50) NOT NULL,
  `name` varchar(70) NOT NULL,
  `email` varchar(70) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admin`
--


-- --------------------------------------------------------

--
-- Table structure for table `admin_login`
--

CREATE TABLE `admin_login` (
  `admin_id` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admin_login`
--


-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `date` date NOT NULL,
  `class_info_id` varchar(30) NOT NULL,
  `student_id` varchar(50) NOT NULL,
  `present` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `class_info`
--

CREATE TABLE `class_info` (
  `class_info_id` varchar(30) NOT NULL,
  `course_id` varchar(25) NOT NULL,
  `semester` tinyint(4) NOT NULL,
  `year` smallint(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `class_instructor`
--

CREATE TABLE `class_instructor` (
  `class_info_id` varchar(30) NOT NULL,
  `instructor_id` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `class_ta`
--

CREATE TABLE `class_ta` (
  `class_info_id` varchar(30) NOT NULL,
  `ta_id` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

CREATE TABLE `course` (
  `course_id` varchar(25) NOT NULL,
  `course_name` varchar(70) NOT NULL,
  `course_details` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `enrollment_record`
--

CREATE TABLE `enrollment_record` (
  `student_id` varchar(50) NOT NULL,
  `class_info_id` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `facial_id_record`
--

CREATE TABLE `facial_id_record` (
  `face_record` bigint(20) NOT NULL,
  `student_id` varchar(50) NOT NULL,
  `creation_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `instructor`
--

CREATE TABLE `instructor` (
  `instructor_id` varchar(50) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `contact` varchar(20) NOT NULL,
  `email` varchar(70) NOT NULL,
  `name` varchar(70) NOT NULL,
  `designation` varchar(10) NOT NULL,
  `department` varchar(10) NOT NULL,
  `joining_date` date NOT NULL,
  `leaving_date` date NOT NULL,
  `adhar_no` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `instructor_login`
--

CREATE TABLE `instructor_login` (
  `instructor_id` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `reset_password_tokens`
--

CREATE TABLE `reset_password_tokens` (
  `email` varchar(70) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expiration` datetime NOT NULL,
  `used` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `reset_password_tokens`
--


-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `student_id` varchar(50) NOT NULL,
  `valid_upto` date NOT NULL,
  `gender` varchar(10) NOT NULL,
  `name` varchar(70) NOT NULL,
  `dob` date NOT NULL,
  `department` varchar(10) NOT NULL,
  `email` varchar(70) NOT NULL,
  `address` text NOT NULL,
  `contact_no` varchar(20) NOT NULL,
  `emergency_contact` varchar(20) NOT NULL,
  `adhar_no` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `student_login`
--

CREATE TABLE `student_login` (
  `student_id` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `ta_login`
--

CREATE TABLE `ta_login` (
  `ta_id` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `ta_record`
--

CREATE TABLE `ta_record` (
  `ta_id` varchar(50) NOT NULL,
  `student_id` varchar(50) NOT NULL,
  `joining_date` date NOT NULL,
  `leaving_date` date NOT NULL,
  `adhar` varchar(50) NOT NULL,
  `email` varchar(70) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `admin_login`
--
ALTER TABLE `admin_login`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`date`,`class_info_id`,`student_id`),
  ADD KEY `class_info_id` (`class_info_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `class_info`
--
ALTER TABLE `class_info`
  ADD PRIMARY KEY (`class_info_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `class_instructor`
--
ALTER TABLE `class_instructor`
  ADD KEY `instructor_id` (`instructor_id`),
  ADD KEY `class_info_id` (`class_info_id`);

--
-- Indexes for table `class_ta`
--
ALTER TABLE `class_ta`
  ADD KEY `ta_id` (`ta_id`),
  ADD KEY `class_info_id` (`class_info_id`);

--
-- Indexes for table `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`course_id`);

--
-- Indexes for table `enrollment_record`
--
ALTER TABLE `enrollment_record`
  ADD KEY `student_id` (`student_id`),
  ADD KEY `class_info_id` (`class_info_id`);

--
-- Indexes for table `facial_id_record`
--
ALTER TABLE `facial_id_record`
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `instructor`
--
ALTER TABLE `instructor`
  ADD PRIMARY KEY (`instructor_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `instructor_login`
--
ALTER TABLE `instructor_login`
  ADD PRIMARY KEY (`instructor_id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`student_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `student_login`
--
ALTER TABLE `student_login`
  ADD PRIMARY KEY (`student_id`);

--
-- Indexes for table `ta_login`
--
ALTER TABLE `ta_login`
  ADD PRIMARY KEY (`ta_id`);

--
-- Indexes for table `ta_record`
--
ALTER TABLE `ta_record`
  ADD PRIMARY KEY (`ta_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `student_id` (`student_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin_login`
--
ALTER TABLE `admin_login`
  ADD CONSTRAINT `Admin_login_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`);

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `Attendance_ibfk_1` FOREIGN KEY (`class_info_id`) REFERENCES `class_info` (`class_info_id`),
  ADD CONSTRAINT `Attendance_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`);

--
-- Constraints for table `class_info`
--
ALTER TABLE `class_info`
  ADD CONSTRAINT `Class_info_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`);

--
-- Constraints for table `class_instructor`
--
ALTER TABLE `class_instructor`
  ADD CONSTRAINT `Class_instructor_ibfk_1` FOREIGN KEY (`class_info_id`) REFERENCES `class_info` (`class_info_id`),
  ADD CONSTRAINT `Class_instructor_ibfk_2` FOREIGN KEY (`instructor_id`) REFERENCES `instructor` (`instructor_id`);

--
-- Constraints for table `class_ta`
--
ALTER TABLE `class_ta`
  ADD CONSTRAINT `Class_ta_ibfk_1` FOREIGN KEY (`class_info_id`) REFERENCES `class_info` (`class_info_id`),
  ADD CONSTRAINT `Class_ta_ibfk_2` FOREIGN KEY (`ta_id`) REFERENCES `ta_record` (`ta_id`);

--
-- Constraints for table `enrollment_record`
--
ALTER TABLE `enrollment_record`
  ADD CONSTRAINT `Enrollment_Record_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  ADD CONSTRAINT `Enrollment_Record_ibfk_2` FOREIGN KEY (`class_info_id`) REFERENCES `class_info` (`class_info_id`);

--
-- Constraints for table `facial_id_record`
--
ALTER TABLE `facial_id_record`
  ADD CONSTRAINT `Facial_ID_Record_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`);

--
-- Constraints for table `instructor_login`
--
ALTER TABLE `instructor_login`
  ADD CONSTRAINT `Instructor_login_ibfk_1` FOREIGN KEY (`instructor_id`) REFERENCES `instructor` (`instructor_id`);

--
-- Constraints for table `student_login`
--
ALTER TABLE `student_login`
  ADD CONSTRAINT `Student_login_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`);

--
-- Constraints for table `ta_login`
--
ALTER TABLE `ta_login`
  ADD CONSTRAINT `TA_login_ibfk_1` FOREIGN KEY (`ta_id`) REFERENCES `ta_record` (`ta_id`);

--
-- Constraints for table `ta_record`
--
ALTER TABLE `ta_record`
  ADD CONSTRAINT `TA_Record_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
