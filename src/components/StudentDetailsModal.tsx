import React, { useEffect, useState } from 'react';
import { getStudentDetails } from '../services/studentListApi';
import '../styles/StudentDetails.css';

interface StudentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pid: string | null;
}

interface StudentDetail {
  pid: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup?: string;
  nationality: string;
  contactNumber: string;
  email: string;
  maritalStatus?: string;
  enrollmentNumber?: string;
  [key: string]: any;
}

export const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({
  isOpen,
  onClose,
  pid,
}) => {
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && pid) {
      fetchStudentDetails();
    }
  }, [isOpen, pid]);

  const fetchStudentDetails = async () => {
    if (!pid) return;
    setLoading(true);
    try {
      const data = await getStudentDetails(pid);
      setStudent(data);
    } catch (err) {
      console.error('Error fetching student details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !pid) return null;

  return (
    <div className="details-modal-overlay" onClick={onClose}>
      <div className="details-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="details-modal-close" onClick={onClose}>
          ✕
        </button>

        {loading ? (
          <div className="details-loading">Loading student details...</div>
        ) : student ? (
          <div className="details-body">
            <h2>Student Information</h2>

            {/* Student Photo */}
            <div className="details-photo-section">
              {student.photoPath ? (
                <img
                  src={`https://localhost:7257/Uploads/${student.photoPath}`}
                  alt={`${student.firstName} ${student.lastName}`}
                  className="details-student-photo"
                  onError={(e) => {
                    console.error('Failed to load photo:', student.photoPath);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="details-photo-placeholder">📷</div>
              )}
            </div>

            <div className="details-sections">
              <div className="details-section">
                <h3>📋 Personal Information</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">
                      {student.firstName} {student.middleName} {student.lastName}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date of Birth:</span>
                    <span className="detail-value">
                      {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Gender:</span>
                    <span className="detail-value">{student.personalDetails?.gender || student.gender || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Blood Group:</span>
                    <span className="detail-value">{student.bloodGroup || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Nationality:</span>
                    <span className="detail-value">{student.personalDetails?.nationality || student.nationality || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Marital Status:</span>
                    <span className="detail-value">{student.maritalStatus || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Age:</span>
                    <span className="detail-value">{student.age || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Place of Birth:</span>
                    <span className="detail-value">{student.placeOfBirth || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h3>📧 Contact Information</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{student.contactDetail?.email || student.email || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Alternate Email:</span>
                    <span className="detail-value">{student.contactDetail?.alternateEmail || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Primary Mobile:</span>
                    <span className="detail-value">{student.contactDetail?.primaryMobile || student.contactNumber || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Secondary Mobile:</span>
                    <span className="detail-value">{student.contactDetail?.secondaryMobile || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Enrollment Number:</span>
                    <span className="detail-value">{student.enrollmentNumber || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {student.addresses && student.addresses.length > 0 && (
                <div className="details-section">
                  <h3>📍 Address Information</h3>
                  {student.addresses.map((addr: any, idx: number) => (
                    <div key={idx} style={{ marginBottom: idx < student.addresses.length - 1 ? '20px' : '0' }}>
                      <h4 style={{ margin: '0 0 12px 0', color: '#666', fontSize: '0.9rem', fontWeight: '600' }}>
                        {addr.addressType || 'Address'} #{idx + 1}
                      </h4>
                      <div className="details-grid">
                        <div className="detail-item">
                          <span className="detail-label">Type:</span>
                          <span className="detail-value">{addr.addressType || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Street:</span>
                          <span className="detail-value">{addr.street || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">City:</span>
                          <span className="detail-value">{addr.city || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">District:</span>
                          <span className="detail-value">{addr.district || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Province:</span>
                          <span className="detail-value">{addr.province || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Postal Code:</span>
                          <span className="detail-value">{addr.postalCode || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {student.contactDetail && (
                <div className="details-section">
                  <h3>🏛️ Citizenship Information</h3>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Citizenship Number:</span>
                      <span className="detail-value">{student.citizenshipDetail?.citizenshipNumber || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Issue Date:</span>
                      <span className="detail-value">{student.citizenshipDetail?.issueDate ? new Date(student.citizenshipDetail.issueDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Issue District:</span>
                      <span className="detail-value">{student.citizenshipDetail?.issueDistrict || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}

              {student.academicEnrollment && (
                <div className="details-section">
                  <h3>🎓 Academic Information</h3>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Faculty:</span>
                      <span className="detail-value">{student.academicEnrollment.faculty || student.faculty || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Program:</span>
                      <span className="detail-value">{student.academicEnrollment.program || student.program || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Level:</span>
                      <span className="detail-value">{student.level || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Semester:</span>
                      <span className="detail-value">{student.semester || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}

              {student.bankDetail && (
                <div className="details-section">
                  <h3>🏦 Bank Information</h3>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Account Holder Name:</span>
                      <span className="detail-value">{student.bankDetail.accountHolderName || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Bank Name:</span>
                      <span className="detail-value">{student.bankDetail.bankName || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Account Number:</span>
                      <span className="detail-value">{student.bankDetail.accountNumber || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Branch:</span>
                      <span className="detail-value">{student.bankDetail.branch || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}

              {student.financialDetail && (
                <div className="details-section">
                  <h3>💰 Financial Information</h3>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Fee Category:</span>
                      <span className="detail-value">{student.financialDetail.feeCategory || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Scholarship Type:</span>
                      <span className="detail-value">{student.financialDetail.scholarshipType || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}

              {student.parentGuardians && student.parentGuardians.length > 0 && (
                <div className="details-section">
                  <h3>👨‍👩‍👧 Parent/Guardian Information</h3>
                  {student.parentGuardians.map((pg: any, idx: number) => (
                    <div key={idx} style={{ marginBottom: idx < student.parentGuardians.length - 1 ? '20px' : '0' }}>
                      <h4 style={{ margin: '0 0 12px 0', color: '#666', fontSize: '0.9rem', fontWeight: '600' }}>
                        {pg.relationship || 'Guardian'} #{idx + 1}
                      </h4>
                      <div className="details-grid">
                        <div className="detail-item">
                          <span className="detail-label">Name:</span>
                          <span className="detail-value">{pg.name || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Relationship:</span>
                          <span className="detail-value">{pg.relationship || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Contact:</span>
                          <span className="detail-value">{pg.contact || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Occupation:</span>
                          <span className="detail-value">{pg.occupation || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {student.documents && student.documents.length > 0 && (
                <div className="details-section">
                  <h3>📄 Documents</h3>
                  <div className="details-grid">
                    {student.documents.map((doc: any, idx: number) => (
                      <div key={idx} className="detail-item">
                        <span className="detail-label">Document {idx + 1}:</span>
                        <span className="detail-value">{doc.documentType || 'N/A'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button className="close-details-btn" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <div className="details-error">Failed to load student details.</div>
        )}
      </div>
    </div>
  );
};
