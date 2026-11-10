import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getMembers } from '../../api/membersApi';
import {
  addPackingItem,
  assignPackingItem,
  deletePackingItem,
  getPackingItems,
  togglePackingItem,
} from '../../api/packingApi';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import { ListCheckIcon, PlusIcon, TrashIcon } from '../../components/Icons';
import Loader from '../../components/Loader';
import { useAuth } from '../../context/useAuth';
import './TripModules.css';

export default function TripPackingPage() {
  const { trip } = useOutletContext();
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const [filter, setFilter] = useState('all');
  const [itemTitle, setItemTitle] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [formError, setFormError] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchPacking() {
      try {
        const [packingData, memberData] = await Promise.all([
          getPackingItems(trip.id),
          getMembers(trip.id),
        ]);
        if (!active) return;
        setItems(packingData);
        setMembers(memberData);
        setError('');
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Unable to load packing checklist.');
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchPacking();
    return () => {
      active = false;
    };
  }, [trip.id, reloadKey]);

  function handleRetry() {
    setLoading(true);
    setError('');
    setReloadKey((k) => k + 1);
  }

  async function handleAddItem(event) {
    event.preventDefault();
    setFormError('');

    if (!itemTitle.trim()) {
      setFormError('Please enter an item name.');
      return;
    }

    setAdding(true);
    try {
      const created = await addPackingItem(
        trip.id,
        { title: itemTitle, assigneeId },
        user?.name
      );
      setItems((prev) => [...prev, created]);
      setItemTitle('');
      setAssigneeId('');
    } catch (err) {
      setFormError(err.message || 'Could not add item.');
    } finally {
      setAdding(false);
    }
  }

  async function handleToggle(itemId) {
    try {
      const updated = await togglePackingItem(trip.id, itemId);
      setItems((prev) => prev.map((i) => (i.id === itemId ? updated : i)));
    } catch {
      // Keep UI resilient
    }
  }

  async function handleAssign(itemId, nextAssigneeId) {
    try {
      const updated = await assignPackingItem(trip.id, itemId, nextAssigneeId);
      setItems((prev) => prev.map((i) => (i.id === itemId ? updated : i)));
    } catch {
      // Keep UI resilient
    }
  }

  async function handleDelete(itemId) {
    try {
      await deletePackingItem(trip.id, itemId);
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    } catch {
      // Keep UI resilient
    }
  }

  const packedCount = items.filter((i) => i.packed).length;
  const totalCount = items.length;
  const progressPercent =
    totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  const visibleItems = items.filter((item) => {
    if (filter === 'packed') return item.packed;
    if (filter === 'pending') return !item.packed;
    return true;
  });

  return (
    <div className="tf-mod-stack">
      <div className="tf-mod-header">
        <div>
          <h1 className="tf-mod-title">Packing checklist</h1>
          <p className="tf-mod-subtitle">
            Assign shared items to members so nothing gets forgotten or duplicated.
          </p>
        </div>
      </div>

      <Card>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-2)',
            fontSize: 'var(--text-sm)',
          }}
        >
          <strong>
            {packedCount} of {totalCount} items packed
          </strong>
          <span className="muted-text">{progressPercent}%</span>
        </div>
        <div className="progress-track" aria-label={`Packing progress ${progressPercent}%`}>
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </Card>

      <Card title="Add packing item">
        <form className="form-stack" onSubmit={handleAddItem}>
          {formError && (
            <div className="form-error" role="alert">
              {formError}
            </div>
          )}

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="pack-title" className="form-label">
                Item name
              </label>
              <input
                id="pack-title"
                type="text"
                className="form-input"
                placeholder="e.g., Portable power bank"
                value={itemTitle}
                onChange={(e) => setItemTitle(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="pack-assignee" className="form-label">
                Assign to
              </label>
              <select
                id="pack-assignee"
                className="form-select"
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary btn-sm" disabled={adding}>
              <PlusIcon size={15} />
              {adding ? 'Adding...' : 'Add item'}
            </button>
          </div>
        </form>
      </Card>

      {loading ? (
        <Loader label="Loading packing checklist..." />
      ) : error ? (
        <ErrorState message={error} onRetry={handleRetry} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<ListCheckIcon size={20} />}
          title="Packing checklist is empty"
          description="Add shared essentials above and assign who is bringing each item."
        />
      ) : (
        <div className="tf-mod-stack" style={{ gap: 'var(--space-3)' }}>
          <div className="inline-actions" role="tablist" aria-label="Filter packing items">
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'all'}
              className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('all')}
            >
              All ({totalCount})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'pending'}
              className={`btn btn-sm ${filter === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('pending')}
            >
              To pack ({totalCount - packedCount})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'packed'}
              className={`btn btn-sm ${filter === 'packed' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('packed')}
            >
              Packed ({packedCount})
            </button>
          </div>

          {visibleItems.length === 0 ? (
            <EmptyState
              icon={<ListCheckIcon size={18} />}
              title="No items in this view"
              description="Try switching filters to view all packing items."
            />
          ) : (
            <ul className="tf-packing-list">
              {visibleItems.map((item) => (
                <li key={item.id} className="tf-packing-row">
                  <label className="tf-packing-row__left" htmlFor={`pack-chk-${item.id}`}>
                    <input
                      id={`pack-chk-${item.id}`}
                      type="checkbox"
                      className="tf-packing-row__checkbox"
                      checked={item.packed}
                      onChange={() => handleToggle(item.id)}
                    />
                    <span
                      className={
                        item.packed ? 'tf-packing-row__title--packed' : ''
                      }
                    >
                      {item.title}
                    </span>
                  </label>

                  <div className="tf-packing-row__right">
                    <label htmlFor={`assign-${item.id}`} className="sr-only">
                      Assign {item.title}
                    </label>
                    <select
                      id={`assign-${item.id}`}
                      className="form-select tf-packing-select"
                      value={item.assigneeId || ''}
                      onChange={(e) => handleAssign(item.id, e.target.value)}
                    >
                      <option value="">Unassigned</option>
                      {members.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      className="btn btn-ghost btn-sm btn-icon"
                      onClick={() => handleDelete(item.id)}
                      aria-label={`Delete ${item.title}`}
                      title="Delete item"
                    >
                      <TrashIcon size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
