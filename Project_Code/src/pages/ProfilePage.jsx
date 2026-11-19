import { useEffect, useState } from 'react';
import { getTrips } from '../api/tripsApi';
import Card from '../components/Card';
import ErrorState from '../components/ErrorState';
import Loader from '../components/Loader';
import { useAuth } from '../context/useAuth';
import { formatFullDate } from '../utils/dateUtils';
import { getInitials } from '../utils/formatters';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const userId = user?.id;

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [university, setUniversity] = useState(user?.university || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [bio, setBio] = useState(user?.bio || '');

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');

  const [trips, setTrips] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState('');

  useEffect(() => {
    if (!userId) return undefined;
    let active = true;

    async function loadStats() {
      try {
        const list = await getTrips(userId);
        if (active) {
          setTrips(list);
          setStatsError('');
        }
      } catch (err) {
        if (active) setStatsError(err.message || 'Unable to load trip stats.');
      } finally {
        if (active) setStatsLoading(false);
      }
    }

    loadStats();
    return () => {
      active = false;
    };
  }, [userId]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaveError('');
    setSaveMessage('');

    if (!name.trim()) {
      setSaveError('Name cannot be empty.');
      return;
    }

    setSaving(true);
    try {
      await updateProfile({ name, phone, university, department, bio });
      setSaveMessage('Profile updated.');
    } catch (err) {
      setSaveError(err.message || 'Could not update profile.');
    } finally {
      setSaving(false);
    }
  }

  const createdCount = trips.filter((t) => t.userRole === 'Trip Creator').length;
  const memberCount = trips.filter((t) => t.userRole === 'Trip Member').length;

  return (
    <main className="container page-section">
      <div className="tf-profile__wrap">
        <div className="page-header">
          <div>
            <h1 className="page-title">Profile</h1>
            <p className="page-subtitle">
              Manage how your name and details appear to trip collaborators.
            </p>
          </div>
        </div>

        <div className="tf-profile__grid">
          <Card>
            <div className="tf-profile__identity">
              <div className="tf-profile__avatar">{getInitials(user?.name)}</div>
              <div>
                <h2 className="tf-profile__name">{user?.name}</h2>
                <p className="tf-profile__email">{user?.email}</p>
                {user?.phone && <p className="tf-profile__email">{user?.phone}</p>}
                {(user?.university || user?.department) && (
                  <p className="tf-profile__affiliation">
                    {[user?.department, user?.university].filter(Boolean).join(' · ')}
                  </p>
                )}
                {user?.createdAt && (
                  <p className="tf-profile__since">
                    Member since {formatFullDate(user.createdAt.slice(0, 10))}
                  </p>
                )}
              </div>
            </div>

            <hr className="divider" />

            {statsLoading ? (
              <Loader inline label="Loading trip activity..." />
            ) : statsError ? (
              <ErrorState message={statsError} />
            ) : (
              <div className="tf-profile__stats">
                <div className="tf-profile__stat-box">
                  <span className="tf-profile__stat-num">{trips.length}</span>
                  <span className="tf-profile__stat-label">Active trips</span>
                </div>
                <div className="tf-profile__stat-box">
                  <span className="tf-profile__stat-num">{createdCount}</span>
                  <span className="tf-profile__stat-label">Trip Creator</span>
                </div>
                <div className="tf-profile__stat-box">
                  <span className="tf-profile__stat-num">{memberCount}</span>
                  <span className="tf-profile__stat-label">Trip Member</span>
                </div>
              </div>
            )}
          </Card>

          <Card title="Edit profile" subtitle="Changes apply across your trip workspaces.">
            <form className="form-stack" onSubmit={handleSubmit}>
              {saveError && (
                <div className="form-error" role="alert">
                  {saveError}
                </div>
              )}
              {saveMessage && (
                <div className="tf-profile__saved" role="status">
                  {saveMessage}
                </div>
              )}

              <div className="form-field">
                <label htmlFor="profile-name" className="form-label">
                  Full name
                </label>
                <input
                  id="profile-name"
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="profile-email" className="form-label">
                  Email address
                </label>
                <input
                  id="profile-email"
                  type="email"
                  className="form-input"
                  value={user?.email || ''}
                  disabled
                />
                <span className="form-hint">
                  Email changes will be supported after backend integration.
                </span>
              </div>

              <div className="form-field">
                <label htmlFor="profile-phone" className="form-label">
                  Mobile number
                </label>
                <input
                  id="profile-phone"
                  type="tel"
                  className="form-input"
                  placeholder="e.g., +880 1712-345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="profile-university" className="form-label">
                  University or group
                </label>
                <input
                  id="profile-university"
                  type="text"
                  className="form-input"
                  placeholder="e.g., Daffodil International University"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="profile-department" className="form-label">
                  Department
                </label>
                <input
                  id="profile-department"
                  type="text"
                  className="form-input"
                  placeholder="e.g., Software Engineering"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="profile-bio" className="form-label">
                  Short bio
                </label>
                <textarea
                  id="profile-bio"
                  className="form-textarea"
                  placeholder="Share travel style or planning strengths..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </main>
  );
}
