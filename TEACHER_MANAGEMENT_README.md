# EduPulse Teacher Management

## How to Use the Teacher Management Interface

1. **Start the server:**

   ```bash
   npm start
   # or
   node server.js
   ```

2. **Access the teacher management page:**
   Open your browser and go to: `http://localhost:5000/teachers`

3. **Features Available:**

   ### Create Teacher
   - Fill in the teacher details (name, email, password, school name, etc.)
   - Click "Create Teacher" button
   - The teacher will be created and you'll see a success message

   ### View Teachers
   - Enter the school name in the "Filter by School" field
   - Click "Load Teachers" button
   - All teachers for that school will be displayed in cards

   ### Edit Teacher
   - Click the "Edit" button on any teacher card
   - Update the information in the modal form
   - Click "Update Teacher"

   ### Delete Teacher
   - Click the "Delete" button on any teacher card
   - Confirm the deletion in the popup

   ### Change Role
   - Click "Make Admin" or "Make Teacher" button to change the teacher's role
   - The role will be updated immediately

## API Endpoints

The interface uses the following API endpoints:

- `POST /api/teachers` - Create teacher
- `GET /api/teachers/school/:school_name` - Get teachers for a school
- `PUT /api/teachers/:id` - Update teacher
- `PATCH /api/teachers/:id/role` - Update teacher role
- `DELETE /api/teachers/:id` - Delete teacher

## Notes

- All names are stored in lowercase in the database but displayed with proper capitalization
- Teachers are associated with schools by name
- The interface includes proper error handling and loading states
- All buttons are fully functional and connected to the backend API</content>
  <parameter name="filePath">e:\Kara\edu\backendedupulse\TEACHER_MANAGEMENT_README.md
