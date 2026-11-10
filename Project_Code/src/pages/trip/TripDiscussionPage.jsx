import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  addDiscussionReply,
  createDiscussionPost,
  getDiscussionPosts,
} from '../../api/discussionApi';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import { MessageIcon, RefreshIcon } from '../../components/Icons';
import Loader from '../../components/Loader';
import { useAuth } from '../../context/useAuth';
import { formatTimestamp } from '../../utils/dateUtils';
import { getInitials } from '../../utils/formatters';
import './TripModules.css';

export default function TripDiscussionPage() {
  const { trip } = useOutletContext();
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [lastRefreshedAt, setLastRefreshedAt] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const [newPostText, setNewPostText] = useState('');
  const [postError, setPostError] = useState('');
  const [posting, setPosting] = useState(false);

  const [replyDrafts, setReplyDrafts] = useState({});
  const [openReplyFor, setOpenReplyFor] = useState(null);
  const [replyingPostId, setReplyingPostId] = useState(null);

  useEffect(() => {
    let active = true;

    async function fetchPosts() {
      try {
        const data = await getDiscussionPosts(trip.id);
        if (!active) return;
        setPosts(data);
        setError('');
        setLastRefreshedAt(new Date().toISOString());
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Unable to load discussion posts.');
      } finally {
        if (active) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    }

    fetchPosts();
    return () => {
      active = false;
    };
  }, [trip.id, reloadKey]);

  function handleRefresh(isManual) {
    if (isManual) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');
    setReloadKey((k) => k + 1);
  }

  async function handleCreatePost(event) {
    event.preventDefault();
    setPostError('');
    if (!newPostText.trim()) {
      setPostError('Write a note before posting.');
      return;
    }

    setPosting(true);
    try {
      const created = await createDiscussionPost(trip.id, newPostText, user);
      setPosts((prev) => [created, ...prev]);
      setNewPostText('');
    } catch (err) {
      setPostError(err.message || 'Could not save post.');
    } finally {
      setPosting(false);
    }
  }

  async function handleAddReply(event, postId) {
    event.preventDefault();
    const text = (replyDrafts[postId] || '').trim();
    if (!text) return;

    setReplyingPostId(postId);
    try {
      const reply = await addDiscussionReply(trip.id, postId, text, user);
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, replies: [...post.replies, reply] }
            : post
        )
      );
      setReplyDrafts((prev) => ({ ...prev, [postId]: '' }));
      setOpenReplyFor(null);
    } catch {
      // Keep UI resilient
    } finally {
      setReplyingPostId(null);
    }
  }

  return (
    <div className="tf-mod-stack">
      <div className="tf-mod-header">
        <div>
          <h1 className="tf-mod-title">Discussion</h1>
          <p className="tf-mod-subtitle">
            Persistent notes and replies. Refresh manually to check for new posts from members.
          </p>
        </div>

        <div className="inline-actions">
          {lastRefreshedAt && (
            <span className="muted-text" style={{ fontSize: 'var(--text-xs)' }}>
              Last refreshed {formatTimestamp(lastRefreshedAt)}
            </span>
          )}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleRefresh(true)}
            disabled={refreshing || loading}
          >
            <RefreshIcon size={14} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      <Card title="Start a discussion thread">
        <form className="form-stack" onSubmit={handleCreatePost}>
          {postError && (
            <div className="form-error" role="alert">
              {postError}
            </div>
          )}

          <div className="form-field">
            <label htmlFor="discussion-post-input" className="form-label">
              Note for the group
            </label>
            <textarea
              id="discussion-post-input"
              className="form-textarea"
              placeholder="Share transport updates, hostel notes, or planning questions..."
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary btn-sm" disabled={posting}>
              {posting ? 'Posting...' : 'Post note'}
            </button>
          </div>
        </form>
      </Card>

      {loading ? (
        <Loader label="Loading discussion threads..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => handleRefresh(false)} />
      ) : posts.length === 0 ? (
        <EmptyState
          icon={<MessageIcon size={20} />}
          title="No discussion posts yet"
          description="Keep important decisions and questions saved here instead of losing them in chat threads."
        />
      ) : (
        <div className="tf-post-list">
          {posts.map((post) => (
            <article key={post.id} className="tf-post-card">
              <div className="tf-post-card__header">
                <div className="tf-post-author">
                  <span className="tf-avatar-sm">{getInitials(post.authorName)}</span>
                  <div>
                    <span
                      style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--weight-semibold)',
                      }}
                    >
                      {post.authorName}
                    </span>
                    <span
                      className="badge"
                      style={{ marginLeft: 'var(--space-2)' }}
                    >
                      {post.authorRole}
                    </span>
                  </div>
                </div>

                <span className="tf-update-time">
                  {formatTimestamp(post.createdAt)}
                </span>
              </div>

              <p className="tf-post-body">{post.content}</p>

              {post.replies.length > 0 && (
                <div className="tf-replies">
                  {post.replies.map((reply) => (
                    <div key={reply.id} className="tf-reply-item">
                      <div
                        className="tf-post-card__header"
                        style={{ marginBottom: '6px' }}
                      >
                        <div className="tf-post-author">
                          <span className="tf-avatar-sm">
                            {getInitials(reply.authorName)}
                          </span>
                          <span
                            style={{
                              fontSize: 'var(--text-xs)',
                              fontWeight: 'var(--weight-semibold)',
                            }}
                          >
                            {reply.authorName}
                          </span>
                          <span className="badge">{reply.authorRole}</span>
                        </div>
                        <span className="tf-update-time">
                          {formatTimestamp(reply.createdAt)}
                        </span>
                      </div>
                      <p className="tf-post-body">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: 'var(--space-3)' }}>
                {openReplyFor === post.id ? (
                  <form
                    className="tf-reply-form"
                    onSubmit={(e) => handleAddReply(e, post.id)}
                  >
                    <label htmlFor={`reply-${post.id}`} className="sr-only">
                      Reply to {post.authorName}
                    </label>
                    <input
                      id={`reply-${post.id}`}
                      type="text"
                      className="form-input"
                      placeholder="Write a reply..."
                      value={replyDrafts[post.id] || ''}
                      onChange={(e) =>
                        setReplyDrafts((prev) => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="btn btn-primary btn-sm"
                      disabled={replyingPostId === post.id}
                    >
                      {replyingPostId === post.id ? 'Sending...' : 'Reply'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setOpenReplyFor(null)}
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setOpenReplyFor(post.id)}
                  >
                    Reply ({post.replies.length})
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
