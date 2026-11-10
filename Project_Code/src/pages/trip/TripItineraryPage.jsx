import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  addActivity,
  deleteActivity,
  getItinerary,
  reorderDayActivity,
  updateActivity,
} from '../../api/itineraryApi';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  EditIcon,
  MapPinIcon,
  PlusIcon,
  TrashIcon,
} from '../../components/Icons';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/useAuth';
import { getTripDays } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatters';
import './TripModules.css';

const EMPTY_FORM = {
  day: 1,
  title: '',
  time: '09:00',
  location: '',
  cost: '',
  notes: '',
};

export default function TripItineraryPage() {
  const { trip } = useOutletContext();
  const { user } = useAuth();

  const days = getTripDays(trip.startDate, trip.endDate);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchItinerary() {
      try {
        const data = await getItinerary(trip.id);
        if (!active) return;
        setActivities(data);
        setError('');
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Unable to load itinerary.');
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchItinerary();
    return () => {
      active = false;
    };
  }, [trip.id, reloadKey]);

  function handleRetry() {
    setLoading(true);
    setError('');
    setReloadKey((k) => k + 1);
  }

  function openAddModal(dayNumber = 1) {
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      day: dayNumber,
    });
    setFormError('');
    setModalOpen(true);
  }

  function openEditModal(activity) {
    setEditingId(activity.id);
    setForm({
      day: activity.day,
      title: activity.title,
      time: activity.time || '09:00',
      location: activity.location || '',
      cost: String(activity.cost ?? 0),
      notes: activity.notes || '',
    });
    setFormError('');
    setModalOpen(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError('');

    if (!form.title.trim()) {
      setFormError('Please enter an activity title.');
      return;
    }
    if (form.cost !== '' && Number(form.cost) < 0) {
      setFormError('Cost cannot be negative.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        day: Number(form.day),
        title: form.title,
        time: form.time || '09:00',
        location: form.location,
        cost: form.cost === '' ? 0 : Number(form.cost),
        notes: form.notes,
      };

      if (editingId) {
        const updated = await updateActivity(trip.id, editingId, payload, user?.name);
        setActivities((prev) =>
          prev.map((item) => (item.id === editingId ? updated : item))
        );
      } else {
        const created = await addActivity(trip.id, payload, user?.name);
        setActivities((prev) => [...prev, created]);
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err.message || 'Could not save activity.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(activityId) {
    try {
      await deleteActivity(trip.id, activityId);
      setActivities((prev) => prev.filter((item) => item.id !== activityId));
    } catch {
      // Keep UI safe
    }
  }

  async function handleReorder(dayNumber, activityId, direction) {
    try {
      const updatedList = await reorderDayActivity(
        trip.id,
        dayNumber,
        activityId,
        direction
      );
      setActivities(updatedList);
    } catch {
      // Keep UI safe
    }
  }

  const totalCost = activities.reduce((sum, item) => sum + Number(item.cost || 0), 0);

  return (
    <div className="tf-mod-stack">
      <div className="tf-mod-header">
        <div>
          <h1 className="tf-mod-title">Itinerary</h1>
          <p className="tf-mod-subtitle">
            Day-by-day shared schedule. Every member can add, edit, or reorder plans.
          </p>
        </div>

        <div className="inline-actions">
          <span className="badge">Total planned: {formatCurrency(totalCost)}</span>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => openAddModal(1)}
          >
            <PlusIcon size={15} />
            Add activity
          </button>
        </div>
      </div>

      {loading ? (
        <Loader label="Loading day-wise itinerary..." />
      ) : error ? (
        <ErrorState message={error} onRetry={handleRetry} />
      ) : days.length === 0 ? (
        <EmptyState
          icon={<CalendarIcon size={20} />}
          title="No trip dates set"
          description="Set valid start and end dates in Overview to generate day columns."
        />
      ) : (
        <>
          {activities.length === 0 && (
            <EmptyState
              icon={<CalendarIcon size={20} />}
              title="No itinerary activities yet"
              description="Start building the plan by adding your first activity to any day column below."
              action={
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => openAddModal(1)}
                >
                  <PlusIcon size={15} />
                  Add first activity
                </button>
              }
            />
          )}

          <div className="tf-itinerary-columns">
            {days.map((day) => {
              const dayItems = activities.filter((item) => item.day === day.dayNumber);
              const dayCost = dayItems.reduce((sum, item) => sum + Number(item.cost || 0), 0);

              return (
                <section key={day.dayNumber} className="tf-day-col" aria-label={day.label}>
                  <div className="tf-day-col__header">
                    <div>
                      <h2 className="tf-day-col__title">{day.label}</h2>
                      <p className="tf-day-col__date">{day.formattedDate}</p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => openAddModal(day.dayNumber)}
                      aria-label={`Add activity to ${day.label}`}
                    >
                      <PlusIcon size={14} />
                      Add
                    </button>
                  </div>

                  <div className="tf-day-col__body">
                    {dayItems.length === 0 ? (
                      <div className="tf-day-col__empty">
                        No activities planned for {day.label}.
                      </div>
                    ) : (
                      dayItems.map((item, idx) => (
                        <article key={item.id} className="tf-activity-card">
                          <div className="tf-activity-card__top">
                            <span className="inline-actions" style={{ gap: '4px' }}>
                              <ClockIcon size={13} />
                              {item.time || 'TBD'}
                            </span>
                            <span>{formatCurrency(item.cost)}</span>
                          </div>

                          <h3 className="tf-activity-card__title">{item.title}</h3>

                          {item.location && (
                            <p className="tf-activity-card__meta">
                              <MapPinIcon size={13} />
                              <span>{item.location}</span>
                            </p>
                          )}

                          {item.notes && (
                            <p className="tf-activity-card__notes">{item.notes}</p>
                          )}

                          <div className="tf-activity-card__actions">
                            <div className="inline-actions" style={{ gap: '2px' }}>
                              <button
                                type="button"
                                className="btn btn-ghost btn-sm btn-icon"
                                onClick={() =>
                                  handleReorder(day.dayNumber, item.id, 'up')
                                }
                                disabled={idx === 0}
                                aria-label="Move activity up"
                                title="Move up"
                              >
                                <ChevronUpIcon size={14} />
                              </button>
                              <button
                                type="button"
                                className="btn btn-ghost btn-sm btn-icon"
                                onClick={() =>
                                  handleReorder(day.dayNumber, item.id, 'down')
                                }
                                disabled={idx === dayItems.length - 1}
                                aria-label="Move activity down"
                                title="Move down"
                              >
                                <ChevronDownIcon size={14} />
                              </button>
                            </div>

                            <div className="inline-actions" style={{ gap: '2px' }}>
                              <button
                                type="button"
                                className="btn btn-ghost btn-sm btn-icon"
                                onClick={() => openEditModal(item)}
                                aria-label={`Edit ${item.title}`}
                                title="Edit"
                              >
                                <EditIcon size={14} />
                              </button>
                              <button
                                type="button"
                                className="btn btn-ghost btn-sm btn-icon"
                                onClick={() => handleDelete(item.id)}
                                aria-label={`Delete ${item.title}`}
                                title="Delete"
                              >
                                <TrashIcon size={14} />
                              </button>
                            </div>
                          </div>
                        </article>
                      ))
                    )}
                  </div>

                  <div className="tf-day-col__footer">
                    <span>{dayItems.length} planned</span>
                    <strong>Day total: {formatCurrency(dayCost)}</strong>
                  </div>
                </section>
              );
            })}
          </div>
        </>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit activity' : 'Add itinerary activity'}
      >
        <form className="form-stack" onSubmit={handleSubmit}>
          {formError && (
            <div className="form-error" role="alert">
              {formError}
            </div>
          )}

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="act-day" className="form-label">
                Day
              </label>
              <select
                id="act-day"
                className="form-select"
                value={form.day}
                onChange={(e) => setForm((f) => ({ ...f, day: Number(e.target.value) }))}
              >
                {days.map((d) => (
                  <option key={d.dayNumber} value={d.dayNumber}>
                    {d.label} ({d.formattedDate})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="act-time" className="form-label">
                Time
              </label>
              <input
                id="act-time"
                type="time"
                className="form-input"
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="act-title" className="form-label">
              Activity title
            </label>
            <input
              id="act-title"
              type="text"
              className="form-input"
              placeholder="e.g., Ferry crossing to island"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="act-location" className="form-label">
                Location
              </label>
              <input
                id="act-location"
                type="text"
                className="form-input"
                placeholder="e.g., Teknaf Jetty"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              />
            </div>

            <div className="form-field">
              <label htmlFor="act-cost" className="form-label">
                Estimated cost (BDT)
              </label>
              <input
                id="act-cost"
                type="number"
                min="0"
                step="50"
                className="form-input"
                placeholder="e.g., 1200"
                value={form.cost}
                onChange={(e) => setForm((f) => ({ ...f, cost: e.target.value }))}
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="act-notes" className="form-label">
              Notes (optional)
            </label>
            <textarea
              id="act-notes"
              className="form-textarea"
              placeholder="Meeting spot, reminders, or ticket info..."
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
          </div>

          <div className="inline-actions" style={{ justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Save activity' : 'Add activity'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
