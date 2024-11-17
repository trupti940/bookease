# **BookEase - Scheduling Application**

## **Introduction**
BookEase is a web-based scheduling application designed to streamline appointment bookings for professionals and businesses. It provides features such as setting availability, booking appointments, managing schedules, and notifications. With an intuitive dashboard and integrated calendar support, BookEase makes scheduling hassle-free.

## **Project Type**
Fullstack

## **Deployed App**
- **Frontend**: [https://bookease-frontend.example.com](#)

- **Database**: Firebase Realtime Database

## **Directory Structure**
BOOK-EASE/
├── .vscode/            # VSCode specific settings
├── assets/             # Static assets (images, icons, etc.)
├── components/         # HTML files for individual components
│   ├── availability.html
│   ├── book-appointment.html
│   ├── dashboard.html
│   ├── login.html
│   ├── my-appointments.html
│   ├── notification.html
│   ├── reports.html
│   ├── serviceDetail.html
│   ├── sign-up.html
├── css/                # CSS files for styling individual pages
│   ├── availability.css
│   ├── book-appointment.css
│   ├── dashboard.css
│   ├── home.css
│   ├── login.css
│   ├── my-appointments.css
│   ├── reports.css
│   ├── serviceDetail.css
│   ├── sign-up.css
│   ├── unique-dash.css
├── js/                 # JavaScript files for component behavior
│   ├── availability.js
│   ├── book-appointment.js
│   ├── dashboard.js
│   ├── logout.js
│   ├── login.js
│   ├── my-appointments.js
│   ├── notification.js
│   ├── reports.js
│   ├── serviceDetail.js
│   ├── sign-up.js
│   ├── unique-dash.js
├── index.html          # Main entry point for the application
├── README.md           # Documentation for the project


<!-- e html2pdf.js  -->



## **Video Walkthrough of the Project**
[Project Walkthrough Video](#)

## **Video Walkthrough of the Codebase**
[Codebase Walkthrough Video](#)

## **Features**
- User authentication (Signup, Login, Logout) using Firebase.
- Dynamic dashboard displaying key metrics: total appointments, income, notifications, and monthly stats.
- Responsive design using Bootstrap for mobile-friendliness.
- Booking appointment functionality with real-time updates.
- Notification management system for pending tasks.
- Calendar integration to visualize schedules.
- Export functionality for appointments in various formats (PDF, CSV).

## **Design Decisions or Assumptions**
- **Firebase** is used for authentication and real-time database needs.
- Bootstrap is utilized for UI responsiveness to reduce development time.
- Sidebar styling and layout consistency were emphasized for usability.
- Local storage is used to store user tokens for authentication state persistence.

## **Installation & Getting Started**
Follow these steps to install and run the project locally:

### Frontend Setup
```bash
cd BOOK-EASE
npm install
npm start

