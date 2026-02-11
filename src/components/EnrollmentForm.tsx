import { useState, useEffect } from 'react';
import type { StudentEnrollmentForm, PersonalDetails, AddressDetails, ParentGuardianDetails, AcademicDetails } from '../types';
import { EnrollmentFormSchema } from '../validation/schema';
import { formatZodErrors, type ValidationError } from '../validation/utils';
import { submitStudentEnrollment, updateStudentEnrollment } from '../services/studentApi';
import { getStudentDetails } from '../services/studentListApi';
import '../styles/form.css';
import '../styles/formFields.css';
import '../styles/addressFields.css';
import '../styles/parentGuardianFields.css';
import '../styles/academicFields.css';
import '../styles/extracurricularFields.css';
import '../styles/declarationFields.css';
import PersonalDetailsSection from './FormSections/PersonalDetailsSection';
import AddressDetailsSection from './FormSections/AddressDetailsSection';
import ParentGuardianDetailsSection from './FormSections/ParentGuardianDetailsSection';
import AcademicDetailsSection from './FormSections/AcademicDetailsSection';
import FinancialDetailsSection from './FormSections/FinancialDetailsSection';
import ExtracurricularDetailsSection from './FormSections/ExtracurricularDetailsSection';
import DeclarationSection from './FormSections/DeclarationSection';

interface EnrollmentFormProps {
  onSuccess?: () => void;
  editingPid?: string | null;
  onCancel?: () => void;
}

const EnrollmentForm = ({ onSuccess, editingPid, onCancel }: EnrollmentFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingEditData, setIsLoadingEditData] = useState(false);
  const [formData, setFormData] = useState<StudentEnrollmentForm>({
    personalDetails: {} as any,
    addressDetails: {
      permanent: {
        province: '',
        district: '',
        municipality: '',
        wardNumber: '',
        toleStreet: '',
        houseNumber: '',
      },
      isSameAsPermanent: false,
      temporary: {
        province: '',
        district: '',
        municipality: '',
        wardNumber: '',
        toleStreet: '',
        houseNumber: '',
        sameAsPermanent: false,
      },
    } as any,
    parentGuardianDetails: {
      father: {
        fullName: '',
        occupation: '',
        designation: '',
        organization: '',
        mobileNumber: '',
        email: '',
      },
      mother: {
        fullName: '',
        occupation: '',
        designation: '',
        organization: '',
        mobileNumber: '',
        email: '',
      },
      legalGuardians: [],
      annualFamilyIncome: '',
    } as any,
    academicDetails: {
      currentEnrollment: {
        faculty: '',
        program: '',
        courseLevel: '',
        academicYear: '',
        semesterClass: '',
        section: '',
        enrollDate: '',
        academicStatus: '',
      },
      previousHistory: [],
    } as any,
    financialDetails: {
      feeCategory: '',
      scholarshipDetails: {
        scholarshipType: '',
        scholarshipProviderName: '',
        scholarshipAmount: '',
      },
      bankDetails: undefined,
    } as any,
    extracurricularDetails: {
      interests: [],
      otherInterestDetails: '',
      hostellerStatus: '',
      transportationMethod: '',
    } as any,
    declaration: {
      agreedToTerms: false,
      dateOfApplication: new Date().toISOString().split('T')[0],
      place: '',
    } as any,
  });

  const totalSteps = 7;

  // Function to map API student data to form structure
  const mapApiDataToFormData = (apiData: any): StudentEnrollmentForm => {
        // === DEBUG: Log all academicEnrollment keys and values ===
        if (apiData?.academicEnrollment && typeof apiData.academicEnrollment === 'object') {
          console.log('🔎 [DEBUG] academicEnrollment keys/values:');
          Object.entries(apiData.academicEnrollment).forEach(([key, value]) => {
            console.log(`   • ${key}:`, value);
          });
        } else {
          console.log('⚠️ [DEBUG] academicEnrollment missing or not an object:', apiData?.academicEnrollment);
        }
    if (!apiData) {
      console.error('❌ mapApiDataToFormData called with null/undefined apiData!');
      return {} as any;
    }
    
    // Helper function to convert DisabilityType enum to form display value
    const convertDisabilityTypeEnum = (value: any): string => {
      if (!value) return '';
      
      const mapping: { [key: string]: string } = {
        'HearingImpairment': 'Hearing',
        'VisualImpairment': 'Visual',
        'MobilityImpairment': 'Physical',
        'CognitiveImpairment': 'Other',
        'None': 'None',
        'Other': 'Other',
        '0': 'None',
        '1': 'Visual',
        '2': 'Hearing',
        '3': 'Physical',
        '4': 'Other',
        '5': 'Other',
      };
      
      const strValue = String(value);
      console.log(`   🏥 Converting disability type: "${value}" (${typeof value}) → "${mapping[strValue] || value}"`);
      return mapping[strValue] || strValue;
    };
    
    const convertBloodGroupEnum = (value: any): string => {
      if (!value) return '';
      
      const mapping: { [key: string]: string } = {
        'A_Positive': 'A+',
        'A_Negative': 'A-',
        'B_Positive': 'B+',
        'B_Negative': 'B-',
        'AB_Positive': 'AB+',
        'AB_Negative': 'AB-',
        'O_Positive': 'O+',
        'O_Negative': 'O-',
        'APlusitive': 'A+',  // Alternative format
        'APlus': 'A+',
        'B+': 'B+',
        'A+': 'A+',
        '0': 'A+',  // Numeric enum values
        '1': 'A-',
        '2': 'B+',
        '3': 'B-',
        '4': 'AB+',
        '5': 'AB-',
        '6': 'O+',
        '7': 'O-',
      };
      
      const strValue = String(value);
      console.log(`   🩸 Converting blood group: "${value}" (${typeof value}) → "${mapping[strValue] || value}"`);
      return mapping[strValue] || strValue;
    };
    
    console.log('='.repeat(80));
    console.log('🔄 [MAPPING STARTED]');
    console.log('Full API Response:', JSON.stringify(apiData, null, 2));
    console.log('='.repeat(80));
    
    console.log('📸 Looking for image - photoPath:', apiData?.photoPath, 'profileImage:', apiData?.profileImage);
    
    // Log ALL top-level keys in the API response
    console.log('='.repeat(80));
    console.log('🔑 ALL API KEYS AVAILABLE:');
    if (apiData && typeof apiData === 'object') {
      Object.keys(apiData).forEach(key => {
        const value = apiData[key];
        const type = typeof value;
        const preview = type === 'object' ? `[${Object.keys(value).join(', ')}]` : String(value).substring(0, 50);
        console.log(`   • ${key}: ${type} = ${preview}`);
      });
    }
    console.log('='.repeat(80));
    
    // Log biometric/personal fields from API
    console.log('🔍 CHECKING FOR BIOMETRIC FIELDS IN API:');
    console.log('   👤 gender:', {
      'top-level': apiData?.gender,
      'personal.gender': apiData?.personal?.gender,
      'biometric.gender': apiData?.biometric?.gender,
    });
    console.log('   🆔 citizenshipNumber:', {
      'top-level': apiData?.citizenshipNumber,
      'personal': apiData?.personal?.citizenshipNumber,
      'biometric': apiData?.biometric?.citizenshipNumber,
    });
    console.log('   📅 citizenshipIssueDate:', {
      'top-level': apiData?.citizenshipIssueDate,
      'biometric': apiData?.biometric?.citizenshipIssueDate,
    });
    console.log('   🩸 BLOOD GROUP DEBUG:');
    console.log('      personalDetails.bloodGroup:', apiData?.personalDetails?.bloodGroup);
    console.log('      TYPE:', typeof apiData?.personalDetails?.bloodGroup);
    console.log('      VALUE:', apiData?.personalDetails?.bloodGroup);
    console.log('      AS STRING:', String(apiData?.personalDetails?.bloodGroup));
    console.log('   👫 maritalStatus:', {
      'top-level': apiData?.maritalStatus,
      'biometric': apiData?.biometric?.maritalStatus,
    });
    console.log('   🧬 ethnicity:', {
      'top-level': apiData?.ethnicity,
      'caste': apiData?.caste,
      'biometric': apiData?.biometric?.ethnicity,
    });
    console.log('   🆘 emergencyContactName:', apiData?.emergencyContactName);
    console.log('   👥 emergencyContact object:', apiData?.emergencyContact);
    console.log('   👨‍👩‍👦 PARENT GUARDIANS DEBUGGING:');
    console.log('      All parentGuardians:', apiData?.parentGuardians);
    if (apiData?.parentGuardians?.length > 0) {
      apiData.parentGuardians.forEach((p: any, idx: number) => {
        console.log(`      Guardian ${idx}:`, {
          parentType: p?.parentType,
          ParentType: p?.ParentType,
          fullName: p?.fullName,
          FullName: p?.FullName,
          relation: p?.relation,
          annualFamilyIncome: p?.annualFamilyIncome,
          AnnualFamilyIncome: p?.AnnualFamilyIncome,
        });
      });
    }
    
    console.log('   ♿ DISABILITY DETAILS DEBUGGING:');
    console.log('      disabilityDetails array:', apiData?.disabilityDetails);
    console.log('      disabilityDetails length:', apiData?.disabilityDetails?.length || 0);
    if (apiData?.disabilityDetails?.length > 0) {
      apiData.disabilityDetails.forEach((d: any, idx: number) => {
        console.log(`      Disability ${idx}:`, {
          disabilityType: d?.disabilityType,
          DisabilityType: d?.DisabilityType,
          disabilityPercentage: d?.disabilityPercentage,
          DisabilityPercentage: d?.DisabilityPercentage,
          fullObject: d
        });
      });
    }
    console.log('   📍 ADDRESSES DEBUGGING:');
    console.log('      All addresses array:', apiData?.addresses);
    console.log('      Addresses count:', apiData?.addresses?.length || 0);
    if (apiData?.addresses?.length > 0) {
      apiData.addresses.forEach((addr: any, idx: number) => {
        console.log(`      Address ${idx}:`, {
          addressType: addr?.addressType,
          AddressType: addr?.AddressType,
          province: addr?.province,
          Province: addr?.Province,
          district: addr?.district,
          District: addr?.District,
          municipality: addr?.municipality,
          Municipality: addr?.Municipality,
          wardNumber: addr?.wardNumber,
          WardNumber: addr?.WardNumber,
          toleStreet: addr?.toleStreet,
          ToleStreet: addr?.ToleStreet,
          houseNumber: addr?.houseNumber,
          HouseNumber: addr?.HouseNumber,
          fullObject: addr
        });
      });
    }
    
    // Helper function to safely split date
    const formatDate = (dateStr: any) => {
      if (!dateStr) return '';
      if (typeof dateStr === 'string') {
        return dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
      }
      return '';
    };

    const mapped: StudentEnrollmentForm = {
      personalDetails: {
        firstName: apiData?.firstName || '',
        lastName: apiData?.lastName || '',
        middleName: apiData?.middleName || '',
        gender: apiData?.personalDetails?.gender || '',
        dateOfBirth: formatDate(apiData?.dateOfBirth),
        placeOfBirth: apiData?.placeOfBirth || '',
        email: apiData?.contactDetail?.email || '',
        alternateEmail: apiData?.contactDetail?.alternateEmail || '',
        primaryMobile: apiData?.contactDetail?.primaryMobile || '',
        secondaryMobile: apiData?.contactDetail?.secondaryMobile || '',
        citizenshipNumber: apiData?.citizenshipDetail?.citizenshipNumber || '',
        citizenshipIssueDate: formatDate(apiData?.citizenshipDetail?.issueDate),
        citizenshipIssueDistrict: apiData?.citizenshipDetail?.issueDistrict || '',
        maritalStatus: apiData?.personalDetails?.maritalStatus || '',
        nationality: apiData?.personalDetails?.nationality || '',
        bloodGroup: convertBloodGroupEnum(apiData?.personalDetails?.bloodGroup),
        ethnicity: apiData?.personalDetails?.ethnicity || '',
        religion: apiData?.personalDetails?.religion || '',
        disabilityType: convertDisabilityTypeEnum(apiData?.disabilityDetails?.[0]?.DisabilityType || apiData?.disabilityDetails?.[0]?.disabilityType),
        disabilityPercentage: apiData?.disabilityDetails?.[0]?.DisabilityPercentage || apiData?.disabilityDetails?.[0]?.disabilityPercentage || 0,
        emergencyContactName: apiData?.emergencyContacts?.[0]?.contactName || '',
        emergencyContactRelation: apiData?.emergencyContacts?.[0]?.relation || '',
        emergencyContactNumber: apiData?.emergencyContacts?.[0]?.contactNumber || '',
        profileImage: apiData?.photoPath || '',
      },
      addressDetails: (() => {
        const addressesArray = apiData?.addresses || apiData?.Addresses || [];
        
        console.log('📍 ADDRESS EXTRACTION:');
        console.log('   Raw addresses array:', JSON.stringify(addressesArray, null, 2));
        console.log('   Total count:', addressesArray.length);
        
        // Strategy 1: Try to find by AddressType property
        let permanentAddr = addressesArray.find((a: any) => {
          const typeVal = a?.AddressType || a?.addressType || '';
          return typeVal === 'Permanent' || typeVal === 'permanent' || typeVal === 0;
        });
        
        let temporaryAddr = addressesArray.find((a: any) => {
          const typeVal = a?.AddressType || a?.addressType || '';
          return typeVal === 'Temporary' || typeVal === 'temporary' || typeVal === 1;
        });
        
        // Strategy 2: If not found by type, use array index (first = permanent, second = temporary)
        if (!permanentAddr && addressesArray.length > 0) {
          permanentAddr = addressesArray[0];
          console.log('   Using index [0] as permanent address');
        }
        if (!temporaryAddr && addressesArray.length > 1) {
          temporaryAddr = addressesArray[1];
          console.log('   Using index [1] as temporary address');
        }
        
        console.log('   After extraction - Permanent:', permanentAddr);
        console.log('   After extraction - Temporary:', temporaryAddr);
        
        const getPropValue = (obj: any, ...keys: string[]) => {
          for (const key of keys) {
            const val = obj?.[key];
            if (val !== undefined && val !== null && val !== '') return val;
          }
          return '';
        };
        
        const permanentData = {
          province: String(getPropValue(permanentAddr, 'Province', 'province')),
          district: String(getPropValue(permanentAddr, 'District', 'district')),
          municipality: String(getPropValue(permanentAddr, 'Municipality', 'municipality')),
          wardNumber: String(getPropValue(permanentAddr, 'WardNumber', 'wardNumber')),
          toleStreet: String(getPropValue(permanentAddr, 'ToleStreet', 'toleStreet')),
          houseNumber: String(getPropValue(permanentAddr, 'HouseNumber', 'houseNumber')),
        };

        const temporaryData = {
          province: String(getPropValue(temporaryAddr, 'Province', 'province')),
          district: String(getPropValue(temporaryAddr, 'District', 'district')),
          municipality: String(getPropValue(temporaryAddr, 'Municipality', 'municipality')),
          wardNumber: String(getPropValue(temporaryAddr, 'WardNumber', 'wardNumber')),
          toleStreet: String(getPropValue(temporaryAddr, 'ToleStreet', 'toleStreet')),
          houseNumber: String(getPropValue(temporaryAddr, 'HouseNumber', 'houseNumber')),
        };
        
        console.log('   Final permanent data:', permanentData);
        console.log('   Final temporary data:', temporaryData);
        
        // Check if temporary is same as permanent
        const isSame = temporaryAddr && permanentAddr && 
          getPropValue(permanentAddr, 'Province', 'province') === getPropValue(temporaryAddr, 'Province', 'province') &&
          getPropValue(permanentAddr, 'District', 'district') === getPropValue(temporaryAddr, 'District', 'district') &&
          getPropValue(permanentAddr, 'Municipality', 'municipality') === getPropValue(temporaryAddr, 'Municipality', 'municipality') &&
          getPropValue(permanentAddr, 'WardNumber', 'wardNumber') === getPropValue(temporaryAddr, 'WardNumber', 'wardNumber') &&
          getPropValue(permanentAddr, 'ToleStreet', 'toleStreet') === getPropValue(temporaryAddr, 'ToleStreet', 'toleStreet') &&
          getPropValue(permanentAddr, 'HouseNumber', 'houseNumber') === getPropValue(temporaryAddr, 'HouseNumber', 'houseNumber');

        console.log('   Same address:', isSame);

        return {
          permanent: permanentData,
          temporary: {
            ...temporaryData,
            sameAsPermanent: !!isSame,
          },
          isSameAsPermanent: !!isSame,
        };
      })(),
      parentGuardianDetails: {
        father: {
          fullName: apiData?.parentGuardians?.find((p: any) => p?.parentType === 'Father' || p?.parentType === 0)?.fullName || '',
          occupation: apiData?.parentGuardians?.find((p: any) => p?.parentType === 'Father' || p?.parentType === 0)?.occupation || '',
          designation: apiData?.parentGuardians?.find((p: any) => p?.parentType === 'Father' || p?.parentType === 0)?.designation || '',
          organization: apiData?.parentGuardians?.find((p: any) => p?.parentType === 'Father' || p?.parentType === 0)?.organization || '',
          mobileNumber: apiData?.parentGuardians?.find((p: any) => p?.parentType === 'Father' || p?.parentType === 0)?.mobileNumber || '',
          email: apiData?.parentGuardians?.find((p: any) => p?.parentType === 'Father' || p?.parentType === 0)?.gardianEmail || '',
        },
        mother: {
          fullName: apiData?.parentGuardians?.find((p: any) => p?.parentType === 'Mother' || p?.parentType === 1)?.fullName || '',
          occupation: apiData?.parentGuardians?.find((p: any) => p?.parentType === 'Mother' || p?.parentType === 1)?.occupation || '',
          designation: apiData?.parentGuardians?.find((p: any) => p?.parentType === 'Mother' || p?.parentType === 1)?.designation || '',
          organization: apiData?.parentGuardians?.find((p: any) => p?.parentType === 'Mother' || p?.parentType === 1)?.organization || '',
          mobileNumber: apiData?.parentGuardians?.find((p: any) => p?.parentType === 'Mother' || p?.parentType === 1)?.mobileNumber || '',
          email: apiData?.parentGuardians?.find((p: any) => p?.parentType === 'Mother' || p?.parentType === 1)?.gardianEmail || '',
        },
        legalGuardians: apiData?.parentGuardians?.filter((p: any) => p?.parentType === 'Guardian' || p?.parentType === 2 || p?.parentType === 'Other' || p?.parentType === 3)?.map((p: any) => {
          return {
            id: p.pid,
            fullName: p.fullName,
            occupation: p.occupation,
            mobileNumber: p.mobileNumber,
            email: p.gardianEmail,
          };
        }) || [],
        annualFamilyIncome: (() => {
          const found = apiData?.parentGuardians?.find((p: any) => p?.AnnualFamilyIncome != null && p?.AnnualFamilyIncome !== '' && p?.AnnualFamilyIncome !== undefined) ||
                        apiData?.parentGuardians?.find((p: any) => p?.annualFamilyIncome != null && p?.annualFamilyIncome !== '' && p?.annualFamilyIncome !== undefined);
          const enumValue = String(found?.AnnualFamilyIncome ?? found?.annualFamilyIncome ?? '');
          // Reverse mapping: enum value to display string
          const reverseMap: Record<string, string> = {
            'LessThan5Lakh': 'Less than 5 Lakh',
            'Between5And10Lakh': '5-10 Lakh',
            'Between10And20Lakh': '10-20 Lakh',
            'MoreThan20Lakh': 'More than 20 Lakh',
            '': 'Prefer not to specify',
          };
          return reverseMap[enumValue] || '';
        })(),
      },
      academicDetails: {
        currentEnrollment: (() => {
          const src = apiData?.academicEnrollment || apiData?.academicDetails?.currentEnrollment || {};
          return {
            faculty: src.facultyDisplay || src.faculty || src.FacultyDisplay || src.Faculty || '',
            program: src.programDisplay || src.program || src.ProgramDisplay || src.Program || '',
            courseLevel: src.levelDisplay || src.courseLevel || src.level || src.LevelDisplay || src.Level || '',
            academicYear: src.academicYearDisplay || src.academicYear || src.AcademicYearDisplay || src.AcademicYear || '',
            semesterClass: src.semesterDisplay || src.semesterClass || src.semester || src.SemesterDisplay || src.Semester || '',
            section: src.sectionDisplay || src.section || src.SectionDisplay || src.Section || '',
            rollNumber: src.rollNumber || '',
            registrationNumber: src.registrationNumber || '',
            enrollDate: formatDate(src.enrollDate || src.enrollmentDate),
            academicStatus: src.academicStatusDisplay || src.academicStatus || src.AcademicStatusDisplay || src.AcademicStatus || '',
          };
        })(),
        previousHistory: apiData?.academicHistories?.map((h: any) => {
          return {
            qualification: h?.qualificationDisplay || h?.qualification || h?.QualificationDisplay || h?.Qualification || '',
            boardUniversity: h?.boardOrUniversity || h?.boardUniversity || h?.BoardOrUniversity || '',
            institutionName: h?.institutionName || h?.InstitutionName || '',
            passedYear: String(h?.passedYear || h?.PassedYear || ''),
            divisionGPA: h?.divisionOrGPA || h?.divisionGPA || h?.DivisionOrGPA || '',
            marksheet: h?.marksheet instanceof File ? h?.marksheet : (h?.marksheetPath || h?.MarksheetPath || undefined),
          };
        }) || [],
        citizenshipUpload: (() => {
          // Prefer documents array if present
          const doc = Array.isArray(apiData?.documents)
            ? apiData.documents.find((d: any) => {
                const type = (d.documentType || d.documentTypeDisplay || '').toLowerCase();
                return type === 'citizenship' || type.includes('citizenship');
              })
            : undefined;
          if (doc && doc.filePath) return doc.filePath;
          const val = apiData?.citizenshipUpload
            || apiData?.citizenshipDocumentPath
            || apiData?.citizenshipDetail?.documentPath
            || apiData?.citizenshipDetail?.citizenshipDocumentPath
            || apiData?.citizenshipDocument
            || apiData?.citizenshipFile
            || apiData?.citizenshipFilePath
            || undefined;
          if (val instanceof File) return val;
          if (typeof val === 'string' && val) return val;
          return undefined;
        })(),
        signatureUpload: (() => {
          const doc = Array.isArray(apiData?.documents)
            ? apiData.documents.find((d: any) => {
                const type = (d.documentType || d.documentTypeDisplay || '').toLowerCase();
                return type === 'signature' || type.includes('signature');
              })
            : undefined;
          if (doc && doc.filePath) return doc.filePath;
          const val = apiData?.signatureUpload
            || apiData?.signaturePath
            || apiData?.signatureDocumentPath
            || apiData?.signatureFile
            || apiData?.signatureFilePath
            || undefined;
          if (val instanceof File) return val;
          if (typeof val === 'string' && val) return val;
          return undefined;
        })(),
        characterCertificateUpload: (() => {
          const doc = Array.isArray(apiData?.documents)
            ? apiData.documents.find((d: any) => {
                const type = (d.documentType || d.documentTypeDisplay || '').toLowerCase();
                return type === 'charactercertificate' || type === 'character certificate' || type.includes('charactercertificate') || type.includes('character_certificate') || type.includes('character certificate');
              })
            : undefined;
          if (doc && doc.filePath) return doc.filePath;
          const val = apiData?.characterCertificateUpload
            || apiData?.characterCertificatePath
            || apiData?.characterCertificateDocumentPath
            || apiData?.characterCertificateFile
            || apiData?.characterCertificateFilePath
            || undefined;
          if (val instanceof File) return val;
          if (typeof val === 'string' && val) return val;
          return undefined;
        })(),
      },
      financialDetails: {
        feeCategory: apiData?.financialDetail?.feeCategory || '',
        scholarshipDetails: {
          scholarshipType: apiData?.financialDetail?.scholarshipType || '',
          scholarshipProviderName: apiData?.financialDetail?.scholarshipProviderName || '',
          scholarshipAmount: apiData?.financialDetail?.scholarshipAmount || 0,
        },
        bankDetails: apiData?.bankDetail ? {
          accountHolderName: apiData.bankDetail.accountHolderName || '',
          bankName: apiData.bankDetail.bankName || '',
          accountNumber: apiData.bankDetail.accountNumber || '',
          branch: apiData.bankDetail.branch || '',
        } : undefined,
      },
      extracurricularDetails: {
        interests:
          Array.isArray(apiData?.extracurricularDetails)
            ? apiData?.extracurricularDetails[0]?.interests?.split(',').map((s: string) => s.trim())
            : Array.isArray(apiData?.extracurricularDetails?.interests)
              ? apiData?.extracurricularDetails?.interests
              : Array.isArray(apiData?.interests)
                ? apiData?.interests
                : [],
        otherInterestDetails:
          Array.isArray(apiData?.extracurricularDetails)
            ? apiData?.extracurricularDetails[0]?.achievements || ''
            : apiData?.extracurricularDetails?.otherInterestDetails
              || apiData?.otherInterestDetails
              || '',
        hostellerStatus:
          Array.isArray(apiData?.extracurricularDetails)
            ? apiData?.extracurricularDetails[0]?.scholarType || ''
            : apiData?.extracurricularDetails?.hostellerStatus
              || apiData?.hostellerStatus
              || '',
        transportationMethod:
          Array.isArray(apiData?.extracurricularDetails)
            ? apiData?.extracurricularDetails[0]?.transportMethod || ''
            : apiData?.extracurricularDetails?.transportationMethod
              || apiData?.transportationMethod
              || '',
      },
      declaration: {
        agreedToTerms: apiData?.declaration?.isAgreed ?? false,
        dateOfApplication: formatDate(apiData?.declaration?.applicationDate) || new Date().toISOString().split('T')[0],
        place: apiData?.declaration?.place || '',
      },
    };
    
    console.log('✅ Mapping complete. Mapped fields:', mapped);
    console.log('📊 DETAILED BIOMETRIC/PERSONAL FIELDS:');
    console.log('   👤 Gender:', mapped.personalDetails.gender);
    console.log('   🆔 Citizenship #:', mapped.personalDetails.citizenshipNumber);
    console.log('   📅 Citizenship Issue Date:', mapped.personalDetails.citizenshipIssueDate);
    console.log('   📍 Citizenship Issue District:', mapped.personalDetails.citizenshipIssueDistrict);
    console.log('   🩸 Blood Group:', mapped.personalDetails.bloodGroup);
    console.log('      RAW API bloodGroup:', apiData?.personalDetails?.bloodGroup);
    console.log('      TYPE:', typeof apiData?.personalDetails?.bloodGroup);
    console.log('   👫 Marital Status:', mapped.personalDetails.maritalStatus);
    console.log('   ✝️ Religion:', mapped.personalDetails.religion);
    console.log('   🧬 Ethnicity/Caste:', mapped.personalDetails.ethnicity);
    console.log('   🆘 Emergency Contact Name:', mapped.personalDetails.emergencyContactName);
    console.log('   👥 Emergency Contact Relation:', mapped.personalDetails.emergencyContactRelation);
    console.log('   📞 Emergency Contact Number:', mapped.personalDetails.emergencyContactNumber);
    console.log('   🖼️ Image:', mapped.personalDetails.profileImage);
    console.log('   Address:', mapped.addressDetails);
    console.log('   Academic:', mapped.academicDetails);
    
    console.log('='.repeat(80));
    console.log('📦 [MAPPING COMPLETE] FINAL MAPPED VALUES:');
    console.log('='.repeat(80));
    console.log('🎯 CRITICAL FIELDS STATUS:');
    console.log(`   ✅ firstname: "${mapped.personalDetails.firstName}" ${mapped.personalDetails.firstName ? '(HAS VALUE)' : '(EMPTY)'}`);
    console.log(`   ✅ gender: "${mapped.personalDetails.gender}" ${mapped.personalDetails.gender ? '(HAS VALUE)' : '(EMPTY)'}`);
    console.log(`   ✅ citizenshipNumber: "${mapped.personalDetails.citizenshipNumber}" ${mapped.personalDetails.citizenshipNumber ? '(HAS VALUE)' : '(EMPTY)'}`);
    console.log(`   ✅ bloodGroup: "${mapped.personalDetails.bloodGroup}" ${mapped.personalDetails.bloodGroup ? '(HAS VALUE)' : '(EMPTY)'}`);
    console.log(`   ✅ maritalStatus: "${mapped.personalDetails.maritalStatus}" ${mapped.personalDetails.maritalStatus ? '(HAS VALUE)' : '(EMPTY)'}`);
    console.log(`   ✅ religion: "${mapped.personalDetails.religion}" ${mapped.personalDetails.religion ? '(HAS VALUE)' : '(EMPTY)'}`);
    console.log(`   ✅ ethnicity: "${mapped.personalDetails.ethnicity}" ${mapped.personalDetails.ethnicity ? '(HAS VALUE)' : '(EMPTY)'}`);
    console.log(`   ✅ emergencyContactName: "${mapped.personalDetails.emergencyContactName}" ${mapped.personalDetails.emergencyContactName ? '(HAS VALUE)' : '(EMPTY)'}`);
    console.log('='.repeat(80));
    
    return mapped;
  };

  // Load existing student data when editingPid is provided
  useEffect(() => {
    if (editingPid) {
      console.log('='.repeat(80));
      console.log('📝 EDIT MODE ACTIVATED - PID:', editingPid);
      console.log('='.repeat(80));
      setIsLoadingEditData(true);
      
      getStudentDetails(editingPid)
        .then((studentData) => {
          console.log('='.repeat(80));
          console.log('📥 [STEP 1] API RESPONSE RECEIVED');
          console.log('Response type:', typeof studentData);
          console.log('Response keys:', studentData ? Object.keys(studentData) : 'null/undefined');
          console.log('Full response:', JSON.stringify(studentData, null, 2));
          console.log('='.repeat(80));
          
          if (studentData && typeof studentData === 'object' && Object.keys(studentData).length > 0) {
            console.log('✅ Valid student data, proceeding to mapping...');
            const mappedData = mapApiDataToFormData(studentData);
            
            console.log('='.repeat(80));
            console.log('📦 [STEP 2] MAPPING COMPLETE');
            console.log('Mapped data structure:', JSON.stringify(mappedData, null, 2));
            console.log('='.repeat(80));
            
            console.log('💾 [STEP 3] SETTING FORM STATE');
            setFormData(mappedData);
            
            // Verify state was set (this will show after the next render)
            setTimeout(() => {
              console.log('='.repeat(80));
              console.log('⏱️ [AFTER SET] Form state update verification:');
              console.log(`   ✅ firstName: "${mappedData.personalDetails.firstName}"`);
              console.log(`   ✅ gender: "${mappedData.personalDetails.gender}"`);
              console.log(`   ✅ citizenshipNumber: "${mappedData.personalDetails.citizenshipNumber}"`);
              console.log(`   ✅ bloodGroup: "${mappedData.personalDetails.bloodGroup}"`);
              console.log(`   ✅ maritalStatus: "${mappedData.personalDetails.maritalStatus}"`);
              console.log(`   ✅ religion: "${mappedData.personalDetails.religion}"`);
              console.log(`   ✅ ethnicity: "${mappedData.personalDetails.ethnicity}"`);
              console.log(`   ✅ emergencyContactName: "${mappedData.personalDetails.emergencyContactName}"`);
              console.log('   (These values should now appear in PersonalDetailsSection)');
              console.log('='.repeat(80));
            }, 100);
          } else {
            console.error('❌ Invalid student data received:');
            console.error('   - studentData:', studentData);
            console.error('   - type:', typeof studentData);
            console.error('   - keys:', studentData ? Object.keys(studentData) : 'N/A');
            alert('❌ Failed to load student data. The API returned empty or invalid data.\n\nCheck browser console for details.');
          }
        })
        .catch((err) => {
          console.error('='.repeat(80));
          console.error('❌ [ERROR] Exception in promise chain:');
          console.error('Error message:', err?.message);
          console.error('Full error:', err);
          console.error('='.repeat(80));
          alert('❌ Error loading student data: ' + (err?.message || 'Unknown error'));
        })
        .finally(() => {
          console.log('✅ [DONE] Loading process complete');
          setIsLoadingEditData(false);
        });
    }
  }, [editingPid]);

  // Monitor form data changes when in edit mode to verify data is persisting
  useEffect(() => {
    if (editingPid) {
      const fieldsToCheck = {
        'First Name': formData.personalDetails.firstName,
        'Gender': formData.personalDetails.gender,
        'Citizenship #': formData.personalDetails.citizenshipNumber,
        'Blood Group': formData.personalDetails.bloodGroup,
        'Marital Status': formData.personalDetails.maritalStatus,
        'Religion': formData.personalDetails.religion,
        'Ethnicity': formData.personalDetails.ethnicity,
        'Emergency Name': formData.personalDetails.emergencyContactName,
        'Emergency Relation': formData.personalDetails.emergencyContactRelation,
        'Emergency Mobile': formData.personalDetails.emergencyContactNumber,
      };
      
      console.log('='.repeat(80));
      console.log('👀 [FORM STATE CHECK] Current values in form:');
      Object.entries(fieldsToCheck).forEach(([label, value]) => {
        const status = value ? '✅' : '❌';
        console.log(`   ${status} ${label}: "${value}"`);
      });
      console.log('='.repeat(80));
    }
  }, [formData, editingPid]);

  // Helper function to create initial form data
  const createInitialFormData = (): StudentEnrollmentForm => ({
    personalDetails: {} as any,
    addressDetails: {
      permanent: {
        province: '',
        district: '',
        municipality: '',
        wardNumber: '',
        toleStreet: '',
        houseNumber: '',
      },
      isSameAsPermanent: false,
      temporary: {
        province: '',
        district: '',
        municipality: '',
        wardNumber: '',
        toleStreet: '',
        houseNumber: '',
        sameAsPermanent: false,
      },
    } as any,
    parentGuardianDetails: {
      father: {
        fullName: '',
        occupation: '',
        designation: '',
        organization: '',
        mobileNumber: '',
        email: '',
      },
      mother: {
        fullName: '',
        occupation: '',
        designation: '',
        organization: '',
        mobileNumber: '',
        email: '',
      },
      legalGuardians: [],
      annualFamilyIncome: '',
    } as any,
    academicDetails: {
      currentEnrollment: {
        faculty: '',
        program: '',
        courseLevel: '',
        academicYear: '',
        semesterClass: '',
        section: '',
        enrollDate: '',
        academicStatus: '',
      },
      previousHistory: [],
    } as any,
    financialDetails: {
      feeCategory: '',
      scholarshipDetails: {
        scholarshipType: '',
        scholarshipProviderName: '',
        scholarshipAmount: '',
      },
      bankDetails: undefined,
    } as any,
    extracurricularDetails: {
      interests: [],
      otherInterestDetails: '',
      hostellerStatus: '',
      transportationMethod: '',
    } as any,
    declaration: {
      agreedToTerms: false,
      dateOfApplication: new Date().toISOString().split('T')[0],
      place: '',
    } as any,
  });

  const handlePersonalDetailsChange = (field: keyof PersonalDetails, value: any) => {
    setFormData(prev => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        [field]: value
      }
    }));
  };

  const handleAddressDetailsChange = (path: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      
      if (keys.length === 1) {
        // Top level
        (newData.addressDetails as any)[keys[0]] = value;
      } else if (keys.length === 2) {
        // Nested (e.g., permanent.province)
        if (!newData.addressDetails[keys[0] as keyof AddressDetails]) {
          (newData.addressDetails as any)[keys[0]] = {};
        }
        (newData.addressDetails[keys[0] as keyof AddressDetails] as any)[keys[1]] = value;
      }
      
      return newData;
    });
  };

  const handleParentGuardianDetailsChange = (path: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      
      if (keys.length === 1) {
        // Top level
        (newData.parentGuardianDetails as any)[keys[0]] = value;
      } else if (keys.length === 2) {
        // Nested (e.g., father.fullName)
        if (!newData.parentGuardianDetails[keys[0] as keyof ParentGuardianDetails]) {
          (newData.parentGuardianDetails as any)[keys[0]] = {};
        }
        (newData.parentGuardianDetails[keys[0] as keyof ParentGuardianDetails] as any)[keys[1]] = value;
      }
      
      return newData;
    });
  };

  const handleAcademicDetailsChange = (path: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      
      if (keys.length === 1) {
        // Top level (previousHistory)
        (newData.academicDetails as any)[keys[0]] = value;
      } else if (keys.length === 2) {
        // Nested (e.g., currentEnrollment.faculty)
        if (!newData.academicDetails[keys[0] as keyof AcademicDetails]) {
          (newData.academicDetails as any)[keys[0]] = {};
        }
        (newData.academicDetails[keys[0] as keyof AcademicDetails] as any)[keys[1]] = value;
      }
      
      return newData;
    });
  };

  const handleFinancialDetailsChange = (path: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      financialDetails: {
        ...prev.financialDetails,
        [path]: value
      }
    }));
  };

  const handleExtracurricularDetailsChange = (path: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      extracurricularDetails: {
        ...prev.extracurricularDetails,
        [path]: value
      }
    }));
  };

  const handleDeclarationChange = (path: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      declaration: {
        ...prev.declaration,
        [path]: value
      }
    }));
  };

  const handleNext = () => {
    // Validate current step data before moving to next
    try {
      const dataToValidate: any = {};
      
      switch (currentStep) {
        case 1:
          dataToValidate.personal = formData.personalDetails;
          console.log('='.repeat(80));
          console.log('🔍 STEP 1: Validating Personal Details');
          console.log('='.repeat(80));
          console.log('📋 ALL PERSONAL FIELDS:');
          Object.keys(formData.personalDetails).forEach(key => {
            const value = (formData.personalDetails as any)[key];
            console.log(`   ${key}: "${value}" (${typeof value})`);
          });
          console.log('='.repeat(80));
          EnrollmentFormSchema.pick({ personal: true }).parse(dataToValidate);
          break;
        case 2:
          dataToValidate.address = formData.addressDetails;
          console.log('Validating Address Details:', formData.addressDetails);
          EnrollmentFormSchema.pick({ address: true }).parse(dataToValidate);
          break;
        case 3:
          dataToValidate.guardian = formData.parentGuardianDetails;
          console.log('Validating Guardian Details:', formData.parentGuardianDetails);
          EnrollmentFormSchema.pick({ guardian: true }).parse(dataToValidate);
          break;
        case 4:
          dataToValidate.academic = formData.academicDetails;
          console.log('Validating Academic Details:', formData.academicDetails);
          EnrollmentFormSchema.pick({ academic: true }).parse(dataToValidate);
          break;
        case 5:
          dataToValidate.financial = formData.financialDetails;
          console.log('Validating Financial Details:', formData.financialDetails);
          EnrollmentFormSchema.pick({ financial: true }).parse(dataToValidate);
          break;
        case 6:
          dataToValidate.extracurricular = formData.extracurricularDetails;
          console.log('Validating Extracurricular Details:', formData.extracurricularDetails);
          EnrollmentFormSchema.pick({ extracurricular: true }).parse(dataToValidate);
          break;
        case 7:
          dataToValidate.declaration = formData.declaration;
          console.log('Validating Declaration:', formData.declaration);
          EnrollmentFormSchema.pick({ declaration: true }).parse(dataToValidate);
          break;
      }
      
      // If validation passes, clear errors and move to next step
      setValidationErrors([]);
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error: any) {
      // Check if it's a ZodError
      if (error.issues && Array.isArray(error.issues)) {
        const formattedErrors = formatZodErrors(error);
        setValidationErrors(formattedErrors);
        console.error('='.repeat(80));
        console.error(`❌ Validation errors on step ${currentStep}:`);
        console.error('Formatted errors:', formattedErrors);
        formattedErrors.forEach(err => {
          console.error(`   ❌ ${err.field}: ${err.message}`);
        });
        console.error('Raw ZodError issues:', error.issues);
        console.error('='.repeat(80));
        
        // Show alert with error details
        const errorMessages = formattedErrors.map(err => `❌ ${err.field}: ${err.message}`).join('\n');
        alert(`⚠️ Validation Failed!\n\nPlease fix these errors:\n\n${errorMessages}`);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setValidationErrors([]);
    }
  };

  const handleSubmit = () => {
    try {
      // Map internal form structure to schema structure for validation
      const dataToValidate = {
        personal: formData.personalDetails,
        address: formData.addressDetails,
        guardian: formData.parentGuardianDetails,
        academic: formData.academicDetails,
        financial: formData.financialDetails,
        extracurricular: formData.extracurricularDetails,
        declaration: formData.declaration,
      };

      // Validate entire form
      EnrollmentFormSchema.parse(dataToValidate);
      
      setValidationErrors([]);
      submitFormToBackend();
    } catch (error: any) {
      // Check if it's a ZodError
      if (error.issues && Array.isArray(error.issues)) {
        const errors = formatZodErrors(error);
        setValidationErrors(errors);
        console.error('Form validation errors:', errors);
        alert('Please fix the validation errors before submitting.');
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const submitFormToBackend = async () => {
    setIsSubmitting(true);
    try {
      console.log('=== SUBMITTING TO BACKEND ===');
      const result = editingPid
        ? await updateStudentEnrollment(formData, editingPid)
        : await submitStudentEnrollment(formData);

      if (result.success) {
        console.log('✓ Form submitted successfully!', result.data);
        alert('✓ Student ' + (editingPid ? 'updated' : 'registered') + ' successfully!');
        // Reset form properly
        setCurrentStep(1);
        setFormData(createInitialFormData());
        setValidationErrors([]);
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
      } else {
        console.error('Backend error:', result.error);
        alert(`❌ Submission failed:\n\n${result.error}`);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('❌ An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalDetailsSection 
            data={formData.personalDetails}
            onChange={handlePersonalDetailsChange}
            errors={validationErrors}
          />
        );
      case 2:
        return (
          <AddressDetailsSection 
            data={formData.addressDetails}
            onChange={handleAddressDetailsChange}
            errors={validationErrors}
          />
        );
      case 3:
        return (
          <ParentGuardianDetailsSection 
            data={formData.parentGuardianDetails}
            onChange={handleParentGuardianDetailsChange}
            errors={validationErrors}
          />
        );
      case 4:
        return (
          <AcademicDetailsSection 
            data={formData.academicDetails}
            onChange={handleAcademicDetailsChange}
            errors={validationErrors}
          />
        );
      case 5:
        return (
          <FinancialDetailsSection 
            data={formData.financialDetails}
            onChange={handleFinancialDetailsChange}
            errors={validationErrors}
          />
        );
      case 6:
        return (
          <ExtracurricularDetailsSection 
            data={formData.extracurricularDetails}
            onChange={handleExtracurricularDetailsChange}
            errors={validationErrors}
          />
        );
      case 7:
        return (
          <DeclarationSection 
            data={formData.declaration}
            onChange={handleDeclarationChange}
            errors={validationErrors}
          />
        );
      default:
        return null;
    }
  };

  const stepTitles = [
    'Personal & Biometric Details',
    'Address Details',
    'Parent/Guardian Details',
    'Academic Details',
    'Financial Details',
    'Extracurricular & Other Info',
    'Declaration',
  ];

  return (
    <div className="enrollment-form-container">
      {isLoadingEditData && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <p>Loading student information...</p>
          </div>
        </div>
      )}

      <header className="form-header">
        <h1>{editingPid ? 'Edit Student Information' : 'Student Enrollment Form'}</h1>
        <p>Step {currentStep} of {totalSteps}</p>
      </header>

      <div className="form-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="form-steps-indicator">
        {stepTitles.map((title, index) => (
          <div 
            key={index + 1}
            className={`step-indicator ${currentStep === index + 1 ? 'active' : ''} ${currentStep > index + 1 ? 'completed' : ''}`}
            onClick={() => setCurrentStep(index + 1)}
          >
            <span className="step-number">{index + 1}</span>
            <span className="step-title">{title}</span>
          </div>
        ))}
      </div>

      <div className="form-content">
        <h2>{stepTitles[currentStep - 1]}</h2>
        {getStepContent()}
      </div>

      <div className="form-navigation">
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {onCancel && (
            <button 
              className="btn btn-secondary"
              onClick={onCancel}
              style={{ marginRight: 'auto' }}
            >
              Back to List
            </button>
          )}
          <button 
            className="btn btn-secondary"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </button>

          {currentStep === totalSteps ? (
            <button 
              className="btn btn-success"
              onClick={handleSubmit}
              disabled={!formData.declaration.agreedToTerms || !formData.declaration.place || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Form'}
            </button>
          ) : (
            <button 
              className="btn btn-primary"
              onClick={handleNext}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrollmentForm;
