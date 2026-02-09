# Student Management System - User Flow Guide

## Main Dashboard (Default View)

```
┌─────────────────────────────────────────────────────────┐
│  Student Directory         + Register New Student       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Student  │  │ Student  │  │ Student  │  ...       │
│  │   Card   │  │   Card   │  │   Card   │             │
│  │          │  │          │  │          │             │
│  │ Name     │  │ Name     │  │ Name     │             │
│  │ Email    │  │ Email    │  │ Email    │             │
│  │ Contact  │  │ Contact  │  │ Contact  │             │
│  │ DOB      │  │ DOB      │  │ DOB      │             │
│  │ Faculty  │  │ Faculty  │  │ Faculty  │             │
│  │ Program  │  │ Program  │  │ Program  │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Card Hover State (Shows Action Buttons)

```
  ┌──────────────────────┐
  │ Student Name         │
  │ email@example.com    │ ← Hover here
  │ +977-1234567890      │
  │ 2000-01-15           │
  │ Engineering          │
  │ Computer Science     │
  ├──────────────────────┤
  │ 👁️ View Details      │ ← Animated in on hover
  │ ✏️ Edit             │
  │ 🗑️ Delete           │
  └──────────────────────┘
```

## User Interactions & Flows

### 1. **VIEW STUDENT LIST** (Default on app load)
- App opens → StudentList fetches all students → Display cards

### 2. **REGISTER NEW STUDENT**
```
User clicks "+ Register New Student"
    ↓
RegistrationModal opens with empty form
    ↓
User fills 7-step form
    ↓
User clicks "Submit"
    ↓
Form validates and submits to backend
    ↓
Success → Modal closes, List refreshes
```

### 3. **VIEW STUDENT DETAILS**
```
User hovers on card → "View Details" button appears
    ↓
User clicks "View Details"
    ↓
StudentDetailsModal opens
    ↓
Modal fetches student data from backend
    ↓
Display all information in organized sections:
  - Personal Information
  - Contact Information
  - Address
  - Academic Information
    ↓
User clicks "Close" or clicks overlay
    ↓
Modal closes
```

### 4. **EDIT STUDENT**
```
User hovers on card → "Edit" button appears
    ↓
User clicks "Edit"
    ↓
RegistrationModal opens with editingPid set
    ↓
Form should pre-fill with student data (optional)
    ↓
User modifies data
    ↓
User clicks "Submit"
    ↓
Form submits UPDATE request to backend
    ↓
Success → Modal closes, List refreshes with updated data
```

### 5. **DELETE STUDENT**
```
User hovers on card → "Delete" button appears
    ↓
User clicks "Delete"
    ↓
Confirmation dialog appears:
"Are you sure you want to delete [Student Name]?"
    ↓
If Yes:
  ↓
  DELETE request sent to `/api/student/{pid}`
  ↓
  Success → "Student deleted successfully" alert
  ↓
  List refreshes (deleted student removed)
  
If No:
  ↓
  Dialog closes, no action taken
```

## Component Hierarchy

```
App.tsx
├── StudentList
│   ├── Fetch: GET /api/student/all
│   └── Card Components
│       └── Hover Action Buttons
│           ├── View Details → StudentDetailsModal
│           ├── Edit → RegistrationModal with editingPid
│           └── Delete → Confirmation → DELETE request
│
├── RegistrationModal
│   └── EnrollmentForm (7-step)
│       └── Submit → POST/PUT /api/student/register
│
└── StudentDetailsModal
    └── Fetch: GET /api/student/{pid}
        └── Display all sections
```

## API Calls Mapped to User Actions

| User Action | HTTP Method | Endpoint | Data |
|---|---|---|---|
| Load list | GET | `/api/student/all` | None |
| View details | GET | `/api/student/{pid}` | PID |
| Register new | POST | `/api/student/register` | CompleteRequestDTO |
| Edit student | PUT | `/api/student/{pid}` | CompleteRequestDTO |
| Delete | DELETE | `/api/student/{pid}` | PID |

## Styling & Colors

- **Primary Gradient**: Purple (#667eea → #764ba2)
- **Accent Gradient**: Pink/Red (#f093fb → #f5576c)
- **View Details Button**: Blue (#667eea)
- **Edit Button**: Green (#48bb78)
- **Delete Button**: Red (#f56565)
- **Card Background**: White (#ffffff)
- **Text**: Dark gray (#333333)
- **Secondary Text**: Medium gray (#666666)

## Responsive Breakpoints

- **Desktop**: Grid of cards (auto-fill, 320px min)
- **Tablet**: 2-3 columns
- **Mobile**: Single column, buttons always visible

## Features Implemented

✅ Student list with card layout
✅ Hover-activated action buttons
✅ View full student details
✅ Edit student information
✅ Delete student with confirmation
✅ Register new student
✅ Modal-based forms
✅ Responsive design
✅ Loading states
✅ Error handling
✅ Success/failure alerts
✅ Data refresh after actions
