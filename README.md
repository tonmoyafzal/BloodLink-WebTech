 BloodLink - Blood Donor Finder Web Application

**Course Project:** Blood Donor Finder (BloodLink)  
**Institution:** American International University-Bangladesh (AIUB)  
**Technologies:** HTML5, CSS3, Vanilla JavaScript (ES6+), LocalStorage Database  

---
 🩸 Project Overview

BloodLink is a web-based platform that connects blood donors, patients, and partner hospitals/blood banks in one place. In medical emergencies, finding compatible blood donors quickly is a matter of life and death. BloodLink solves this by offering:
- **Role-Based Access Control (RBAC)** across 4 user roles: **Admin**, **Donor**, **Patient / Requester**, and **Hospital / Blood Bank**.
- **Admin Verification Gatekeeping**: Every blood request is reviewed and approved by an administrator before becoming publicly visible to donors and hospitals.
- **Urgent Matching & Click-to-Call**: Registered donors with matching blood groups and locations are notified and can respond with one click ("I can donate"), while patients can instantly call donors.
- **Hospital Blood Stock Management & Low-Stock Alerts**: Real-time tracking of blood units with automatic warnings when reserves fall below safety thresholds (< 5 bags).
- **Donation Camps & Verified History**: Hospitals can publish upcoming voluntary donation camps and verify completed donations, updating donor records.
- **Robust Client-Side Validation & Error Handling**: Comprehensive validation on all forms, specifically invalid email detection, phone number validation, password strength/matching, positive quantity checks, and past/future date constraints.

---
 📁 Project Structure

```text
BloodLink/
│
├── Blood_Donor_Finder_BloodLink_Proposal-1.pdf   # Project Proposal & Specification
├── README.md                                     # System Documentation & Testing Guide
├── index.html                                    # Public Landing Page & Statistics
├── login.html                                    # Role-based Login with Quick-Fill Demo
├── register.html                                 # Registration with Dynamic Donor Fields
├── camps.html                                    # Public Upcoming Donation Camps
├── style.css                                     # Core Stylesheet (Flat & Minimal Red Accent)
│
├── css/
│   └── style.css                                 # Stylesheet copy for relative paths
│
├── js/
│   ├── app.js                                    # Core Application Logic, Database & Controllers
│   └── main.js                                   # Application Entry point mirror
│
├── admin/                                        # Admin Role Module
│   ├── dashboard.html                            # System Overview & Latest Pending Requests
│   ├── users.html                                # Manage, Filter, Approve, Suspend, Delete Users
│   ├── requests.html                             # Review, Approve & Reject Blood Requests
│   └── reports.html                              # Statistics by Blood Group & Area with Date Filter
│
├── donor/                                        # Donor Role Module
│   ├── dashboard.html                            # Donor Overview, Availability & Stats
│   ├── profile.html                              # Edit Profile & Toggle Donation Availability
│   ├── requests.html                             # Matching Requests & "I Can Donate" Action
│   └── history.html                              # Verified Donation Records & Last Date
│
├── hospital/                                     # Hospital / Blood Bank Module
│   ├── stock.html                                # Blood Stock Tracker with Low-Stock Indication
│   ├── camps.html                                # Create, Edit, Publish & Delete Donation Camps
│   ├── verify.html                               # Verify Completed Donations & Credit Donors
│   └── profile.html                              # Hospital Contact & Address Management
│
└── patient/                                      # Patient / Requester Module
    ├── post-request.html                         # Post Urgent Blood Request (Pending Admin Review)
    ├── search-donors.html                        # Filter Available Donors by Blood Group & Area
    ├── my-requests.html                          # Track Request Status, Edit, Cancel & Fulfill
    └── responses.html                            # View Responding Donors with Click-to-Call
```

🛡️ Input Validation & Error Handling Implementation

All user input is checked with client-side validation logic and real-time visual feedback:

1. **Email Validation (`BloodLink.validation.isValidEmail`)**:
   - Uses RFC 5322 regex (`/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/`).
   - Rejects: Missing `@`, missing domain, spaces, missing top-level domain (`.com`, `.org`), invalid characters.
   - User feedback: Highlights field in red (`.input-error`), displays inline `<span class="field-error">Invalid email address format (e.g. name@example.com).</span>`, and displays top flash banner.
   - Clears automatically as soon as the user starts correcting the field.
   - Checks for duplicate emails during registration (`An account with this email address already exists`).

2. **Phone Number Validation (`BloodLink.validation.isValidPhone`)**:
   - Validates Bangladesh format (`01XXXXXXXXX` or `+8801XXXXXXXXX`) and standard 10–14 digit international formats.
   - Rejects non-numeric characters and phone numbers shorter than 11 digits.

3. **Password Security & Matching**:
   - Minimum 6 characters required.
   - Confirms password equality (`Passwords do not match`).

4. **Logical Quantity Validation (`BloodLink.validation.isValidBags`)**:
   - Blood request bags needed must be an integer >= 1.
   - Hospital blood stock bags must be an integer >= 0.

5. **Date Constraint Checks**:
   - **Last donation date**: Cannot be set to a future date.
   - **Camp date**: Cannot be set to a past date.

6. **Suspended & Inactive Account Handling**:
   - Suspended accounts cannot log in; displays error: *"This account has been suspended by an administrator."*
   - Pending registrations display: *"Your account registration is currently pending administrator approval."*

---
 🚀 How to Run

1. Open `BloodLink/index.html` or `BloodLink/login.html` directly in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
2. No Node.js, server, or build step is required — the system runs on pure HTML5, CSS3, and Vanilla JavaScript with `localStorage`.
3. If using VS Code, you can also right-click `index.html` and click **"Open with Live Server"**.
