import { useEffect, useId, useState } from 'react';
import bdMapImage from '../assets/bangladesh-districts-map.jpg';
import { MapPinIcon } from './Icons';
import './BangladeshInteractiveMap.css';

export default function BangladeshInteractiveMap({
  districts = [],
  selectedDistrict = null,
  onSelectDistrict,
  activeDivision = 'All',
}) {
  const [hoveredDistrict, setHoveredDistrict] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showLabels, setShowLabels] = useState(true);
  const tooltipId = useId();

  // Close popup/tooltip on Escape or clicking outside
  useEffect(() => {
    function handleDocumentClick(e) {
      if (
        e.target.closest('.tf-bd-pin-target') ||
        e.target.closest('.tf-bd-map-toolbar') ||
        e.target.closest('.tf-map-district-card') ||
        e.target.closest('.tf-modal') ||
        e.target.closest('.tf-modal-backdrop')
      ) {
        return;
      }
      setHoveredDistrict(null);
      onSelectDistrict?.(null);
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setHoveredDistrict(null);
        onSelectDistrict?.(null);
      }
    }

    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onSelectDistrict]);

  function handleZoomIn() {
    setZoomLevel((z) => Math.min(2.0, Number((z + 0.25).toFixed(2))));
  }

  function handleZoomOut() {
    setZoomLevel((z) => Math.max(1, Number((z - 0.25).toFixed(2))));
  }

  function handleResetZoom() {
    setZoomLevel(1);
  }

  function handleViewportClick(e) {
    if (e.target.closest('.tf-bd-pin-target') || e.target.closest('.tf-bd-map-toolbar')) {
      return;
    }
    setHoveredDistrict(null);
    onSelectDistrict?.(null);
  }

  function handlePinClick(e, district) {
    e.stopPropagation();
    if (selectedDistrict?.id === district.id) {
      setHoveredDistrict(null);
      onSelectDistrict?.(null);
    } else {
      onSelectDistrict?.(district);
    }
  }

  return (
    <div className="tf-bd-map-wrapper">
      <div className="tf-bd-map-toolbar">
        <div className="tf-bd-map-legend">
          <span className="tf-bd-map-legend__dot" aria-hidden="true" />
          <span className="tf-bd-map-legend__text">
            Click any red district pin to view visitable places
          </span>
        </div>

        <div className="tf-bd-map-controls">
          <button
            type="button"
            className={`btn btn-sm ${showLabels ? 'btn-secondary' : 'btn-ghost'} tf-bd-map-btn-toggle`}
            onClick={() => setShowLabels((prev) => !prev)}
            title="Toggle district names on map"
            aria-pressed={showLabels}
          >
            {showLabels ? 'Names: ON' : 'Names: OFF'}
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm tf-bd-map-btn"
            onClick={handleZoomIn}
            title="Zoom in"
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm tf-bd-map-btn"
            onClick={handleZoomOut}
            title="Zoom out"
            aria-label="Zoom out"
            disabled={zoomLevel <= 1}
          >
            −
          </button>
          {zoomLevel > 1 && (
            <button
              type="button"
              className="btn btn-ghost btn-sm tf-bd-map-btn-reset"
              onClick={handleResetZoom}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div
        className="tf-bd-map-viewport"
        onClick={handleViewportClick}
        role="presentation"
      >
        <div
          className="tf-bd-map-stage"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: '50% 50%',
            transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Authentic Bangladesh district map artwork */}
          <img
            src={bdMapImage}
            alt="Bangladesh District Map"
            className="tf-bd-map-image"
            draggable={false}
          />

          {/* Interactive pinpoint markers for all 64 districts */}
          <div className="tf-bd-map-pins" role="region" aria-label="Interactive district pins">
            {districts.map((district) => {
              const isSelected = selectedDistrict?.id === district.id;
              const isHovered = hoveredDistrict?.id === district.id;
              const matchesDivision =
                activeDivision === 'All' || district.division === activeDivision;

              return (
                <div
                  key={district.id}
                  className={`tf-bd-pin-anchor ${
                    isSelected ? 'tf-bd-pin-anchor--selected' : ''
                  } ${!matchesDivision ? 'tf-bd-pin-anchor--dimmed' : ''}`}
                  style={{
                    left: `${district.coords.x}%`,
                    top: `${district.coords.y}%`,
                  }}
                >
                  <button
                    type="button"
                    className={`tf-bd-pin-target ${
                      isSelected ? 'tf-bd-pin-target--selected' : ''
                    }`}
                    onClick={(e) => handlePinClick(e, district)}
                    onMouseEnter={() => setHoveredDistrict(district)}
                    onMouseLeave={() => setHoveredDistrict((curr) => (curr?.id === district.id ? null : curr))}
                    onFocus={() => setHoveredDistrict(district)}
                    onBlur={() => setHoveredDistrict((curr) => (curr?.id === district.id ? null : curr))}
                    aria-label={`${district.name} (${district.bnName}), ${district.places.length} visitable places`}
                  >
                    <span className="tf-bd-pin-core" />
                    {isSelected && <span className="tf-bd-pin-pulse" />}
                  </button>

                  {/* Crisp district name label matching authentic map typography */}
                  {showLabels && !isHovered && !isSelected && (
                    <span className="tf-bd-pin-name-label" aria-hidden="true">
                      {district.bnName}
                    </span>
                  )}

                  {/* Hover or selected floating label */}
                  {(isHovered || isSelected) && (
                    <div
                      id={tooltipId}
                      className="tf-bd-pin-tooltip"
                      role="tooltip"
                    >
                      <span className="tf-bd-pin-tooltip__name">
                        {district.name}
                      </span>
                      <span className="tf-bd-pin-tooltip__bn">
                        {district.bnName}
                      </span>
                      <span className="tf-bd-pin-tooltip__count">
                        <MapPinIcon size={10} />
                        {district.places.length} {district.places.length === 1 ? 'place' : 'places'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
