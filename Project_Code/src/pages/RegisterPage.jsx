import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { DestinationCover } from '../components/TropicalVisuals';
import { useAuth } from '../context/useAuth';
import './AuthPages.css';

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [university, setUniversity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter your mobile number.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await register({ name, email, password, phone, university });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Could not create account.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="tf-auth-page">
      <div className="tf-auth-card-wrap">
        <div className="tf-auth-card">
          <DestinationCover destination="Sylhet" height="mini" />

          <div className="tf-auth-card__body">
            <div className="tf-auth-card__header">
              <h1 className="tf-auth-card__title">Create your TripForge account</h1>
              <p className="tf-auth-card__subtitle">
                Start planning group trips with friends or classmates.
              </p>
            </div>

            <form className="form-stack" onSubmit={handleSubmit} noValidate>
              {error && (
                <div className="form-error" role="alert">
                  {error}
                </div>
              )}

              <div className="form-field">
                <label htmlFor="register-name" className="form-label">
                  Full name
                </label>
                <input
                  id="register-name"
                  type="text"
                  className="form-input"
                  placeholder="Enter Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="register-email" className="form-label">
                  Email address
                </label>
                <input
                  id="register-email"
                  type="email"
                  className="form-input"
                  placeholder="name@campus.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="register-phone" className="form-label">
                  Mobile number
                </label>
                <input
                  id="register-phone"
                  type="tel"
                  className="form-input"
                  placeholder="e.g., +880 1*********"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="register-university" className="form-label">
                  University (optional)
                </label>
                <input
                  id="register-university"
                  type="text"
                  className="form-input"
                  placeholder="e.g., Daffodil International University"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="register-password" className="form-label">
                    Password
                  </label>
                  <input
                    id="register-password"
                    type="password"
                    className="form-input"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="register-confirm" className="form-label">
                    Confirm password
                  </label>
                  <input
                    id="register-confirm"
                    type="password"
                    className="form-input"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <p className="tf-auth-switch">
              Already have an account?{' '}
              <Link to="/login" className="tf-auth-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
