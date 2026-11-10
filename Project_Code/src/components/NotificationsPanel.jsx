import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../api/notificationsApi';
import { formatTimestamp } from '../utils/dateUtils';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import { BellIcon, CheckIcon, CloseIcon } from './Icons';
import Loader from './Loader';
import './NotificationsPanel.css';

export default function NotificationsPanel({ onClose, onUnreadCountChange }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function fetchNotifications() {
      try {
        const data = await getNotifications();
        if (!active) return;
        setItems(data);
        setError('');
        if (onUnreadCountChange) {
          onUnreadCountChange(data.filter((n) => !n.read).length);
        }
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Unable to load notifications.');
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchNotifications();
    return () => {
      active = false;
    };
  }, [reloadKey, onUnreadCountChange]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  function handleRetry() {
    setLoading(true);
    setError('');
    setReloadKey((k) => k + 1);
  }

  async function handleMarkRead(id) {
    try {
      await markNotificationAsRead(id);
      const next = items.map((item) => (item.id === id ? { ...item, read: true } : item));
      setItems(next);
      if (onUnreadCountChange) {
        onUnreadCountChange(next.filter((n) => !n.read).length);
      }
    } catch {
      // Keep UI resilient
    }
  }

  async function handleMarkAllRead() {
    try {
      await markAllNotificationsAsRead();
      const next = items.map((item) => ({ ...item, read: true }));
      setItems(next);
      if (onUnreadCountChange) {
        onUnreadCountChange(0);
      }
    } catch {
      // Keep UI resilient
    }
  }

  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <div
      className="tf-notif-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <aside className="tf-notif-panel" role="dialog" aria-modal="true" aria-label="Notifications">
        <div className="tf-notif-panel__header">
          <div>
            <h2 className="tf-notif-panel__title">Notifications</h2>
            <p className="tf-notif-panel__subtitle">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
            </p>
          </div>
          <div className="inline-actions">
            {unreadCount > 0 && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleMarkAllRead}
              >
                <CheckIcon size={14} />
                Mark all read
              </button>
            )}
            <button
              type="button"
              className="btn btn-ghost btn-icon"
              onClick={onClose}
              aria-label="Close notifications"
            >
              <CloseIcon size={18} />
            </button>
          </div>
        </div>

        <div className="tf-notif-panel__body">
          {loading ? (
            <Loader label="Loading notifications..." />
          ) : error ? (
            <ErrorState message={error} onRetry={handleRetry} />
          ) : items.length === 0 ? (
            <EmptyState
              icon={<BellIcon size={18} />}
              title="No notifications yet"
              description="Updates on itinerary changes, polls, ideas, and expenses will appear here."
            />
          ) : (
            <ul className="tf-notif-list">
              {items.map((item) => (
                <li
                  key={item.id}
                  className={`tf-notif-item ${item.read ? 'tf-notif-item--read' : 'tf-notif-item--unread'}`}
                >
                  <div className="tf-notif-item__top">
                    <span className="badge">{item.category}</span>
                    {!item.read && (
                      <span className="tf-notif-item__dot" aria-label="Unread" />
                    )}
                  </div>
                  <p className="tf-notif-item__trip">{item.tripName}</p>
                  <p className="tf-notif-item__message">{item.message}</p>
                  <div className="tf-notif-item__footer">
                    <span className="tf-notif-item__time">{formatTimestamp(item.createdAt)}</span>
                    <div className="inline-actions">
                      {!item.read && (
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleMarkRead(item.id)}
                        >
                          Mark read
                        </button>
                      )}
                      {item.link && (
                        <Link
                          to={item.link}
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            if (!item.read) handleMarkRead(item.id);
                            onClose();
                          }}
                        >
                          Open
                        </Link>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="tf-notif-panel__footer">
          <Link to="/notifications" className="btn btn-secondary btn-sm" onClick={onClose}>
            View full notifications page
          </Link>
        </div>
      </aside>
    </div>
  );
}
