import type { ChangeEvent } from 'react';
import type { AddressDetails } from '../../types';
import { provinces, getDistrictsForProvince, getMunicipalitiesForDistrict } from '../../data/nepalData';

interface AddressDetailsSectionProps {
  data: AddressDetails;
  onChange: (path: string, value: any) => void;
}

const AddressDetailsSection = ({ data, onChange }: AddressDetailsSectionProps) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>, path: string) => {
    const { value } = e.target;
    onChange(path, value);
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    onChange('temporary.sameAsPermanent', checked);
    
    // If same as permanent, copy permanent address to temporary
    if (checked && data.permanent) {
      onChange('temporary.province', data.permanent.province);
      onChange('temporary.district', data.permanent.district);
      onChange('temporary.municipality', data.permanent.municipality);
      onChange('temporary.wardNumber', data.permanent.wardNumber);
      onChange('temporary.toleStreet', data.permanent.toleStreet);
      onChange('temporary.houseNumber', data.permanent.houseNumber);
    }
  };

  const permanentProvince = data.permanent?.province || '';
  const permanentDistrict = data.permanent?.district || '';
  const permanentDistrics = getDistrictsForProvince(permanentProvince);
  const permanentMunicipalities = getMunicipalitiesForDistrict(permanentDistrict);

  const isSameAsPermanent = data.temporary?.sameAsPermanent || false;
  const temporaryProvince = data.temporary?.province || '';
  const temporaryDistrict = data.temporary?.district || '';
  const temporaryDistricts = getDistrictsForProvince(temporaryProvince);
  const temporaryMunicipalities = getMunicipalitiesForDistrict(temporaryDistrict);

  return (
    <div className="form-section address-details">
      {/* Permanent Address Section */}
      <div className="form-section-divider">Permanent Address</div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Province
            <span className="required">*</span>
          </label>
          <select
            value={permanentProvince}
            onChange={(e) => handleInputChange(e, 'permanent.province')}
            required
            className="form-input"
          >
            <option value="">-- Select Province --</option>
            {provinces.map(province => (
              <option key={province} value={province}>{province}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            District
            <span className="required">*</span>
          </label>
          <select
            value={permanentDistrict}
            onChange={(e) => handleInputChange(e, 'permanent.district')}
            disabled={!permanentProvince}
            required
            className="form-input"
          >
            <option value="">-- Select District --</option>
            {permanentDistrics.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            Municipality/VDC
            <span className="required">*</span>
          </label>
          <select
            value={data.permanent?.municipality || ''}
            onChange={(e) => handleInputChange(e, 'permanent.municipality')}
            disabled={!permanentDistrict}
            required
            className="form-input"
          >
            <option value="">-- Select Municipality --</option>
            {permanentMunicipalities.map(municipality => (
              <option key={municipality} value={municipality}>{municipality}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Ward Number
            <span className="required">*</span>
          </label>
          <input
            type="number"
            value={data.permanent?.wardNumber || ''}
            onChange={(e) => handleInputChange(e, 'permanent.wardNumber')}
            placeholder="Enter ward number"
            min="1"
            max="32"
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Tole/Street
            <span className="required">*</span>
          </label>
          <input
            type="text"
            value={data.permanent?.toleStreet || ''}
            onChange={(e) => handleInputChange(e, 'permanent.toleStreet')}
            placeholder="Enter tole or street name"
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">House Number</label>
          <input
            type="text"
            value={data.permanent?.houseNumber || ''}
            onChange={(e) => handleInputChange(e, 'permanent.houseNumber')}
            placeholder="Enter house number"
            className="form-input"
          />
        </div>
      </div>

      {/* Temporary Address Section */}
      <div className="form-section-divider">Temporary Address</div>

      <div className="form-row">
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isSameAsPermanent}
              onChange={handleCheckboxChange}
              className="form-checkbox"
            />
            <span>Same as Permanent Address</span>
          </label>
        </div>
      </div>

      {!isSameAsPermanent && (
        <>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Province</label>
              <select
                value={temporaryProvince}
                onChange={(e) => handleInputChange(e, 'temporary.province')}
                className="form-input"
              >
                <option value="">-- Select Province --</option>
                {provinces.map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">District</label>
              <select
                value={temporaryDistrict}
                onChange={(e) => handleInputChange(e, 'temporary.district')}
                disabled={!temporaryProvince}
                className="form-input"
              >
                <option value="">-- Select District --</option>
                {temporaryDistricts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Municipality/VDC</label>
              <select
                value={data.temporary?.municipality || ''}
                onChange={(e) => handleInputChange(e, 'temporary.municipality')}
                disabled={!temporaryDistrict}
                className="form-input"
              >
                <option value="">-- Select Municipality --</option>
                {temporaryMunicipalities.map(municipality => (
                  <option key={municipality} value={municipality}>{municipality}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Ward Number</label>
              <input
                type="number"
                value={data.temporary?.wardNumber || ''}
                onChange={(e) => handleInputChange(e, 'temporary.wardNumber')}
                placeholder="Enter ward number"
                min="1"
                max="32"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tole/Street</label>
              <input
                type="text"
                value={data.temporary?.toleStreet || ''}
                onChange={(e) => handleInputChange(e, 'temporary.toleStreet')}
                placeholder="Enter tole or street name"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">House Number</label>
              <input
                type="text"
                value={data.temporary?.houseNumber || ''}
                onChange={(e) => handleInputChange(e, 'temporary.houseNumber')}
                placeholder="Enter house number"
                className="form-input"
              />
            </div>
          </div>
        </>
      )}

      {isSameAsPermanent && (
        <div className="info-box">
          <p>✓ Temporary address is same as permanent address</p>
        </div>
      )}
    </div>
  );
};

export default AddressDetailsSection;
