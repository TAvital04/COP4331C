# Repository Developer & Contributor Guide (`README_DEV.md`)

Welcome to the **LAMP Stack Web Applications Repository** developer setup guide! This document outlines every step required for a new team member to start contributing, deploying, and testing the codebase.

---

## 🏁 Step-by-Step Onboarding Checklist

1. [Step 1: Get Added as a GitHub Collaborator](#step-1-get-added-as-a-github-collaborator)
2. [Step 2: Generate SSH Keys & Configure Local Git](#step-2-generate-ssh-keys--configure-local-git)
3. [Step 3: Open Terminal & Clone Repository](#step-3-open-terminal--clone-repository)
4. [Step 4: Create Local `.env` Configuration File](#step-4-create-local-env-configuration-file)
5. [Step 5: Start & Configure MySQL Database](#step-5-start--configure-mysql-database)
6. [Step 6: Connect to Live Remote Server via SSH (`ssh root@talavital.com`)](#step-6-connect-to-live-remote-server-via-ssh-ssh-roottalavitalcom)
7. [Step 7: Local Development Server (`php -S localhost:8000`)](#step-7-local-development-server-php--s-localhost8000)
8. [Step 8: Team Contribution & Git Workflow](#step-8-team-contribution--git-workflow)
9. [Project-Specific Developer Guides](#project-specific-developer-guides)

---

## Step 1: Get Added as a GitHub Collaborator

1. Provide your **GitHub username** or email to the repository administrator.
2. Accept the invitation email or navigate to [github.com/notifications](https://github.com/notifications).

---

## Step 2: Generate SSH Keys & Configure Local Git

To push and pull code without repeatedly typing passwords:

1. Open your terminal:
   - **Windows**: Open **PowerShell** or **Git Bash**.
   - **Mac/Linux**: Open Terminal.
2. Set your Git identity:
   ```bash
   git config --global user.name "Your Full Name"
   git config --global user.email "your_email@example.com"
   ```
3. Generate SSH Key:
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```
   *(Press `Enter` through all prompts to accept default settings).*
4. Copy your Public Key:
   - **Windows (PowerShell)**: `Get-Content ~/.ssh/id_ed25519.pub`
   - **Mac/Linux**: `cat ~/.ssh/id_ed25519.pub`
5. Go to **GitHub** $\rightarrow$ **Settings** $\rightarrow$ **SSH and GPG keys** $\rightarrow$ **New SSH key**, paste your key, and save.

---

## Step 3: Open Terminal & Clone Repository

1. Open PowerShell or Terminal.
2. Navigate to your projects directory:
   ```bash
   cd ~/Documents
   ```
3. Clone the repository:
   ```bash
   git clone git@github.com:TAvital04/COP4331C.git "LAMP Stack"
   cd "LAMP Stack"
   ```

---

## Step 4: Create Local `.env` Configuration File

Each teammate needs a local `.env` file containing local MySQL credentials.

1. Copy `.env.example`:
   - **Windows (PowerShell)**:
     ```powershell
     Copy-Item .env.example .env
     ```
   - **Mac/Linux**:
     ```bash
     cp .env.example .env
     ```
2. Verify `.env` contents:
   ```env
   DB_HOST=localhost
   DB_USER=TheBeast
   DB_PASSWORD=WeLoveCOP4331
   DB_NAME=COP4331
   ```

---

## Step 5: Start & Configure MySQL Database

1. **Start MySQL Service**:
   - **XAMPP User**: Open XAMPP Control Panel and click **Start** for MySQL.
   - **Mac/Linux**: Run `sudo service mysql start` or `brew services start mysql`.
2. **Launch MySQL CLI Shell**:
   ```bash
   mysql -u root -p
   ```
   > 💡 **XAMPP Windows Tip**: If `mysql` is not recognized, click the **Shell** button on the right side of the XAMPP Control Panel and run `mysql -u root -p` there, or use `C:\xampp\mysql\bin\mysql.exe -u root -p`. Default XAMPP root password is blank (just press `Enter`).
3. **Execute Core Setup SQL Commands**:
   ```sql
   CREATE DATABASE IF NOT EXISTS COP4331;
   USE COP4331;

   -- Create Database User matching .env
   CREATE USER IF NOT EXISTS 'TheBeast'@'localhost' IDENTIFIED BY 'WeLoveCOP4331';
   GRANT ALL PRIVILEGES ON COP4331.* TO 'TheBeast'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

---

## Step 6: Connect to Live Remote Server via SSH (`ssh root@talavital.com`)

To log into the live DigitalOcean droplet and deploy your changes to **PRODUCTION**:

1. **Open Terminal / PowerShell and connect over SSH**:
   ```bash
   ssh root@talavital.com
   ```
   *(Or use `ssh root@YOUR_SERVER_IP` if connecting via IP address).*
2. **Navigate to Apache Web Root Directory**:
   ```bash
   cd /var/www/html
   ```
3. **Pull Latest Main Branch Code**:
   ```bash
   git pull origin main
   ```
4. **Verify Live Deployment**:
   - Web Landing Portal: `https://talavital.com/`
   - Colors App: `https://talavital.com/colors/`
   - Small Project: `https://talavital.com/small-project/`

---

## Step 7: Local Development Server (`php -S localhost:8000`)

To test application code locally in your browser:

1. Open terminal inside the `LAMP Stack` repository root folder.
2. Run:
   ```bash
   php -S localhost:8000
   ```
3. Open local URLs in your browser:
   - Portal: `http://localhost:8000/index.html`
   - Colors App: `http://localhost:8000/colors/index.html`
   - Small Project: `http://localhost:8000/small-project/index.html`

---

## Step 8: Team Contribution & Git Workflow

Follow these rules for team contributions:

1. **Always pull the latest changes before starting work**:
   ```bash
   git checkout main
   git pull origin main
   ```
2. **Create a separate feature branch**:
   ```bash
   git checkout -b feature/short-feature-name
   ```
3. **Commit your work with clear messages**:
   ```bash
   git add .
   git commit -m "feat: added user feedback notifications"
   ```
4. **Push branch to GitHub**:
   ```bash
   git push -u origin feature/short-feature-name
   ```
5. **Create a Pull Request (PR)** on GitHub and request a review from a teammate before merging.

---

## 📖 Project-Specific Developer Guides

For specific database tables, API payloads, and test workflows for individual projects:
- 🎨 [Colors Project Developer Guide](colors/README_DEV.md)
- 📇 [Small Project (Contact Manager) Developer Guide](small-project/README_DEV.md)
