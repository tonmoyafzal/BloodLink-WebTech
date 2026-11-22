 BloodLink - Blood Donor Finder Web Application

Course Project: Blood Donor Finder (BloodLink)  
Institution: American International University-Bangladesh (AIUB)  
Technologies:** HTML5, CSS3, Vanilla JavaScript (ES6+), LocalStorage Database  

---
 🩸 Project Overview

BloodLink is a web-based platform designed to connect blood donors, patients, and partner hospitals or blood banks in one place. It aims to make finding and arranging blood donations faster and easier, especially during medical emergencies. The system provides separate access for administrators, donors, patients, and hospitals, with features designed for each role.

Blood requests are reviewed and approved by an administrator before being shared with donors and hospitals. Registered donors can respond to matching requests, while patients can search for available donors and contact them directly. Hospitals can manage their blood stock, receive low-stock alerts, publish upcoming donation camps, and verify completed donations. The platform also includes donor history tracking, request management, user management, and reports to help administrators monitor overall activities.

The project is organized into separate HTML, CSS, and JavaScript files, with dedicated modules for the admin, donor, hospital, and patient sections. It also includes a public landing page, login and registration pages, and a donation camps page. Form validation and error handling are implemented to ensure accurate information and provide a smooth user experience.

---
 📁 Project Structure

```text
BloodLink
│
├── Blood_Donor_Finder_BloodLink_Proposal-1.pdf   # Project Proposal & Specification
├── README.md                                     # System Documentation & Testing Guide
├── index.html                                    # Public Landing Page & Statistics
├── login.html                                    # Role-based Login with Quick-Fill Demo
├── register.html                                 # Registration with Dynamic Donor Fields
├── camps.html                                    # Public Upcoming Donation Camps
├── style.css                                     # Core Stylesheet (Flat & Minimal Red Accent)
│
├── css
│   └── style.css                                 # Stylesheet copy for relative paths
│
├── js
│   ├── app.js                                    # Core Application Logic, Database & Controllers
│   └── main.js                                   # Application Entry point mirror
│
├── admin                                         # Admin Role Module
│   ├── dashboard.html                            # System Overview & Latest Pending Requests
│   ├── users.html                                # Manage, Filter, Approve, Suspend, Delete Users
│   ├── requests.html                             # Review, Approve & Reject Blood Requests
│   └── reports.html                              # Statistics by Blood Group & Area with Date Filter
│
├── donor                                         # Donor Role Module
│   ├── dashboard.html                            # Donor Overview, Availability & Stats
│   ├── profile.html                              # Edit Profile & Toggle Donation Availability
│   ├── requests.html                             # Matching Requests & "I Can Donate" Action
│   └── history.html                              # Verified Donation Records & Last Date
│
├── hospital                                      # Hospital / Blood Bank Module
│   ├── stock.html                                # Blood Stock Tracker with Low-Stock Indication
│   ├── camps.html                                # Create, Edit, Publish & Delete Donation Camps
│   ├── verify.html                               # Verify Completed Donations & Credit Donors
│   └── profile.html                              # Hospital Contact & Address Management
│
└── patient                                       # Patient / Requester Module
    ├── post-request.html                         # Post Urgent Blood Request (Pending Admin Review)
    ├── search-donors.html                        # Filter Available Donors by Blood Group & Area
    ├── my-requests.html                          # Track Request Status, Edit, Cancel & Fulfill
    └── responses.html                            # View Responding Donors with Click-to-Call
```

🛡️ Input Validation & Error Handling Implementation

All user input is checked with client-side validation logic and real-time visual feedback:

1. Email Validation (`BloodLink.validation.isValidEmail`):
   - Uses RFC 5322 regex (`/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/`).
   - Rejects: Missing `@`, missing domain, spaces, missing top-level domain (`.com`, `.org`), invalid characters.
   - User feedback: Highlights field in red (`.input-error`), displays inline `<span class="field-error">Invalid email address format (e.g. name@example.com).</span>`, and displays top flash banner.
   - Clears automatically as soon as the user starts correcting the field.
   - Checks for duplicate emails during registration (`An account with this email address already exists`).

2. Phone Number Validation (`BloodLink.validation.isValidPhone`):
   - Validates Bangladesh format (`01XXXXXXXXX` or `+8801XXXXXXXXX`) and standard 10–14 digit international formats.
   - Rejects non-numeric characters and phone numbers shorter than 11 digits.

3. Password Security & Matching:
   - Minimum 6 characters required.
   - Confirms password equality (`Passwords do not match`).

4. Logical Quantity Validation (`BloodLink.validation.isValidBags`):
   - Blood request bags needed must be an integer >= 1.
   - Hospital blood stock bags must be an integer >= 0.

5. Date Constraint Checks:
   - Last donation date**: Cannot be set to a future date.
   - Camp date: Cannot be set to a past date.

6. Suspended & Inactive Account Handling:
   - Suspended accounts cannot log in; displays error: *"This account has been suspended by an administrator."
   - Pending registrations display: *"Your account registration is currently pending administrator approval."

---
 🚀 How to Run

1. Open `BloodLink/index.html` or `BloodLink/login.html` directly in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
2. No Node.js, server, or build step is required — the system runs on pure HTML5, CSS3, and Vanilla JavaScript with `localStorage`.
3. If using VS Code, you can also right-click `index.html` and click **"Open with Live Server"**.
