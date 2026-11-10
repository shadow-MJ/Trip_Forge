import Card from './Card';
import { MapPinIcon } from './Icons';
import './MapView.css';

export default function MapView({ destination, coordinates, activities = [], compact = false }) {
  const uniqueLocations = [];
  const seen = new Set();

  activities.forEach((item) => {
    const loc = item.location?.trim();
    if (loc && !seen.has(loc.toLowerCase())) {
      seen.add(loc.toLowerCase());
      uniqueLocations.push({
        label: loc,
        day: item.day,
        title: item.title,
      });
    }
  });

  return (
    <Card
      title="Route and map"
      subtitle={destination || 'Destination map placeholder'}
      action={<span className="badge">Google Maps placeholder</span>}
      padding={compact ? 'compact' : 'default'}
    >
      <div className="tf-map">
        <div className="tf-map__canvas" aria-label="Map placeholder preview">
          <svg
            className="tf-map__grid"
            viewBox="0 0 400 170"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M0 34H400M0 68H400M0 102H400M0 136H400" stroke="currentColor" strokeOpacity="0.14" />
            <path d="M50 0V170M100 0V170M150 0V170M200 0V170M250 0V170M300 0V170M350 0V170" stroke="currentColor" strokeOpacity="0.14" />
            <path
              d="M58 118 C115 80, 155 112, 204 72 C248 38, 294 88, 342 52"
              stroke="var(--accent-primary)"
              strokeWidth="2.5"
              strokeDasharray="6 5"
              strokeOpacity="0.85"
            />
            <circle cx="58" cy="118" r="6" fill="var(--accent-warm)" />
            <circle cx="204" cy="72" r="5.5" fill="var(--accent-sun)" />
            <circle cx="342" cy="52" r="6" fill="var(--accent-primary)" />
          </svg>

          <div className="tf-map__overlay">
            <MapPinIcon size={16} />
            <div>
              <p className="tf-map__notice">Google Maps integration will render here</p>
              <p className="tf-map__coords">
                {coordinates
                  ? `Approx. ${coordinates.lat.toFixed(4)}° N, ${coordinates.lng.toFixed(4)}° E`
                  : 'Interactive pins, distances, and route directions pending API key'}
              </p>
            </div>
          </div>
        </div>

        <div className="tf-map__stops">
          <p className="tf-map__stops-label">
            Planned stops ({uniqueLocations.length})
          </p>
          {uniqueLocations.length > 0 ? (
            <ol className="tf-map__stop-list">
              {uniqueLocations.slice(0, 6).map((stop, idx) => (
                <li key={`${stop.label}-${idx}`} className="tf-map__stop-item">
                  <span className="tf-map__stop-index">{idx + 1}</span>
                  <div className="tf-map__stop-text">
                    <span className="tf-map__stop-name">{stop.label}</span>
                    <span className="tf-map__stop-meta">Day {stop.day} · {stop.title}</span>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="tf-map__empty-stops">
              Add locations to itinerary activities to preview your route stops here.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

