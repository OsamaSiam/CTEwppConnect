-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 28, 2022 at 07:26 PM
-- Server version: 8.0.17
-- PHP Version: 7.3.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `staff`
--

-- --------------------------------------------------------

--
-- Table structure for table `contact_info`
--

CREATE TABLE `contact_info` (
  `empolyee_ID` int(10) NOT NULL,
  `ENfirst_name` varchar(50) NOT NULL,
  `ENlast_name` varchar(50) NOT NULL,
  `department` varchar(100) NOT NULL,
  `email` varchar(80) NOT NULL,
  `office_no` int(4) NOT NULL,
  `office_hours` varchar(13) NOT NULL,
  `ext` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `contact_info`
--

INSERT INTO `contact_info` (`empolyee_ID`, `ENfirst_name`, `ENlast_name`, `department`, `email`, `office_no`, `office_hours`, `ext`) VALUES
(2, 'Jamaan', 'Alzahrani', 'Computer and Information Technology', 'jalzahrani@cte.edu.sa', 322, '07:15-08:30', 0),
(3, 'Salem', 'Alzahrani', 'Computer and Information Technology', 'salzahrani3@cte.edu.sa', 1223, '09:00-14:00', 2424),
(4, 'Eid', 'elhrbi', 'Electronics Technology', 'ealhrbi@tvtc.gov.sa', 531, '13:30-15:00', 163);

-- --------------------------------------------------------

--
-- Table structure for table `id`
--

CREATE TABLE `id` (
  `empolyee_ID` int(10) NOT NULL,
  `national_ID` int(10) NOT NULL,
  `ENfirst_name` varchar(50) NOT NULL,
  `ENlast_name` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ARfirst_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ARlast_name` varchar(25) NOT NULL,
  `phone_number` varchar(12) NOT NULL,
  `registered` tinyint(1) NOT NULL DEFAULT '0',
  `role` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'timetabler or advisor',
  `manage_group_ID` int(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `id`
--

INSERT INTO `id` (`empolyee_ID`, `national_ID`, `ENfirst_name`, `ENlast_name`, `ARfirst_name`, `ARlast_name`, `phone_number`, `registered`, `role`, `manage_group_ID`) VALUES
(1, 1234567890, 'Mohammed', 'Abduallah', 'محمد أحمد', 'عبدالله', '966566211587', 0, 'timetabler', NULL),
(2, 1041234569, 'Jamaan', 'Alzahrani', 'جمعان', 'الزهراني', '966503779887', 0, 'advisor', 44017),
(998, 1023456789, 'Ahmed', 'Osama', 'احمد', 'أسامة', '9665xxxxxxxx', 0, 'timetabler', NULL),
(999, 1012345678, 'Osama', 'Ahmed', 'أسامة', 'أحمد', '0541199915', 0, 'advisor', 44017);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contact_info`
--
ALTER TABLE `contact_info`
  ADD PRIMARY KEY (`empolyee_ID`);

--
-- Indexes for table `id`
--
ALTER TABLE `id`
  ADD PRIMARY KEY (`empolyee_ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
