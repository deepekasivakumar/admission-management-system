# Admission Management & CRM System

A comprehensive web-based system for colleges to manage admissions, configure quotas, allocate seats, and track student documents and fees.

## 🚀 Objective
Build a web-based Admission Management system that allows colleges to:
- Configure programs and quotas
- Manage applicants
- Allocate seats without quota violations
- Generate admission numbers
- Track documents and fees
- View basic dashboards

## 📂 Project Structure
- **/backend**: NestJS API with PostgreSQL & TypeORM.
- **/frontend**: React application with Vite & Vanilla CSS.

## 🛠️ Scope & Features
### 1. Master Setup
Admin can create:
- Institution, Campus, Department, Program / Branch, Academic Year
- Course Type (UG/PG), Entry Type (Regular/Lateral), Admission Mode (Govt/Management)

### 2. Seat Matrix & Quota
- Total intake management (e.g., 100)
- Quotas (KCET, COMEDK, Management)
- Real-time seat counter & allocation blocking

### 3. Applicant Management
- Application Form (< 15 fields)
- Document checklist status (Pending / Submitted / Verified)

### 4. Admission Allocation
- Government Flow (Allotment number, Quota selection)
- Management Flow (Manual applicant creation, Manual allocation)

### 5. Admission Confirmation
- Generated unique & immutable admission numbers (e.g., `INST/2026/UG/CSE/KCET/0001`)
- Confirmation only after fee is paid

### 6. Dashboards
- Total intake vs admitted
- Quota-wise filled seats
- Remaining seats
- Pending documents & fees

## 👤 User Roles
- **Admin**: Setup masters and configure quotas.
- **Admission Officer**: Create applicants, allocate seats, verify documents, and confirm admission.
- **Management (View Only)**: View dashboard status.

## ⚙️ Key System Rules
- Quota seats cannot exceed intake.
- No seat allocation if quota full.
- Admission number generated only once.
- Admission confirmed only if fee paid.
- Seat counters update in real time.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Vanilla CSS.
- **Backend**: NestJS, TypeORM, PostgreSQL.
- **Database**: Local SQL Database (Postgres recommended).

## 🚀 Getting Started
### Backend
1. `cd backend`
2. `npm install`
3. Configure `.env` with your local PostgreSQL credentials.
4. `npm run start:dev`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`
