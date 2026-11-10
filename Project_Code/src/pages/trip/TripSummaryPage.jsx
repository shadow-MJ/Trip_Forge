import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getExpenses } from '../../api/expensesApi';
import { getIdeas } from '../../api/ideasApi';
import { getItinerary } from '../../api/itineraryApi';
import { getMembers } from '../../api/membersApi';
import { getPackingItems } from '../../api/packingApi';
import { getPolls } from '../../api/pollsApi';
import Card from '../../components/Card';
import ErrorState from '../../components/ErrorState';
import { ArrowRightIcon } from '../../components/Icons';
import Loader from '../../components/Loader';
import MapView from '../../components/MapView';
import { DestinationCover, MemberAvatarStack } from '../../components/TropicalVisuals';
import WeatherCard from '../../components/WeatherCard';
import { formatDateRange, getTripDays } from '../../utils/dateUtils';
import { calculateExpenseSummary } from '../../utils/expenseCalculator';
import { formatCurrency, formatExactCurrency, pluralize } from '../../utils/formatters';
import './TripModules.css';

export default function TripSummaryPage() {
  const { trip } = useOutletContext();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function fetchSummary() {
      try {
        const [itinerary, ideas, polls, expenses, packing, members] = await Promise.all([
          getItinerary(trip.id),
          getIdeas(trip.id),
          getPolls(trip.id),
          getExpenses(trip.id),
          getPackingItems(trip.id),
          getMembers(trip.id),
        ]);
        if (!active) return;
        setData({ itinerary, ideas, polls, expenses, packing, members });
        setError('');
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Unable to generate trip summary.');
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchSummary();
    return () => {
      active = false;
    };
  }, [trip.id, reloadKey]);

  function handleRetry() {
    setLoading(true);
    setError('');
    setReloadKey((k) => k + 1);
  }

  if (loading) {
    return <Loader label="Compiling read-only trip summary..." />;
  }

  if (error || !data) {
    return <ErrorState message={error} onRetry={handleRetry} />;
  }

  const days = getTripDays(trip.startDate, trip.endDate);
  const { totalSpent, balances, settlements } = calculateExpenseSummary(
    data.expenses,
    data.members
  );
  const itineraryCost = data.itinerary.reduce(
    (sum, item) => sum + Number(item.cost || 0),
    0
  );
  const packedCount = data.packing.filter((i) => i.packed).length;

  return (
    <div className="tf-mod-stack">
      <section className="tf-overview-hero">
        <DestinationCover
          destination={trip.destination}
          name={trip.name}
          height="mini"
        >
          <div className="tf-overview-hero__top">
            <span className="tf-overview-hero__pill">Read-only final trip summary</span>
            <MemberAvatarStack members={data.members} totalCount={data.members.length} />
          </div>
        </DestinationCover>

        <div className="tf-overview-hero__body">
          <div className="tf-overview-hero__head">
            <div>
              <h1 className="tf-mod-title">{trip.name}</h1>
              <p className="tf-mod-subtitle">
                {trip.destination} · {formatDateRange(trip.startDate, trip.endDate)}
              </p>
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm no-print"
              onClick={() => window.print()}
            >
              Print summary
            </button>
          </div>

          <div className="tf-overview-facts">
            <div className="tf-fact-box">
              <p className="tf-fact-label">Duration</p>
              <p className="tf-fact-value">{pluralize(days.length, 'day')}</p>
            </div>
            <div className="tf-fact-box">
              <p className="tf-fact-label">Members</p>
              <p className="tf-fact-value">{pluralize(data.members.length, 'member')}</p>
            </div>
            <div className="tf-fact-box">
              <p className="tf-fact-label">Tracked spent</p>
              <p className="tf-fact-value">{formatExactCurrency(totalSpent)}</p>
            </div>
            <div className="tf-fact-box">
              <p className="tf-fact-label">Planned budget</p>
              <p className="tf-fact-value">
                {Number(trip.budget) > 0 ? formatCurrency(trip.budget) : 'Not set'}
              </p>
            </div>
          </div>
          {trip.description && (
            <p className="tf-overview-desc">{trip.description}</p>
          )}
        </div>
      </section>

      <div className="tf-two-col">
        <MapView
          destination={trip.destination}
          coordinates={trip.coordinates}
          activities={data.itinerary}
          compact
        />
        <WeatherCard destination={trip.destination} readOnly />
      </div>

      <Card
        title="Final itinerary"
        subtitle={`${pluralize(data.itinerary.length, 'activity')} · Planned activity cost ${formatCurrency(itineraryCost)}`}
      >
        {data.itinerary.length === 0 ? (
          <p className="muted-text" style={{ fontSize: 'var(--text-sm)' }}>
            No itinerary activities scheduled yet.
          </p>
        ) : (
          <div className="tf-mod-stack" style={{ gap: 'var(--space-4)' }}>
            {days.map((day) => {
              const dayItems = data.itinerary.filter((i) => i.day === day.dayNumber);
              if (dayItems.length === 0) return null;
              const dayCost = dayItems.reduce((s, i) => s + Number(i.cost || 0), 0);

              return (
                <div key={day.dayNumber}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 'var(--space-2)',
                      fontSize: 'var(--text-sm)',
                    }}
                  >
                    <strong>
                      {day.label} — {day.formattedDate}
                    </strong>
                    <span className="muted-text">{formatCurrency(dayCost)}</span>
                  </div>
                  <div className="tf-table-wrap">
                    <table className="tf-table">
                      <tbody>
                        {dayItems.map((act) => (
                          <tr key={act.id}>
                            <td style={{ width: '80px' }}>{act.time || 'TBD'}</td>
                            <td>
                              <strong>{act.title}</strong>
                            </td>
                            <td>{act.location || '—'}</td>
                            <td className="tf-table__num">{formatCurrency(act.cost)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <div className="tf-two-col">
        <Card title="Group decisions" subtitle="Poll outcomes & approved ideas">
          {data.polls.length === 0 && data.ideas.length === 0 ? (
            <p className="muted-text" style={{ fontSize: 'var(--text-sm)' }}>
              No polls or ideas recorded yet.
            </p>
          ) : (
            <div className="tf-mod-stack" style={{ gap: 'var(--space-3)' }}>
              {data.polls.map((poll) => {
                const sortedOpts = [...poll.options].sort(
                  (a, b) => b.voterIds.length - a.voterIds.length
                );
                const topOption = sortedOpts[0];
                return (
                  <div key={poll.id} className="tf-fact-box">
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '8px',
                      }}
                    >
                      <strong style={{ fontSize: 'var(--text-sm)' }}>
                        {poll.question}
                      </strong>
                      <span className="badge">{poll.status}</span>
                    </div>
                    <p
                      className="muted-text"
                      style={{ fontSize: 'var(--text-xs)', marginTop: '4px' }}
                    >
                      Leading choice: {topOption?.text || 'No votes'} (
                      {topOption?.voterIds.length || 0} votes)
                    </p>
                  </div>
                );
              })}

              {data.ideas.filter((i) => i.addedToItinerary).length > 0 && (
                <div>
                  <p className="tf-fact-label" style={{ marginBottom: '6px' }}>
                    Ideas added to itinerary
                  </p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {data.ideas
                      .filter((i) => i.addedToItinerary)
                      .map((idea) => (
                        <li key={idea.id} style={{ fontSize: 'var(--text-sm)' }}>
                          · {idea.title}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Card>

        <Card title="Packing & members" subtitle="Checklist completion and group roster">
          <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
            Packing progress:{' '}
            <strong>
              {packedCount} of {data.packing.length} items packed
            </strong>
          </p>
          <div className="progress-track" style={{ marginBottom: 'var(--space-4)' }}>
            <div
              className="progress-fill"
              style={{
                width: `${
                  data.packing.length > 0
                    ? Math.round((packedCount / data.packing.length) * 100)
                    : 0
                }%`,
              }}
            />
          </div>

          <p className="tf-fact-label" style={{ marginBottom: 'var(--space-2)' }}>
            Members
          </p>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {data.members.map((m) => (
              <li
                key={m.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 'var(--text-sm)',
                }}
              >
                <span>{m.name}</span>
                <span className="badge">{m.role}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="Expense settlement summary" subtitle="Tracking only — balances across members">
        {data.expenses.length === 0 ? (
          <p className="muted-text" style={{ fontSize: 'var(--text-sm)' }}>
            No expenses logged for this trip.
          </p>
        ) : (
          <div className="tf-two-col tf-two-col--balances">
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
                  {balances.map((b) => (
                    <tr key={b.memberId}>
                      <td>{b.name}</td>
                      <td className="tf-table__num">{formatExactCurrency(b.paid)}</td>
                      <td className="tf-table__num">{formatExactCurrency(b.share)}</td>
                      <td className="tf-table__num">
                        <strong>
                          {b.net > 0
                            ? `+${formatExactCurrency(b.net)}`
                            : b.net < 0
                            ? `-${formatExactCurrency(Math.abs(b.net))}`
                            : formatExactCurrency(0)}
                        </strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <p className="tf-fact-label" style={{ marginBottom: 'var(--space-2)' }}>
                Who pays whom
              </p>
              {settlements.length === 0 ? (
                <p className="muted-text" style={{ fontSize: 'var(--text-sm)' }}>
                  All member balances are settled.
                </p>
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
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
