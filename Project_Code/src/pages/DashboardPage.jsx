import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUnreadNotificationCount } from '../api/notificationsApi';
import {
  cancelUserPendingRequest,
  getTrips,
  getUserPendingRequests,
  joinTripByCode,
} from '../api/tripsApi';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import {
  ArrowRightIcon,
  BellIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  CompassIcon,
  MapPinIcon,
  PlusIcon,
  SunIcon,
} from '../components/Icons';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import { DestinationCover, MemberAvatarStack } from '../components/TropicalVisuals';
import { useAuth } from '../context/useAuth';
import { formatDateRange, formatFullDate } from '../utils/dateUtils';
import { formatCurrency, pluralize } from '../utils/formatters';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const userId = user?.id;
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const [joinOpen, setJoinOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [joining, setJoining] = useState(false);
  const [joinSuccessInfo, setJoinSuccessInfo] = useState(null);
  const [cancelingReqId, setCancelingReqId] = useState(null);

  useEffect(() => {
    if (!userId) return undefined;
    let active = true;

    async function fetchDashboard() {
      try {
        const [tripsData, unread, pendingData] = await Promise.all([
          getTrips(userId),
          getUnreadNotificationCount(),
          getUserPendingRequests(userId),
        ]);
        if (!active) return;
        setTrips(tripsData);
        setUnreadCount(unread);
        setPendingRequests(pendingData);
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
      const result = await joinTripByCode(inviteCode, user);
      if (result.status === 'pending') {
        setJoinSuccessInfo(result);
        const updated = await getUserPendingRequests(userId);
        setPendingRequests(updated);
        setInviteCode('');
      } else if (result.id) {
        setJoinOpen(false);
        setInviteCode('');
        navigate(`/trips/${result.id}/overview`);
      }
    } catch (err) {
      setJoinError(err.message || 'Unable to join trip.');
    } finally {
      setJoining(false);
    }
  }

  async function handleCancelPending(requestId) {
    setCancelingReqId(requestId);
    try {
      await cancelUserPendingRequest(requestId, userId);
      setPendingRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
      alert(err.message || 'Could not cancel join request.');
    } finally {
      setCancelingReqId(null);
    }
  }

  function handleOpenJoinModal() {
    setJoinError('');
    setJoinSuccessInfo(null);
    setInviteCode('');
    setJoinOpen(true);
  }

  function handleCloseJoinModal() {
    setJoinOpen(false);
    setJoinError('');
    setJoinSuccessInfo(null);
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
            <SunIcon size={12} />
            EXPEDITIONS // {pluralize(trips.length, 'ACTIVE DOSSIER')}
          </span>
          <h1 className="page-title">Ready for your next expedition, <em className="serif-accent">{firstName}</em>?</h1>
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
            onClick={handleOpenJoinModal}
          >
            Join with code
          </button>
          <Link to="/trips/new" className="btn btn-primary">
            <PlusIcon size={16} />
            Create trip
          </Link>
        </div>
      </section>

      {!loading && !error && pendingRequests.length > 0 && (
        <section className="tf-pending-section" aria-labelledby="pending-requests-title">
          <div className="tf-pending-section__header">
            <div>
              <span className="badge badge-warm tf-pending-section__badge">
                <ClockIcon size={12} />
                AWAITING APPROVAL // {pluralize(pendingRequests.length, 'DOSSIER')}
              </span>
              <h2 id="pending-requests-title" className="tf-pending-section__title">
                Pending join requests
              </h2>
              <p className="tf-pending-section__subtitle">
                The trip creator must approve your request before you can access the workspace.
              </p>
            </div>
          </div>

          <div className="tf-pending-grid">
            {pendingRequests.map((req) => (
              <div key={req.id} className="tf-pending-card">
                <div className="tf-pending-card__body">
                  <div className="tf-pending-card__meta">
                    <span className="badge badge-warm">
                      <ClockIcon size={11} />
                      Pending approval
                    </span>
                    <span className="tf-pending-card__date">
                      {formatFullDate(req.requestedAt?.slice(0, 10))}
                    </span>
                  </div>

                  <h3 className="tf-pending-card__name">{req.tripName || 'Trip'}</h3>

                  {req.destination && (
                    <p className="tf-pending-card__dest">
                      <MapPinIcon size={13} />
                      {req.destination}
                    </p>
                  )}

                  <p className="tf-pending-card__desc">
                    Your request was received and is awaiting creator review.
                  </p>
                </div>

                <div className="tf-pending-card__footer">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm tf-pending-card__cancel"
                    onClick={() => handleCancelPending(req.id)}
                    disabled={cancelingReqId === req.id}
                  >
                    {cancelingReqId === req.id ? 'Canceling...' : 'Cancel request'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
                onClick={handleOpenJoinModal}
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
        onClose={handleCloseJoinModal}
        title={joinSuccessInfo ? 'Join request submitted' : 'Join a trip'}
        subtitle={
          joinSuccessInfo
            ? 'Your request has been sent to the trip creator.'
            : 'Enter the invite code shared by your group.'
        }
        size="sm"
      >
        {joinSuccessInfo ? (
          <div className="tf-join-success">
            <div className="tf-join-success__icon" aria-hidden="true">
              <CheckIcon size={24} />
            </div>
            <div className="tf-join-success__details">
              <p className="tf-join-success__trip">{joinSuccessInfo.trip?.name}</p>
              {joinSuccessInfo.trip?.destination && (
                <p className="tf-join-success__dest">
                  <MapPinIcon size={13} />
                  {joinSuccessInfo.trip?.destination}
                </p>
              )}
              <div className="badge badge-warm tf-join-success__badge">
                <ClockIcon size={12} />
                Awaiting Trip Creator approval
              </div>
              <p className="tf-join-success__msg">
                The trip creator has been notified. Once approved, this trip will appear in your active expeditions dossier.
              </p>
            </div>
            <div className="inline-actions" style={{ justifyContent: 'flex-end', width: '100%' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCloseJoinModal}
              >
                Got it
              </button>
            </div>
          </div>
        ) : (
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
                Demo tip: try <code>6767</code> to request joining Sajek Valley Cloud Trek.
              </span>
            </div>
            <div className="inline-actions" style={{ justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseJoinModal}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={joining}>
                {joining ? 'Submitting...' : 'Request to join'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </main>
  );
}
