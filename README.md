# LAMP Stack Development & Deployment Guide

This document outlines the workflow for group contribution, initial server provisioning, and ongoing redeployments for the LAMP stack application on `talavital.com`.

---

## Part 1: Local Development & Group Contribution Workflow

Follow these steps to work on the project locally as a team member:

### 0. Generate SSH Key for Server Access
To access the server without sharing passwords, generate an SSH Key on your machine and send your **public key** to the project admin (to be added to DigitalOcean):

1. Open Terminal (Mac/Linux) or PowerShell / Git Bash (Windows) and run:
   ```bash
   ssh-keygen -t ed25519 -C "your_name"
   ```
   *(Press `Enter` through all prompts to accept default settings).*

2. Display and copy your **Public Key**:
   * **Windows (PowerShell):** `Get-Content ~/.ssh/id_ed25519.pub`
   * **Mac / Linux:** `cat ~/.ssh/id_ed25519.pub`

3. Copy the output text (starts with `ssh-ed25519 ...`) and send it to the project admin to add to DigitalOcean.

### 1. Clone the Repository & Configure Credentials
> **Note:** Before cloning, send your email address to the project administrator to receive contributor access to the repository.

```bash
git clone <repository-url>
cd <repository-folder>
cp .env.example .env
```
Edit your local `.env` file to match your local MySQL settings or leave default values:
```env
DB_HOST=localhost
DB_USER=TheBeast
DB_PASSWORD=WeLoveCOP4331
DB_NAME=COP4331
```
*(Note: `.env` is listed in `.gitignore` so your personal credentials will never be committed to Git).*

### 2. Project File Structure
* **`LAMPAPI/`** – PHP backend API endpoints (`Login.php`, `AddColor.php`, `SearchColors.php`, `db.php`).
* **Frontend** – `index.html`, `color.html`, `css/`, `js/`.

### 3. Pushing Changes
Always make changes on a feature branch or pull latest changes before pushing:
```bash
git checkout -b feature/my-new-feature
git add .
git commit -m "Describe feature changes"
git push origin feature/my-new-feature
```

---

## Part 2: One-Time Server Initial Setup (Run ONCE on Server)

Execute these steps only once when setting up a fresh server or droplet for `talavital.com`.

### Step 1: Connect to Server over SSH
```bash
ssh root@talavital.com  # or ssh root@YOUR_SERVER_IP
```

### Step 2: System Packages & Server Updates
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y apache2 mysql-server php libapache2-mod-php php-mysql certbot python3-certbot-apache
```
*(Note: If using a DigitalOcean 1-Click LAMP Droplet, Apache, MySQL, and PHP are pre-installed).*

### Step 3: Initial Database & Schema Setup (Run ONCE)
Log into MySQL on the server:
```bash
sudo mysql -u root -p
```
Run the following SQL commands to create the database, tables, and DB user:
```sql
CREATE DATABASE IF NOT EXISTS COP4331;
USE COP4331;

-- Create Users Table
CREATE TABLE IF NOT EXISTS Users (
  ID INT NOT NULL AUTO_INCREMENT,
  FirstName VARCHAR(50) NOT NULL DEFAULT '',
  LastName VARCHAR(50) NOT NULL DEFAULT '',
  Login VARCHAR(50) NOT NULL DEFAULT '',
  Password VARCHAR(50) NOT NULL DEFAULT '',
  PRIMARY KEY (ID)
) ENGINE = InnoDB;

-- Create Colors Table
CREATE TABLE IF NOT EXISTS Colors (
  ID INT NOT NULL AUTO_INCREMENT,
  Name VARCHAR(50) NOT NULL DEFAULT '',
  UserID INT NOT NULL DEFAULT '0',
  PRIMARY KEY (ID)
) ENGINE = InnoDB;

-- Create Database User matching .env file
CREATE USER IF NOT EXISTS 'TheBeast'@'localhost' IDENTIFIED BY 'WeLoveCOP4331';
GRANT ALL PRIVILEGES ON COP4331.* TO 'TheBeast'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 4: Initial Web Root & SSL Setup
1. Clone the repository into Apache's web root `/var/www/html`:
   ```bash
   cd /var/www/html
   git clone <repository-url> .
   cp .env.example .env
   sudo chown -R www-data:www-data /var/www/html
   sudo chmod -R 755 /var/www/html
   ```
2. Enable SSL Certificate (HTTPS) via Certbot:
   ```bash
   sudo certbot --apache -d talavital.com -d www.talavital.com
   ```

---

## Part 3: Ongoing Code Updates & Redeployment Workflow

Whenever you or a team member push new code updates (e.g. changes to PHP, HTML, CSS, JS), run these commands on the live server to pull the changes:

1. **SSH into the server**:
   ```bash
   ssh root@talavital.com
   ```
2. **Pull latest code**:
   ```bash
   cd /var/www/html
   git pull origin main
   ```
3. **Restart web server (if needed)**:
   ```bash
   sudo systemctl restart apache2
   ```
4. **Test Live Domain**:
   Open `https://talavital.com/` in your browser or test endpoints:
   ```bash
   curl -X POST https://talavital.com/LAMPAPI/Login.php -H "Content-Type: application/json" -d '{"login":"RickL","password":"COP4331"}'
   ```