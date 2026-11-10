import { useId } from 'react';
import { getInitials } from '../utils/formatters';
import './TropicalVisuals.css';

function getDestinationScene(destination = '', name = '') {
  const text = `${destination} ${name}`.toLowerCase();
  if (/sylhet|tea|jaflong|ratargul|waterfall|forest|spring/.test(text)) return 'tea';
  if (/bandarban|ridge|sajek|boga|hill|trek|mountain|peak/.test(text)) return 'ridge';
  if (/sundarban|river|mangrove|khulna|lake|boat/.test(text)) return 'river';
  return 'coast';
}

export function DestinationCover({
  destination = '',
  name = '',
  height = 'card',
  children,
}) {
  const scene = getDestinationScene(destination, name);
  const rawId = useId().replace(/:/g, '');
  const skyGradId = `tf-sky-${scene}-${rawId}`;
  const sunGradId = `tf-sun-${scene}-${rawId}`;

  return (
    <div
      className={`tf-scene tf-scene--${scene} tf-scene--${height}`}
    >
      <svg
        className="tf-scene__svg"
        viewBox="0 0 400 140"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={skyGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            {scene === 'coast' && (
              <>
                <stop offset="0%" stopColor="#fde6c4" />
                <stop offset="52%" stopColor="#bfeae2" />
                <stop offset="100%" stopColor="#149188" />
              </>
            )}
            {scene === 'tea' && (
              <>
                <stop offset="0%" stopColor="#eaf6d7" />
                <stop offset="55%" stopColor="#a7dfc9" />
                <stop offset="100%" stopColor="#137b6c" />
              </>
            )}
            {scene === 'ridge' && (
              <>
                <stop offset="0%" stopColor="#ffd7ba" />
                <stop offset="55%" stopColor="#f6b88e" />
                <stop offset="100%" stopColor="#267365" />
              </>
            )}
            {scene === 'river' && (
              <>
                <stop offset="0%" stopColor="#d9f2ec" />
                <stop offset="50%" stopColor="#7ed0c2" />
                <stop offset="100%" stopColor="#0f6b63" />
              </>
            )}
          </linearGradient>

          <linearGradient id={sunGradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff4d6" />
            <stop offset="100%" stopColor="#f4a261" />
          </linearGradient>
        </defs>

        <rect width="400" height="140" fill={`url(#${skyGradId})`} />

        {scene === 'coast' && (
          <>
            <circle cx="318" cy="40" r="24" fill={`url(#${sunGradId})`} opacity="0.92" />
            <path
              d="M0 92 Q90 78 190 90 T400 84 L400 140 L0 140 Z"
              fill="#0f766e"
              opacity="0.45"
            />
            <path
              d="M0 105 Q110 92 220 106 T400 100 L400 140 L0 140 Z"
              fill="#0b5d56"
              opacity="0.72"
            />
            <path
              d="M0 120 Q120 112 250 122 T400 118 L400 140 L0 140 Z"
              fill="#f3d7aa"
              opacity="0.88"
            />
            {/* Coastal palm cluster */}
            <path
              d="M46 126 Q55 86 68 56"
              stroke="#0c3c37"
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M68 56 C48 44, 30 50, 22 64 C40 58, 56 58, 68 56 Z"
              fill="#0f524c"
            />
            <path
              d="M68 56 C58 34, 78 26, 98 34 C82 40, 74 48, 68 56 Z"
              fill="#0c423d"
            />
            <path
              d="M68 56 C86 48, 102 58, 108 72 C92 64, 78 60, 68 56 Z"
              fill="#115e57"
            />
            <path
              d="M68 56 C44 62, 34 76, 36 86 C48 74, 58 64, 68 56 Z"
              fill="#0c423d"
            />
          </>
        )}

        {scene === 'tea' && (
          <>
            <circle cx="88" cy="38" r="22" fill={`url(#${sunGradId})`} opacity="0.85" />
            <path
              d="M0 94 Q100 58 205 84 T400 72 L400 140 L0 140 Z"
              fill="#2e8b75"
              opacity="0.55"
            />
            <path
              d="M0 110 Q120 76 240 104 T400 92 L400 140 L0 140 Z"
              fill="#1b6b5c"
              opacity="0.78"
            />
            <path
              d="M0 124 Q140 100 280 120 T400 112 L400 140 L0 140 Z"
              fill="#0f524c"
              opacity="0.92"
            />
            {/* Waterfall ribbon */}
            <path
              d="M276 76 C278 92, 270 106, 274 128"
              stroke="#e6faf6"
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.72"
            />
            <ellipse cx="274" cy="130" rx="22" ry="5" fill="#e6faf6" opacity="0.48" />
          </>
        )}

        {scene === 'ridge' && (
          <>
            <circle cx="290" cy="44" r="26" fill={`url(#${sunGradId})`} opacity="0.92" />
            <path
              d="M0 102 L72 62 L145 90 L228 50 L315 86 L400 60 L400 140 L0 140 Z"
              fill="#2f6f64"
              opacity="0.55"
            />
            <path
              d="M0 116 L90 82 L175 106 L270 72 L360 104 L400 88 L400 140 L0 140 Z"
              fill="#195249"
              opacity="0.8"
            />
            <path
              d="M0 126 Q140 112 260 128 T400 122 L400 140 L0 140 Z"
              fill="#0d3832"
              opacity="0.9"
            />
          </>
        )}

        {scene === 'river' && (
          <>
            <circle cx="315" cy="42" r="20" fill={`url(#${sunGradId})`} opacity="0.88" />
            <path
              d="M0 78 Q90 66 180 78 T400 72 L400 140 L0 140 Z"
              fill="#156b62"
              opacity="0.62"
            />
            <path
              d="M0 98 Q120 90 250 100 T400 94 L400 140 L0 140 Z"
              fill="#0f5a53"
              opacity="0.82"
            />
            <path
              d="M65 118 Q135 114 205 118"
              stroke="#d7f7f0"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.6"
            />
            <path
              d="M235 124 Q295 120 355 124"
              stroke="#d7f7f0"
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity="0.5"
            />
            {/* Mangrove silhouette + river boat */}
            <path
              d="M150 108 L188 108 L180 116 L158 116 Z"
              fill="#102a28"
            />
            <path d="M168 94 L168 108" stroke="#102a28" strokeWidth="2" />
            <circle cx="38" cy="78" r="20" fill="#0d4a44" opacity="0.9" />
            <circle cx="66" cy="84" r="16" fill="#0f5c54" opacity="0.9" />
          </>
        )}
      </svg>

      {children && <div className="tf-scene__overlay">{children}</div>}
    </div>
  );
}

export function MemberAvatarStack({ members = [], totalCount, maxShown = 4 }) {
  if (!members || members.length === 0) return null;
  const shown = members.slice(0, maxShown);
  const extra = Math.max(0, (totalCount || members.length) - shown.length);

  return (
    <div className="tf-avatar-stack" aria-label={`${totalCount || members.length} members`}>
      {shown.map((member) => (
        <span
          key={member.id}
          className="tf-avatar-stack__chip"
          title={member.name}
        >
          {getInitials(member.name)}
        </span>
      ))}
      {extra > 0 && (
        <span className="tf-avatar-stack__chip tf-avatar-stack__chip--extra">
          +{extra}
        </span>
      )}
    </div>
  );
}
