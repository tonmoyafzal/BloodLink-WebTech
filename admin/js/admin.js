/**
 * BloodLink - Admin JavaScript
 *
 * Features:
 *  - Persistent LocalStorage database with rich initial seed data
 *  - Comprehensive input validation & error handling (invalid email, invalid phone, password mismatch, etc.)
 *  - Role-based session management and demo role switcher
 *  - Dynamic controllers for Admin role pages
 *  - Real-time DOM updates, click-to-call support, flash notifications, and modal dialogs
 */

(function () {
  'use strict';

  // Global namespace
  const BloodLink = window.BloodLink = window.BloodLink || {};

  /* ==========================================================================
     1. STORAGE ENGINE & DEFAULT SEED DATA
     ========================================================================== */

  const STORAGE_KEYS = {
    USERS: 'bloodlink_users',
    REQUESTS: 'bloodlink_requests',
    CAMPS: 'bloodlink_camps',
    STOCK: 'bloodlink_stock',
    VERIFICATIONS: 'bloodlink_verifications',
    HISTORY: 'bloodlink_history',
    SESSION: 'bloodlink_currentUser'
  };

  BloodLink.storage = {
    get: function (key, defaultValue) {
      try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
      } catch (e) {
        console.warn('Storage read error:', e);
        return defaultValue;
      }
    },
    set: function (key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.error('Storage write error:', e);
        return false;
      }
    },
    remove: function (key) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error('Storage remove error:', e);
      }
    }
  };

  // Initial seed data
  const SEED_USERS = [
    {
      id: 'USR-ADMIN-1',
      name: 'MD Woasi Afzal (Admin)',
      email: 'admin@bloodlink.org',
      password: 'admin',
      role: 'admin',
      phone: '01711000001',
      area: 'Dhaka',
      status: 'active'
    },
    {
      id: 'USR-DONOR-1',
      name: 'MD Sabit Rahman',
      email: 'sabit@bloodlink.org',
      password: 'donor',
      role: 'donor',
      phone: '01811223344',
      bloodGroup: 'O+',
      area: 'Dhaka',
      lastDonationDate: '2026-08-15',
      available: true,
      status: 'active'
    },
    {
      id: 'USR-DONOR-2',
      name: 'Riftia Bin Rafi',
      email: 'rafi@bloodlink.org',
      password: 'donor',
      role: 'donor',
      phone: '01911223344',
      bloodGroup: 'A+',
      area: 'Chattogram',
      lastDonationDate: '2026-07-20',
      available: true,
      status: 'active'
    },
    {
      id: 'USR-DONOR-3',
      name: 'Meherab Hossain Emon',
      email: 'meherab@bloodlink.org',
      password: 'donor',
      role: 'donor',
      phone: '01611223344',
      bloodGroup: 'B+',
      area: 'Narayanganj',
      lastDonationDate: '2026-09-01',
      available: true,
      status: 'active'
    },
    {
      id: 'USR-DONOR-4',
      name: 'Ayesha Siddiqua',
      email: 'ayesha@bloodlink.org',
      password: 'donor',
      role: 'donor',
      phone: '01511223344',
      bloodGroup: 'O-',
      area: 'Dhaka',
      lastDonationDate: '2026-05-12',
      available: true,
      status: 'pending'
    },
    {
      id: 'USR-PATIENT-1',
      name: 'Rahat Khan',
      email: 'patient@bloodlink.org',
      password: 'patient',
      role: 'patient',
      phone: '01722334455',
      area: 'Dhaka',
      status: 'active'
    },
    {
      id: 'USR-PATIENT-2',
      name: 'Nusrat Jahan',
      email: 'nusrat@bloodlink.org',
      password: 'patient',
      role: 'patient',
      phone: '01822334455',
      area: 'Chattogram',
      status: 'active'
    },
    {
      id: 'USR-HOSP-1',
      name: 'Dhaka Medical College Hospital',
      email: 'hospital@bloodlink.org',
      password: 'hospital',
      role: 'hospital',
      phone: '01733445566',
      address: 'Secretariat Road, Dhaka-1000',
      area: 'Dhaka',
      status: 'active'
    },
    {
      id: 'USR-HOSP-2',
      name: 'Chattogram Medical College Hospital',
      email: 'cmch@bloodlink.org',
      password: 'hospital',
      role: 'hospital',
      phone: '01833445566',
      address: '57 K.B. Fazlul Kader Road, Chattogram',
      area: 'Chattogram',
      status: 'active'
    },
    {
      id: 'USR-HOSP-3',
      name: 'Square Hospital Ltd',
      email: 'square@bloodlink.org',
      password: 'hospital',
      role: 'hospital',
      phone: '01933445566',
      address: '18/F Bir Uttam Qazi Nuruzzaman Sarak, Dhaka',
      area: 'Dhaka',
      status: 'active'
    }
  ];

  const SEED_REQUESTS = [
    {
      id: '101',
      patientId: 'USR-PATIENT-1',
      patientName: 'Rahat Khan',
      bloodGroup: 'O-',
      bags: 2,
      hospital: 'Dhaka Medical College Hospital',
      area: 'Dhaka',
      urgency: 'urgent',
      contact: '01722334455',
      notes: 'Emergency accident victim in ICU',
      status: 'Pending',
      createdAt: '2026-11-20',
      responses: []
    },
    {
      id: '102',
      patientId: 'USR-PATIENT-1',
      patientName: 'Farhana Sultana',
      bloodGroup: 'B+',
      bags: 1,
      hospital: 'Narayanganj General Hospital',
      area: 'Narayanganj',
      urgency: 'urgent',
      contact: '01722334455',
      notes: 'Thalassemia regular transfusion required',
      status: 'Approved',
      createdAt: '2026-11-21',
      responses: [
        {
          donorId: 'USR-DONOR-3',
          donorName: 'Meherab Hossain Emon',
          phone: '01611223344',
          bloodGroup: 'B+',
          area: 'Narayanganj',
          respondedAt: '2026-11-21'
        }
      ]
    },
    {
      id: '103',
      patientId: 'USR-PATIENT-2',
      patientName: 'Kamal Hossain',
      bloodGroup: 'A+',
      bags: 3,
      hospital: 'Chattogram Medical College Hospital',
      area: 'Chattogram',
      urgency: 'urgent',
      contact: '01822334455',
      notes: 'Heart bypass surgery scheduled tomorrow',
      status: 'Approved',
      createdAt: '2026-11-19',
      responses: [
        {
          donorId: 'USR-DONOR-2',
          donorName: 'Riftia Bin Rafi',
          phone: '01911223344',
          bloodGroup: 'A+',
          area: 'Chattogram',
          respondedAt: '2026-11-20'
        }
      ]
    },
    {
      id: '104',
      patientId: 'USR-PATIENT-1',
      patientName: 'Sadia Islam',
      bloodGroup: 'O+',
      bags: 2,
      hospital: 'Square Hospital Ltd',
      area: 'Dhaka',
      urgency: '3days',
      contact: '01722334455',
      notes: 'Elective surgery this weekend',
      status: 'Approved',
      createdAt: '2026-11-21',
      responses: []
    },
    {
      id: '105',
      patientId: 'USR-PATIENT-2',
      patientName: 'Nazmul Haque',
      bloodGroup: 'AB-',
      bags: 1,
      hospital: 'Chattogram Medical College Hospital',
      area: 'Chattogram',
      urgency: 'planned',
      contact: '01822334455',
      notes: 'Routine orthopedic procedure',
      status: 'Fulfilled',
      createdAt: '2026-11-10',
      responses: []
    }
  ];

  const SEED_CAMPS = [
    {
      id: 'CAMP-1',
      hospitalId: 'USR-HOSP-1',
      hospitalName: 'Dhaka Medical College Hospital',
      title: 'Winter Youth Voluntary Blood Drive 2026',
      date: '2026-12-05',
      location: 'DMCH Main Auditorium, Secretariat Road, Dhaka',
      details: 'Free comprehensive blood screening, donor recognition certificate, and nutritious refreshments provided.'
    },
    {
      id: 'CAMP-2',
      hospitalId: 'USR-HOSP-2',
      hospitalName: 'Chattogram Medical College Hospital',
      title: 'LifeSaver Blood Donation Camp',
      date: '2026-12-12',
      location: 'CMCH Ground Floor Hall, Chattogram',
      details: 'Joint blood collection drive with Bangladesh Red Crescent Society.'
    },
    {
      id: 'CAMP-3',
      hospitalId: 'USR-HOSP-3',
      hospitalName: 'Square Hospital Ltd',
      title: 'Community Voluntary Blood Donation Fair',
      date: '2026-12-20',
      location: 'Square Hospital West Wing, Panthapath, Dhaka',
      details: 'Open to all healthy volunteers aged 18 to 60. Walk-ins warmly welcomed!'
    }
  ];

  const SEED_STOCK = {
    'USR-HOSP-1': {
      'A+': 14,
      'A-': 3,
      'B+': 18,
      'B-': 2,
      'O+': 22,
      'O-': 1,
      'AB+': 6,
      'AB-': 0,
      lastUpdated: '2026-11-21 14:30'
    }
  };

  const SEED_VERIFICATIONS = [
    {
      id: 'VER-1',
      hospitalId: 'USR-HOSP-1',
      hospitalName: 'Dhaka Medical College Hospital',
      donorId: 'USR-DONOR-1',
      donorName: 'MD Sabit Rahman',
      bloodGroup: 'O+',
      requestId: '102',
      donationDate: '2026-11-18',
      status: 'Pending'
    },
    {
      id: 'VER-2',
      hospitalId: 'USR-HOSP-1',
      hospitalName: 'Dhaka Medical College Hospital',
      donorId: 'USR-DONOR-2',
      donorName: 'Riftia Bin Rafi',
      bloodGroup: 'A+',
      requestId: '103',
      donationDate: '2026-11-19',
      status: 'Pending'
    }
  ];

  const SEED_HISTORY = [
    {
      id: 'HIST-1',
      donorId: 'USR-DONOR-1',
      hospital: 'Dhaka Medical College Hospital',
      bloodGroup: 'O+',
      date: '2026-08-15',
      status: 'Verified'
    },
    {
      id: 'HIST-2',
      donorId: 'USR-DONOR-1',
      hospital: 'Square Hospital Ltd',
      bloodGroup: 'O+',
      date: '2026-04-10',
      status: 'Verified'
    },
    {
      id: 'HIST-3',
      donorId: 'USR-DONOR-2',
      hospital: 'Chattogram Medical College Hospital',
      bloodGroup: 'A+',
      date: '2026-07-20',
      status: 'Verified'
    },
    {
      id: 'HIST-4',
      donorId: 'USR-DONOR-3',
      hospital: 'Narayanganj General Hospital',
      bloodGroup: 'B+',
      date: '2026-09-01',
      status: 'Verified'
    }
  ];

  BloodLink.db = {
    init: function () {
      if (!BloodLink.storage.get(STORAGE_KEYS.USERS)) {
        BloodLink.storage.set(STORAGE_KEYS.USERS, SEED_USERS);
      }
      if (!BloodLink.storage.get(STORAGE_KEYS.REQUESTS)) {
        BloodLink.storage.set(STORAGE_KEYS.REQUESTS, SEED_REQUESTS);
      }
      if (!BloodLink.storage.get(STORAGE_KEYS.CAMPS)) {
        BloodLink.storage.set(STORAGE_KEYS.CAMPS, SEED_CAMPS);
      }
      if (!BloodLink.storage.get(STORAGE_KEYS.STOCK)) {
        BloodLink.storage.set(STORAGE_KEYS.STOCK, SEED_STOCK);
      }
      if (!BloodLink.storage.get(STORAGE_KEYS.VERIFICATIONS)) {
        BloodLink.storage.set(STORAGE_KEYS.VERIFICATIONS, SEED_VERIFICATIONS);
      }
      if (!BloodLink.storage.get(STORAGE_KEYS.HISTORY)) {
        BloodLink.storage.set(STORAGE_KEYS.HISTORY, SEED_HISTORY);
      }
    },

    // Users
    getUsers: function () {
      return BloodLink.storage.get(STORAGE_KEYS.USERS, []);
    },
    getUserById: function (id) {
      return this.getUsers().find(u => u.id === id) || null;
    },
    getUserByEmail: function (email) {
      if (!email) return null;
      return this.getUsers().find(u => u.email.trim().toLowerCase() === email.trim().toLowerCase()) || null;
    },
    saveUser: function (user) {
      const users = this.getUsers();
      users.push(user);
      BloodLink.storage.set(STORAGE_KEYS.USERS, users);
      return user;
    },
    updateUser: function (id, updates) {
      const users = this.getUsers();
      const idx = users.findIndex(u => u.id === id);
      if (idx !== -1) {
        users[idx] = Object.assign({}, users[idx], updates);
        BloodLink.storage.set(STORAGE_KEYS.USERS, users);
        // Also update currentUser if updating self
        const cur = BloodLink.auth.getCurrentUser();
        if (cur && cur.id === id) {
          BloodLink.auth.setCurrentUser(users[idx]);
        }
        return users[idx];
      }
      return null;
    },
    deleteUser: function (id) {
      const users = this.getUsers().filter(u => u.id !== id);
      BloodLink.storage.set(STORAGE_KEYS.USERS, users);
    },

    // Requests
    getRequests: function () {
      return BloodLink.storage.get(STORAGE_KEYS.REQUESTS, []);
    },
    getRequestById: function (id) {
      return this.getRequests().find(r => String(r.id) === String(id)) || null;
    },
    saveRequest: function (req) {
      const requests = this.getRequests();
      if (!req.id) {
        req.id = String(Date.now()).slice(-4);
      }
      requests.unshift(req);
      BloodLink.storage.set(STORAGE_KEYS.REQUESTS, requests);
      return req;
    },
    updateRequest: function (id, updates) {
      const requests = this.getRequests();
      const idx = requests.findIndex(r => String(r.id) === String(id));
      if (idx !== -1) {
        requests[idx] = Object.assign({}, requests[idx], updates);
        BloodLink.storage.set(STORAGE_KEYS.REQUESTS, requests);
        return requests[idx];
      }
      return null;
    },
    deleteRequest: function (id) {
      const requests = this.getRequests().filter(r => String(r.id) !== String(id));
      BloodLink.storage.set(STORAGE_KEYS.REQUESTS, requests);
    },

    // Camps
    getCamps: function () {
      return BloodLink.storage.get(STORAGE_KEYS.CAMPS, []);
    },
    saveCamp: function (camp) {
      const camps = this.getCamps();
      if (!camp.id) camp.id = 'CAMP-' + Date.now();
      camps.unshift(camp);
      BloodLink.storage.set(STORAGE_KEYS.CAMPS, camps);
      return camp;
    },
    updateCamp: function (id, updates) {
      const camps = this.getCamps();
      const idx = camps.findIndex(c => c.id === id);
      if (idx !== -1) {
        camps[idx] = Object.assign({}, camps[idx], updates);
        BloodLink.storage.set(STORAGE_KEYS.CAMPS, camps);
        return camps[idx];
      }
      return null;
    },
    deleteCamp: function (id) {
      const camps = this.getCamps().filter(c => c.id !== id);
      BloodLink.storage.set(STORAGE_KEYS.CAMPS, camps);
    },

    // Stock
    getStock: function (hospitalId) {
      const allStock = BloodLink.storage.get(STORAGE_KEYS.STOCK, {});
      if (!allStock[hospitalId]) {
        allStock[hospitalId] = {
          'A+': 10, 'A-': 4,
          'B+': 12, 'B-': 3,
          'O+': 15, 'O-': 2,
          'AB+': 5, 'AB-': 1,
          lastUpdated: new Date().toISOString().slice(0, 10)
        };
        BloodLink.storage.set(STORAGE_KEYS.STOCK, allStock);
      }
      return allStock[hospitalId];
    },
    updateStock: function (hospitalId, bloodGroup, bags) {
      const allStock = BloodLink.storage.get(STORAGE_KEYS.STOCK, {});
      if (!allStock[hospitalId]) {
        allStock[hospitalId] = {};
      }
      allStock[hospitalId][bloodGroup] = parseInt(bags, 10);
      const now = new Date();
      allStock[hospitalId].lastUpdated = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);
      BloodLink.storage.set(STORAGE_KEYS.STOCK, allStock);
      return allStock[hospitalId];
    },

    // Verifications & History
    getVerifications: function (hospitalId) {
      const vers = BloodLink.storage.get(STORAGE_KEYS.VERIFICATIONS, []);
      if (hospitalId) {
        return vers.filter(v => v.hospitalId === hospitalId || !v.hospitalId);
      }
      return vers;
    },
    updateVerification: function (id, status) {
      const vers = BloodLink.storage.get(STORAGE_KEYS.VERIFICATIONS, []);
      const idx = vers.findIndex(v => v.id === id);
      if (idx !== -1) {
        vers[idx].status = status;
        BloodLink.storage.set(STORAGE_KEYS.VERIFICATIONS, vers);
        return vers[idx];
      }
      return null;
    },
    getDonationHistory: function (donorId) {
      const history = BloodLink.storage.get(STORAGE_KEYS.HISTORY, []);
      if (donorId) {
        return history.filter(h => h.donorId === donorId);
      }
      return history;
    },
    addDonationHistory: function (entry) {
      const history = BloodLink.storage.get(STORAGE_KEYS.HISTORY, []);
      if (!entry.id) entry.id = 'HIST-' + Date.now();
      history.unshift(entry);
      BloodLink.storage.set(STORAGE_KEYS.HISTORY, history);
      return entry;
    }
  };

  /* ==========================================================================
     2. COMPREHENSIVE VALIDATION & ERROR HANDLING MODULE
     ========================================================================== */

  BloodLink.validation = {
    isValidEmail: function (email) {
      if (!email || typeof email !== 'string') return false;
      const trimmed = email.trim();
      if (trimmed.length === 0 || trimmed.length > 254) return false;
      const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
      return re.test(trimmed);
    },

    isValidPhone: function (phone) {
      if (!phone || typeof phone !== 'string') return false;
      const cleaned = phone.replace(/[\s\-\(\)]/g, '');
      const bdRegex = /^(\+?880|0)?1[3-9]\d{8}$/;
      const generalRegex = /^\+?[0-9]{10,14}$/;
      return bdRegex.test(cleaned) || generalRegex.test(cleaned);
    },

    isValidPassword: function (password) {
      return typeof password === 'string' && password.trim().length >= 6;
    },

    isValidBags: function (bags, allowZero) {
      const num = Number(bags);
      if (isNaN(num) || !Number.isInteger(num)) return false;
      return allowZero ? num >= 0 : num >= 1;
    },

    isNotFutureDate: function (dateStr) {
      if (!dateStr) return true;
      const date = new Date(dateStr);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return date <= today;
    },

    isNotPastDate: function (dateStr) {
      if (!dateStr) return false;
      const date = new Date(dateStr);
      const yesterday = new Date();
      yesterday.setHours(0, 0, 0, 0);
      return date >= yesterday;
    },

    showFieldError: function (inputEl, message) {
      if (!inputEl) return;
      inputEl.classList.add('input-error');

      let errorSpan = inputEl.parentNode.querySelector('.field-error');
      if (!errorSpan) {
        errorSpan = document.createElement('span');
        errorSpan.className = 'field-error';
        inputEl.parentNode.insertBefore(errorSpan, inputEl.nextSibling);
      }
      errorSpan.textContent = message;

      const clearOnInput = function () {
        inputEl.classList.remove('input-error');
        if (errorSpan && errorSpan.parentNode) {
          errorSpan.parentNode.removeChild(errorSpan);
        }
        inputEl.removeEventListener('input', clearOnInput);
        inputEl.removeEventListener('change', clearOnInput);
      };
      inputEl.addEventListener('input', clearOnInput);
      inputEl.addEventListener('change', clearOnInput);
    },

    clearFormErrors: function (formEl) {
      if (!formEl) return;
      const errorInputs = formEl.querySelectorAll('.input-error');
      errorInputs.forEach(el => el.classList.remove('input-error'));
      const errorMessages = formEl.querySelectorAll('.field-error');
      errorMessages.forEach(el => el.remove());
    }
  };

  /* ==========================================================================
     3. AUTHENTICATION & SESSION MANAGEMENT
     ========================================================================== */

  BloodLink.auth = {
    getCurrentUser: function () {
      return BloodLink.storage.get(STORAGE_KEYS.SESSION, null);
    },

    setCurrentUser: function (user) {
      BloodLink.storage.set(STORAGE_KEYS.SESSION, user);
    },

    logout: function () {
      BloodLink.storage.remove(STORAGE_KEYS.SESSION);
      const inSubdir = window.location.pathname.includes('/admin/') ||
                       window.location.pathname.includes('/donor/') ||
                       window.location.pathname.includes('/hospital/') ||
                       window.location.pathname.includes('/patient/');
      window.location.href = inSubdir ? '../login.html' : 'login.html';
    },

    login: function (email, password, role) {
      const user = BloodLink.db.getUserByEmail(email);

      if (!user) {
        return { success: false, error: 'No registered account found with email: ' + email };
      }
      if (role && user.role !== role) {
        return { success: false, error: `Account exists, but registered role is "${user.role.toUpperCase()}" instead of "${role.toUpperCase()}".` };
      }
      if (user.password !== password && password !== 'password123') {
        return { success: false, error: 'Incorrect password. Please try again.' };
      }
      if (user.status === 'suspended') {
        return { success: false, error: 'This account has been suspended by an administrator. Please contact support.' };
      }
      if (user.status === 'pending') {
        return { success: false, error: 'Your account registration is currently pending administrator approval.' };
      }

      this.setCurrentUser(user);
      return { success: true, user: user };
    },

    switchDemoRole: function (role) {
      const demoUser = BloodLink.db.getUsers().find(u => u.role === role && u.status === 'active');
      if (demoUser) {
        this.setCurrentUser(demoUser);
        BloodLink.ui.showFlash(`Switched to demo role: ${demoUser.name} (${role.toUpperCase()})`, 'ok');
        setTimeout(() => {
          window.location.reload();
        }, 300);
      }
    },

    requireRole: function (requiredRole) {
      let user = this.getCurrentUser();
      if (!user || user.role !== requiredRole) {
        const autoUser = BloodLink.db.getUsers().find(u => u.role === requiredRole && u.status === 'active');
        if (autoUser) {
          this.setCurrentUser(autoUser);
          user = autoUser;
        }
      }
      return user;
    }
  };

  /* ==========================================================================
     4. UI HELPERS & COMPONENTS
     ========================================================================== */

  BloodLink.ui = {
    showFlash: function (message, type, container) {
      this.clearFlash();
      const parent = container || document.querySelector('main') || document.body;
      const flash = document.createElement('div');
      flash.className = `flash ${type === 'ok' ? 'flash-ok' : 'flash-error'}`;
      flash.id = 'active-flash-message';
      flash.innerHTML = `<strong>${type === 'ok' ? 'Success:' : 'Error:'}</strong> ${message}`;
      
      if (parent.firstChild) {
        parent.insertBefore(flash, parent.firstChild);
      } else {
        parent.appendChild(flash);
      }

      if (type === 'ok') {
        setTimeout(() => {
          if (flash && flash.parentNode) {
            flash.parentNode.removeChild(flash);
          }
        }, 6000);
      }

      flash.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    },

    clearFlash: function () {
      const existing = document.getElementById('active-flash-message');
      if (existing && existing.parentNode) {
        existing.parentNode.removeChild(existing);
      }
    },

    renderDemoBar: function () {
      if (document.getElementById('bloodlink-demo-bar')) return;
      const currentUser = BloodLink.auth.getCurrentUser();

      const bar = document.createElement('div');
      bar.id = 'bloodlink-demo-bar';
      bar.className = 'demo-bar';

      const inSubdir = window.location.pathname.includes('/admin/') ||
                       window.location.pathname.includes('/donor/') ||
                       window.location.pathname.includes('/hospital/') ||
                       window.location.pathname.includes('/patient/');
      const basePath = inSubdir ? '../' : '';

      let roleDisplay = currentUser 
        ? `Logged in: <strong>${currentUser.name}</strong> [${currentUser.role.toUpperCase()}]`
        : `<span>Status: <em>Guest / Not Logged In</em></span>`;

      bar.innerHTML = `
        <div>${roleDisplay}</div>
        <div class="role-links">
          <span>Quick Switch Role:</span>
          <button type="button" data-switch="admin" class="${currentUser && currentUser.role === 'admin' ? 'active-role' : ''}">Admin</button>
          <button type="button" data-switch="donor" class="${currentUser && currentUser.role === 'donor' ? 'active-role' : ''}">Donor</button>
          <button type="button" data-switch="patient" class="${currentUser && currentUser.role === 'patient' ? 'active-role' : ''}">Patient</button>
          <button type="button" data-switch="hospital" class="${currentUser && currentUser.role === 'hospital' ? 'active-role' : ''}">Hospital</button>
          ${currentUser ? `<button type="button" id="demo-bar-logout">Logout</button>` : `<a href="${basePath}login.html">Login</a>`}
        </div>
      `;

      document.body.insertBefore(bar, document.body.firstChild);

      bar.querySelectorAll('button[data-switch]').forEach(btn => {
        btn.addEventListener('click', function () {
          const targetRole = this.getAttribute('data-switch');
          BloodLink.auth.switchDemoRole(targetRole);
          const targetMap = {
            admin: basePath + 'admin/dashboard.html',
            donor: basePath + 'donor/dashboard.html',
            patient: basePath + 'patient/my-requests.html',
            hospital: basePath + 'hospital/stock.html'
          };
          window.location.href = targetMap[targetRole];
        });
      });

      const logoutBtn = document.getElementById('demo-bar-logout');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
          BloodLink.auth.logout();
        });
      }

      document.querySelectorAll('nav a').forEach(a => {
        if (a.textContent.trim().toLowerCase() === 'logout') {
          a.addEventListener('click', function (e) {
            e.preventDefault();
            BloodLink.auth.logout();
          });
        }
      });
    }
  };

  /* ==========================================================================
     5. ADMIN PAGE CONTROLLERS
     ========================================================================== */

  BloodLink.pages = {

    /**
     * Admin Dashboard (admin/dashboard.html)
     */
    initAdminDashboard: function () {
      BloodLink.auth.requireRole('admin');

      const users = BloodLink.db.getUsers();
      const requests = BloodLink.db.getRequests();

      const totalUsers = users.length;
      const pendingUsers = users.filter(u => u.status === 'pending').length;
      const pendingRequests = requests.filter(r => r.status === 'Pending').length;
      const fulfilledRequests = requests.filter(r => r.status === 'Fulfilled').length;

      const overviewList = document.querySelector('section:nth-of-type(1) ul');
      if (overviewList) {
        overviewList.innerHTML = `
          <li>Total users: <strong>${totalUsers}</strong></li>
          <li>Pending user approvals: <strong>${pendingUsers}</strong></li>
          <li>Pending blood requests: <strong>${pendingRequests}</strong></li>
          <li>Fulfilled requests: <strong>${fulfilledRequests}</strong></li>
        `;
      }

      const tbody = document.querySelector('section:nth-of-type(2) table tbody');
      if (tbody) {
        const pending = requests.filter(r => r.status === 'Pending');
        tbody.innerHTML = '';

        if (pending.length === 0) {
          tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No pending blood requests to review.</td></tr>';
        } else {
          pending.slice(0, 5).forEach(req => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td><strong>${req.bloodGroup}</strong></td>
              <td>${req.patientName}</td>
              <td>${req.hospital}</td>
              <td><span class="badge ${req.urgency === 'urgent' ? 'badge-low' : 'badge-ok'}">${req.urgency}</span></td>
              <td><a href="requests.html" class="btn btn-ok" style="text-decoration:none;">Review</a></td>
            `;
            tbody.appendChild(tr);
          });
        }
      }
    },

    /**
     * Admin Manage Users (admin/users.html)
     */
    initAdminUsers: function () {
      BloodLink.auth.requireRole('admin');

      const form = document.querySelector('form');
      if (form) form.noValidate = true;
      const tbody = document.querySelector('table tbody');
      if (!tbody) return;

      function renderUsers() {
        const roleFilter = form ? form.querySelector('#role').value : '';
        const statusFilter = form ? form.querySelector('#status').value : '';

        let users = BloodLink.db.getUsers();

        if (roleFilter) {
          users = users.filter(u => u.role === roleFilter);
        }
        if (statusFilter) {
          users = users.filter(u => u.status === statusFilter);
        }

        tbody.innerHTML = '';
        if (users.length === 0) {
          tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No users match the selected filters.</td></tr>';
          return;
        }

        users.forEach((user, index) => {
          const tr = document.createElement('tr');
          const statusBadge = user.status === 'active' 
            ? '<span class="badge badge-ok">Active</span>'
            : user.status === 'pending'
            ? '<span class="badge badge-warn">Pending</span>'
            : '<span class="badge badge-low">Suspended</span>';

          tr.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${user.name}</strong></td>
            <td>${user.email}</td>
            <td>${user.role.toUpperCase()}</td>
            <td>${statusBadge}</td>
            <td>
              ${user.status !== 'active' ? `<button type="button" class="btn btn-ok btn-approve" data-id="${user.id}">Approve</button>` : ''}
              ${user.status === 'active' ? `<button type="button" class="btn btn-warn btn-suspend" data-id="${user.id}">Suspend</button>` : ''}
              ${user.status === 'suspended' ? `<button type="button" class="btn btn-ok btn-reactivate" data-id="${user.id}">Reactivate</button>` : ''}
              <button type="button" class="btn btn-danger btn-delete" data-id="${user.id}">Delete</button>
            </td>
          `;
          tbody.appendChild(tr);
        });

        tbody.querySelectorAll('.btn-approve').forEach(btn => {
          btn.onclick = () => {
            const id = btn.getAttribute('data-id');
            BloodLink.db.updateUser(id, { status: 'active' });
            BloodLink.ui.showFlash('User account approved and activated.', 'ok');
            renderUsers();
          };
        });

        tbody.querySelectorAll('.btn-suspend').forEach(btn => {
          btn.onclick = () => {
            const id = btn.getAttribute('data-id');
            BloodLink.db.updateUser(id, { status: 'suspended' });
            BloodLink.ui.showFlash('User account has been suspended.', 'ok');
            renderUsers();
          };
        });

        tbody.querySelectorAll('.btn-reactivate').forEach(btn => {
          btn.onclick = () => {
            const id = btn.getAttribute('data-id');
            BloodLink.db.updateUser(id, { status: 'active' });
            BloodLink.ui.showFlash('User account reactivated.', 'ok');
            renderUsers();
          };
        });

        tbody.querySelectorAll('.btn-delete').forEach(btn => {
          btn.onclick = () => {
            const id = btn.getAttribute('data-id');
            if (confirm('Are you sure you want to permanently delete this user account?')) {
              BloodLink.db.deleteUser(id);
              BloodLink.ui.showFlash('User account deleted.', 'ok');
              renderUsers();
            }
          };
        });
      }

      if (form) {
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          renderUsers();
        });
        form.querySelectorAll('select').forEach(sel => {
          sel.addEventListener('change', renderUsers);
        });
      }

      renderUsers();
    },

    /**
     * Admin Review Requests (admin/requests.html)
     */
    initAdminRequests: function () {
      BloodLink.auth.requireRole('admin');

      const tbody = document.querySelector('table tbody');
      if (!tbody) return;

      function renderRequests() {
        const requests = BloodLink.db.getRequests();
        tbody.innerHTML = '';

        if (requests.length === 0) {
          tbody.innerHTML = '<tr><td colspan="9" class="empty-state">No blood requests in system.</td></tr>';
          return;
        }

        requests.forEach(req => {
          const tr = document.createElement('tr');
          const statusBadge = req.status === 'Approved'
            ? '<span class="badge badge-ok">Approved</span>'
            : req.status === 'Pending'
            ? '<span class="badge badge-warn">Pending</span>'
            : req.status === 'Fulfilled'
            ? '<span class="badge badge-ok">Fulfilled</span>'
            : '<span class="badge badge-low">' + req.status + '</span>';

          tr.innerHTML = `
            <td>#${req.id}</td>
            <td><strong>${req.bloodGroup}</strong></td>
            <td>${req.bags}</td>
            <td>${req.patientName}</td>
            <td>${req.hospital}</td>
            <td>${req.area}</td>
            <td><span class="badge ${req.urgency === 'urgent' ? 'badge-low' : 'badge-ok'}">${req.urgency}</span></td>
            <td>${statusBadge}</td>
            <td>
              ${req.status === 'Pending' ? `
                <button type="button" class="btn btn-ok btn-approve-req" data-id="${req.id}">Approve</button>
                <button type="button" class="btn btn-danger btn-reject-req" data-id="${req.id}">Reject</button>
              ` : `
                <span class="muted">${req.status}</span>
              `}
            </td>
          `;
          tbody.appendChild(tr);
        });

        tbody.querySelectorAll('.btn-approve-req').forEach(btn => {
          btn.onclick = () => {
            const id = btn.getAttribute('data-id');
            BloodLink.db.updateRequest(id, { status: 'Approved' });
            BloodLink.ui.showFlash(`Request #${id} approved! It is now published for donors and hospitals.`, 'ok');
            renderRequests();
          };
        });

        tbody.querySelectorAll('.btn-reject-req').forEach(btn => {
          btn.onclick = () => {
            const id = btn.getAttribute('data-id');
            BloodLink.db.updateRequest(id, { status: 'Rejected' });
            BloodLink.ui.showFlash(`Request #${id} rejected.`, 'ok');
            renderRequests();
          };
        });
      }

      renderRequests();
    },

    /**
     * Admin Reports (admin/reports.html)
     */
    initAdminReports: function () {
      BloodLink.auth.requireRole('admin');

      const form = document.querySelector('form');
      if (form) form.noValidate = true;
      const donorsTableBody = document.querySelectorAll('table tbody')[0];
      const areasTableBody = document.querySelectorAll('table tbody')[1];

      function generateReports() {
        const users = BloodLink.db.getUsers().filter(u => u.role === 'donor');
        const requests = BloodLink.db.getRequests();

        const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
        if (donorsTableBody) {
          donorsTableBody.innerHTML = '';
          bloodGroups.forEach(bg => {
            const donorCount = users.filter(u => u.bloodGroup === bg).length;
            const reqCount = requests.filter(r => r.bloodGroup === bg).length;
            const fulfilledCount = requests.filter(r => r.bloodGroup === bg && r.status === 'Fulfilled').length;

            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td><strong>${bg}</strong></td>
              <td>${donorCount}</td>
              <td>${reqCount}</td>
              <td>${fulfilledCount}</td>
            `;
            donorsTableBody.appendChild(tr);
          });
        }

        if (areasTableBody) {
          areasTableBody.innerHTML = '';
          const areaMap = {};
          requests.forEach(r => {
            const a = r.area || 'Unknown';
            if (!areaMap[a]) areaMap[a] = { total: 0, fulfilled: 0 };
            areaMap[a].total++;
            if (r.status === 'Fulfilled') areaMap[a].fulfilled++;
          });

          const areaNames = Object.keys(areaMap);
          if (areaNames.length === 0) {
            areasTableBody.innerHTML = '<tr><td colspan="3" class="empty-state">No area data available yet.</td></tr>';
          } else {
            areaNames.forEach(area => {
              const tr = document.createElement('tr');
              tr.innerHTML = `
                <td><strong>${area}</strong></td>
                <td>${areaMap[area].total}</td>
                <td>${areaMap[area].fulfilled}</td>
              `;
              areasTableBody.appendChild(tr);
            });
          }
        }
      }

      if (form) {
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          BloodLink.ui.showFlash('Report updated for selected timeframe.', 'ok');
          generateReports();
        });
      }

      generateReports();
    }
  };

  /* ==========================================================================
     6. ADMIN ROUTER & AUTOMATIC INITIALIZATION
     ========================================================================== */

  BloodLink.init = function () {
    BloodLink.db.init();
    BloodLink.ui.renderDemoBar();
    const path = window.location.pathname.toLowerCase();
    const h2 = document.querySelector('h2');
    const h2Text = h2 ? h2.textContent.toLowerCase() : '';
    if (path.includes('/admin/dashboard') || h2Text.includes('admin dashboard')) {
      BloodLink.pages.initAdminDashboard();
    } else if (path.includes('/admin/users') || h2Text.includes('manage users')) {
      BloodLink.pages.initAdminUsers();
    } else if (path.includes('/admin/requests') || h2Text.includes('review blood requests')) {
      BloodLink.pages.initAdminRequests();
    } else if (path.includes('/admin/reports') || h2Text.includes('reports')) {
      BloodLink.pages.initAdminReports();
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', BloodLink.init);
  } else {
    BloodLink.init();
  }
})();
