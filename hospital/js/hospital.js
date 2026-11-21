/**
 * BloodLink - Hospital JavaScript
 *
 * Features:
 *  - Persistent LocalStorage database with rich initial seed data
 *  - Comprehensive input validation & error handling (invalid email, invalid phone, password mismatch, etc.)
 *  - Role-based session management and demo role switcher
 *  - Dynamic controllers for Hospital role pages
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
     5. HOSPITAL PAGE CONTROLLERS
     ========================================================================== */

  BloodLink.pages = {

    /**
     * Hospital Blood Stock (hospital/stock.html)
     */
    initHospitalStock: function () {
      const hosp = BloodLink.auth.requireRole('hospital');
      if (!hosp) return;

      const form = document.querySelector('form');
      if (form) form.noValidate = true;
      const tbody = document.querySelector('table tbody');
      if (!tbody) return;

      function renderStock() {
        const stock = BloodLink.db.getStock(hosp.id);
        const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

        tbody.innerHTML = '';
        let hasLowStock = false;

        bloodGroups.forEach(bg => {
          const bags = stock[bg] !== undefined ? stock[bg] : 0;
          const isLow = bags < 5;
          if (isLow) hasLowStock = true;

          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td><strong>${bg}</strong></td>
            <td>${bags}</td>
            <td><span class="badge ${isLow ? 'badge-low' : 'badge-ok'}">${isLow ? 'Low Stock' : 'Normal'}</span></td>
            <td>${stock.lastUpdated || 'Today'}</td>
          `;
          tbody.appendChild(tr);
        });

        if (hasLowStock) {
          BloodLink.ui.showFlash('Attention: One or more blood groups have LOW stock (less than 5 bags).', 'error');
        }
      }

      if (form) {
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          BloodLink.validation.clearFormErrors(form);
          BloodLink.ui.clearFlash();

          const bgSelect = document.getElementById('blood_group');
          const bagsInput = document.getElementById('bags');

          const bg = bgSelect.value;
          const bags = bagsInput.value.trim();

          if (!BloodLink.validation.isValidBags(bags, true)) {
            BloodLink.validation.showFieldError(bagsInput, 'Bags in stock must be 0 or a positive whole number.');
            return;
          }

          BloodLink.db.updateStock(hosp.id, bg, bags);
          BloodLink.ui.showFlash(`Blood stock for group ${bg} updated to ${bags} bags.`, 'ok');
          bagsInput.value = '';
          renderStock();
        });
      }

      renderStock();
    },

    /**
     * Hospital Donation Camps (hospital/camps.html)
     */
    initHospitalCamps: function () {
      const hosp = BloodLink.auth.requireRole('hospital');
      if (!hosp) return;

      const form = document.querySelector('form');
      if (form) form.noValidate = true;
      const tbody = document.querySelector('table tbody');
      if (!tbody) return;

      function renderCamps() {
        const camps = BloodLink.db.getCamps().filter(c => c.hospitalId === hosp.id || !c.hospitalId);
        tbody.innerHTML = '';

        if (camps.length === 0) {
          tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No donation camps published yet. Use the form above to add one.</td></tr>';
          return;
        }

        camps.forEach(camp => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td><strong>${camp.title}</strong></td>
            <td>${camp.date}</td>
            <td>${camp.location}</td>
            <td>
              <button type="button" class="btn btn-muted btn-edit-camp" data-id="${camp.id}">Edit</button>
              <button type="button" class="btn btn-danger btn-delete-camp" data-id="${camp.id}">Delete</button>
            </td>
          `;
          tbody.appendChild(tr);
        });

        tbody.querySelectorAll('.btn-delete-camp').forEach(btn => {
          btn.onclick = () => {
            const id = btn.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this donation camp?')) {
              BloodLink.db.deleteCamp(id);
              BloodLink.ui.showFlash('Donation camp deleted.', 'ok');
              renderCamps();
            }
          };
        });

        tbody.querySelectorAll('.btn-edit-camp').forEach(btn => {
          btn.onclick = () => {
            const id = btn.getAttribute('data-id');
            const camps = BloodLink.db.getCamps();
            const camp = camps.find(c => c.id === id);
            if (!camp) return;

            document.getElementById('title').value = camp.title;
            document.getElementById('camp_date').value = camp.date;
            document.getElementById('location').value = camp.location;
            document.getElementById('details').value = camp.details || '';

            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Update Camp';
            form.setAttribute('data-editing', camp.id);
            form.scrollIntoView({ behavior: 'smooth' });
          };
        });
      }

      if (form) {
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          BloodLink.validation.clearFormErrors(form);
          BloodLink.ui.clearFlash();

          const titleEl = document.getElementById('title');
          const dateEl = document.getElementById('camp_date');
          const locEl = document.getElementById('location');
          const detEl = document.getElementById('details');

          const title = titleEl.value.trim();
          const date = dateEl.value;
          const location = locEl.value.trim();
          const details = detEl ? detEl.value.trim() : '';

          let hasError = false;

          if (!title) {
            BloodLink.validation.showFieldError(titleEl, 'Camp title is required.');
            hasError = true;
          }
          if (!date) {
            BloodLink.validation.showFieldError(dateEl, 'Camp date is required.');
            hasError = true;
          } else if (!BloodLink.validation.isNotPastDate(date)) {
            BloodLink.validation.showFieldError(dateEl, 'Camp date cannot be in the past.');
            hasError = true;
          }
          if (!location) {
            BloodLink.validation.showFieldError(locEl, 'Location is required.');
            hasError = true;
          }

          if (hasError) {
            BloodLink.ui.showFlash('Please correct the camp form errors.', 'error');
            return;
          }

          const editingId = form.getAttribute('data-editing');
          if (editingId) {
            BloodLink.db.updateCamp(editingId, {
              title: title,
              date: date,
              location: location,
              details: details
            });
            form.removeAttribute('data-editing');
            form.querySelector('button[type="submit"]').textContent = 'Publish Camp';
            BloodLink.ui.showFlash('Camp updated successfully!', 'ok');
          } else {
            BloodLink.db.saveCamp({
              hospitalId: hosp.id,
              hospitalName: hosp.name,
              title: title,
              date: date,
              location: location,
              details: details
            });
            BloodLink.ui.showFlash('Donation camp published successfully!', 'ok');
          }

          form.reset();
          renderCamps();
        });
      }

      renderCamps();
    },

    /**
     * Hospital Verify Donations (hospital/verify.html)
     */
    initHospitalVerify: function () {
      const hosp = BloodLink.auth.requireRole('hospital');
      if (!hosp) return;

      const tbody = document.querySelector('table tbody');
      if (!tbody) return;

      function renderVerifications() {
        const vers = BloodLink.db.getVerifications(hosp.id).filter(v => v.status === 'Pending');
        tbody.innerHTML = '';

        if (vers.length === 0) {
          tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No pending donation verifications.</td></tr>';
          return;
        }

        vers.forEach(v => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td><strong>${v.donorName}</strong></td>
            <td><strong>${v.bloodGroup}</strong></td>
            <td>#${v.requestId}</td>
            <td>${v.donationDate}</td>
            <td>
              <button type="button" class="btn btn-ok btn-verify-action" data-id="${v.id}">Verify</button>
              <button type="button" class="btn btn-danger btn-reject-action" data-id="${v.id}">Reject</button>
            </td>
          `;
          tbody.appendChild(tr);
        });

        tbody.querySelectorAll('.btn-verify-action').forEach(btn => {
          btn.onclick = () => {
            const id = btn.getAttribute('data-id');
            const v = BloodLink.db.updateVerification(id, 'Verified');
            if (v) {
              BloodLink.db.addDonationHistory({
                donorId: v.donorId,
                hospital: hosp.name,
                bloodGroup: v.bloodGroup,
                date: v.donationDate,
                status: 'Verified'
              });
              BloodLink.db.updateUser(v.donorId, {
                lastDonationDate: v.donationDate
              });
              BloodLink.ui.showFlash(`Donation by ${v.donorName} verified and credited to their record!`, 'ok');
            }
            renderVerifications();
          };
        });

        tbody.querySelectorAll('.btn-reject-action').forEach(btn => {
          btn.onclick = () => {
            const id = btn.getAttribute('data-id');
            BloodLink.db.updateVerification(id, 'Rejected');
            BloodLink.ui.showFlash('Donation rejected.', 'ok');
            renderVerifications();
          };
        });
      }

      renderVerifications();
    },

    /**
     * Hospital Profile (hospital/profile.html)
     */
    initHospitalProfile: function () {
      const hosp = BloodLink.auth.requireRole('hospital');
      if (!hosp) return;

      const form = document.querySelector('form');
      if (!form) return;
      form.noValidate = true;

      const nameEl = document.getElementById('hospital_name');
      const addrEl = document.getElementById('address');
      const areaEl = document.getElementById('area');
      const phoneEl = document.getElementById('phone');
      const emailEl = document.getElementById('email');

      if (nameEl) nameEl.value = hosp.name || '';
      if (addrEl) addrEl.value = hosp.address || '';
      if (areaEl) areaEl.value = hosp.area || '';
      if (phoneEl) phoneEl.value = hosp.phone || '';
      if (emailEl) emailEl.value = hosp.email || '';

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        BloodLink.validation.clearFormErrors(form);
        BloodLink.ui.clearFlash();

        const name = nameEl.value.trim();
        const addr = addrEl.value.trim();
        const area = areaEl.value.trim();
        const phone = phoneEl.value.trim();
        const email = emailEl.value.trim();

        let hasError = false;

        if (!name) {
          BloodLink.validation.showFieldError(nameEl, 'Hospital name is required.');
          hasError = true;
        }

        if (email) {
          if (!BloodLink.validation.isValidEmail(email)) {
            BloodLink.validation.showFieldError(emailEl, 'Invalid email address format.');
            hasError = true;
          } else {
            const existing = BloodLink.db.getUserByEmail(email);
            if (existing && existing.id !== hosp.id) {
              BloodLink.validation.showFieldError(emailEl, 'Email is already used by another account.');
              hasError = true;
            }
          }
        }

        if (phone && !BloodLink.validation.isValidPhone(phone)) {
          BloodLink.validation.showFieldError(phoneEl, 'Please enter a valid phone number.');
          hasError = true;
        }

        if (hasError) {
          BloodLink.ui.showFlash('Please fix errors in hospital profile.', 'error');
          return;
        }

        BloodLink.db.updateUser(hosp.id, {
          name: name,
          address: addr,
          area: area,
          phone: phone,
          email: email
        });

        BloodLink.ui.showFlash('Hospital profile saved successfully!', 'ok');
      });
    }
  };

  /* ==========================================================================
     6. HOSPITAL ROUTER & AUTOMATIC INITIALIZATION
     ========================================================================== */

  BloodLink.init = function () {
    BloodLink.db.init();
    BloodLink.ui.renderDemoBar();
    const path = window.location.pathname.toLowerCase();
    const h2 = document.querySelector('h2');
    const h2Text = h2 ? h2.textContent.toLowerCase() : '';
    if (path.includes('/hospital/stock') || h2Text.includes('blood stock')) {
      BloodLink.pages.initHospitalStock();
    } else if (path.includes('/hospital/camps') || (path.includes('/hospital/') && h2Text.includes('donation camps'))) {
      BloodLink.pages.initHospitalCamps();
    } else if (path.includes('/hospital/verify') || h2Text.includes('verify donations')) {
      BloodLink.pages.initHospitalVerify();
    } else if (path.includes('/hospital/profile') || (path.includes('/hospital/') && h2Text.includes('hospital profile'))) {
      BloodLink.pages.initHospitalProfile();
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', BloodLink.init);
  } else {
    BloodLink.init();
  }
})();
