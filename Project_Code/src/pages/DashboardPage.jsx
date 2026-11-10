import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUnreadNotificationCount } from '../api/notificationsApi';
import { getTrips, joinTripByCode } from '../api/tripsApi';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import {
  ArrowRightIcon,
  BellIcon,
  CalendarIcon,
  CompassIcon,
  MapPinIcon,
  PlusIcon,
  SunIcon,
} from '../components/Icons';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import { DestinationCover, MemberAvatarStack } from '../components/TropicalVisuals';
import { useAuth } from '../context/useAuth';
import { formatDateRange } from '../utils/dateUtils';
import { formatCurrency, pluralize } from '../utils/formatters';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const userId = user?.id;
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const [joinOpen, setJoinOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (!userId) return undefined;
    let active = true;

    async function fetchDashboard() {
      try {
        const [tripsData, unread] = await Promise.all([
          getTrips(userId),
          getUnreadNotificationCount(),
        ]);
        if (!active) return;
        setTrips(tripsData);
        setUnreadCount(unread);
        setError('');
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Unable to load your trips.');
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchDashboard();
    return () => {
      active = false;
    };
  }, [userId, reloadKey]);

  function handleRetry() {
    setLoading(true);
    setError('');
    setReloadKey((k) => k + 1);
  }

  async function handleJoinTrip(event) {
    event.preventDefault();
    setJoinError('');
    if (!inviteCode.trim()) {
      setJoinError('Please enter an invite code.');
      return;
    }

    setJoining(true);
    try {
      const joinedTrip = await joinTripByCode(inviteCode, user);
      setJoinOpen(false);
      setInviteCode('');
      navigate(`/trips/${joinedTrip.id}/overview`);
    } catch (err) {
      setJoinError(err.message || 'Unable to join trip.');
    } finally {
      setJoining(false);
    }
  }

  const filteredTrips = trips.filter((trip) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      trip.name.toLowerCase().includes(q) ||
      trip.destination.toLowerCase().includes(q)
    );
  });

  const firstName = user?.name?.split(' ')[0] || 'traveler';

  return (
    <main className="container page-section">
      <section className="tf-dash-hero">
        <div>
          <span className="badge badge-warm tf-dash-hero__badge">
            <SunIcon size={13} />
            Trip hub · {pluralize(trips.length, 'active escape')}
          </span>
          <h1 className="page-title">Ready for your next trip, {firstName}?</h1>
          <p className="page-subtitle">
            Keep itineraries, group polls, and BDT expenses moving smoothly together.
          </p>
        </div>

        <div className="inline-actions tf-dash-hero__actions">
          <Link to="/notifications" className="btn btn-secondary">
            <BellIcon size={15} />
            Notifications
            {unreadCount > 0 && <span className="badge badge-warm">{unreadCount}</span>}
          </Link>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setJoinError('');
              setJoinOpen(true);
            }}
          >
            Join with code
          </button>
          <Link to="/trips/new" className="btn btn-primary">
            <PlusIcon size={16} />
            Create trip
          </Link>
        </div>
      </section>

      {!loading && !error && trips.length > 0 && (
        <div className="tf-dashboard__toolbar">
          <div className="tf-dashboard__search">
            <label htmlFor="trip-search" className="sr-only">
              Search trips
            </label>
            <input
              id="trip-search"
              type="search"
              className="form-input"
              placeholder="Search trips by name or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <span className="tf-dashboard__count">
            Showing {pluralize(filteredTrips.length, 'trip')}
          </span>
        </div>
      )}

      {loading ? (
        <Loader label="Loading your trips..." />
      ) : error ? (
        <ErrorState title="Could not load trips" message={error} onRetry={handleRetry} />
      ) : trips.length === 0 ? (
        <EmptyState
          icon={<CompassIcon size={20} />}
          title="No trips yet"
          description="Create your first collaborative trip workspace or join a friend's trip using an invite code."
          action={
            <div className="inline-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setJoinOpen(true)}
              >
                Join with code
              </button>
              <Link to="/trips/new" className="btn btn-primary">
                <PlusIcon size={16} />
                Create trip
              </Link>
            </div>
          }
        />
      ) : filteredTrips.length === 0 ? (
        <EmptyState
          icon={<CompassIcon size={20} />}
          title="No matching trips"
          description={`No trips match "${searchQuery}".`}
          action={
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setSearchQuery('')}
            >
              Clear search
            </button>
          }
        />
      ) : (
        <div className="tf-dashboard__grid">
          {filteredTrips.map((trip) => {
            const hasBudget = Number(trip.budget) > 0;
            const spendPercent = hasBudget
              ? Math.min(100, Math.round((Number(trip.totalSpent || 0) / Number(trip.budget)) * 100))
              : 0;

            return (
              <Link
                key={trip.id}
                to={`/trips/${trip.id}/overview`}
                className="tf-trip-card"
              >
                <DestinationCover
                  destination={trip.destination}
                  name={trip.name}
                  height="card"
                >
                  <div className="tf-trip-card__cover-top">
                    <span className="tf-trip-card__role">{trip.userRole}</span>
                    <span className="tf-trip-card__arrow" aria-hidden="true">
                      <ArrowRightIcon size={14} />
                    </span>
                  </div>
                </DestinationCover>

                <div className="tf-trip-card__body">
                  <h2 className="tf-trip-card__title">{trip.name}</h2>

                  <div className="tf-trip-card__meta">
                    <span className="tf-trip-card__meta-item">
                      <MapPinIcon size={14} />
                      {trip.destination}
                    </span>
                    <span className="tf-trip-card__meta-item">
                      <CalendarIcon size={14} />
                      {formatDateRange(trip.startDate, trip.endDate)}
                    </span>
                  </div>

                  <div className="tf-trip-card__footer">
                    <div className="tf-trip-card__members">
                      <MemberAvatarStack
                        members={trip.membersPreview}
                        totalCount={trip.memberCount}
                        maxShown={3}
                      />
                      <span>{pluralize(trip.memberCount, 'member')}</span>
                    </div>

                    <div className="tf-trip-card__budget">
                      <span className="tf-trip-card__stat">
                        {hasBudget
                          ? `${formatCurrency(trip.totalSpent)} / ${formatCurrency(trip.budget)}`
                          : `${formatCurrency(trip.totalSpent)} spent`}
                      </span>
                      {hasBudget && (
                        <div className="progress-track tf-trip-card__bar" aria-hidden="true">
                          <div
                            className="progress-fill"
                            style={{ width: `${spendPercent}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={joinOpen}
        onClose={() => setJoinOpen(false)}
        title="Join a trip"
        subtitle="Enter the invite code shared by your group."
        size="sm"
      >
        <form className="form-stack" onSubmit={handleJoinTrip}>
          {joinError && (
            <div className="form-error" role="alert">
              {joinError}
            </div>
          )}
          <div className="form-field">
            <label htmlFor="join-invite-code" className="form-label">
              Invite code
            </label>
            <input
              id="join-invite-code"
              type="text"
              className="form-input"
              placeholder="e.g., 6767"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              autoFocus
            />
            <span className="form-hint">
              Demo tip: try <code>6767</code> to join Sundarbans River Study Tour.
            </span>
          </div>
          <div className="inline-actions" style={{ justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setJoinOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={joining}>
              {joining ? 'Joining...' : 'Join trip'}
            </button>
          </div>
        </form>
      </Modal>
    </main>
  );
}
