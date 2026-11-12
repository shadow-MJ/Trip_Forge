import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import BangladeshInteractiveMap from '../components/BangladeshInteractiveMap';
import Card from '../components/Card';
import {
  CalendarIcon,
  CloseIcon,
  CompassIcon,
  MapIcon,
  MapPinIcon,
  PlusIcon,
  SearchIcon,
  SunIcon,
} from '../components/Icons';
import Modal from '../components/Modal';
import { useAuth } from '../context/useAuth';
import {
  BANGLADESH_DISTRICTS,
  BANGLADESH_DIVISIONS,
  searchDistrictsAndPlaces,
} from '../data/bangladeshDistricts';
import { pluralize } from '../utils/formatters';
import './BangladeshMapPage.css';

export default function BangladeshMapPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'traveler';

  const [activeDivision, setActiveDivision] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Filter districts based on division and search query
  const filteredDistricts = useMemo(() => {
    let result = BANGLADESH_DISTRICTS;

    if (searchQuery.trim()) {
      result = searchDistrictsAndPlaces(searchQuery);
    }

    if (activeDivision !== 'All') {
      result = result.filter((d) => d.division === activeDivision);
    }

    return result;
  }, [activeDivision, searchQuery]);

  // Total places count in currently filtered districts
  const totalPlacesCount = useMemo(() => {
    return filteredDistricts.reduce((sum, d) => sum + d.places.length, 0);
  }, [filteredDistricts]);

  function handleOpenDistrictModal(district) {
    if (!district) {
      setSelectedDistrict(null);
      setModalOpen(false);
      return;
    }
    setSelectedDistrict(district);
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setSelectedDistrict(null);
  }

  return (
    <main className="container page-section">
      {/* Hero Header */}
      <section className="tf-map-hero">
        <div>
          <span className="badge badge-warm tf-map-hero__badge">
            <CompassIcon size={12} />
            BANGLADESH ATLAS // 64 DISTRICTS & {BANGLADESH_DISTRICTS.reduce((s, d) => s + d.places.length, 0)}+ VISIONS
          </span>
          <h1 className="page-title">
            Explore Bangladesh, <em className="serif-accent">{firstName}</em>
          </h1>
          <p className="page-subtitle">
            Click any district pin on the map to browse famous tourist attractions, archaeological wonders, and scenic trails.
          </p>
        </div>

        <div className="inline-actions tf-map-hero__actions">
          <Link to="/trips/new" className="btn btn-primary">
            <PlusIcon size={16} />
            Plan custom trip
          </Link>
        </div>
      </section>

      {/* Division Filters & Search Bar */}
      <div className="tf-map-filter-bar">
        <div className="tf-map-divisions" role="tablist" aria-label="Filter by division">
          {BANGLADESH_DIVISIONS.map((div) => {
            const count =
              div === 'All'
                ? BANGLADESH_DISTRICTS.length
                : BANGLADESH_DISTRICTS.filter((d) => d.division === div).length;

            return (
              <button
                key={div}
                type="button"
                role="tab"
                aria-selected={activeDivision === div}
                className={`tf-map-division-pill ${
                  activeDivision === div ? 'tf-map-division-pill--active' : ''
                }`}
                onClick={() => setActiveDivision(div)}
              >
                <span>{div}</span>
                <span className="tf-map-division-pill__count">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="tf-map-search">
          <span className="tf-map-search__icon" aria-hidden="true">
            <SearchIcon size={14} />
          </span>
          <input
            type="search"
            className="form-input tf-map-search__input"
            placeholder="Search district or spot (e.g. Sajek, Inani, Ratargul)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search districts and places"
          />
          {searchQuery && (
            <button
              type="button"
              className="tf-map-search__clear"
              onClick={() => setSearchQuery('')}
              title="Clear search"
              aria-label="Clear search"
            >
              <CloseIcon size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Interactive Map + District Quick Browser */}
      <div className="tf-map-layout">
        {/* Interactive Map */}
        <section className="tf-map-layout__map" aria-label="Interactive map">
          <BangladeshInteractiveMap
            districts={filteredDistricts}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={handleOpenDistrictModal}
            activeDivision={activeDivision}
          />
        </section>

        {/* Sidebar / Quick District Explorer */}
        <aside className="tf-map-layout__sidebar" aria-label="Districts list">
          <Card
            title={
              <div className="tf-map-sidebar__header">
                <span>Districts ({filteredDistricts.length})</span>
                <span className="badge badge-warm" style={{ fontSize: '11px' }}>
                  {totalPlacesCount} {pluralize(totalPlacesCount, 'attraction')}
                </span>
              </div>
            }
            subtitle={
              activeDivision === 'All'
                ? 'Select any district on the map or from the list below.'
                : `Showing all districts in ${activeDivision} Division.`
            }
          >
            {filteredDistricts.length === 0 ? (
              <div className="tf-map-empty-state">
                <MapIcon size={24} />
                <p>No districts match "{searchQuery}".</p>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSearchQuery('')}
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="tf-map-district-list">
                {filteredDistricts.map((district) => (
                  <button
                    key={district.id}
                    type="button"
                    className={`tf-map-district-card ${
                      selectedDistrict?.id === district.id ? 'tf-map-district-card--active' : ''
                    }`}
                    onClick={() => handleOpenDistrictModal(district)}
                  >
                    <div className="tf-map-district-card__top">
                      <div className="tf-map-district-card__names">
                        <span className="tf-map-district-card__en">{district.name}</span>
                        <span className="tf-map-district-card__bn">{district.bnName}</span>
                      </div>
                      <span className="badge">{district.division}</span>
                    </div>

                    <p className="tf-map-district-card__summary">
                      {district.highlightsSummary}
                    </p>

                    <div className="tf-map-district-card__footer">
                      <span className="tf-map-district-card__spots">
                        <MapPinIcon size={12} />
                        {district.places.length} {district.places.length === 1 ? 'place to visit' : 'places to visit'}
                      </span>
                      <span className="tf-map-district-card__action">
                        View places →
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Card>
        </aside>
      </div>

      {/* Visitable Places Popup / Modal */}
      {selectedDistrict && (
        <Modal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          size="lg"
          title={
            <div className="tf-district-modal__title-row">
              <span className="tf-district-modal__name">{selectedDistrict.name}</span>
              <span className="tf-district-modal__bn">{selectedDistrict.bnName}</span>
              <span className="badge badge-warm">{selectedDistrict.division} Division</span>
            </div>
          }
          subtitle={`Visitable tourist places & historical attractions (${selectedDistrict.places.length})`}
        >
          <div className="tf-district-modal">
            {/* District Meta & Overview */}
            <div className="tf-district-modal__overview">
              <p className="tf-district-modal__summary">
                {selectedDistrict.highlightsSummary}
              </p>
              <div className="tf-district-modal__badges">
                <span className="tf-fact-chip">
                  <MapPinIcon size={12} />
                  Coordinates: {selectedDistrict.coords.lat}° N, {selectedDistrict.coords.lng}° E
                </span>
                <span className="tf-fact-chip">
                  <SunIcon size={12} />
                  Total curated spots: {selectedDistrict.places.length}
                </span>
              </div>
            </div>

            {/* Places List */}
            <div className="tf-district-modal__places" role="list">
              {selectedDistrict.places.map((place, idx) => (
                <div key={`${place.name}-${idx}`} className="tf-place-card" role="listitem">
                  <div className="tf-place-card__header">
                    <div className="tf-place-card__title-group">
                      <span className="tf-place-card__index">{idx + 1}</span>
                      <div>
                        <h3 className="tf-place-card__name">{place.name}</h3>
                        {place.bnName && (
                          <span className="tf-place-card__bn">{place.bnName}</span>
                        )}
                      </div>
                    </div>
                    <span className="badge badge-warm tf-place-card__category">
                      {place.category}
                    </span>
                  </div>

                  <p className="tf-place-card__desc">{place.description}</p>

                  <div className="tf-place-card__meta">
                    {place.bestTime && (
                      <div className="tf-place-card__meta-item">
                        <CalendarIcon size={13} />
                        <span>
                          <strong>Best time:</strong> {place.bestTime}
                        </span>
                      </div>
                    )}
                    {place.highlights && (
                      <div className="tf-place-card__meta-item">
                        <CompassIcon size={13} />
                        <span>
                          <strong>Highlights:</strong> {place.highlights}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Actions */}
            <div className="tf-district-modal__actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <Link
                to={`/trips/new?destination=${encodeURIComponent(selectedDistrict.name)}`}
                className="btn btn-primary"
                onClick={handleCloseModal}
              >
                <PlusIcon size={15} />
                Plan a trip to {selectedDistrict.name}
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
}
