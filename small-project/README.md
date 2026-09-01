# ContactSphere - Personal Contact Manager (Small Project)

**ContactSphere** is a full-featured, responsive **Personal Contact Manager** web application built for the COP 4331 Small Project requirement. Each user can register an account, log in securely, and manage their personal contacts independently.

> 🛠️ **Teammate & Developer Setup Guide**: See [small-project/README_DEV.md](README_DEV.md) for step-by-step onboarding, Git collaboration, MySQL shell setup, and testing commands.

---

## ✨ Features

- **User Authentication**: Account registration (Sign Up) & Login with animated tab switcher.
- **Private Contact Management**: Add, Edit, and Delete personal contacts (no shared contacts between users).
- **Live Server-Side Search**: Query backend with partial text matching across First Name, Last Name, Phone Number, and Email.
- **Modern UI Design System**: Glassmorphic dark mode theme with interactive card grid, modals, and toast notifications.
- **Session Persistence**: Browser cookie integration maintaining login state across page refreshes.

---

## 📁 File Structure

```text
small-project/
├── index.html           # Main application single-page interface (Auth & Dashboard)
├── css/
│   └── styles.css       # Complete dark mode design system & animations
├── js/
│   └── code.js          # AJAX API client, cookie handler, modal & toast managers
└── LAMPAPI/
    ├── db.php           # Database helper & environment loader
    ├── Login.php        # User authentication endpoint
    ├── Register.php     # User registration endpoint
    ├── AddContact.php   # Create contact endpoint
    ├── SearchContacts.php # Server-side partial search endpoint
    ├── EditContact.php  # Update contact endpoint
    └── DeleteContact.php# Delete contact endpoint
```

---

## 🗄️ Database Schema (MySQL)

Run these SQL statements in your MySQL database to prepare the required tables:

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

-- Contacts Table
CREATE TABLE IF NOT EXISTS Contacts (
  ID INT NOT NULL AUTO_INCREMENT,
  FirstName VARCHAR(50) NOT NULL DEFAULT '',
  LastName VARCHAR(50) NOT NULL DEFAULT '',
  Phone VARCHAR(50) NOT NULL DEFAULT '',
  Email VARCHAR(50) NOT NULL DEFAULT '',
  UserID INT NOT NULL DEFAULT '0',
  PRIMARY KEY (ID)
) ENGINE = InnoDB;
```

---

## 🔌 API Endpoints Reference

All API requests expect HTTP `POST` with `Content-Type: application/json`.

### 1. User Registration
- **Endpoint**: `LAMPAPI/Register.php`
- **Payload**: `{ "firstName": "Jane", "lastName": "Doe", "login": "janedoe", "password": "secretpassword" }`
- **Response**: `{ "id": 5, "error": "" }`

### 2. User Login
- **Endpoint**: `LAMPAPI/Login.php`
- **Payload**: `{ "login": "janedoe", "password": "secretpassword" }`
- **Response**: `{ "id": 5, "firstName": "Jane", "lastName": "Doe", "error": "" }`

### 3. Add Contact
- **Endpoint**: `LAMPAPI/AddContact.php`
- **Payload**: `{ "firstName": "John", "lastName": "Smith", "phone": "555-123-4567", "email": "john@example.com", "userId": 5 }`
- **Response**: `{ "error": "" }`

### 4. Search Contacts (Server-Side Partial Match)
- **Endpoint**: `LAMPAPI/SearchContacts.php`
- **Payload**: `{ "search": "John", "userId": 5 }`
- **Response**: `{ "results": [{ "ID": 12, "FirstName": "John", "LastName": "Smith", "Phone": "555-123-4567", "Email": "john@example.com" }], "error": "" }`

### 5. Edit Contact
- **Endpoint**: `LAMPAPI/EditContact.php`
- **Payload**: `{ "contactId": 12, "firstName": "John", "lastName": "Smith", "phone": "555-999-0000", "email": "john.updated@example.com", "userId": 5 }`
- **Response**: `{ "error": "" }`

### 6. Delete Contact
- **Endpoint**: `LAMPAPI/DeleteContact.php`
- **Payload**: `{ "contactId": 12, "userId": 5 }`
- **Response**: `{ "error": "" }`

---

## 🚀 Local Setup & Running

1. Ensure Apache and MySQL are running on your machine or server.
2. Verify `.env` file exists in the repository root containing your database credentials.
3. Access `http://localhost/COP4331C/small-project/index.html` in your web browser.
