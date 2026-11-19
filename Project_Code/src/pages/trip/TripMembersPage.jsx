import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  approveJoinRequest,
  getMembers,
  getPendingJoinRequests,
  regenerateInviteCode,
  rejectJoinRequest,
  removeMember,
} from '../../api/membersApi';
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
  const [pendingRequests, setPendingRequests] = useState([]);
  const [customInviteCode, setCustomInviteCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [actionError, setActionError] = useState('');
  const [approvalMessage, setApprovalMessage] = useState('');
  const [processingReqId, setProcessingReqId] = useState(null);

  const inviteCode = customInviteCode ?? trip.inviteCode;
  const isCreator = trip.userRole === 'Trip Creator';

  useEffect(() => {
    let active = true;

    async function fetchTripMembersAndRequests() {
      try {
        const [membersData, requestsData] = await Promise.all([
          getMembers(trip.id),
          isCreator ? getPendingJoinRequests(trip.id) : Promise.resolve([]),
        ]);
        if (!active) return;
        setMembers(membersData);
        setPendingRequests(requestsData);
        setError('');
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Unable to load trip members.');
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchTripMembersAndRequests();
    return () => {
      active = false;
    };
  }, [trip.id, isCreator, reloadKey]);

  function handleRetry() {
    setLoading(true);
    setError('');
    setReloadKey((k) => k + 1);
  }

  async function handleApproveRequest(req) {
    setProcessingReqId(req.id);
    setActionError('');
    setApprovalMessage('');
    try {
      const result = await approveJoinRequest(trip.id, req.id, user?.name);
      setPendingRequests((prev) => prev.filter((r) => r.id !== req.id));
      if (result.member) {
        setMembers((prev) => {
          if (prev.some((m) => m.id === result.member.id)) return prev;
          return [...prev, result.member];
        });
      }
      setApprovalMessage(`Approved ${req.name} to join the trip.`);
      await refreshTrip();
    } catch (err) {
      setActionError(err.message || 'Could not approve join request.');
    } finally {
      setProcessingReqId(null);
    }
  }

  async function handleDeclineRequest(req) {
    setProcessingReqId(req.id);
    setActionError('');
    setApprovalMessage('');
    try {
      await rejectJoinRequest(trip.id, req.id, user?.name);
      setPendingRequests((prev) => prev.filter((r) => r.id !== req.id));
      setApprovalMessage(`Declined join request from ${req.name}.`);
      await refreshTrip();
    } catch (err) {
      setActionError(err.message || 'Could not decline join request.');
    } finally {
      setProcessingReqId(null);
    }
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

      {approvalMessage && (
        <div className="form-success tf-approval-banner" role="status">
          <CheckIcon size={16} />
          <span>{approvalMessage}</span>
        </div>
      )}

      {isCreator && (
        <Card
          title={
            <div className="tf-pending-card-title">
              <span>Pending join requests</span>
              {pendingRequests.length > 0 && (
                <span className="badge badge-warm">{pendingRequests.length}</span>
              )}
            </div>
          }
          subtitle="Review and approve requests from travelers who entered your trip invite code."
        >
          {loading ? (
            <Loader inline label="Checking pending requests..." />
          ) : pendingRequests.length === 0 ? (
            <p className="tf-pending-empty-note">
              No pending requests. When someone enters your invite code, their request will appear here for your approval.
            </p>
          ) : (
            <ul className="tf-member-list">
              {pendingRequests.map((req) => (
                <li key={req.id} className="tf-member-row tf-member-row--pending">
                  <div className="tf-member-row__info">
                    <span className="tf-avatar-sm tf-avatar-sm--pending">
                      {getInitials(req.name)}
                    </span>
                    <div>
                      <p className="tf-member-row__name">
                        {req.name}
                        <span className="badge badge-warm tf-pending-badge">
                          Awaiting approval
                        </span>
                      </p>
                      <p className="tf-member-row__email">
                        {req.email} · Requested {formatFullDate(req.requestedAt?.slice(0, 10))}
                      </p>
                    </div>
                  </div>

                  <div className="inline-actions">
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleDeclineRequest(req)}
                      disabled={processingReqId === req.id}
                    >
                      {processingReqId === req.id ? 'Processing...' : 'Decline'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => handleApproveRequest(req)}
                      disabled={processingReqId === req.id}
                    >
                      <CheckIcon size={14} />
                      {processingReqId === req.id ? 'Approving...' : 'Approve'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
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
