import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  createIdea,
  getIdeas,
  markIdeaAddedToItinerary,
  voteIdea,
} from '../../api/ideasApi';
import { addActivity } from '../../api/itineraryApi';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import {
  CheckIcon,
  LightbulbIcon,
  MapPinIcon,
  PlusIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from '../../components/Icons';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/useAuth';
import { getTripDays } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatters';
import './TripModules.css';

export default function TripIdeasPage() {
  const { trip } = useOutletContext();
  const { user } = useAuth();
  const days = getTripDays(trip.startDate, trip.endDate);

  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const [suggestOpen, setSuggestOpen] = useState(false);
  const [ideaForm, setIdeaForm] = useState({
    title: '',
    location: '',
    estimatedCost: '',
    notes: '',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [addTarget, setAddTarget] = useState(null);
  const [targetDay, setTargetDay] = useState(1);
  const [targetTime, setTargetTime] = useState('10:00');
  const [addingToPlan, setAddingToPlan] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchIdeas() {
      try {
        const data = await getIdeas(trip.id);
        if (!active) return;
        setIdeas(data);
        setError('');
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Unable to load ideas.');
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchIdeas();
    return () => {
      active = false;
    };
  }, [trip.id, reloadKey]);

  function handleRetry() {
    setLoading(true);
    setError('');
    setReloadKey((k) => k + 1);
  }

  async function handleSuggestIdea(event) {
    event.preventDefault();
    setFormError('');

    if (!ideaForm.title.trim()) {
      setFormError('Please enter an idea title.');
      return;
    }

    setSubmitting(true);
    try {
      const created = await createIdea(trip.id, ideaForm, user);
      setIdeas((prev) => [created, ...prev]);
      setIdeaForm({ title: '', location: '', estimatedCost: '', notes: '' });
      setSuggestOpen(false);
    } catch (err) {
      setFormError(err.message || 'Could not post idea.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVote(ideaId, value) {
    try {
      const updated = await voteIdea(trip.id, ideaId, user.id, value);
      setIdeas((prev) => prev.map((item) => (item.id === ideaId ? updated : item)));
    } catch {
      // Keep UI resilient
    }
  }

  async function handleConfirmAddToItinerary(event) {
    event.preventDefault();
    if (!addTarget) return;

    setAddingToPlan(true);
    try {
      await addActivity(
        trip.id,
        {
          day: Number(targetDay),
          title: addTarget.title,
          time: targetTime,
          location: addTarget.location,
          cost: addTarget.estimatedCost,
          notes: addTarget.notes,
        },
        user?.name
      );
      const updatedIdea = await markIdeaAddedToItinerary(trip.id, addTarget.id);
      setIdeas((prev) =>
        prev.map((item) => (item.id === addTarget.id ? updatedIdea : item))
      );
      setAddTarget(null);
    } catch {
      // Keep UI resilient
    } finally {
      setAddingToPlan(false);
    }
  }

  function getVoteStats(idea) {
    const values = Object.values(idea.votes || {});
    const likes = values.filter((v) => v === 1).length;
    const dislikes = values.filter((v) => v === -1).length;
    return {
      likes,
      dislikes,
      net: likes - dislikes,
      myVote: idea.votes?.[user?.id] || 0,
    };
  }

  const sortedIdeas = [...ideas].sort((a, b) => getVoteStats(b).net - getVoteStats(a).net);

  return (
    <div className="tf-mod-stack">
      <div className="tf-mod-header">
        <div>
          <h1 className="tf-mod-title">Ideas &amp; voting</h1>
          <p className="tf-mod-subtitle">
            Suggest places or activities, vote as a group, and promote winners to the itinerary.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => {
            setFormError('');
            setSuggestOpen(true);
          }}
        >
          <PlusIcon size={15} />
          Suggest idea
        </button>
      </div>

      {loading ? (
        <Loader label="Loading trip ideas..." />
      ) : error ? (
        <ErrorState message={error} onRetry={handleRetry} />
      ) : sortedIdeas.length === 0 ? (
        <EmptyState
          icon={<LightbulbIcon size={20} />}
          title="No ideas suggested yet"
          description="Drop restaurant spots, hikes, or stops here so the group can vote before scheduling."
          action={
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setSuggestOpen(true)}
            >
              <PlusIcon size={15} />
              Suggest first idea
            </button>
          }
        />
      ) : (
        <div className="tf-idea-list">
          {sortedIdeas.map((idea) => {
            const { likes, dislikes, net, myVote } = getVoteStats(idea);

            return (
              <article key={idea.id} className="tf-idea-card">
                <div className="tf-idea-card__main">
                  <div className="inline-actions" style={{ marginBottom: '6px' }}>
                    <span className="badge">
                      Score: {net > 0 ? `+${net}` : net}
                    </span>
                    {idea.addedToItinerary && (
                      <span className="badge badge-solid">
                        <CheckIcon size={12} />
                        Added to itinerary
                      </span>
                    )}
                  </div>

                  <h2 className="tf-idea-card__title">{idea.title}</h2>

                  <div className="tf-idea-card__meta">
                    <span>Suggested by {idea.authorName}</span>
                    {idea.location && (
                      <span className="inline-actions" style={{ gap: '4px' }}>
                        <MapPinIcon size={12} />
                        {idea.location}
                      </span>
                    )}
                    <span>Est. {formatCurrency(idea.estimatedCost)}</span>
                  </div>

                  {idea.notes && <p className="tf-idea-card__notes">{idea.notes}</p>}
                </div>

                <div className="tf-idea-card__controls">
                  <button
                    type="button"
                    className={`tf-vote-btn ${myVote === 1 ? 'tf-vote-btn--active' : ''}`}
                    onClick={() => handleVote(idea.id, 1)}
                    aria-pressed={myVote === 1}
                    aria-label={`Like ${idea.title}`}
                  >
                    <ThumbsUpIcon size={14} />
                    <span>{likes}</span>
                  </button>

                  <button
                    type="button"
                    className={`tf-vote-btn ${myVote === -1 ? 'tf-vote-btn--active' : ''}`}
                    onClick={() => handleVote(idea.id, -1)}
                    aria-pressed={myVote === -1}
                    aria-label={`Dislike ${idea.title}`}
                  >
                    <ThumbsDownIcon size={14} />
                    <span>{dislikes}</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    disabled={idea.addedToItinerary || days.length === 0}
                    onClick={() => {
                      setAddTarget(idea);
                      setTargetDay(days[0]?.dayNumber || 1);
                      setTargetTime('10:00');
                    }}
                  >
                    {idea.addedToItinerary ? 'In itinerary' : 'Add to itinerary'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={suggestOpen}
        onClose={() => setSuggestOpen(false)}
        title="Suggest an idea"
        subtitle="Everyone in the trip can vote on your suggestion."
      >
        <form className="form-stack" onSubmit={handleSuggestIdea}>
          {formError && (
            <div className="form-error" role="alert">
              {formError}
            </div>
          )}

          <div className="form-field">
            <label htmlFor="idea-title" className="form-label">
              Idea title
            </label>
            <input
              id="idea-title"
              type="text"
              className="form-input"
              placeholder="e.g., Sunset kayak session"
              value={ideaForm.title}
              onChange={(e) => setIdeaForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="idea-location" className="form-label">
                Location
              </label>
              <input
                id="idea-location"
                type="text"
                className="form-input"
                placeholder="e.g., Patuartek Beach"
                value={ideaForm.location}
                onChange={(e) => setIdeaForm((f) => ({ ...f, location: e.target.value }))}
              />
            </div>

            <div className="form-field">
              <label htmlFor="idea-cost" className="form-label">
                Estimated cost (BDT)
              </label>
              <input
                id="idea-cost"
                type="number"
                min="0"
                step="50"
                className="form-input"
                placeholder="e.g., 650"
                value={ideaForm.estimatedCost}
                onChange={(e) =>
                  setIdeaForm((f) => ({ ...f, estimatedCost: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="idea-notes" className="form-label">
              Notes
            </label>
            <textarea
              id="idea-notes"
              className="form-textarea"
              placeholder="Why this is worth doing or best time of day..."
              value={ideaForm.notes}
              onChange={(e) => setIdeaForm((f) => ({ ...f, notes: e.target.value }))}
            />
          </div>

          <div className="inline-actions" style={{ justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setSuggestOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Posting...' : 'Post idea'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={Boolean(addTarget)}
        onClose={() => setAddTarget(null)}
        title="Add idea to itinerary"
        subtitle={addTarget?.title}
        size="sm"
      >
        <form className="form-stack" onSubmit={handleConfirmAddToItinerary}>
          <div className="form-field">
            <label htmlFor="promote-day" className="form-label">
              Select day
            </label>
            <select
              id="promote-day"
              className="form-select"
              value={targetDay}
              onChange={(e) => setTargetDay(Number(e.target.value))}
            >
              {days.map((d) => (
                <option key={d.dayNumber} value={d.dayNumber}>
                  {d.label} ({d.formattedDate})
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="promote-time" className="form-label">
              Time
            </label>
            <input
              id="promote-time"
              type="time"
              className="form-input"
              value={targetTime}
              onChange={(e) => setTargetTime(e.target.value)}
            />
          </div>

          <div className="inline-actions" style={{ justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setAddTarget(null)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={addingToPlan}>
              {addingToPlan ? 'Adding...' : 'Add to day'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
