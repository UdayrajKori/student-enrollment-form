import { useState } from 'react';
import type { StudentEnrollmentForm, PersonalDetails, AddressDetails, ParentGuardianDetails, AcademicDetails } from '../types';
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

const EnrollmentForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<StudentEnrollmentForm>({
    personalDetails: {} as any,
    addressDetails: {} as any,
    parentGuardianDetails: {
      father: {} as any,
      mother: {} as any,
      legalGuardians: [],
    } as any,
    academicDetails: {
      currentEnrollment: {} as any,
      previousHistory: [],
    } as any,
    financialDetails: {
      feeCategory: '',
    } as any,
    extracurricularDetails: {
      interests: [],
      previousAwards: [],
    } as any,
    declaration: {
      agreedToTerms: false,
      dateOfApplication: new Date().toISOString().split('T')[0],
      place: '',
    } as any,
  });

  const totalSteps = 7;

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
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.declaration.agreedToTerms) {
      alert('Please agree to the declaration before submitting.');
      return;
    }

    if (!formData.declaration.dateOfApplication || !formData.declaration.place) {
      alert('Please fill in all required declaration fields.');
      return;
    }

    console.log('=== STUDENT ENROLLMENT FORM SUBMITTED ===');
    console.log(JSON.stringify(formData, null, 2));
    
    alert('✓ Form submitted successfully!\n\nCheck the browser console for detailed form data.');
    // TODO: Send formData to backend API
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalDetailsSection 
            data={formData.personalDetails}
            onChange={handlePersonalDetailsChange}
          />
        );
      case 2:
        return (
          <AddressDetailsSection 
            data={formData.addressDetails}
            onChange={handleAddressDetailsChange}
          />
        );
      case 3:
        return (
          <ParentGuardianDetailsSection 
            data={formData.parentGuardianDetails}
            onChange={handleParentGuardianDetailsChange}
          />
        );
      case 4:
        return (
          <AcademicDetailsSection 
            data={formData.academicDetails}
            onChange={handleAcademicDetailsChange}
          />
        );
      case 5:
        return (
          <FinancialDetailsSection 
            data={formData.financialDetails}
            onChange={handleFinancialDetailsChange}
          />
        );
      case 6:
        return (
          <ExtracurricularDetailsSection 
            data={formData.extracurricularDetails}
            onChange={handleExtracurricularDetailsChange}
          />
        );
      case 7:
        return (
          <DeclarationSection 
            data={formData.declaration}
            onChange={handleDeclarationChange}
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
      <header className="form-header">
        <h1>Student Enrollment Form</h1>
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
            disabled={!formData.declaration.agreedToTerms || !formData.declaration.place}
          >
            Submit Form
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
  );
};

export default EnrollmentForm;
