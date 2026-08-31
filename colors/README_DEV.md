# Colors Project - Developer & Contributor Guide (`README_DEV.md`)

This guide provides step-by-step instructions for teammates working on the **Colors Starter Application**. It covers everything from being invited as a repository collaborator to running local MySQL queries, connecting to the server via SSH (`ssh root@talavital.com`), and testing API endpoints.

---

## 📋 Table of Contents

1. [Step 1: Accept GitHub Collaborator Invitation](#step-1-accept-github-collaborator-invitation)
2. [Step 2: Open Terminal / Shell & Clone Repository](#step-2-open-terminal--shell--clone-repository)
3. [Step 3: Environment Setup (`.env`)](#step-3-environment-setup-env)
4. [Step 4: Start MySQL & Load Database Schema](#step-4-start-mysql--load-database-schema)
5. [Step 5: Remote Server SSH Access & Deployment (`ssh root@talavital.com`)](#step-5-remote-server-ssh-access--deployment-ssh-roottalavitalcom)
6. [Step 6: Run & Test the Application Locally & Live](#step-6-run--test-the-application-locally--live)
7. [Step 7: Team Git Contribution Workflow](#step-7-team-git-contribution-workflow)

---

## Step 1: Accept GitHub Collaborator Invitation

1. Send your **GitHub username** or **email address** to your team lead.
2. Check your email or go to [github.com/notifications](https://github.com/notifications) to accept the repository collaborator invitation.
3. Verify Git is installed on your computer:
   - **Windows**: Open PowerShell and type `git --version`
   - **Mac/Linux**: Open Terminal and type `git --version`

---

## Step 2: Open Terminal / Shell & Clone Repository

1. Open your terminal application:
   - **Windows**: Press `Win + X` and select **PowerShell** or **Terminal**.
   - **Mac**: Press `Cmd + Space`, type `Terminal`, and press `Enter`.
2. Navigate to your projects folder:
   ```bash
   cd ~/Documents
   ```
3. Clone the project repository and enter the folder:
   ```bash
   git clone <REPOSITORY_URL>
   cd "LAMP Stack"
   ```

---

## Step 3: Environment Setup (`.env`)

1. Copy the example environment configuration file to create your personal `.env`:
   - **Windows (PowerShell)**:
     ```powershell
     Copy-Item .env.example .env
     ```
   - **Mac/Linux (Bash)**:
     ```bash
     cp .env.example .env
     ```
2. Open `.env` in VS Code or your text editor and verify database settings:
   ```env
   DB_HOST=localhost
   DB_USER=TheBeast
   DB_PASSWORD=WeLoveCOP4331
   DB_NAME=COP4331
   ```

---

## Step 4: Start MySQL & Load Database Schema

### A. Start MySQL Service
- **Windows (XAMPP)**: Open XAMPP Control Panel and click **Start** next to MySQL and Apache.
- **Mac/Linux (Native MySQL)**:
  ```bash
  sudo service mysql start
  # or on macOS: brew services start mysql
  ```

### B. Access MySQL Shell & Run SQL Scripts
Open a terminal shell and log into MySQL as root:
```bash
mysql -u root -p
```

> 💡 **XAMPP Windows Troubleshooting ("mysql is not recognized")**:
> If PowerShell says `mysql` is not recognized:
> - **Option 1 (Easiest)**: Open XAMPP Control Panel and click the **Shell** button on the right side. In that window, type `mysql -u root -p`.
> - **Option 2**: Run using XAMPP's direct path in PowerShell: `C:\xampp\mysql\bin\mysql.exe -u root -p`
> - *(Note: Default XAMPP root password is blank, so just press `Enter` when prompted for password).*

*(Enter your MySQL root password when prompted)*.

Once inside the MySQL prompt (`mysql>`), run the following SQL commands:

```sql
-- 1. Create Database
CREATE DATABASE IF NOT EXISTS COP4331;
USE COP4331;

-- 2. Create Users Table
CREATE TABLE IF NOT EXISTS Users (
  ID INT NOT NULL AUTO_INCREMENT,
  FirstName VARCHAR(50) NOT NULL DEFAULT '',
  LastName VARCHAR(50) NOT NULL DEFAULT '',
  Login VARCHAR(50) NOT NULL DEFAULT '',
  Password VARCHAR(50) NOT NULL DEFAULT '',
  PRIMARY KEY (ID)
) ENGINE = InnoDB;

-- 3. Create Colors Table
CREATE TABLE IF NOT EXISTS Colors (
  ID INT NOT NULL AUTO_INCREMENT,
  Name VARCHAR(50) NOT NULL DEFAULT '',
  UserID INT NOT NULL DEFAULT '0',
  PRIMARY KEY (ID)
) ENGINE = InnoDB;

-- 4. Create DB User matching .env file
CREATE USER IF NOT EXISTS 'TheBeast'@'localhost' IDENTIFIED BY 'WeLoveCOP4331';
GRANT ALL PRIVILEGES ON COP4331.* TO 'TheBeast'@'localhost';
FLUSH PRIVILEGES;

-- 5. Insert Test Data
INSERT INTO Users (FirstName, LastName, Login, Password) VALUES ('Demo', 'User', 'demouser', 'password123');
INSERT INTO Colors (Name, UserID) VALUES ('Blue', 1), ('Green', 1), ('Red', 1);

EXIT;
```

---

## Step 5: Remote Server SSH Access & Deployment (`ssh root@talavital.com`)

To connect to the live DigitalOcean droplet and update the colors application on `talavital.com`:

1. **SSH into the Server**:
   ```bash
   ssh root@talavital.com
   ```
2. **Navigate to Apache Web Root**:
   ```bash
   cd /var/www/html
   ```
3. **Pull Latest Main Branch**:
   ```bash
   git pull origin main
   ```
4. **Set Web Server Ownership & Permissions**:
   ```bash
   sudo chown -R www-data:www-data /var/www/html
   sudo chmod -R 755 /var/www/html
   ```

---

## Step 6: Run & Test the Application Locally & Live

### A. Start Local Web Server (PHP Built-In Server)
Open terminal inside the `LAMP Stack` repository folder and run:
```bash
php -S localhost:8000
```
Keep this terminal window open while testing.

---

### B. Browser & API Testing
1. **Local Browser**: `http://localhost:8000/colors/index.html`
2. **Live Domain**: `https://talavital.com/colors/index.html`
3. Test API Endpoints using cURL:
   ```bash
   # Test Local API
   curl -X POST http://localhost/colors/LAMPAPI/Login.php \
     -H "Content-Type: application/json" \
     -d "{\"login\":\"demouser\",\"password\":\"password123\"}"

   # Test Live Server API
   curl -X POST https://talavital.com/colors/LAMPAPI/Login.php \
     -H "Content-Type: application/json" \
     -d "{\"login\":\"demouser\",\"password\":\"password123\"}"
   ```

---

## Step 7: Team Git Contribution Workflow

Never push directly to `main`. Always use feature branches:

1. **Pull latest changes**:
   ```bash
   git checkout main
   git pull origin main
   ```
2. **Create a new feature branch**:
   ```bash
   git checkout -b feature/colors-ui-update
   ```
3. **Make your changes, then stage & commit**:
   ```bash
   git add .
   git commit -m "feat(colors): updated color list UI and added error validation"
   ```
4. **Push branch to GitHub**:
   ```bash
   git push -u origin feature/colors-ui-update
   ```
5. **Open Pull Request (PR)**: Go to GitHub repository page, click **Compare & pull request**, request review from a teammate, and merge once approved!
