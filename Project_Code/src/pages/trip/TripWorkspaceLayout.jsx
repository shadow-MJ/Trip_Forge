import { useCallback, useEffect, useState } from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';
import { getTripById } from '../../api/tripsApi';
import ErrorState from '../../components/ErrorState';
import Loader from '../../components/Loader';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/useAuth';
import './TripWorkspaceLayout.css';

export default function TripWorkspaceLayout() {
  const { tripId } = useParams();
  const { user } = useAuth();
  const userId = user?.id;

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!tripId || !userId) return undefined;
    let active = true;

    async function fetchTrip() {
      try {
        const data = await getTripById(tripId, userId);
        if (!active) return;
        setTrip(data);
        setError('');
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Could not open trip workspace.');
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchTrip();
    return () => {
      active = false;
    };
  }, [tripId, userId, reloadKey]);

  const refreshTrip = useCallback(async () => {
    if (!tripId || !userId) return;
    const data = await getTripById(tripId, userId);
    setTrip(data);
  }, [tripId, userId]);

  function handleRetry() {
    setLoading(true);
    setError('');
    setReloadKey((k) => k + 1);
  }

  if (loading) {
    return (
      <div className="container page-section">
        <Loader label="Loading trip workspace..." />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="container page-section">
        <ErrorState
          title="Trip workspace unavailable"
          message={error || 'This trip could not be found.'}
          onRetry={handleRetry}
        />
        <div style={{ marginTop: 'var(--space-4)' }}>
          <Link to="/dashboard" className="btn btn-secondary btn-sm">
            Return to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-section">
      <div className="tf-workspace">
        <Sidebar trip={trip} />
        <main className="tf-workspace__content">
          <Outlet key={trip.id} context={{ trip, refreshTrip }} />
        </main>
      </div>
    </div>
  );
}
