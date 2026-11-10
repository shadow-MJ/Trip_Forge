import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../api/notificationsApi';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import { BellIcon, CheckIcon, RefreshIcon } from '../components/Icons';
import Loader from '../components/Loader';
import { formatTimestamp } from '../utils/dateUtils';
import './NotificationsPage.css';

export default function NotificationsPage() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
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
  }, [reloadKey]);

  function handleRefresh() {
    setLoading(true);
    setError('');
    setReloadKey((k) => k + 1);
  }

  async function handleMarkRead(id) {
    try {
      await markNotificationAsRead(id);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, read: true } : item))
      );
    } catch {
      // Resilient fallback
    }
  }

  async function handleMarkAllRead() {
    try {
      await markAllNotificationsAsRead();
      setItems((prev) => prev.map((item) => ({ ...item, read: true })));
    } catch {
      // Resilient fallback
    }
  }

  const unreadCount = items.filter((n) => !n.read).length;
  const visibleItems =
    filter === 'unread' ? items.filter((item) => !item.read) : items;

  return (
    <main className="container page-section">
      <div className="tf-notifs-page__wrap">
        <div className="page-header">
          <div>
            <h1 className="page-title">Notifications</h1>
            <p className="page-subtitle">
              In-app activity updates across your trips.{' '}
              {unreadCount > 0 ? `${unreadCount} unread.` : 'All caught up.'}
            </p>
          </div>
          <div className="inline-actions">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleRefresh}
            >
              <RefreshIcon size={14} />
              Refresh
            </button>
            {unreadCount > 0 && (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleMarkAllRead}
              >
                <CheckIcon size={14} />
                Mark all read
              </button>
            )}
          </div>
        </div>

        <div className="tf-notifs-page__tabs" role="tablist" aria-label="Filter notifications">
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'all'}
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('all')}
          >
            All ({items.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'unread'}
            className={`btn btn-sm ${filter === 'unread' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {loading ? (
          <Loader label="Loading notifications..." />
        ) : error ? (
          <ErrorState message={error} onRetry={handleRefresh} />
        ) : visibleItems.length === 0 ? (
          <EmptyState
            icon={<BellIcon size={20} />}
            title={filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            description={
              filter === 'unread'
                ? 'You have reviewed every recent update.'
                : 'Activity from itinerary edits, ideas, polls, and expenses will appear here.'
            }
          />
        ) : (
          <ul className="tf-notifs-page__list">
            {visibleItems.map((item) => (
              <li
                key={item.id}
                className={`tf-notifs-page__card ${item.read ? '' : 'tf-notifs-page__card--unread'}`}
              >
                <div className="tf-notifs-page__card-top">
                  <div className="inline-actions">
                    <span className="badge">{item.category}</span>
                    <span className="tf-notifs-page__trip">{item.tripName}</span>
                  </div>
                  {!item.read && <span className="badge badge-solid">Unread</span>}
                </div>

                <p className="tf-notifs-page__msg">{item.message}</p>

                <div className="tf-notifs-page__card-foot">
                  <span className="tf-notifs-page__time">
                    {formatTimestamp(item.createdAt)}
                  </span>
                  <div className="inline-actions">
                    {!item.read && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleMarkRead(item.id)}
                      >
                        Mark as read
                      </button>
                    )}
                    {item.link && (
                      <Link
                        to={item.link}
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          if (!item.read) handleMarkRead(item.id);
                        }}
                      >
                        Open trip section
                      </Link>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
