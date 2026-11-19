import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { DestinationCover } from '../components/TropicalVisuals';
import { useAuth } from '../context/useAuth';
import './AuthPages.css';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const from = location.state?.from?.pathname || '/dashboard';

  function handleFillDemo(account = 'joy') {
    if (account === 'tonmoy') {
      setEmail('ranatonmoy33@gmail.com');
      setPassword('tonmoy1234');
    } else {
      setEmail('bijoyhasan1612@gmail.com');
      setPassword('@1111111');
    }
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    setSubmitting(true);
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Could not sign in.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="tf-auth-page">
      <div className="tf-auth-card-wrap">
        <div className="tf-auth-card">
          <DestinationCover destination="Cox's Bazar" height="mini" />

          <div className="tf-auth-card__body">
            <div className="tf-auth-card__header">
              <h1 className="tf-auth-card__title">Sign in to TripForge</h1>
              <p className="tf-auth-card__subtitle">
                Open your shared trips and collaborate with your group.
              </p>
            </div>

            <form className="form-stack" onSubmit={handleSubmit} noValidate>
              {error && (
                <div className="form-error" role="alert">
                  {error}
                </div>
              )}

              <div className="form-field">
                <label htmlFor="login-email" className="form-label">
                  Email address
                </label>
                <input
                  id="login-email"
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
                <label htmlFor="login-password" className="form-label">
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="tf-auth-demo-box">
              <div className="tf-auth-demo-row">
                <div>
                  <p className="tf-auth-demo-title">Demo account · Joy</p>
                  <p className="tf-auth-demo-creds">
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleFillDemo('joy')}
                >
                  Fill credentials
                </button>
              </div>

              <div className="tf-auth-demo-divider" />

              <div className="tf-auth-demo-row">
                <div>
                  <p className="tf-auth-demo-title">Demo account · Tonmoy</p>
                  <p className="tf-auth-demo-creds">
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleFillDemo('tonmoy')}
                >
                  Fill credentials
                </button>
              </div>
            </div>

            <p className="tf-auth-switch">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="tf-auth-link">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
