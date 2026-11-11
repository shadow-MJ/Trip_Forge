import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  CalendarIcon,
  ListCheckIcon,
  MapPinIcon,
  SunIcon,
  WalletIcon,
} from "../components/Icons";
import {
  DestinationCover,
  MemberAvatarStack,
} from "../components/TropicalVisuals";
import { useAuth } from "../context/useAuth";
import "./LandingPage.css";

const PILLARS = [
  {
    tone: 'walnut',
    Icon: CalendarIcon,
    title: 'Shared itinerary & quick polls',
    description: 'Structure multi-day trails together, vote on campsites and routes, and settle group decisions in minutes.',
  },
  {
    tone: 'cognac',
    Icon: WalletIcon,
    title: 'BDT expense splitting',
    description: 'Track group expenditures in BDT (৳3k–15k group budgets) with exact who-pays-whom balance settlements.',
  },
  {
    tone: 'bronze',
    Icon: ListCheckIcon,
    title: 'Packing & trip summary',
    description: 'Distribute gear across friends, check off essentials, and export a clean, unified travel dossier.',
  },
];

const PREVIEW_MEMBERS = [
  { id: 'p1', name: 'Joy M' },
  { id: 'p2', name: 'Mahmud Rana Tonmoy' },
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
              <SunIcon size={12} />
              EXPEDITION ATELIER · 2026
            </span>

            <h1 className="tf-landing__title">
              Plan unforgettable escapes <em className="serif-accent tf-hero-serif">together</em>.
            </h1>

            <p className="tf-landing__subtitle">
              Replace chaotic group chats with one serene, tactile workspace for
              shared itineraries, quick polls, BDT expense settlements, and collective gear packing.
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

          <div
            className="tf-landing__showcase"
            aria-label="Sample TripForge trip workspace preview"
          >
            <div className="tf-showcase-card">
              <DestinationCover
                destination="Cox's Bazar & Saint Martin's"
                name="Cox's Bazar Coastline Escape"
                height="card"
              >
                <div className="tf-showcase-card__cover-top">
                  <span className="tf-cover-pill">01 · ACTIVE</span>
                  <span className="tf-cover-pill">Dec 18 – Dec 21</span>
                </div>
              </DestinationCover>

              <div className="tf-showcase-card__body">
                <div className="tf-showcase-card__head">
                  <div>
                    <h2 className="tf-showcase-card__title">
                      Cox's Bazar Coastline Escape
                    </h2>
                    <span className="tf-showcase-card__dest">
                      <MapPinIcon size={13} />
                      Cox's Bazar & Saint Martin's
                    </span>
                  </div>
                  <MemberAvatarStack members={PREVIEW_MEMBERS} totalCount={4} />
                </div>

                <div className="tf-showcase-card__widgets">
                  <div className="tf-mini-widget">
                    <div className="tf-mini-widget__row">
                      <span>Shared budget tracked</span>
                      <strong className="mono-num">৳14,500 / ৳20,000</strong>
                    </div>
                    <div className="progress-track" aria-hidden="true">
                      <div
                        className="progress-fill"
                        style={{ width: '72%' }}
                      />
                    </div>
                  </div>

                  <div className="tf-mini-widget">
                    <div className="tf-mini-widget__row">
                      <span>Live group consensus</span>
                      <span className="badge badge-warm">3 of 4 voted</span>
                    </div>
                    <div className="progress-track" aria-hidden="true">
                      <div
                        className="progress-fill tf-progress-warm"
                        style={{ width: '75%' }}
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
          {PILLARS.map((pillar) => {
            const Icon = pillar.Icon;
            return (
              <div key={pillar.title} className="tf-landing__pillar">
                <span className={`tf-pillar-icon tf-pillar-icon--${pillar.tone}`}>
                  <Icon size={20} />
                </span>
                <h3 className="tf-landing__pillar-title">{pillar.title}</h3>
                <p className="tf-landing__pillar-desc">{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="tf-landing__footer no-print">
        <div className="container tf-landing__footer-inner">
          <p>© 2026 TripForge Atelier · Collaborative expedition planning</p>
          <p className="muted-text mono-num">Crafted for mindful travel in Bangladesh & beyond</p>
        </div>
      </footer>
    </main>
  );
}
