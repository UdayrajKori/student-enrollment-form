import type { ChangeEvent } from 'react';
import type { ExtracurricularDetails } from '../../types';
import ValidationErrorDisplay from '../ValidationErrorDisplay';
import { getStepFieldError, hasStepFieldError } from '../../validation/utils';
import type { ValidationError } from '../../validation/utils';
import { interests, hostellerStatuses, transportationMethods } from '../../data/extracurricularData';

interface ExtracurricularDetailsSectionProps {
  data: ExtracurricularDetails;
  onChange: (path: string, value: any) => void;
  errors?: ValidationError[];
}

const ExtracurricularDetailsSection = ({ data, onChange, errors = [] }: ExtracurricularDetailsSectionProps) => {
  const stepKey = 'extracurricular';

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, path: string) => {
    const { value } = e.target;
    onChange(path, value);
  };

  const handleCheckboxChange = (interest: string) => {
    const updatedInterests = data.interests.includes(interest)
      ? data.interests.filter(i => i !== interest)
      : [...data.interests, interest];
    onChange('interests', updatedInterests);
  };

  const hasOtherInterest = data.interests.includes('Other');

  return (
    <div className="form-section extracurricular-details">
      {/* Extracurricular Interests */}
      <div className="form-section-divider">Extracurricular Interests</div>

      <div className="form-row">
        <div className="form-group full-width">
          <label className="form-label">
            Select Your Interests
            <span className="required">*</span>
          </label>
          <div className={`checkboxes-grid ${hasStepFieldError(errors, stepKey, 'interests') ? 'error' : ''}`}>
            {interests.map(interest => (
              <label key={interest} className="checkbox-label-inline">
                <input
                  type="checkbox"
                  checked={data.interests.includes(interest)}
                  onChange={() => handleCheckboxChange(interest)}
                  className="form-checkbox"
                />
                <span>{interest}</span>
              </label>
            ))}
          </div>
          {hasStepFieldError(errors, stepKey, 'interests') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'interests')} 
            />
          )}
        </div>
      </div>

      {/* Other Interest Details */}
      {hasOtherInterest && (
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Please Specify Other Interest
              <span className="required">*</span>
            </label>
            <input
              type="text"
              value={data.otherInterestDetails || ''}
              onChange={(e) => handleInputChange(e, 'otherInterestDetails')}
              placeholder="e.g., Photography, Writing, etc."
              required
              className={`form-input ${hasStepFieldError(errors, stepKey, 'otherInterestDetails') ? 'error' : ''}`}
            />
            {hasStepFieldError(errors, stepKey, 'otherInterestDetails') && (
              <ValidationErrorDisplay 
                error={getStepFieldError(errors, stepKey, 'otherInterestDetails')} 
              />
            )}
          </div>
        </div>
      )}

      {/* Previous Achievements/Awards */}
      <div className="form-section-divider">Achievements & Awards</div>

      <div className="form-row">
        <div className="form-group full-width">
          <label className="form-label">
            Describe Your Achievements/Awards
          </label>
          <textarea
            value={data.otherInterestDetails || ''}
            onChange={(e) => handleInputChange(e, 'otherInterestDetails')}
            placeholder="e.g., National Science Olympiad Winner 2023, Dean's List Award 2022, Sports Excellence Certificate 2021, etc."
            rows={4}
            className={`form-input ${hasStepFieldError(errors, stepKey, 'otherInterestDetails') ? 'error' : ''}`}
            style={{ resize: 'vertical' }}
          />
          <small dangerously-set-inner-html={{ __html: 'You can add multiple achievements separated by line breaks or commas' }} />
          {hasStepFieldError(errors, stepKey, 'otherInterestDetails') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'otherInterestDetails')} 
            />
          )}
        </div>
      </div>

      {/* Hosteller Status & Transportation */}
      <div className="form-section-divider">Living & Transportation</div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Hosteller or Day Scholar
            <span className="required">*</span>
          </label>
          <select
            value={data.hostellerStatus || ''}
            onChange={(e) => handleInputChange(e, 'hostellerStatus')}
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'hostellerStatus') ? 'error' : ''}`}
          >
            <option value="">-- Select Status --</option>
            {hostellerStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          {hasStepFieldError(errors, stepKey, 'hostellerStatus') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'hostellerStatus')} 
            />
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Transportation Method
            <span className="required">*</span>
          </label>
          <select
            value={data.transportationMethod || ''}
            onChange={(e) => handleInputChange(e, 'transportationMethod')}
            required
            className={`form-input ${hasStepFieldError(errors, stepKey, 'transportationMethod') ? 'error' : ''}`}
          >
            <option value="">-- Select Method --</option>
            {transportationMethods.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
          {hasStepFieldError(errors, stepKey, 'transportationMethod') && (
            <ValidationErrorDisplay 
              error={getStepFieldError(errors, stepKey, 'transportationMethod')} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ExtracurricularDetailsSection;
