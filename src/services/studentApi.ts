import type { StudentEnrollmentForm } from '../types';
import { API_BASE_URL } from '../config';

/**
 * Enum mappings for backend compatibility
 */
const enumMappings = {
  gender: {
    'Male': 'Male',
    'Female': 'Female',
    'Other': 'Other',
  },
  nationality: {
    'Nepal': 'Nepal',
    'Nepali': 'Nepal',
    'American': 'American',
    'Canadian': 'Canadian',
    'British': 'British',
    'Australian': 'Australian',
    'Indian': 'Indian',
    'Chinese': 'Chinese',
    'German': 'German',
    'French': 'French',
    'Japanese': 'Japanese',
    'Mexican': 'Mexican',
    'Brazilian': 'Brazilian',
    'South African': 'SouthAfrican',
    'Italian': 'Italian',
    'Russian': 'Russian',
    'Spanish': 'Spanish',
    'Other': 'Other',
  },
  bloodGroup: {
    'A+': 'A_Positive',
    'A-': 'A_Negative',
    'B+': 'B_Positive',
    'B-': 'B_Negative',
    'AB+': 'AB_Positive',
    'AB-': 'AB_Negative',
    'O+': 'O_Positive',
    'O-': 'O_Negative',
    'A_Positive': 'A_Positive',
    'A_Negative': 'A_Negative',
    'B_Positive': 'B_Positive',
    'B_Negative': 'B_Negative',
    'AB_Positive': 'AB_Positive',
    'AB_Negative': 'AB_Negative',
    'O_Positive': 'O_Positive',
    'O_Negative': 'O_Negative',
  },
  maritalStatus: {
    'Single': 'Single',
    'Married': 'Married',
    'Divorced': 'Divorced',
    'Widowed': 'Widowed',
  },
  feeCategory: {
    'Regular': 'Regular',
    'SelfFinanced': 'SelfFinanced',
    'Self Financed': 'SelfFinanced',
    'Scholarship': 'Scholarship',
    'Quota': 'Quota',
  },
  scholarshipType: {
    'Government': 'Government',
    'Government Scholarship': 'Government',
    'Private': 'Private',
    'Private Scholarship': 'Private',
    'Institutional': 'Institutional',
    'Institutional Scholarship': 'Institutional',
    'Other': 'Other',
  },
  bankName: {
    'NabilBank': 'NabilBank',
    'Nabil Bank': 'NabilBank',
    'Nabil': 'NabilBank',
    'NABIL': 'NabilBank',
    'EverestBank': 'EverestBank',
    'Everest Bank': 'EverestBank',
    'Everest': 'EverestBank',
    'EVEREST': 'EverestBank',
    'HimalayanBank': 'HimalayanBank',
    'Himalayan Bank': 'HimalayanBank',
    'Himalayan': 'HimalayanBank',
    'HIMALAYAN': 'HimalayanBank',
    'StandardChartered': 'StandardChartered',
    'Standard Chartered': 'StandardChartered',
    'Standard': 'StandardChartered',
    'STANDARD CHARTERED': 'StandardChartered',
    'NICAsia': 'NICAsia',
    'NIC Asia': 'NICAsia',
    'NIC ASIA': 'NICAsia',
    'NIC': 'NICAsia',
    'SiddharthaBank': 'SiddharthaBank',
    'Siddhartha Bank': 'SiddharthaBank',
    'Siddhartha': 'SiddharthaBank',
    'SIDDHARTHA': 'SiddharthaBank',
    'Laxmi': 'NabilBank',
    'Laxmi Unnati': 'NabilBank',
    'Agricultural Bank': 'NabilBank',
    'Nepal Bank': 'NabilBank',
    'Rastriya Bank': 'NabilBank',
    'Other': 'Other',
  },
  faculty: {
    'Science': 'Science',
    'Management': 'Management',
    'Humanities': 'Humanities',
    'Education': 'Education',
    'Engineering': 'Engineering',
    'Law': 'Law',
    'Medicine': 'Medicine',
    'Agriculture': 'Agriculture',
    'Arts': 'Arts',
    'SocialSciences': 'SocialSciences',
    'Social Sciences': 'SocialSciences',
    'Other': 'Other',
  },
  program: {
    'BTech': 'BTech',
    'BBA': 'BBA',
    'BSCCSIT': 'BSCCSIT',
    'BA': 'BA',
    'Bed': 'Bed',
    'LLB': 'LLB',
    'DPharm': 'DPharm',
    'BPharm': 'BPharm',
    'BScAg': 'BScAg',
    'MA': 'MA',
    'PCM (Physics, Chemistry, Math)': 'BTech',
    'Physics': 'BTech',
    'Chemistry': 'BTech',
    'Math': 'BTech',
    'Biology': 'BTech',
    'Commerce': 'BBA',
    'Arts': 'BA',
    'Other': 'BTech',
  },
  level: {
    'Diploma': 'Diploma',
    'Bachelor': 'Bachelor',
    'Master': 'Master',
    'PhD': 'PhD',
    'Other': 'Other',
  },
  academicYear: {
    '1st Year': 'FirstYear',
    'FirstYear': 'FirstYear',
    '2nd Year': 'SecondYear',
    'SecondYear': 'SecondYear',
    '3rd Year': 'ThirdYear',
    'ThirdYear': 'ThirdYear',
    '4th Year': 'FourthYear',
    'FourthYear': 'FourthYear',
    '5th Year': 'FourthYear', // Map to 4th year
    'Fifth Year': 'FourthYear',
    'Other': 'FirstYear',
  },
  semester: {
    'First Semester': 'FirstSemester',
    'FirstSemester': 'FirstSemester',
    '1st Semester': 'FirstSemester',
    'Second Semester': 'SecondSemester',
    'SecondSemester': 'SecondSemester',
    '2nd Semester': 'SecondSemester',
    'Second Trimester': 'SecondSemester', // Map trimester to semester
    'Third Semester': 'ThirdSemester',
    'ThirdSemester': 'ThirdSemester',
    '3rd Semester': 'ThirdSemester',
    'Fourth Semester': 'FourthSemester',
    'FourthSemester': 'FourthSemester',
    '4th Semester': 'FourthSemester',
    'Fifth Semester': 'FifthSemester',
    'FifthSemester': 'FifthSemester',
    '5th Semester': 'FifthSemester',
    'Sixth Semester': 'SixthSemester',
    'SixthSemester': 'SixthSemester',
    '6th Semester': 'SixthSemester',
    'Seventh Semester': 'SeventhSemester',
    'SeventhSemester': 'SeventhSemester',
    '7th Semester': 'SeventhSemester',
    'Eighth Semester': 'EighthSemester',
    'EighthSemester': 'EighthSemester',
    '8th Semester': 'EighthSemester',
    'Other': 'FirstSemester',
  },
  section: {
    'A': 'A',
    'B': 'B',
    'C': 'C',
    'D': 'D',
    'E': 'E',
    'F': 'F',
    'G': 'G',
    'H': 'H',
    'I': 'I',
    'J': 'J',
    'K': 'K',
    'L': 'L',
    'M': 'M',
    'N': 'N',
    'O': 'O',
    'P': 'P',
  },
  academicStatus: {
    'Active': 'Active',
    'OnHold': 'OnHold',
    'On Hold': 'OnHold',
    'Completed': 'Completed',
    'DroppedOut': 'DroppedOut',
    'Dropped Out': 'DroppedOut',
  },
  qualification: {
    'SEE': 'SEE',
    'SLC': 'SLC',
    'SLC/SEE': 'SLC',
    'SLC/SEE (Secondary Education Examination)': 'SEE',
    'PlusTwo': 'PlusTwo',
    'Plus Two': 'PlusTwo',
    '+2': 'PlusTwo',
    'Bachelor': 'Bachelor',
    'Master': 'Master',
    'PhD': 'PhD',
    'Other': 'Other',
  },
  gardianType: {
    'Father': 'Father',
    'Mother': 'Mother',
    'Guardian': 'Guardian',
    'Grandparent': 'Guardian',
    'Grandmother': 'Guardian',
    'Grandfather': 'Guardian',
    'Uncle': 'Guardian',
    'Aunt': 'Guardian',
    'Brother': 'Guardian',
    'Sister': 'Guardian',
    'Other': 'Other',
  },
  scholarType: {
    'Hosteller': 'Hosteller',
    'Day Scholar': 'DayScholar',
    'DayScholar': 'DayScholar',
    'Hostel': 'Hosteller',
    'Home': 'DayScholar',
  },
  transportationMethod: {
    'Walk': 'Walk',
    'Bicycle': 'Bicycle',
    'Bus': 'Bus',
    'PrivateVehicle': 'PrivateVehicle',
    'Private Vehicle': 'PrivateVehicle',
    'Car': 'PrivateVehicle',
    'Motorcycle': 'PrivateVehicle',
  },
};

/**
 * Convert File to Base64 string
 */
/**
 * Get document type from field name
 */
function getDocumentType(fieldName: string): string {
  const mapping: Record<string, string> = {
    'profileImage': 'Photo',
    'citizenshipFrontUpload': 'Citizenship',
    'citizenshipBackUpload': 'Citizenship',
    'signatureUpload': 'Signature',
    'characterCertificateUpload': 'CharacterCertificate',
  };
  return mapping[fieldName] || 'Other';
}
function mapEnumValue(backendField: keyof typeof enumMappings, frontendValue: string): string {
  const mapping = enumMappings[backendField] as Record<string, string>;
  const mapped = mapping[frontendValue];
  
  // If value not found in mapping, return a sensible default
  if (!mapped) {
    console.warn(`Unknown ${backendField} value: "${frontendValue}", using fallback`);
    
    // Provide defaults for common fields
    switch(backendField) {
      case 'bankName': return 'Other';
      case 'program': return 'BTech';
      case 'academicYear': return 'FirstYear';
      case 'semester': return 'FirstSemester';
      case 'feeCategory': return 'Regular';
      case 'scholarshipType': return 'Other';
      case 'faculty': return 'Science';
      default: return frontendValue; // Return as-is and let backend validate
    }
  }
  
  return mapped;
}

/**
 * Transform frontend form data to backend CompleteRequestDTO format
 */
async function transformFormDataToDTO(formData: StudentEnrollmentForm) {
  // NO MORE BASE64 - Just collect file references for later upload
  
  console.log('=== FORM DATA TRANSFORMATION ===');
  console.log('profileImage:', formData.personalDetails.profileImage);
  console.log('citizenship:', formData.academicDetails.citizenshipUpload);
  console.log('signature:', formData.academicDetails.signatureUpload);
  console.log('characterCert:', formData.academicDetails.characterCertificateUpload);

  // Store files to be uploaded later
  const filesToUpload = {
    profileImage: formData.personalDetails.profileImage || null,
    citizenship: formData.academicDetails.citizenshipUpload || null,
    signature: formData.academicDetails.signatureUpload || null,
    characterCertificate: formData.academicDetails.characterCertificateUpload || null,
    marksheets: formData.academicDetails.previousHistory
      .map(h => h.marksheet || null)
      .filter((m): m is File => m !== null),
  };

  const dtoData = {
    // Student Details
    firstName: formData.personalDetails.firstName,
    middleName: formData.personalDetails.middleName || '',
    lastName: formData.personalDetails.lastName,
    dateOfBirth: new Date(formData.personalDetails.dateOfBirth).toISOString(),
    placeOfBirth: formData.personalDetails.placeOfBirth || '',
    photoPath: '', // Will be handled by file upload

    // Personal Details
    gender: mapEnumValue('gender', formData.personalDetails.gender),
    nationality: mapEnumValue('nationality', formData.personalDetails.nationality),
    bloodGroup: mapEnumValue('bloodGroup', formData.personalDetails.bloodGroup || 'O+'),
    maritalStatus: mapEnumValue('maritalStatus', formData.personalDetails.maritalStatus || 'Single'),
    religion: formData.personalDetails.religion || '',
    ethnicity: formData.personalDetails.ethnicity,

    // Contact Details
    email: formData.personalDetails.email,
    alternateEmail: formData.personalDetails.alternateEmail || '',
    primaryMobile: formData.personalDetails.primaryMobile,
    secondaryMobile: formData.personalDetails.secondaryMobile || '',

    // Financial details
    feeCategory: mapEnumValue('feeCategory', formData.financialDetails.feeCategory || 'Regular'),
    scholarshipType: mapEnumValue('scholarshipType', formData.financialDetails.scholarshipDetails?.scholarshipType || 'Other'),
    scholarshipProviderName: formData.financialDetails.scholarshipDetails?.scholarshipProviderName || '',
    scholarshipAmount: formData.financialDetails.scholarshipDetails?.scholarshipAmount || 0,

    // Bank Details
    accountHolderName: formData.financialDetails.bankDetails?.accountHolderName || '',
    bankName: mapEnumValue('bankName', formData.financialDetails.bankDetails?.bankName || 'Other'),
    accountNumber: formData.financialDetails.bankDetails?.accountNumber || '',
    branch: formData.financialDetails.bankDetails?.branch || '',

    // Citizenship Details
    citizenshipNumber: formData.personalDetails.citizenshipNumber,
    issueDate: new Date(formData.personalDetails.citizenshipIssueDate).toISOString(),
    issueDistrict: formData.personalDetails.citizenshipIssueDistrict,

    // Academic Enrollment Details
    faculty: mapEnumValue('faculty', formData.academicDetails.currentEnrollment.faculty),
    program: mapEnumValue('program', formData.academicDetails.currentEnrollment.program),
    level: mapEnumValue('level', formData.academicDetails.currentEnrollment.courseLevel),
    academicYear: mapEnumValue('academicYear', formData.academicDetails.currentEnrollment.academicYear),
    semester: mapEnumValue('semester', formData.academicDetails.currentEnrollment.semesterClass),
    section: mapEnumValue('section', formData.academicDetails.currentEnrollment.section),
    rollNumber: formData.academicDetails.currentEnrollment.rollNumber,
    registrationNumber: formData.academicDetails.currentEnrollment.registrationNumber,
    enrollmentDate: new Date(formData.academicDetails.currentEnrollment.enrollDate).toISOString(),
    academicStatus: mapEnumValue('academicStatus', formData.academicDetails.currentEnrollment.academicStatus),

    // Declaration
    isAgreed: formData.declaration.agreedToTerms,
    applicationDate: new Date(formData.declaration.dateOfApplication).toISOString(),
    place: formData.declaration.place,

    // Addresses (permanent and temporary)
    addresses: [
      {
        addressType: 'Permanent',
        province: formData.addressDetails.permanent.province,
        district: formData.addressDetails.permanent.district,
        municipality: formData.addressDetails.permanent.municipality,
        wardNumber: parseInt(formData.addressDetails.permanent.wardNumber, 10),
        toleStreet: formData.addressDetails.permanent.toleStreet,
        houseNumber: formData.addressDetails.permanent.houseNumber || '',
      },
      ...(formData.addressDetails.temporary && !formData.addressDetails.temporary.sameAsPermanent
        ? [
            {
              addressType: 'Temporary',
              province: formData.addressDetails.temporary.province || '',
              district: formData.addressDetails.temporary.district || '',
              municipality: formData.addressDetails.temporary.municipality || '',
              wardNumber: parseInt(formData.addressDetails.temporary.wardNumber || '0', 10),
              toleStreet: formData.addressDetails.temporary.toleStreet || '',
              houseNumber: formData.addressDetails.temporary.houseNumber || '',
            },
          ]
        : []),
    ],

    // Emergency Contacts
    emergencyContacts: [
      {
        contactName: formData.personalDetails.emergencyContactName,
        relation: formData.personalDetails.emergencyContactRelation,
        contactNumber: formData.personalDetails.emergencyContactNumber,
      },
    ],

    // Parent/Guardian Details
    parentGuardians: [
      {
        parentType: 'Father',
        fullName: formData.parentGuardianDetails.father.fullName,
        occupation: formData.parentGuardianDetails.father.occupation || '',
        designation: formData.parentGuardianDetails.father.designation || '',
        organization: formData.parentGuardianDetails.father.organization || '',
        mobileNumber: formData.parentGuardianDetails.father.mobileNumber,
        gardianEmail: formData.parentGuardianDetails.father.email || '',
      },
      {
        parentType: 'Mother',
        fullName: formData.parentGuardianDetails.mother.fullName,
        occupation: formData.parentGuardianDetails.mother.occupation || '',
        designation: formData.parentGuardianDetails.mother.designation || '',
        organization: formData.parentGuardianDetails.mother.organization || '',
        mobileNumber: formData.parentGuardianDetails.mother.mobileNumber,
        gardianEmail: formData.parentGuardianDetails.mother.email || '',
      },
      ...formData.parentGuardianDetails.legalGuardians.map((guardian) => ({
        parentType: mapEnumValue('gardianType', guardian.relation),
        fullName: guardian.fullName,
        occupation: guardian.occupation || '',
        designation: '',
        organization: '',
        mobileNumber: guardian.mobileNumber,
        gardianEmail: guardian.email || '',
      })),
    ],

    // Disability Details
    disabilityDetails: formData.personalDetails.disabilityStatus === 'Yes'
      ? [
          {
            disabilityType: formData.personalDetails.disabilityType || 'None',
            disabilityPercentage: formData.personalDetails.disabilityPercentage || 0,
          },
        ]
      : [],

    // Academic History
    academicHistories: formData.academicDetails.previousHistory.map((history) => ({
      qualification: mapEnumValue('qualification', history.qualification),
      boardOrUniversity: history.boardUniversity,
      institutionName: history.institutionName,
      passedYear: parseInt(history.passedYear, 10),
      divisionOrGPA: history.divisionGPA,
    })),

    // Extracurricular Details
    extracurricularDetails: [
      {
        interests: formData.extracurricularDetails.interests.join(', '),
        achievements: formData.extracurricularDetails.otherInterestDetails || '',
        scholarType: mapEnumValue('scholarType', formData.extracurricularDetails.hostellerStatus),
        transportMethod: mapEnumValue('transportationMethod', formData.extracurricularDetails.transportationMethod),
      },
    ],

    // No documents here - will be uploaded separately via FormData
    documents: [],
  };

  // Return both DTO and files for two-step upload process
  return { dtoData, filesToUpload };
}

/**
 * Upload student files separately as FormData (much faster than base64)
 */
async function uploadStudentFiles(pid: string, filesToUpload: any) {
  try {
    const formData = new FormData();

    // Add photo - must match backend field name exactly (PascalCase)
    if (filesToUpload.profileImage instanceof File) {
      formData.append('PhotoFile', filesToUpload.profileImage);
      console.log('Adding PhotoFile:', filesToUpload.profileImage.name);
    }

    // Add citizenship
    if (filesToUpload.citizenship instanceof File) {
      formData.append('CitizenshipFile', filesToUpload.citizenship);
      console.log('Adding CitizenshipFile:', filesToUpload.citizenship.name);
    }

    // Add signature
    if (filesToUpload.signature instanceof File) {
      formData.append('SignatureFile', filesToUpload.signature);
      console.log('Adding SignatureFile:', filesToUpload.signature.name);
    }

    // Add character certificate
    if (filesToUpload.characterCertificate instanceof File) {
      formData.append('CharacterCertificateFile', filesToUpload.characterCertificate);
      console.log('Adding CharacterCertificateFile:', filesToUpload.characterCertificate.name);
    }

    // Add marksheets - sent as array
    if (filesToUpload.marksheets && filesToUpload.marksheets.length > 0) {
      filesToUpload.marksheets.forEach((marksheet: File, index: number) => {
        formData.append(`MarksheetFiles`, marksheet);
        console.log(`Adding Marksheet ${index + 1}:`, marksheet.name);
      });
    }

    // Only upload if there are files
    let hasFiles = false;
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        hasFiles = true;
        break;
      }
    }

    if (!hasFiles) {
      console.log('No files to upload');
      return null;
    }

    console.log('=== UPLOADING FILES ===');
    console.log('Endpoint:', `${API_BASE_URL}/student/${pid}/upload-files`);
    
    const response = await fetch(`${API_BASE_URL}/student/${pid}/upload-files`, {
      method: 'POST',
      body: formData,
      // Do NOT set Content-Type header - browser will set it with boundary
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('File upload errors:', errorData);
      throw new Error(errorData.message || `File upload failed: ${response.status}`);
    }

    const uploadResult = await response.json();
    console.log('✓ Files uploaded successfully');
    return uploadResult;
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error;
  }
}

/**
 * Submit student enrollment form to backend
 * Two-step process: Register student first, then upload files
 */
export async function submitStudentEnrollment(formData: StudentEnrollmentForm) {
  try {
    // Step 1: Transform form data and extract files
    const { dtoData, filesToUpload } = await transformFormDataToDTO(formData);

    console.log('=== STEP 1: REGISTERING STUDENT ===');
    console.log(JSON.stringify(dtoData, null, 2));

    // Register student
    const registerResponse = await fetch(`${API_BASE_URL}/student/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dtoData),
    });

    const registerData = await registerResponse.json();

    if (!registerResponse.ok) {
      console.error('Backend validation errors:', registerData);
      throw new Error(
        registerData.message || `Server error: ${registerResponse.status}`
      );
    }

    // Get student PID from response
    const studentPid = registerData.data?.pid;
    if (!studentPid) {
      throw new Error('No student PID returned from registration');
    }

    console.log('✓ Student registered with PID:', studentPid);

    // Step 2: Upload files if any exist
    let uploadResult = null;
    if (filesToUpload && (
      filesToUpload.profileImage || 
      filesToUpload.citizenship || 
      filesToUpload.signature || 
      filesToUpload.characterCertificate || 
      filesToUpload.marksheets?.length > 0
    )) {
      console.log('=== STEP 2: UPLOADING FILES ===');
      uploadResult = await uploadStudentFiles(studentPid, filesToUpload);
    }

    return {
      success: true,
      data: registerData.data,
      uploadResult,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}
