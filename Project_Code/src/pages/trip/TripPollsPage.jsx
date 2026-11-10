import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { closePoll, createPoll, getPolls, votePoll } from '../../api/pollsApi';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import { CheckIcon, PlusIcon, PollIcon, TrashIcon } from '../../components/Icons';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/useAuth';
import { pluralize } from '../../utils/formatters';
import './TripModules.css';

export default function TripPollsPage() {
  const { trip } = useOutletContext();
  const { user } = useAuth();

  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const [createOpen, setCreateOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [formError, setFormError] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchPolls() {
      try {
        const data = await getPolls(trip.id);
        if (!active) return;
        setPolls(data);
        setError('');
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Unable to load polls.');
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchPolls();
    return () => {
      active = false;
    };
  }, [trip.id, reloadKey]);

  function handleRetry() {
    setLoading(true);
    setError('');
    setReloadKey((k) => k + 1);
  }

  function handleOptionChange(idx, val) {
    setOptions((prev) => prev.map((opt, i) => (i === idx ? val : opt)));
  }

  function handleAddOptionField() {
    if (options.length < 6) {
      setOptions((prev) => [...prev, '']);
    }
  }

  function handleRemoveOptionField(idx) {
    if (options.length > 2) {
      setOptions((prev) => prev.filter((_, i) => i !== idx));
    }
  }

  async function handleCreatePoll(event) {
    event.preventDefault();
    setFormError('');

    if (!question.trim()) {
      setFormError('Please enter a poll question.');
      return;
    }

    const filledOptions = options.map((o) => o.trim()).filter(Boolean);
    if (filledOptions.length < 2) {
      setFormError('Please provide at least two non-empty options.');
      return;
    }

    setCreating(true);
    try {
      const created = await createPoll(
        trip.id,
        { question, options: filledOptions },
        user
      );
      setPolls((prev) => [created, ...prev]);
      setQuestion('');
      setOptions(['', '']);
      setCreateOpen(false);
    } catch (err) {
      setFormError(err.message || 'Could not create poll.');
    } finally {
      setCreating(false);
    }
  }

  async function handleVote(pollId, optionId) {
    try {
      const updated = await votePoll(trip.id, pollId, optionId, user.id);
      setPolls((prev) => prev.map((p) => (p.id === pollId ? updated : p)));
    } catch {
      // Keep UI resilient
    }
  }

  async function handleClosePoll(pollId) {
    try {
      const updated = await closePoll(trip.id, pollId, user?.name);
      setPolls((prev) => prev.map((p) => (p.id === pollId ? updated : p)));
    } catch {
      // Keep UI resilient
    }
  }

  return (
    <div className="tf-mod-stack">
      <div className="tf-mod-header">
        <div>
          <h1 className="tf-mod-title">Polls</h1>
          <p className="tf-mod-subtitle">
            Make quick group decisions. Each member votes once per poll.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => {
            setFormError('');
            setCreateOpen(true);
          }}
        >
          <PlusIcon size={15} />
          Create poll
        </button>
      </div>

      {loading ? (
        <Loader label="Loading polls..." />
      ) : error ? (
        <ErrorState message={error} onRetry={handleRetry} />
      ) : polls.length === 0 ? (
        <EmptyState
          icon={<PollIcon size={20} />}
          title="No polls created yet"
          description="Create a quick poll when your group needs to choose transport, hotels, or restaurants."
          action={
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setCreateOpen(true)}
            >
              <PlusIcon size={15} />
              Create first poll
            </button>
          }
        />
      ) : (
        <div className="tf-poll-list">
          {polls.map((poll) => {
            const totalVotes = poll.options.reduce(
              (sum, opt) => sum + opt.voterIds.length,
              0
            );
            const userVotedOption = poll.options.find((opt) =>
              opt.voterIds.includes(user?.id)
            );
            const showResults = Boolean(userVotedOption) || poll.status === 'closed';

            return (
              <article key={poll.id} className="tf-poll-card">
                <div className="tf-poll-card__top">
                  <div>
                    <h2 className="tf-poll-card__question">{poll.question}</h2>
                    <p className="tf-poll-card__meta">
                      Created by {poll.createdByName} · {pluralize(totalVotes, 'vote')}
                    </p>
                  </div>

                  <div className="inline-actions">
                    <span
                      className={`badge ${poll.status === 'open' ? 'badge-solid' : ''}`}
                    >
                      {poll.status === 'open' ? 'Open' : 'Closed'}
                    </span>
                    {poll.status === 'open' && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleClosePoll(poll.id)}
                      >
                        Close poll
                      </button>
                    )}
                  </div>
                </div>

                <div className="tf-poll-options">
                  {poll.options.map((opt) => {
                    const count = opt.voterIds.length;
                    const percent =
                      totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                    const isUserChoice = opt.voterIds.includes(user?.id);

                    if (!showResults) {
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          className="tf-poll-option-btn"
                          onClick={() => handleVote(poll.id, opt.id)}
                        >
                          <span>{opt.text}</span>
                          <span className="muted-text" style={{ fontSize: 'var(--text-xs)' }}>
                            Vote
                          </span>
                        </button>
                      );
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`tf-poll-result ${
                          isUserChoice ? 'tf-poll-result--chosen' : ''
                        }`}
                      >
                        <div className="tf-poll-result__row">
                          <span className="tf-poll-result__label inline-actions">
                            {opt.text}
                            {isUserChoice && (
                              <span className="badge">
                                <CheckIcon size={11} />
                                Your vote
                              </span>
                            )}
                          </span>
                          <span className="tf-poll-result__stats">
                            {pluralize(count, 'vote')} ({percent}%)
                          </span>
                        </div>
                        <div className="progress-track" aria-hidden="true">
                          <div
                            className="progress-fill"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create a poll"
        subtitle="Members can cast one vote while the poll is open."
      >
        <form className="form-stack" onSubmit={handleCreatePoll}>
          {formError && (
            <div className="form-error" role="alert">
              {formError}
            </div>
          )}

          <div className="form-field">
            <label htmlFor="poll-question" className="form-label">
              Question
            </label>
            <input
              id="poll-question"
              type="text"
              className="form-input"
              placeholder="e.g., Which hotel should we book?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>

          <div className="form-stack" style={{ gap: 'var(--space-2)' }}>
            <span className="form-label">Options</span>
            {options.map((opt, idx) => (
              <div key={idx} className="inline-actions" style={{ width: '100%' }}>
                <label htmlFor={`poll-opt-${idx}`} className="sr-only">
                  Option {idx + 1}
                </label>
                <input
                  id={`poll-opt-${idx}`}
                  type="text"
                  className="form-input"
                  style={{ flex: 1 }}
                  placeholder={`Option ${idx + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon"
                    onClick={() => handleRemoveOptionField(idx)}
                    aria-label={`Remove option ${idx + 1}`}
                  >
                    <TrashIcon size={15} />
                  </button>
                )}
              </div>
            ))}

            {options.length < 6 && (
              <div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleAddOptionField}
                >
                  <PlusIcon size={14} />
                  Add option
                </button>
              </div>
            )}
          </div>

          <div className="inline-actions" style={{ justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={creating}>
              {creating ? 'Creating...' : 'Launch poll'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
