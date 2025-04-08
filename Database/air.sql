CREATE DATABASE IF NOT EXISTS monitoring_system;
USE monitoring_system;

-- Device Type Table
CREATE TABLE device_type (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Parameter Table  
CREATE TABLE parameter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    unit VARCHAR(50),
    max_value DECIMAL(10,2),
    min_value DECIMAL(10,2)
);

-- Type Parameter (Junction Table for Many-to-Many relationship)
CREATE TABLE type_parameter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type_id INT,
    parameter_id INT,
    FOREIGN KEY (type_id) REFERENCES device_type(id) ON DELETE CASCADE,
    FOREIGN KEY (parameter_id) REFERENCES parameter(id) ON DELETE CASCADE
);

-- Sensors Table
CREATE TABLE sensors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type_id INT,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    location_id INT,
    FOREIGN KEY (type_id) REFERENCES device_type(id) ON DELETE SET NULL,
    FOREIGN KEY (location_id) REFERENCES location(id) ON DELETE SET NULL
);

-- Table for location
CREATE TABLE location (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
   
);
