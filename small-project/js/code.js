const urlBase = 'LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let searchTimeout = null;
let currentContacts = [];
let contactToDeleteId = 0;

document.addEventListener('DOMContentLoaded', () => {
    readCookie();
    if (userId > 0) {
        showDashboard();
    } else {
        showAuth();
    }
});

// Tab Switcher between Login and Register
function switchAuthTab(tab) {
    const tabLogin = document.getElementById("tabLogin");
    const tabRegister = document.getElementById("tabRegister");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const authTitle = document.getElementById("authTitle");
    const authSubtitle = document.getElementById("authSubtitle");

    if (tab === 'login') {
        tabLogin.classList.add("active");
        tabRegister.classList.remove("active");
        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");
        authTitle.innerText = "Welcome Back";
        authSubtitle.innerText = "Manage your personal contact directory effortlessly";
    } else {
        tabRegister.classList.add("active");
        tabLogin.classList.remove("active");
        registerForm.classList.remove("hidden");
        loginForm.classList.add("hidden");
        authTitle.innerText = "Create Account";
        authSubtitle.innerText = "Sign up to start organizing your private contacts";
    }
}

// Login API Handler
function doLogin() {
    const login = document.getElementById("loginName").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!login || !password) {
        showToast("Please enter both username and password", "error");
        return;
    }

    const jsonPayload = JSON.stringify({ login: login, password: password });
    const url = `${urlBase}/Login.${extension}`;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    const jsonObject = JSON.parse(xhr.responseText);
                    
                    if (jsonObject.error && jsonObject.error.length > 0) {
                        showToast(jsonObject.error, "error");
                        return;
                    }

                    if (jsonObject.id <= 0) {
                        showToast("User/Password combination incorrect", "error");
                        return;
                    }

                    userId = jsonObject.id;
                    firstName = jsonObject.firstName;
                    lastName = jsonObject.lastName;

                    saveCookie();
                    showToast(`Welcome back, ${firstName}!`, "success");
                    showDashboard();
                } else {
                    showToast("Server error during login", "error");
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        showToast(err.message, "error");
    }
}

// Registration API Handler
function doRegister() {
    const regFirstName = document.getElementById("regFirstName").value.trim();
    const regLastName = document.getElementById("regLastName").value.trim();
    const regLogin = document.getElementById("regLogin").value.trim();
    const regPassword = document.getElementById("regPassword").value.trim();

    if (!regLogin || !regPassword) {
        showToast("Username and password are required", "error");
        return;
    }

    const jsonPayload = JSON.stringify({
        firstName: regFirstName,
        lastName: regLastName,
        login: regLogin,
        password: regPassword
    });

    const url = `${urlBase}/Register.${extension}`;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    const jsonObject = JSON.parse(xhr.responseText);

                    if (jsonObject.error && jsonObject.error.length > 0) {
                        showToast(jsonObject.error, "error");
                        return;
                    }

                    showToast("Account created successfully! Please sign in.", "success");
                    document.getElementById("registerForm").reset();
                    switchAuthTab('login');
                    document.getElementById("loginName").value = regLogin;
                } else {
                    showToast("Server error during registration", "error");
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        showToast(err.message, "error");
    }
}

// Session Persistence via Cookies
function saveCookie() {
    const minutes = 30;
    const date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    document.cookie = `firstName=${encodeURIComponent(firstName)};expires=${date.toGMTString()};path=/`;
    document.cookie = `lastName=${encodeURIComponent(lastName)};expires=${date.toGMTString()};path=/`;
    document.cookie = `userId=${userId};expires=${date.toGMTString()};path=/`;
}

function readCookie() {
    userId = -1;
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const item = cookie.trim();
        if (item.startsWith("userId=")) {
            userId = parseInt(item.split("=")[1]);
        } else if (item.startsWith("firstName=")) {
            firstName = decodeURIComponent(item.split("=")[1]);
        } else if (item.startsWith("lastName=")) {
            lastName = decodeURIComponent(item.split("=")[1]);
        }
    }
}

function showAuth() {
    document.getElementById("authSection").classList.remove("hidden");
    document.getElementById("dashboardSection").classList.add("hidden");
    document.getElementById("navUserWidget").classList.add("hidden");
}

function showDashboard() {
    document.getElementById("authSection").classList.add("hidden");
    document.getElementById("dashboardSection").classList.remove("hidden");
    document.getElementById("navUserWidget").classList.remove("hidden");

    document.getElementById("navUserName").innerText = `${firstName} ${lastName}`;
    const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || "U";
    document.getElementById("userAvatar").innerText = initials;
    document.getElementById("dashboardGreeting").innerText = `Logged in as ${firstName} ${lastName}`;

    searchContacts('');
}

function doLogout() {
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = "lastName=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    
    showAuth();
    showToast("Signed out successfully", "success");
}

// Live Server-Side Search with Debounce
function handleSearchInput() {
    const inputVal = document.getElementById("searchInput").value;
    const clearBtn = document.getElementById("searchClearBtn");

    if (inputVal.length > 0) {
        clearBtn.style.display = "block";
    } else {
        clearBtn.style.display = "none";
    }

    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        searchContacts(inputVal);
    }, 250);
}

function clearSearch() {
    document.getElementById("searchInput").value = "";
    document.getElementById("searchClearBtn").style.display = "none";
    searchContacts('');
}

// Server-Side Search Contacts API Call
function searchContacts(query) {
    if (userId <= 0) return;

    const jsonPayload = JSON.stringify({ search: query, userId: userId });
    const url = `${urlBase}/SearchContacts.${extension}`;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                const jsonObject = JSON.parse(xhr.responseText);
                currentContacts = jsonObject.results || [];
                renderContacts(currentContacts, query);
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        showToast("Error searching contacts", "error");
    }
}

// Render Contact Cards Grid
function renderContacts(contacts, query = '') {
    const grid = document.getElementById("contactsGrid");
    grid.innerHTML = "";

    if (!contacts || contacts.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <line x1="23" y1="11" x2="17" y2="11"></line>
                    </svg>
                </div>
                <h3>${query ? "No matching contacts found" : "No contacts yet"}</h3>
                <p>${query ? `No results match "${escapeHtml(query)}". Try a different search.` : "Get started by adding your first contact."}</p>
                ${query ? `<button class="btn btn-secondary btn-sm" onclick="clearSearch();">Clear Search</button>` : `<button class="btn btn-primary btn-sm" onclick="openContactModal('add');">Add Contact</button>`}
            </div>
        `;
        return;
    }

    contacts.forEach(contact => {
        const first = contact.FirstName || "";
        const last = contact.LastName || "";
        const fullName = `${first} ${last}`.trim() || "Unnamed Contact";
        const initials = ((first.charAt(0) || "") + (last.charAt(0) || "")).toUpperCase() || "?";
        const phone = contact.Phone || "";
        const email = contact.Email || "";

        const card = document.createElement("div");
        card.className = "contact-card";
        card.innerHTML = `
            <div>
                <div class="contact-main">
                    <div class="contact-avatar">${escapeHtml(initials)}</div>
                    <div class="contact-info">
                        <h3>${escapeHtml(fullName)}</h3>
                        <span class="contact-badge">Private</span>
                    </div>
                </div>
                <div class="contact-details">
                    ${phone ? `
                        <div class="detail-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            <span>${escapeHtml(phone)}</span>
                        </div>
                    ` : ''}
                    ${email ? `
                        <div class="detail-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            <span>${escapeHtml(email)}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
            <div class="contact-actions">
                <button type="button" class="btn-icon" title="Edit Contact" onclick="openContactModal('edit', ${contact.ID});">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button type="button" class="btn-icon delete-btn" title="Delete Contact" onclick="openDeleteModal(${contact.ID}, '${escapeJsString(fullName)}');">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Add & Edit Contact Modal Logic
function openContactModal(mode, contactId = 0) {
    const modal = document.getElementById("contactModal");
    const modalTitle = document.getElementById("modalTitle");
    const contactIdInput = document.getElementById("contactId");
    
    document.getElementById("contactForm").reset();
    contactIdInput.value = contactId;

    if (mode === 'edit' && contactId > 0) {
        modalTitle.innerText = "Edit Contact";
        const target = currentContacts.find(c => c.ID == contactId);
        if (target) {
            document.getElementById("contactFirstName").value = target.FirstName || "";
            document.getElementById("contactLastName").value = target.LastName || "";
            document.getElementById("contactPhone").value = target.Phone || "";
            document.getElementById("contactEmail").value = target.Email || "";
        }
    } else {
        modalTitle.innerText = "Add New Contact";
    }

    modal.classList.add("active");
}

function closeContactModal() {
    document.getElementById("contactModal").classList.remove("active");
}

function saveContact() {
    const contactId = parseInt(document.getElementById("contactId").value) || 0;
    const firstName = document.getElementById("contactFirstName").value.trim();
    const lastName = document.getElementById("contactLastName").value.trim();
    const phone = document.getElementById("contactPhone").value.trim();
    const email = document.getElementById("contactEmail").value.trim();

    if (!firstName && !lastName) {
        showToast("Please enter at least a first or last name", "error");
        return;
    }

    const isEdit = contactId > 0;
    const endpoint = isEdit ? "EditContact" : "AddContact";
    
    const payload = {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
        userId: userId
    };

    if (isEdit) {
        payload.contactId = contactId;
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${urlBase}/${endpoint}.${extension}`, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                const jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error && jsonObject.error.length > 0) {
                    showToast(jsonObject.error, "error");
                    return;
                }

                closeContactModal();
                showToast(isEdit ? "Contact updated successfully" : "Contact added successfully", "success");
                searchContacts(document.getElementById("searchInput").value);
            }
        };
        xhr.send(JSON.stringify(payload));
    } catch (err) {
        showToast("Failed to save contact", "error");
    }
}

// Delete Contact Modal Logic
function openDeleteModal(id, name) {
    contactToDeleteId = id;
    document.getElementById("deleteContactName").innerText = name || "this contact";
    document.getElementById("deleteModal").classList.add("active");
}

function closeDeleteModal() {
    contactToDeleteId = 0;
    document.getElementById("deleteModal").classList.remove("active");
}

function confirmDeleteContact() {
    if (contactToDeleteId <= 0) return;

    const payload = JSON.stringify({ contactId: contactToDeleteId, userId: userId });
    const url = `${urlBase}/DeleteContact.${extension}`;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                const jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error && jsonObject.error.length > 0) {
                    showToast(jsonObject.error, "error");
                    return;
                }

                closeDeleteModal();
                showToast("Contact deleted", "success");
                searchContacts(document.getElementById("searchInput").value);
            }
        };
        xhr.send(payload);
    } catch (err) {
        showToast("Failed to delete contact", "error");
    }
}

// Toast Notifications System
function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    const iconSvg = type === "success" 
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

    toast.innerHTML = `${iconSvg}<span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// Helper Sanitizers
function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function escapeJsString(str) {
    return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}
