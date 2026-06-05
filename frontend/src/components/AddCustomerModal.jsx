import { useState } from 'react';
import { X, Save } from 'lucide-react';

export default function AddCustomerModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Female',
    city: 'Mumbai',
    state: 'Maharashtra',
    maritalStatus: 'Never Married',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    education: '',
    occupation: '',
    income: '',
    bio: '',
    lifeGoals: {
      wantKids: 'Yes',
      marriageTimeline: '1-2 Years',
      familyValues: 'Moderate',
    },
    lifestyle: {
      smoking: 'No',
      drinking: 'Socially',
      fitness: 'Regular',
      travel: 'Frequent',
      pets: 'Dog lover',
      socialLife: 'Balanced',
    },
    locationPreferences: {
      relocation: 'Open to Relocate',
    },
    personality: {
      social: 'Ambivert',
      valuesStyle: 'Moderate',
    },
    interests: 'Reading, Travel, Photography'
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedChange = (section, name, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      age: parseInt(formData.age) || 28,
      interests: formData.interests.split(',').map(i => i.trim()),
    };
    onSave(finalData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ width: '650px' }}>
        <div className="modal-header">
          <h2 className="modal-title">Register New Customer</h2>
          <button className="drawer-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {/* Core Info */}
            <h3 className="section-title">Personal Details</h3>
            <div className="settings-row-split" style={{ marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" name="name" className="form-input" required value={formData.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Age</label>
                <input type="number" name="age" className="form-input" required value={formData.age} onChange={handleChange} />
              </div>
            </div>

            <div className="settings-row-split" style={{ marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select name="gender" className="form-select" value={formData.gender} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Marital Status</label>
                <select name="maritalStatus" className="form-select" value={formData.maritalStatus} onChange={handleChange}>
                  <option value="Never Married">Never Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
            </div>

            <div className="settings-row-split" style={{ marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">City</label>
                <input type="text" name="city" className="form-input" required value={formData.city} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input type="text" name="state" className="form-input" required value={formData.state} onChange={handleChange} />
              </div>
            </div>

            <div className="settings-row-split" style={{ marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">Education Background</label>
                <input type="text" name="education" className="form-input" placeholder="e.g. B.Tech from NIT" required value={formData.education} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Occupation / Designation</label>
                <input type="text" name="occupation" className="form-input" placeholder="e.g. Designer at Nike" required value={formData.occupation} onChange={handleChange} />
              </div>
            </div>

            <div className="settings-row-split" style={{ marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">Annual Income (LPA)</label>
                <input type="text" name="income" className="form-input" placeholder="e.g. 15 LPA" required value={formData.income} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Interests & Hobbies (comma-separated)</label>
                <input type="text" name="interests" className="form-input" value={formData.interests} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Profile Biography</label>
              <textarea name="bio" className="form-textarea" required value={formData.bio} onChange={handleChange} />
            </div>

            {/* Life Goals */}
            <h3 className="section-title">Life Goals & Family Values</h3>
            <div className="settings-row-split" style={{ marginBottom: '24px' }}>
              <div className="form-group">
                <label className="form-label">Wants Children?</label>
                <select className="form-select" value={formData.lifeGoals.wantKids} onChange={(e) => handleNestedChange('lifeGoals', 'wantKids', e.target.value)}>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Maybe">Maybe</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Family Values</label>
                <select className="form-select" value={formData.lifeGoals.familyValues} onChange={(e) => handleNestedChange('lifeGoals', 'familyValues', e.target.value)}>
                  <option value="Traditional">Traditional</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Modern">Modern</option>
                </select>
              </div>
            </div>

            {/* Lifestyle */}
            <h3 className="section-title">Lifestyle Preferences</h3>
            <div className="settings-row-split" style={{ marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">Smoking</label>
                <select className="form-select" value={formData.lifestyle.smoking} onChange={(e) => handleNestedChange('lifestyle', 'smoking', e.target.value)}>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="Socially">Socially</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Drinking</label>
                <select className="form-select" value={formData.lifestyle.drinking} onChange={(e) => handleNestedChange('lifestyle', 'drinking', e.target.value)}>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="Socially">Socially</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Save size={14} />
              Register Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
