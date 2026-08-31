# Colors Starter Application

Welcome to the **Colors Starter Application**! This is a simple sample project built for COP 4331 to demonstrate the basics of the LAMP stack (Linux, Apache, MySQL, PHP) with asynchronous JavaScript (AJAX) front-end interactions.

> 🛠️ **Teammate & Developer Setup Guide**: See [colors/README_DEV.md](README_DEV.md) for step-by-step onboarding, Git collaboration, MySQL shell setup, and testing commands.

---

## 📌 Features

- **User Authentication**: Log in with username and password.
- **Color Directory**: Add personal favorite colors linked to your user account.
- **Server-Side Search**: Search through your saved colors dynamically.
- **RESTful API Backend**: PHP backend processing JSON payloads.

---

## 📁 File Structure

```text
colors/
├── index.html         # Login page
├── color.html         # Main color manager dashboard page
├── css/
│   └── styles.css     # Styling for colors application
├── js/
│   └── code.js        # Client-side AJAX logic & session management
└── LAMPAPI/
    ├── db.php         # Database helper connection script
    ├── Login.php      # User login endpoint
    ├── AddColor.php   # Add color endpoint
    └── SearchColors.php # Search colors endpoint
```

---

## 🗄️ Database Setup (MySQL)

Run the following SQL commands in your MySQL database to create the required tables:

```sql
CREATE DATABASE IF NOT EXISTS COP4331;
USE COP4331;

-- Users Table
CREATE TABLE IF NOT EXISTS Users (
  ID INT NOT NULL AUTO_INCREMENT,
  FirstName VARCHAR(50) NOT NULL DEFAULT '',
  LastName VARCHAR(50) NOT NULL DEFAULT '',
  Login VARCHAR(50) NOT NULL DEFAULT '',
  Password VARCHAR(50) NOT NULL DEFAULT '',
  PRIMARY KEY (ID)
) ENGINE = InnoDB;

-- Colors Table
CREATE TABLE IF NOT EXISTS Colors (
  ID INT NOT NULL AUTO_INCREMENT,
  Name VARCHAR(50) NOT NULL DEFAULT '',
  UserID INT NOT NULL DEFAULT '0',
  PRIMARY KEY (ID)
) ENGINE = InnoDB;
```

---

## 🔌 API Endpoints Reference

All API requests expect HTTP `POST` with `Content-Type: application/json`.

### 1. User Login
- **Endpoint**: `LAMPAPI/Login.php`
- **Payload**:
  ```json
  {
    "login": "username",
    "password": "password"
  }
  ```
- **Response**:
  ```json
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "error": ""
  }
  ```

### 2. Add Color
- **Endpoint**: `LAMPAPI/AddColor.php`
- **Payload**:
  ```json
  {
    "color": "Blue",
    "userId": 1
  }
  ```
- **Response**:
  ```json
  {
    "error": ""
  }
  ```

### 3. Search Colors
- **Endpoint**: `LAMPAPI/SearchColors.php`
- **Payload**:
  ```json
  {
    "search": "Bl",
    "userId": 1
  }
  ```
- **Response**:
  ```json
  {
    "results": ["Blue", "Black"],
    "error": ""
  }
  ```

---

## 🚀 Local Setup & Running

1. Make sure your local web server (Apache/XAMPP/WAMP) is running and pointing to this repository folder.
2. Ensure your `.env` file in the parent directory contains the correct database credentials.
3. Open `http://localhost/colors/index.html` in your web browser.
