# Visual Architecture & Diagrams

## Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        App.tsx                              │
│                   (Main Dashboard)                          │
│  - State management for modals                              │
│  - Event handlers                                           │
└──────────────┬──────────────┬────────────────┬──────────────┘
               │              │                │
        ┌──────▼──────┐ ┌────▼─────────┐ ┌───▼──────────────┐
        │ StudentList  │ │Registration  │ │StudentDetails    │
        │             │ │   Modal      │ │     Modal        │
        │ - Fetch all │ │              │ │                  │
        │ - Display   │ │- EnrollmentF │ │- Fetch by PID   │
        │   cards     │ │  orm         │ │- Display info   │
        │ - Actions   │ │- New/Edit    │ │- Organized      │
        │ - Delete    │ │  support     │ │  sections       │
        └──────┬──────┘ └────┬─────────┘ └───┬──────────────┘
               │              │                │
               └──────────────┼────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  API Services     │
                    │                   │
                    │ studentListApi.ts │
                    │ studentApi.ts     │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼──────────┐
                    │  ASP.NET Core API  │
                    │                    │
                    │ GET /student/all   │
                    │ GET /student/{pid} │
                    │ POST /register     │
                    │ PUT /{pid}         │
                    │ DELETE /{pid}      │
                    └────────────────────┘
```

## Data Flow - View Student List

```
┌─────────┐
│  App    │ (mount)
└────┬────┘
     │
     ├──> StudentList (useEffect)
     │        │
     │        ├──> getAllStudents()
     │        │       │
     │        │       ├──> fetch GET /api/student/all
     │        │       │
     │        │       └──> Response: StudentListItem[]
     │        │
     │        └──> setStudents(data)
     │
     └──> Render: Card Grid
          - Display student info
          - Add hover listeners
```

## User Interaction - View Details

```
User hovers on card
        │
        └──> CSS: .card-actions opacity changes
             Buttons become visible
                    │
                    └──> User clicks "View Details"
                             │
                             └──> handleViewDetails(pid)
                                      │
                                      ├──> setSelectedStudentPid(pid)
                                      ├──> setShowDetailsModal(true)
                                      │
                                      └──> StudentDetailsModal renders
                                           │
                                           ├──> getStudentDetails(pid)
                                           │    │
                                           │    └──> fetch GET /api/student/{pid}
                                           │         │
                                           │         └──> Display in modal
                                           │
                                           └──> User clicks "Close"
                                                │
                                                └──> onClose()
                                                     │
                                                     ├──> setShowDetailsModal(false)
                                                     └──> setSelectedStudentPid(null)
```

## Edit Student Flow

```
User clicks "Edit"
     │
     └──> handleEditClick(pid)
          │
          ├──> setEditingPid(pid)
          ├──> setShowRegistrationModal(true)
          │
          └──> RegistrationModal renders
               │
               └──> EnrollmentForm
                    │
                    ├──> editingPid prop is set
                    │
                    ├──> (Optional: Pre-fill form with student data)
                    │
                    └──> User fills form
                         │
                         └──> Click Submit
                              │
                              ├──> submitStudentEnrollment(formData)
                              │    │
                              │    ├──> POST /register (new) or
                              │    │    PUT /{pid} (edit)
                              │    │
                              │    └──> Success
                              │
                              ├──> onSuccess() callback
                              │    │
                              │    ├──> handleFormSuccess()
                              │    └──> setRefreshTrigger()
                              │
                              ├──> onClose()
                              │    │
                              │    ├──> setShowRegistrationModal(false)
                              │    └──> setEditingPid(null)
                              │
                              └──> StudentList refreshes
                                   └──> Shows updated data
```

## Delete Flow

```
User clicks "Delete"
     │
     └──> handleDelete()
          │
          ├──> Confirmation: "Delete [Name]?"
          │    │
          │    ├──> Yes ──────┐
          │    │              │
          │    └──> No ────┐  │
          │               │  │
          │        (cancel)│ │
          │               │  │
          │               │  └──> deleteStudent(pid)
          │               │       │
          │               │       ├──> fetch DELETE /api/student/{pid}
          │               │       │
          │               │       └──> Success alert
          │               │
          │               ├──> fetchStudents()
          │               │    │
          │               │    └──> GET /api/student/all
          │               │
          │               └──> onRefresh()
          │                    │
          │                    └──> setRefreshTrigger()
          │
          └──> List refreshes (deleted student gone)
```

## Component Communication

```
App.tsx
  │
  ├─ Props ─────────────┐
  │                     │
  │  StudentList        RegistrationModal        StudentDetailsModal
  │  ├─ onRegisterClick │  ├─ isOpen            ├─ isOpen
  │  ├─ onEditClick     │  ├─ onClose           ├─ onClose
  │  ├─ onViewDetails   │  ├─ onSuccess         ├─ pid
  │  └─ onRefresh       │  └─ editingPid        └─ (displays)
  │
  └─ Callbacks ──────────────────────────────────┐
     handleRegisterClick()    (← StudentList)
     handleEditClick()        (← StudentList)
     handleViewDetails()      (← StudentList)
     handleFormSuccess()      (← RegistrationModal)
```

## API Response Flow

```
Frontend Request
     │
     └──> HTTP Method to Backend
          │
          ├─ GET /api/student/all
          │  └──> List[StudentListItem]
          │
          ├─ GET /api/student/{pid}
          │  └──> StudentDetail
          │
          ├─ POST /api/student/register
          │  └──> Success/Error
          │
          ├─ PUT /api/student/{pid}
          │  └──> Success/Error
          │
          └─ DELETE /api/student/{pid}
             └──> Success/Error
```

## CSS Styling Layers

```
Base Styles
  │
  ├─ form.css                (Form general)
  ├─ formFields.css          (Form inputs)
  ├─ addressFields.css       (Address section)
  ├─ parentGuardianFields.css (Guardian section)
  ├─ academicFields.css      (Academic section)
  ├─ extracurricularFields.css (Extracurricular)
  ├─ declarationFields.css   (Declaration)
  │
  └─ NEW STYLES (Dashboard specific)
     │
     ├─ StudentList.css      (Card grid, hover effects)
     ├─ Modal.css            (Modal dialogs, animations)
     └─ StudentDetails.css   (Details modal layout)
```

## State Management Tree

```
App (Main state container)
  │
  ├─ showRegistrationModal (boolean)
  │  └─ Controls: RegistrationModal visibility
  │
  ├─ showDetailsModal (boolean)
  │  └─ Controls: StudentDetailsModal visibility
  │
  ├─ selectedStudentPid (string | null)
  │  └─ Controls: Which student's details shown
  │
  ├─ editingPid (string | null)
  │  └─ Controls: Edit mode in RegistrationModal
  │
  └─ refreshTrigger (number)
     └─ Triggers: StudentList data refresh
```

## Network Timing Diagram

```
User Opens App
  │
  ├─ StudentList mounts
  │  │
  │  └─ fetch GET /api/student/all  ───────────────┐
  │                                                  │
  │  (Show loading...)                              │
  │                                                  │
  │  <────────── Response (students[]) ────────────┘
  │
  └─ Render card grid
```

## Mobile Responsive Flow

```
Desktop (1200px+)
  │
  └─ Grid: auto-fill, minmax(320px, 1fr)
     └─ 3-4 columns, buttons hidden until hover

Tablet (768px)
  │
  └─ Grid: minmax(320px, 1fr)
     └─ 2 columns, buttons hidden until hover

Mobile (<768px)
  │
  └─ Grid: 1fr
     └─ 1 column, buttons always visible
        (Stacked vertically)
```

## Error Handling Flow

```
API Call
  │
  ├─ Success (200, 201)
  │  │
  │  ├─ Data returned
  │  ├─ State updated
  │  └─ UI refreshed
  │
  └─ Error (404, 500, network)
     │
     ├─ catch(error)
     ├─ console.error()
     ├─ return user-friendly message
     └─ Show alert or error message
```

## Loading States

```
Initial Load
  │
  ├─ loading = true
  │  │
  │  └─ Show: "Loading students..."
  │
  ├─ API call completes
  │  │
  │  └─ loading = false
  │
  └─ Render: Cards or "No students"
```

---

All diagrams show the complete flow and architecture of the student management system.
