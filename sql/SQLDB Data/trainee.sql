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
-- Database: `trainee`
--

-- --------------------------------------------------------

--
-- Table structure for table `academic`
--

CREATE TABLE `academic` (
  `academic_ID` int(10) NOT NULL,
  `MATH301` char(1) NOT NULL DEFAULT 'N',
  `PHYS301` char(1) NOT NULL DEFAULT 'N',
  `ENGL301` char(1) NOT NULL DEFAULT 'N',
  `INSA312` char(1) NOT NULL DEFAULT 'N',
  `INSA351` char(1) NOT NULL DEFAULT 'N',
  `INSA343` char(1) NOT NULL DEFAULT 'N',
  `MATH303` char(1) NOT NULL DEFAULT 'N',
  `GNRL401` char(1) NOT NULL DEFAULT 'N',
  `INSA371` char(1) NOT NULL DEFAULT 'N',
  `INSA452` char(1) NOT NULL DEFAULT 'N',
  `STAT303` char(1) NOT NULL DEFAULT 'N',
  `ENGL302` char(1) NOT NULL DEFAULT 'N',
  `INSA453` char(1) NOT NULL DEFAULT 'N',
  `INSA482` char(1) NOT NULL DEFAULT 'N',
  `INET433` char(1) NOT NULL DEFAULT 'N',
  `GNRL405` char(1) NOT NULL DEFAULT 'N',
  `INSA443` char(1) NOT NULL DEFAULT 'N',
  `INSA454` char(1) NOT NULL DEFAULT 'N',
  `INSA483` char(1) NOT NULL DEFAULT 'N',
  `GNRL402` char(1) NOT NULL DEFAULT 'N',
  `INET434` char(1) NOT NULL DEFAULT 'N',
  `INSA484` char(1) NOT NULL DEFAULT 'N',
  `INSA492` char(1) NOT NULL DEFAULT 'N',
  `IPRG335` char(1) NOT NULL DEFAULT 'N',
  `INSA481` char(1) NOT NULL DEFAULT 'N',
  `INSA444` char(1) NOT NULL DEFAULT 'N',
  `IPRG473` char(1) NOT NULL DEFAULT 'N',
  `INET351` char(1) NOT NULL DEFAULT 'N',
  `INSA485` char(1) NOT NULL DEFAULT 'N'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `academic`
--

INSERT INTO `academic` (`academic_ID`, `MATH301`, `PHYS301`, `ENGL301`, `INSA312`, `INSA351`, `INSA343`, `MATH303`, `GNRL401`, `INSA371`, `INSA452`, `STAT303`, `ENGL302`, `INSA453`, `INSA482`, `INET433`, `GNRL405`, `INSA443`, `INSA454`, `INSA483`, `GNRL402`, `INET434`, `INSA484`, `INSA492`, `IPRG335`, `INSA481`, `INSA444`, `IPRG473`, `INET351`, `INSA485`) VALUES
(440170394, 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'C', 'C', 'C', 'P', 'N', 'N', 'P', 'N', 'C'),
(440170396, 'N', 'P', 'P', 'P', 'P', 'P', 'N', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'C', 'P', 'N', 'N', 'P', 'N', 'C'),
(440230548, 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'C', 'P', 'P', 'P', 'C', 'C', 'P', 'N', 'N', 'P', 'N', 'C');

-- --------------------------------------------------------

--
-- Table structure for table `id`
--

CREATE TABLE `id` (
  `academic_ID` int(10) NOT NULL,
  `national_ID` int(10) NOT NULL,
  `ENfirst_name` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ENlast_name` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ARfirst_name` varchar(25) NOT NULL,
  `ARlast_name` varchar(25) NOT NULL,
  `phone_number` varchar(12) NOT NULL,
  `group_ID` int(5) UNSIGNED ZEROFILL NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `id`
--

INSERT INTO `id` (`academic_ID`, `national_ID`, `ENfirst_name`, `ENlast_name`, `ARfirst_name`, `ARlast_name`, `phone_number`, `group_ID`) VALUES
(440170394, 1071963639, 'Osama', 'Siam', 'أسامة', 'سيام', '966541199915', 44017),
(440170396, 123456890, 'Alwaleed', 'Khayyat', 'الوليد', 'خياط', '966539090618', 44017),
(440230548, 109136521, 'Mohammed', 'Alghamdi', 'محمد', 'الغامدي', '966553676760', 44023);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `academic`
--
ALTER TABLE `academic`
  ADD PRIMARY KEY (`academic_ID`);

--
-- Indexes for table `id`
--
ALTER TABLE `id`
  ADD PRIMARY KEY (`academic_ID`),
  ADD KEY `phone_number` (`phone_number`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `id`
--
ALTER TABLE `id`
  ADD CONSTRAINT `id_ibfk_1` FOREIGN KEY (`phone_number`) REFERENCES `contacts`.`users` (`phone_number`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
