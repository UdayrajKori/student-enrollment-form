# Testing & Setup Instructions

## Prerequisites

Make sure you have:
- Backend running on `https://localhost:7257`
- Frontend dependencies installed
- API endpoints configured correctly

## Running the Application

### Start the Backend (StudentRegistrationForm)
```bash
cd StudentRegistrationForm
dotnet run
# Backend will run on https://localhost:7257
```

### Start the Frontend (student-enrollment-form)
```bash
cd student-enrollment-form
npm install  # if needed
npm run dev
# Frontend will open on http://localhost:5173
```

## Testing the Features

### 1. Test Student List Display ✅
**Steps:**
1. Open http://localhost:5173 in your browser
2. You should see the Student Directory page with list of cards
3. Each card should show: Name, Email, Contact, DOB, Faculty, Program

**Expected Result:**
- Cards are displayed in a responsive grid
- If no students exist, message "No students found" appears
- Loading state shows briefly while fetching

### 2. Test View Details ✅
**Steps:**
1. Hover over any student card
2. "View Details" button appears
3. Click "View Details"
4. StudentDetailsModal opens

**Expected Result:**
- Modal shows complete student information
- Organized in sections (Personal, Contact, Address, Academic)
- All fields are properly formatted and displayed
- "Close" button works correctly

### 3. Test Register New Student ✅
**Steps:**
1. Click "+ Register New Student" button
2. RegistrationModal opens with empty form
3. Fill in all required fields (7 steps)
4. Click "Submit" on final step

**Expected Result:**
- Form validates all required fields
- Success alert shows "Student registered successfully"
- Modal closes
- New student appears in list
- Student is created in database

### 4. Test Edit Student ✅
**Steps:**
1. Hover over any student card
2. Click "Edit" button
3. RegistrationModal opens
4. Modify some fields (optional: backend can pre-fill data)
5. Click "Submit"

**Expected Result:**
- Form opens for editing
- Changes are sent to backend
- Success message shows "Student updated successfully"
- Modal closes
- List refreshes with updated information

### 5. Test Delete Student ✅
**Steps:**
1. Hover over any student card
2. Click "Delete" button
3. Confirmation dialog appears
4. Click "OK" to confirm deletion

**Expected Result:**
- Confirmation dialog shows with student name
- DELETE request sent to backend
- Success alert: "Student deleted successfully"
- List refreshes
- Deleted student is no longer in the list
- If you click "Cancel", nothing happens

### 6. Test Responsive Design ✅
**Steps:**
1. Resize browser window to mobile size (e.g., 375px width)
2. Open Developer Tools (F12) and select responsive device
3. Test on different device sizes (iPhone, iPad, etc.)

**Expected Result:**
- Cards stack in single column on mobile
- Action buttons are always visible on mobile
- Register button is visible and clickable
- Modal is properly sized for smaller screens
- No horizontal scrolling

### 7. Test Error Handling ✅
**Steps:**
1. Stop the backend server
2. Try to load the list or open a modal
3. Observe error messages

**Expected Result:**
- Error messages are displayed gracefully
- User can understand what went wrong
- Application doesn't crash

## Common Issues & Solutions

### Issue: Buttons not appearing on hover
**Solution:** 
- Check CSS file `StudentList.css` is loaded
- Verify `.card-actions` has opacity/max-height transition
- Check browser zoom level

### Issue: Modal doesn't open
**Solution:**
- Check console for JavaScript errors
- Verify component imports are correct
- Check `isOpen` state management in App.tsx

### Issue: Student list is empty
**Solution:**
- Verify backend is running
- Check API endpoint is correct in `config.ts`
- Check CORS is configured on backend
- Open browser DevTools → Network tab to see API requests

### Issue: "Failed to fetch students" error
**Solution:**
- Ensure backend is running on https://localhost:7257
- Check CORS configuration in Program.cs
- Verify API endpoint `/api/student/all` exists
- Check network connectivity

### Issue: Delete not working
**Solution:**
- Verify DELETE endpoint exists on backend
- Check student PID is correct
- Confirm CORS allows DELETE method
- Check browser console for detailed errors

## Database Verification

To verify students are being created in the database:
1. Open SQL Server Management Studio
2. Connect to your database
3. Run:
   ```sql
   SELECT TOP 10 * FROM Students 
   ORDER BY CreatedDate DESC
   ```
4. You should see newly registered students

## Performance Testing

### Slow List Loading
- If list takes >2 seconds to load, check backend performance
- Monitor Network tab in DevTools
- Check database query performance

### Slow Modal Opening
- File uploads via Base64 can be slow
- Check file sizes being uploaded
- Consider implementing progress indicators

## Browser Compatibility

Tested and working on:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Debugging Tips

1. **Open Browser DevTools** (F12)
   - Console tab for JavaScript errors
   - Network tab to monitor API calls
   - Elements tab to inspect styling

2. **Check Console Logs**
   - "=== SUBMITTING TO BACKEND ===" in form submission
   - Student data being logged before submission

3. **Monitor Network Requests**
   - Watch for API calls to `/api/student/all`, `/api/student/{pid}`, etc.
   - Check response status codes (200, 201, 404, 500, etc.)
   - Verify request/response payloads

4. **React DevTools** (optional browser extension)
   - Inspect component state
   - Check prop values
   - Monitor state changes

## Deployment Checklist

Before deploying to production:
- [ ] Update API_BASE_URL in `config.ts` with production URL
- [ ] Test all CRUD operations on production backend
- [ ] Verify CORS is properly configured
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Check console for any warnings/errors
- [ ] Verify authentication/authorization if needed
- [ ] Test error scenarios (network failures, etc.)
