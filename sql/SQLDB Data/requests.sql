-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 28, 2022 at 07:27 PM
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
-- Database: `requests`
--

-- --------------------------------------------------------

--
-- Table structure for table `record`
--

CREATE TABLE `record` (
  `request_id` int(8) UNSIGNED NOT NULL,
  `status` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pending' COMMENT 'Pending, refused, or done',
  `request_type` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'add or remove',
  `item_requested` varchar(8) NOT NULL,
  `trainee_ID` varchar(12) NOT NULL,
  `trainee_name` varchar(150) NOT NULL,
  `group_ID` int(5) NOT NULL,
  `staff_pending` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'advisor' COMMENT 'timetabler or advisor',
  `request_timestamp` timestamp(6) NOT NULL,
  `update_timestamp` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `reason` varchar(255) NOT NULL,
  `reply_reason` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `record`
--

INSERT INTO `record` (`request_id`, `status`, `request_type`, `item_requested`, `trainee_ID`, `trainee_name`, `group_ID`, `staff_pending`, `request_timestamp`, `update_timestamp`, `reason`, `reply_reason`) VALUES
(4, 'Pending', 'remove', 'inet434', '440170394', 'Osama Siam', 44017, 'advisor', '2022-05-19 00:00:21.000000', '2022-05-19 00:00:21.863747', 'reasons', ''),
(5, 'Pending', 'remove', 'inet434', '440170394', 'Osama Siam', 44017, 'advisor', '2022-05-19 00:01:32.000000', '2022-05-19 00:01:32.758008', 'reasons', ''),
(10, 'Pending', 'remove', 'inet434', '440170394', 'Osama Siam', 44017, 'advisor', '2022-05-19 11:58:38.000000', '2022-05-19 11:58:38.753948', 'reasons', ''),
(11, 'Pending', 'add', 'inet434', '440170394', 'Osama Siam', 44017, 'advisor', '2022-05-19 11:59:27.000000', '2022-05-19 11:59:27.778957', 'reasons', ''),
(12, 'Pending', 'remove', 'insa492', '440230548', 'Mohammed Alghamdi', 44023, 'advisor', '2022-05-19 13:31:16.000000', '2022-05-19 13:31:16.185019', 'reasons', ''),
(13, 'Pending', 'remove', 'insa492', '440170394', 'Osama Siam', 44017, 'advisor', '2022-05-19 13:38:53.000000', '2022-05-19 13:38:53.353759', 'reasons', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `record`
--
ALTER TABLE `record`
  ADD PRIMARY KEY (`request_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `record`
--
ALTER TABLE `record`
  MODIFY `request_id` int(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
