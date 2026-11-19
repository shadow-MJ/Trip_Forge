import { Link, NavLink } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CalendarIcon,
  CompassIcon,
  FileTextIcon,
  LightbulbIcon,
  ListCheckIcon,
  MessageIcon,
  PollIcon,
  UsersIcon,
  WalletIcon,
} from './Icons';
import { DestinationCover } from './TropicalVisuals';
import './Sidebar.css';

const TRIP_TABS = [
  { key: 'overview', label: 'Overview', Icon: CompassIcon },
  { key: 'itinerary', label: 'Itinerary', Icon: CalendarIcon },
  { key: 'ideas', label: 'Ideas', Icon: LightbulbIcon },
  { key: 'polls', label: 'Polls', Icon: PollIcon },
  { key: 'expenses', label: 'Expenses', Icon: WalletIcon },
  { key: 'discussion', label: 'Discussion', Icon: MessageIcon },
  { key: 'packing', label: 'Packing', Icon: ListCheckIcon },
  { key: 'members', label: 'Members', Icon: UsersIcon },
  { key: 'summary', label: 'Summary', Icon: FileTextIcon },
];

export default function Sidebar({ trip }) {
  return (
    <aside className="tf-sidebar no-print" aria-label="Trip workspace navigation">
      <div className="tf-sidebar__top">
        {trip && (
          <DestinationCover
            destination={trip.destination}
            name={trip.name}
            height="mini"
          >
            <div className="tf-sidebar__cover-badges">
              <span className="tf-sidebar__cover-role">{trip.userRole}</span>
            </div>
          </DestinationCover>
        )}

        <div className="tf-sidebar__top-body">
          <Link to="/dashboard" className="tf-sidebar__back">
            <ArrowLeftIcon size={14} />
            All trips
          </Link>

          {trip && (
            <div className="tf-sidebar__trip-info">
              <p className="tf-sidebar__trip-name">{trip.name}</p>
              <p className="tf-sidebar__trip-dest">{trip.destination}</p>
            </div>
          )}
        </div>
      </div>

      <nav className="tf-sidebar__nav">
        {TRIP_TABS.map(({ key, label, Icon }) => {
          const showPendingBadge =
            key === 'members' &&
            trip?.userRole === 'Trip Creator' &&
            Number(trip?.pendingRequestsCount || 0) > 0;

          return (
            <NavLink
              key={key}
              to={`/trips/${trip?.id}/${key}`}
              className={({ isActive }) =>
                `tf-sidebar__link ${isActive ? 'tf-sidebar__link--active' : ''}`
              }
            >
              <Icon size={16} />
              <span className="tf-sidebar__label">{label}</span>
              {showPendingBadge && (
                <span
                  className="badge badge-warm tf-sidebar__count"
                  title={`${trip.pendingRequestsCount} pending join request${
                    trip.pendingRequestsCount > 1 ? 's' : ''
                  }`}
                  aria-label={`${trip.pendingRequestsCount} pending join requests`}
                >
                  {trip.pendingRequestsCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
