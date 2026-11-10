import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { getItinerary } from '../../api/itineraryApi';
import { deleteTrip, getRecentUpdates, updateTrip } from '../../api/tripsApi';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import { BellIcon, EditIcon, TrashIcon } from '../../components/Icons';
import Loader from '../../components/Loader';
import MapView from '../../components/MapView';
import Modal from '../../components/Modal';
import { DestinationCover, MemberAvatarStack } from '../../components/TropicalVisuals';
import WeatherCard from '../../components/WeatherCard';
import { useAuth } from '../../context/useAuth';
import {
  formatDateRange,
  formatTimestamp,
  getTripDays,
  isEndDateValid,
} from '../../utils/dateUtils';
import { formatCurrency, pluralize } from '../../utils/formatters';
import './TripModules.css';

export default function TripOverviewPage() {
  const { trip, refreshTrip } = useOutletContext();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [updates, setUpdates] = useState([]);
  const [updatesLoading, setUpdatesLoading] = useState(true);
  const [updatesError, setUpdatesError] = useState('');
  const [activities, setActivities] = useState([]);
  const [reloadKey, setReloadKey] = useState(0);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: trip.name,
    destination: trip.destination,
    startDate: trip.startDate,
    endDate: trip.endDate,
    budget: String(trip.budget ?? 0),
    description: trip.description || '',
  });
  const [editError, setEditError] = useState('');
  const [saving, setSaving] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchOverviewData() {
      try {
        const [updatesData, itineraryData] = await Promise.all([
          getRecentUpdates(trip.id),
          getItinerary(trip.id),
        ]);
        if (!active) return;
        setUpdates(updatesData);
        setActivities(itineraryData);
        setUpdatesError('');
      } catch (err) {
        if (!active) return;
        setUpdatesError(err.message || 'Unable to load recent updates.');
      } finally {
        if (active) setUpdatesLoading(false);
      }
    }

    fetchOverviewData();
    return () => {
      active = false;
    };
  }, [trip.id, reloadKey]);

  function handleRetryUpdates() {
    setUpdatesLoading(true);
    setUpdatesError('');
    setReloadKey((k) => k + 1);
  }

  function openEditModal() {
    setEditForm({
      name: trip.name,
      destination: trip.destination,
      startDate: trip.startDate,
      endDate: trip.endDate,
      budget: String(trip.budget ?? 0),
      description: trip.description || '',
    });
    setEditError('');
    setEditOpen(true);
  }

  async function handleSaveTrip(event) {
    event.preventDefault();
    setEditError('');

    if (!editForm.name.trim() || !editForm.destination.trim()) {
      setEditError('Trip name and destination are required.');
      return;
    }
    if (!isEndDateValid(editForm.startDate, editForm.endDate)) {
      setEditError('End date must be on or after the start date.');
      return;
    }

    setSaving(true);
    try {
      await updateTrip(trip.id, editForm, user);
      setEditOpen(false);
      await refreshTrip();
      setReloadKey((k) => k + 1);
    } catch (err) {
      setEditError(err.message || 'Could not update trip.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteTrip() {
    setDeleting(true);
    try {
      await deleteTrip(trip.id);
      navigate('/dashboard', { replace: true });
    } catch {
      setDeleting(false);
      setDeleteOpen(false);
    }
  }

  const dayCount = getTripDays(trip.startDate, trip.endDate).length;

  return (
    <div className="tf-mod-stack">
      <section className="tf-overview-hero">
        <DestinationCover
          destination={trip.destination}
          name={trip.name}
          height="hero"
        >
          <div className="tf-overview-hero__top">
            <span className="tf-overview-hero__pill">{trip.userRole}</span>
            <MemberAvatarStack
              members={trip.membersPreview}
              totalCount={trip.memberCount}
            />
          </div>
        </DestinationCover>

        <div className="tf-overview-hero__body">
          <div className="tf-overview-hero__head">
            <div>
              <h1 className="tf-mod-title">{trip.name}</h1>
              <p className="tf-mod-subtitle">
                {trip.destination} · {formatDateRange(trip.startDate, trip.endDate)}
              </p>
            </div>

            <div className="inline-actions">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={openEditModal}
              >
                <EditIcon size={14} />
                Edit trip
              </button>
              {trip.userRole === 'Trip Creator' && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setDeleteOpen(true)}
                >
                  <TrashIcon size={14} />
                  Delete
                </button>
              )}
            </div>
          </div>

          <div className="tf-overview-facts">
            <div className="tf-fact-box">
              <p className="tf-fact-label">Destination</p>
              <p className="tf-fact-value">{trip.destination}</p>
            </div>
            <div className="tf-fact-box">
              <p className="tf-fact-label">Duration</p>
              <p className="tf-fact-value">{pluralize(dayCount, 'day')}</p>
            </div>
            <div className="tf-fact-box">
              <p className="tf-fact-label">Group budget</p>
              <p className="tf-fact-value">
                {Number(trip.budget) > 0 ? formatCurrency(trip.budget) : 'Not set'}
              </p>
            </div>
            <div className="tf-fact-box">
              <p className="tf-fact-label">Members</p>
              <p className="tf-fact-value">{pluralize(trip.memberCount, 'member')}</p>
            </div>
          </div>

          {trip.description && (
            <p className="tf-overview-desc">{trip.description}</p>
          )}
        </div>
      </section>

      <div className="tf-two-col">
        <MapView
          destination={trip.destination}
          coordinates={trip.coordinates}
          activities={activities}
        />
        <WeatherCard destination={trip.destination} />
      </div>

      <Card
        title="Recent updates"
        subtitle="Latest changes made by trip members"
      >
        {updatesLoading ? (
          <Loader inline label="Loading updates..." />
        ) : updatesError ? (
          <ErrorState message={updatesError} onRetry={handleRetryUpdates} />
        ) : updates.length === 0 ? (
          <EmptyState
            icon={<BellIcon size={18} />}
            title="No updates yet"
            description="Activity logs will appear here as members add itinerary stops, ideas, polls, and expenses."
          />
        ) : (
          <ul className="tf-updates-list">
            {updates.slice(0, 8).map((item) => (
              <li key={item.id} className="tf-update-row">
                <span>{item.text}</span>
                <span className="tf-update-time">{formatTimestamp(item.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit trip details"
      >
        <form className="form-stack" onSubmit={handleSaveTrip}>
          {editError && (
            <div className="form-error" role="alert">
              {editError}
            </div>
          )}

          <div className="form-field">
            <label htmlFor="edit-trip-name" className="form-label">
              Trip name
            </label>
            <input
              id="edit-trip-name"
              type="text"
              className="form-input"
              value={editForm.name}
              onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="edit-trip-dest" className="form-label">
              Destination
            </label>
            <input
              id="edit-trip-dest"
              type="text"
              className="form-input"
              value={editForm.destination}
              onChange={(e) => setEditForm((f) => ({ ...f, destination: e.target.value }))}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="edit-trip-start" className="form-label">
                Start date
              </label>
              <input
                id="edit-trip-start"
                type="date"
                className="form-input"
                value={editForm.startDate}
                onChange={(e) => setEditForm((f) => ({ ...f, startDate: e.target.value }))}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="edit-trip-end" className="form-label">
                End date
              </label>
              <input
                id="edit-trip-end"
                type="date"
                className="form-input"
                min={editForm.startDate || undefined}
                value={editForm.endDate}
                onChange={(e) => setEditForm((f) => ({ ...f, endDate: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="edit-trip-budget" className="form-label">
              Group budget (BDT)
            </label>
            <input
              id="edit-trip-budget"
              type="number"
              min="0"
              step="50"
              className="form-input"
              value={editForm.budget}
              onChange={(e) => setEditForm((f) => ({ ...f, budget: e.target.value }))}
            />
          </div>

          <div className="form-field">
            <label htmlFor="edit-trip-desc" className="form-label">
              Description
            </label>
            <textarea
              id="edit-trip-desc"
              className="form-textarea"
              value={editForm.description}
              onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div className="inline-actions" style={{ justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setEditOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete this trip?"
        subtitle="This removes the workspace and all mock trip items from your current session."
        size="sm"
      >
        <div className="inline-actions" style={{ justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setDeleteOpen(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleDeleteTrip}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Confirm delete'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
