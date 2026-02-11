import { API_BASE_URL } from '../config';

export interface StudentListItem {
  pid: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  dateOfBirth: string;
  enrollmentNumber?: string;
  faculty?: string;
  program?: string;
  photoPath?: string;
}

export interface StudentListResponse {
  Message: string;
  Success: boolean;
  Count: number;
  Data: StudentListItem[];
}

export async function getAllStudents(): Promise<StudentListItem[]> {
  try {
    const url = `${API_BASE_URL}/Student/all`;
    console.log('Fetching from URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch students: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Full response:', data);
    
    const rawStudents = data.data || data.Data || [];
    console.log('Raw students from API:', rawStudents);
    
    // Transform the full student objects to StudentListItem format
    const transformedStudents = rawStudents.map((student: any) => {
      const photoPath = student.photoPath || '';
      console.log(`Student ${student.firstName}: photoPath = "${photoPath}"`);
      return {
        pid: student.pid,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.contactDetail?.email || student.email || '',
        contactNumber: student.contactDetail?.primaryMobile || student.contactNumber || '',
        dateOfBirth: student.dateOfBirth,
        enrollmentNumber: student.enrollmentNumber || '',
        faculty: student.academicEnrollment?.faculty || student.faculty || '',
        program: student.academicEnrollment?.program || student.program || '',
        photoPath: photoPath,
      };
    });
    
    console.log('Transformed students:', transformedStudents);
    console.log('Students count:', transformedStudents.length);
    
    return transformedStudents;
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
}

export async function deleteStudent(pid: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/Student/${pid}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting student:', error);
    return false;
  }
}

export async function getStudentDetails(pid: string): Promise<any> {
  try {
    const url = `${API_BASE_URL}/Student/${pid}`;
    console.log('🔍 Fetching student details from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📊 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      throw new Error(`Failed to fetch student details: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('📦 Full API response:', JSON.stringify(data, null, 2));
    
    // The API might return data in data.data or data.Data
    const student = data.data || data.Data || data;
    console.log('✅ Extracted student data:', JSON.stringify(student, null, 2));
    
    if (!student || Object.keys(student).length === 0) {
      console.warn('⚠️ No student data found in response');
      return null;
    }
    
    return student;
  } catch (error) {
    console.error('❌ Error fetching student details:', error);
    return null;
  }
}
