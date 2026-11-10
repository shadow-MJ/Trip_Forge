import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getMembers, regenerateInviteCode, removeMember } from '../../api/membersApi';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import { CheckIcon, CopyIcon, RefreshIcon, UsersIcon } from '../../components/Icons';
import Loader from '../../components/Loader';
import { useAuth } from '../../context/useAuth';
import { formatFullDate } from '../../utils/dateUtils';
import { getInitials } from '../../utils/formatters';
import './TripModules.css';

export default function TripMembersPage() {
  const { trip, refreshTrip } = useOutletContext();
  const { user } = useAuth();

  const [members, setMembers] = useState([]);
  const [customInviteCode, setCustomInviteCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [actionError, setActionError] = useState('');

  const inviteCode = customInviteCode ?? trip.inviteCode;

  useEffect(() => {
    let active = true;

    async function fetchMembers() {
      try {
        const data = await getMembers(trip.id);
        if (!active) return;
        setMembers(data);
        setError('');
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Unable to load trip members.');
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchMembers();
    return () => {
      active = false;
    };
  }, [trip.id, reloadKey]);

  function handleRetry() {
    setLoading(true);
    setError('');
    setReloadKey((k) => k + 1);
  }

  async function handleCopyCode() {
    if (!inviteCode) return;
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleRegenerate() {
    setRegenerating(true);
    setActionError('');
    try {
      const { inviteCode: nextCode } = await regenerateInviteCode(trip.id, user?.name);
      setCustomInviteCode(nextCode);
      await refreshTrip();
    } catch (err) {
      setActionError(err.message || 'Could not regenerate invite code.');
    } finally {
      setRegenerating(false);
    }
  }

  async function handleRemoveMember(memberId) {
    setActionError('');
    try {
      await removeMember(trip.id, memberId);
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      await refreshTrip();
    } catch (err) {
      setActionError(err.message || 'Could not remove member.');
    }
  }

  const isCreator = trip.userRole === 'Trip Creator';

  return (
    <div className="tf-mod-stack">
      <div className="tf-mod-header">
        <div>
          <h1 className="tf-mod-title">Members</h1>
          <p className="tf-mod-subtitle">
            TripForge uses collaborative roles only: Trip Creator and Trip Member.
          </p>
        </div>
      </div>

      <Card
        title="Invite friends"
        subtitle="Share this invite code so friends can join from their Dashboard."
      >
        <div className="tf-invite-box">
          <div>
            <p className="tf-fact-label">Trip invite code</p>
            <p className="tf-invite-code">{inviteCode}</p>
          </div>

          <div className="inline-actions">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleCopyCode}
            >
              {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>

            {isCreator && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleRegenerate}
                disabled={regenerating}
              >
                <RefreshIcon size={14} />
                {regenerating ? 'Updating...' : 'New code'}
              </button>
            )}
          </div>
        </div>
      </Card>

      {actionError && (
        <div className="form-error" role="alert">
          {actionError}
        </div>
      )}

      <Card
        title={`Trip members (${members.length})`}
        subtitle="Every member can add activities, vote, log expenses, and contribute."
      >
        {loading ? (
          <Loader inline label="Loading members..." />
        ) : error ? (
          <ErrorState message={error} onRetry={handleRetry} />
        ) : members.length === 0 ? (
          <EmptyState
            icon={<UsersIcon size={20} />}
            title="No members yet"
            description="Share your invite code above to bring friends into this trip."
          />
        ) : (
          <ul className="tf-member-list">
            {members.map((member) => (
              <li key={member.id} className="tf-member-row">
                <div className="tf-member-row__info">
                  <span className="tf-avatar-sm">{getInitials(member.name)}</span>
                  <div>
                    <p className="tf-member-row__name">
                      {member.name}
                      {member.id === user?.id ? ' (You)' : ''}
                    </p>
                    <p className="tf-member-row__email">
                      {member.email} · Joined {formatFullDate(member.joinedAt?.slice(0, 10))}
                    </p>
                  </div>
                </div>

                <div className="inline-actions">
                  <span
                    className={`badge ${
                      member.role === 'Trip Creator' ? 'badge-solid' : ''
                    }`}
                  >
                    {member.role}
                  </span>

                  {isCreator && member.role !== 'Trip Creator' && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
