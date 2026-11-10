import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { addExpense, deleteExpense, getExpenses } from '../../api/expensesApi';
import { getMembers } from '../../api/membersApi';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import { ArrowRightIcon, PlusIcon, TrashIcon, WalletIcon } from '../../components/Icons';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/useAuth';
import { formatFullDate } from '../../utils/dateUtils';
import { calculateExpenseSummary } from '../../utils/expenseCalculator';
import { formatCurrency, formatExactCurrency } from '../../utils/formatters';
import './TripModules.css';

export default function TripExpensesPage() {
  const { trip } = useOutletContext();
  const { user } = useAuth();

  const [expenses, setExpenses] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [payerId, setPayerId] = useState('');
  const [participantIds, setParticipantIds] = useState([]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchExpensesData() {
      try {
        const [expenseData, memberData] = await Promise.all([
          getExpenses(trip.id),
          getMembers(trip.id),
        ]);
        if (!active) return;
        setExpenses(expenseData);
        setMembers(memberData);
        setError('');
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Unable to load expenses.');
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchExpensesData();
    return () => {
      active = false;
    };
  }, [trip.id, reloadKey]);

  function handleRetry() {
    setLoading(true);
    setError('');
    setReloadKey((k) => k + 1);
  }

  function openAddModal() {
    setTitle('');
    setAmount('');
    setPayerId(user?.id || members[0]?.id || '');
    setParticipantIds(members.map((m) => m.id));
    setDate(new Date().toISOString().slice(0, 10));
    setFormError('');
    setModalOpen(true);
  }

  function toggleParticipant(memberId) {
    setParticipantIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  }

  async function handleAddExpense(event) {
    event.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Please enter an expense description.');
      return;
    }
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setFormError('Please enter an amount greater than 0.');
      return;
    }
    if (!payerId) {
      setFormError('Please select who paid.');
      return;
    }
    if (participantIds.length === 0) {
      setFormError('Select at least one participant to split with.');
      return;
    }

    setSaving(true);
    try {
      const payer = members.find((m) => m.id === payerId);
      const created = await addExpense(
        trip.id,
        {
          title,
          amount: numericAmount,
          payerId,
          payerName: payer?.name,
          participantIds,
          date,
        },
        user?.name
      );
      setExpenses((prev) => [created, ...prev]);
      setModalOpen(false);
    } catch (err) {
      setFormError(err.message || 'Could not add expense.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteExpense(expenseId) {
    try {
      await deleteExpense(trip.id, expenseId);
      setExpenses((prev) => prev.filter((item) => item.id !== expenseId));
    } catch {
      // Keep UI resilient
    }
  }

  const { totalSpent, balances, settlements } = calculateExpenseSummary(
    expenses,
    members
  );
  const budget = Number(trip.budget || 0);
  const budgetPercent =
    budget > 0 ? Math.min(100, Math.round((totalSpent / budget) * 100)) : 0;
  const remainingBudget = budget - totalSpent;

  return (
    <div className="tf-mod-stack">
      <div className="tf-mod-header">
        <div>
          <h1 className="tf-mod-title">Expenses</h1>
          <p className="tf-mod-subtitle">
            Log shared costs, compare against budget, and see balanced splits.
          </p>
        </div>

        <div className="inline-actions">
          <span className="badge">Tracking only — no payments</span>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={openAddModal}
            disabled={loading || members.length === 0}
          >
            <PlusIcon size={15} />
            Add expense
          </button>
        </div>
      </div>

      {loading ? (
        <Loader label="Calculating shared expenses..." />
      ) : error ? (
        <ErrorState message={error} onRetry={handleRetry} />
      ) : (
        <>
          <Card title="Spent vs budget" subtitle="Tracking only across all trip members">
            <div className="tf-expense-summary-grid">
              <div className="tf-fact-box">
                <p className="tf-fact-label">Total spent</p>
                <p className="tf-fact-value">{formatExactCurrency(totalSpent)}</p>
              </div>
              <div className="tf-fact-box">
                <p className="tf-fact-label">Planned budget</p>
                <p className="tf-fact-value">
                  {budget > 0 ? formatCurrency(budget) : 'Not set'}
                </p>
              </div>
              <div className="tf-fact-box">
                <p className="tf-fact-label">
                  {budget <= 0
                    ? 'Budget status'
                    : remainingBudget >= 0
                    ? 'Remaining budget'
                    : 'Over budget'}
                </p>
                <p className="tf-fact-value">
                  {budget > 0 ? formatExactCurrency(Math.abs(remainingBudget)) : 'No limit'}
                </p>
              </div>
            </div>

            {budget > 0 && (
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-muted)',
                    marginBottom: '6px',
                  }}
                >
                  <span>Budget used</span>
                  <span>{Math.round((totalSpent / budget) * 100)}%</span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${budgetPercent}%` }}
                  />
                </div>
              </div>
            )}
          </Card>

          <div className="tf-two-col tf-two-col--balances">
            <Card title="Balances per member" subtitle="Paid vs individual share">
              {balances.length === 0 ? (
                <p className="muted-text" style={{ fontSize: 'var(--text-sm)' }}>
                  No members found in this trip.
                </p>
              ) : (
                <div className="tf-table-wrap">
                  <table className="tf-table tf-table--nowrap tf-table--balances">
                    <thead>
                      <tr>
                        <th>Member</th>
                        <th className="tf-table__num">Paid</th>
                        <th className="tf-table__num">Share</th>
                        <th className="tf-table__num">Net</th>
                      </tr>
                    </thead>
                    <tbody>
                      {balances.map((row) => (
                        <tr key={row.memberId}>
                          <td>{row.name}</td>
                          <td className="tf-table__num">
                            {formatExactCurrency(row.paid)}
                          </td>
                          <td className="tf-table__num">
                            {formatExactCurrency(row.share)}
                          </td>
                          <td className="tf-table__num">
                            <strong>
                              {row.net > 0
                                ? `+${formatExactCurrency(row.net)}`
                                : row.net < 0
                                ? `-${formatExactCurrency(Math.abs(row.net))}`
                                : formatExactCurrency(0)}
                            </strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            <Card
              title="Who pays whom"
              subtitle="Simplified settlement summary (for tracking)"
            >
              {settlements.length === 0 ? (
                <EmptyState
                  icon={<WalletIcon size={18} />}
                  title="All settled up"
                  description="No transfers needed based on current expense logs."
                />
              ) : (
                <ul className="tf-settlement-list">
                  {settlements.map((item) => (
                    <li key={item.id} className="tf-settlement-row">
                      <span className="inline-actions" style={{ gap: '6px' }}>
                        <strong>{item.fromName}</strong>
                        <ArrowRightIcon size={14} />
                        <strong>{item.toName}</strong>
                      </span>
                      <span className="badge badge-solid">
                        {formatExactCurrency(item.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          <Card title="Expense ledger" subtitle="Every recorded shared expense">
            {expenses.length === 0 ? (
              <EmptyState
                icon={<WalletIcon size={20} />}
                title="No expenses logged yet"
                description="Add transport tickets, stays, or meals to calculate member shares automatically."
                action={
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={openAddModal}
                  >
                    <PlusIcon size={15} />
                    Log first expense
                  </button>
                }
              />
            ) : (
              <div className="tf-table-wrap">
                <table className="tf-table">
                  <thead>
                    <tr>
                      <th>Expense</th>
                      <th>Paid by</th>
                      <th>Split</th>
                      <th>Date</th>
                      <th className="tf-table__num">Amount</th>
                      <th className="tf-table__num">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((exp) => (
                      <tr key={exp.id}>
                        <td>
                          <strong>{exp.title}</strong>
                        </td>
                        <td>{exp.payerName}</td>
                        <td>{exp.participantIds?.length || members.length} members</td>
                        <td>{formatFullDate(exp.date)}</td>
                        <td className="tf-table__num">
                          <strong>{formatExactCurrency(exp.amount)}</strong>
                        </td>
                        <td className="tf-table__num">
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm btn-icon"
                            onClick={() => handleDeleteExpense(exp.id)}
                            aria-label={`Delete ${exp.title}`}
                            title="Delete expense"
                          >
                            <TrashIcon size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add shared expense"
        subtitle="Expense tracking only — balances update automatically."
      >
        <form className="form-stack" onSubmit={handleAddExpense}>
          {formError && (
            <div className="form-error" role="alert">
              {formError}
            </div>
          )}

          <div className="form-field">
            <label htmlFor="exp-title" className="form-label">
              Description
            </label>
            <input
              id="exp-title"
              type="text"
              className="form-input"
              placeholder="e.g., Ferry tickets"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="exp-amount" className="form-label">
                Amount (BDT)
              </label>
              <input
                id="exp-amount"
                type="number"
                min="1"
                step="1"
                className="form-input"
                placeholder="e.g., 1500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="exp-date" className="form-label">
                Date
              </label>
              <input
                id="exp-date"
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="exp-payer" className="form-label">
              Paid by
            </label>
            <select
              id="exp-payer"
              className="form-select"
              value={payerId}
              onChange={(e) => setPayerId(e.target.value)}
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span className="form-label">Split equally between</span>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setParticipantIds(members.map((m) => m.id))}
              >
                Select all
              </button>
            </div>
            <div className="tf-participants-grid">
              {members.map((m) => (
                <label key={m.id} className="tf-check-pill" htmlFor={`part-${m.id}`}>
                  <input
                    id={`part-${m.id}`}
                    type="checkbox"
                    checked={participantIds.includes(m.id)}
                    onChange={() => toggleParticipant(m.id)}
                  />
                  <span>{m.name}</span>
                </label>
              ))}
            </div>
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
              {saving ? 'Saving...' : 'Save expense'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
