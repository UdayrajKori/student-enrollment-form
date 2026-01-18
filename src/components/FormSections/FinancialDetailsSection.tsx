import type { ChangeEvent } from 'react';
import type { FinancialDetails } from '../../types';
import { feeCategories, scholarshipTypes } from '../../data/financialData';

interface FinancialDetailsSectionProps {
  data: FinancialDetails;
  onChange: (path: string, value: any) => void;
}

const FinancialDetailsSection = ({ data, onChange }: FinancialDetailsSectionProps) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>, path: string) => {
    const { value } = e.target;
    onChange(path, value);
  };

  const isScholarship = data.feeCategory === 'Scholarship';
  const hasBankDetails = data.bankDetails !== undefined;

  return (
    <div className="form-section financial-details">
      {/* Fee Category */}
      <div className="form-section-divider">Fee Information</div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Fee Category
            <span className="required">*</span>
          </label>
          <select
            value={data.feeCategory || ''}
            onChange={(e) => handleInputChange(e, 'feeCategory')}
            required
            className="form-input"
          >
            <option value="">-- Select Fee Category --</option>
            {feeCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Scholarship Details - Conditional */}
      {isScholarship && (
        <>
          <div className="form-section-divider">Scholarship Details</div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Scholarship Type
                <span className="required">*</span>
              </label>
              <select
                value={data.scholarshipDetails?.scholarshipType || ''}
                onChange={(e) => {
                  const updatedScholarship = {
                    ...data.scholarshipDetails,
                    scholarshipType: e.target.value
                  } as any;
                  onChange('scholarshipDetails', updatedScholarship);
                }}
                required
                className="form-input"
              >
                <option value="">-- Select Type --</option>
                {scholarshipTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Scholarship Provider Name
                <span className="required">*</span>
              </label>
              <input
                type="text"
                value={data.scholarshipDetails?.scholarshipProviderName || ''}
                onChange={(e) => {
                  const updatedScholarship = {
                    ...data.scholarshipDetails,
                    scholarshipProviderName: e.target.value
                  } as any;
                  onChange('scholarshipDetails', updatedScholarship);
                }}
                placeholder="e.g., XYZ Foundation, Government"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Scholarship Amount
                <span className="required">*</span>
              </label>
              <input
                type="number"
                value={data.scholarshipDetails?.scholarshipAmount || ''}
                onChange={(e) => {
                  const updatedScholarship = {
                    ...data.scholarshipDetails,
                    scholarshipAmount: parseFloat(e.target.value)
                  } as any;
                  onChange('scholarshipDetails', updatedScholarship);
                }}
                placeholder="Enter amount in NRs"
                min="0"
                required
                className="form-input"
              />
            </div>
          </div>
        </>
      )}

      {/* Bank Details */}
      <div className="form-section-divider">Bank Details for Reimbursement</div>

      <div className="form-row">
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={hasBankDetails}
              onChange={(e) => {
                if (e.target.checked) {
                  onChange('bankDetails', {
                    accountHolderName: '',
                    bankName: '',
                    accountNumber: '',
                    branch: ''
                  });
                } else {
                  onChange('bankDetails', undefined);
                }
              }}
              className="form-checkbox"
            />
            <span>I want to provide bank details for reimbursement</span>
          </label>
        </div>
      </div>

      {hasBankDetails && (
        <>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Account Holder Name
                <span className="required">*</span>
              </label>
              <input
                type="text"
                value={data.bankDetails?.accountHolderName || ''}
                onChange={(e) => {
                  const updatedBank = {
                    ...data.bankDetails,
                    accountHolderName: e.target.value
                  } as any;
                  onChange('bankDetails', updatedBank);
                }}
                placeholder="Enter account holder's name"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Bank Name
                <span className="required">*</span>
              </label>
              <input
                type="text"
                value={data.bankDetails?.bankName || ''}
                onChange={(e) => {
                  const updatedBank = {
                    ...data.bankDetails,
                    bankName: e.target.value
                  } as any;
                  onChange('bankDetails', updatedBank);
                }}
                placeholder="e.g., Nepal Bank Limited, Himalayan Bank"
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Account Number
                <span className="required">*</span>
              </label>
              <input
                type="text"
                value={data.bankDetails?.accountNumber || ''}
                onChange={(e) => {
                  const updatedBank = {
                    ...data.bankDetails,
                    accountNumber: e.target.value
                  } as any;
                  onChange('bankDetails', updatedBank);
                }}
                placeholder="Enter account number"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Branch
                <span className="required">*</span>
              </label>
              <input
                type="text"
                value={data.bankDetails?.branch || ''}
                onChange={(e) => {
                  const updatedBank = {
                    ...data.bankDetails,
                    branch: e.target.value
                  } as any;
                  onChange('bankDetails', updatedBank);
                }}
                placeholder="Enter branch location"
                required
                className="form-input"
              />
            </div>
          </div>
        </>
      )}

      {isScholarship && (
        <div className="info-box">
          <p>✓ Please ensure your bank details are correct for scholarship reimbursement</p>
        </div>
      )}
    </div>
  );
};

export default FinancialDetailsSection;
