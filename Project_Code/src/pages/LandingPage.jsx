import { Link } from 'react-router-dom';
import {
  ArrowRightIcon,
  CalendarIcon,
  ListCheckIcon,
  MapPinIcon,
  SunIcon,
  WalletIcon,
} from '../components/Icons';
import { DestinationCover, MemberAvatarStack } from '../components/TropicalVisuals';
import { useAuth } from '../context/useAuth';
import './LandingPage.css';

const PILLARS = [
  {
    tone: 'teal',
    Icon: CalendarIcon,
    title: 'Shared itinerary & polls',
    description: 'Shape coastal days together, vote on group spots, and settle decisions fast.',
  },
  {
    tone: 'coral',
    Icon: WalletIcon,
    title: 'BDT expense splitting',
    description: 'Track shared costs in BDT (৳3k–10k group budgets) with clear who-pays-whom splits.',
  },
  {
    tone: 'sun',
    Icon: ListCheckIcon,
    title: 'Packing & trip summary',
    description: 'Assign essentials across friends and export one calm final travel plan.',
  },
];

const PREVIEW_MEMBERS = [
  { id: 'p1', name: 'Mahmud Rana Tonmoy' },
  { id: 'p2', name: 'Arafat Hossain' },
  { id: 'p3', name: 'Nadia Karim' },
  { id: 'p4', name: 'Tariq Hasan' },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="tf-landing">
      <section className="tf-landing__hero-band">
        <div className="container tf-landing__hero">
          <div className="tf-landing__copy">
            <span className="badge badge-warm tf-landing__pill">
              <SunIcon size={13} />
              Made for sunny group trips
            </span>

            <h1 className="tf-landing__title">
              Plan unforgettable escapes together.
            </h1>

            <p className="tf-landing__subtitle">
              Replace scattered group chats with one lively tropical workspace for
              shared itineraries, quick polls, BDT expense splitting, and packing lists.
            </p>

            <div className="tf-landing__cta">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-primary">
                  Open your trips
                  <ArrowRightIcon size={16} />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary">
                    Start planning free
                    <ArrowRightIcon size={16} />
                  </Link>
                  <Link to="/login" className="btn btn-secondary">
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="tf-landing__showcase" aria-label="Sample TripForge trip workspace preview">
            <div className="tf-showcase-card">
              <DestinationCover
                destination="Cox's Bazar & Saint Martin's"
                name="Cox's Bazar Coastline Escape"
                height="card"
              >
                <div className="tf-showcase-card__cover-top">
                  <span className="tf-cover-pill">Trip Creator</span>
                  <span className="tf-cover-pill">Dec 18 – Dec 21</span>
                </div>
              </DestinationCover>

              <div className="tf-showcase-card__body">
                <div className="tf-showcase-card__head">
                  <div>
                    <h2 className="tf-showcase-card__title">
                      Cox&apos;s Bazar Coastline Escape
                    </h2>
                    <p className="tf-showcase-card__dest">
                      <MapPinIcon size={13} />
                      Cox&apos;s Bazar &amp; Saint Martin&apos;s
                    </p>
                  </div>
                  <MemberAvatarStack members={PREVIEW_MEMBERS} totalCount={4} />
                </div>

                <div className="tf-showcase-card__widgets">
                  <div className="tf-mini-widget">
                    <div className="tf-mini-widget__row">
                      <span>Group budget (BDT)</span>
                      <strong>৳6,200 / ৳9,600</strong>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: '65%' }} />
                    </div>
                  </div>

                  <div className="tf-mini-widget">
                    <div className="tf-mini-widget__row">
                      <span>Poll · Seafood dinner spot</span>
                      <strong>Poushee · 67%</strong>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill tf-progress-warm"
                        style={{ width: '67%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container tf-landing__pillars-wrap">
        <div className="tf-landing__pillars">
          {PILLARS.map(({ tone, Icon, title, description }) => (
            <article key={title} className="tf-landing__pillar">
              <span className={`tf-pillar-icon tf-pillar-icon--${tone}`}>
                <Icon size={18} />
              </span>
              <h2 className="tf-landing__pillar-title">{title}</h2>
              <p className="tf-landing__pillar-desc">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="tf-landing__footer">
        <div className="container tf-landing__footer-inner">
          <span>TripForge</span>
          <span className="muted-text">
            Collaborative trip sharing &amp; BDT cost planning for friends &amp; students
          </span>
        </div>
      </footer>
    </main>
  );
}
