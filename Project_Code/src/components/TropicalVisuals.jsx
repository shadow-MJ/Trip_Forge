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
                <stop offset="0%" stopColor="#f8f3ea" />
                <stop offset="48%" stopColor="#dfcdba" />
                <stop offset="100%" stopColor="#5c402d" />
              </>
            )}
            {scene === 'tea' && (
              <>
                <stop offset="0%" stopColor="#f7f1e7" />
                <stop offset="50%" stopColor="#dac7b3" />
                <stop offset="100%" stopColor="#543926" />
              </>
            )}
            {scene === 'ridge' && (
              <>
                <stop offset="0%" stopColor="#faeee0" />
                <stop offset="52%" stopColor="#dcbfa7" />
                <stop offset="100%" stopColor="#4e321f" />
              </>
            )}
            {scene === 'river' && (
              <>
                <stop offset="0%" stopColor="#f6efe6" />
                <stop offset="48%" stopColor="#d5c2af" />
                <stop offset="100%" stopColor="#4e3524" />
              </>
            )}
          </linearGradient>

          <linearGradient id={sunGradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fffaf2" />
            <stop offset="100%" stopColor="#d29a5a" />
          </linearGradient>
        </defs>

        <rect width="400" height="140" fill={`url(#${skyGradId})`} />

        {/* Topographic fine contour lines */}
        <path
          d="M0 38 Q110 24 220 40 T400 32"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M0 58 Q90 46 200 60 T400 52"
          stroke="rgba(255, 255, 255, 0.14)"
          strokeWidth="1"
          strokeDasharray="2 3"
          fill="none"
        />

        {scene === 'coast' && (
          <>
            <circle cx="318" cy="40" r="32" stroke="rgba(255, 255, 255, 0.3)" strokeDasharray="3 3" fill="none" />
            <circle cx="318" cy="40" r="22" fill={`url(#${sunGradId})`} opacity="0.94" />
            <text x="14" y="22" fill="rgba(255, 255, 255, 0.7)" fontSize="8.5" fontFamily="var(--font-mono)" letterSpacing="0.08em">
              21°25′N 92°00′E // SECTOR 01
            </text>
            <path
              d="M0 92 Q90 78 190 90 T400 84 L400 140 L0 140 Z"
              fill="#523928"
              opacity="0.5"
            />
            <path
              d="M0 105 Q110 92 220 106 T400 100 L400 140 L0 140 Z"
              fill="#3a271b"
              opacity="0.78"
            />
            <path
              d="M0 120 Q120 112 250 122 T400 118 L400 140 L0 140 Z"
              fill="#dfcebc"
              opacity="0.9"
            />
            {/* Coastal palm cluster */}
            <path
              d="M46 126 Q55 86 68 56"
              stroke="#241710"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M68 56 C48 44, 30 50, 22 64 C40 58, 56 58, 68 56 Z"
              fill="#352317"
            />
            <path
              d="M68 56 C58 34, 78 26, 98 34 C82 40, 74 48, 68 56 Z"
              fill="#241710"
            />
            <path
              d="M68 56 C86 48, 102 58, 108 72 C92 64, 78 60, 68 56 Z"
              fill="#442e1f"
            />
            <path
              d="M68 56 C44 62, 34 76, 36 86 C48 74, 58 64, 68 56 Z"
              fill="#241710"
            />
          </>
        )}

        {scene === 'tea' && (
          <>
            <circle cx="88" cy="38" r="30" stroke="rgba(255, 255, 255, 0.3)" strokeDasharray="3 3" fill="none" />
            <circle cx="88" cy="38" r="20" fill={`url(#${sunGradId})`} opacity="0.9" />
            <text x="140" y="22" fill="rgba(255, 255, 255, 0.7)" fontSize="8.5" fontFamily="var(--font-mono)" letterSpacing="0.08em">
              24°18′N 91°44′E // TEA HIGHLANDS
            </text>
            <path
              d="M0 94 Q100 58 205 84 T400 72 L400 140 L0 140 Z"
              fill="#563b27"
              opacity="0.55"
            />
            <path
              d="M0 110 Q120 76 240 104 T400 92 L400 140 L0 140 Z"
              fill="#3e281b"
              opacity="0.8"
            />
            <path
              d="M0 124 Q140 100 280 120 T400 112 L400 140 L0 140 Z"
              fill="#2b1a10"
              opacity="0.94"
            />
            {/* Waterfall ribbon */}
            <path
              d="M276 76 C278 92, 270 106, 274 128"
              stroke="#faf6ef"
              strokeWidth="7"
              strokeLinecap="round"
              opacity="0.8"
            />
            <ellipse cx="274" cy="130" rx="20" ry="4" fill="#faf6ef" opacity="0.55" />
          </>
        )}

        {scene === 'ridge' && (
          <>
            <circle cx="290" cy="44" r="34" stroke="rgba(255, 255, 255, 0.3)" strokeDasharray="3 3" fill="none" />
            <circle cx="290" cy="44" r="24" fill={`url(#${sunGradId})`} opacity="0.94" />
            <text x="14" y="22" fill="rgba(255, 255, 255, 0.7)" fontSize="8.5" fontFamily="var(--font-mono)" letterSpacing="0.08em">
              21°47′N 92°13′E // ELEV 1,063M
            </text>
            <path
              d="M0 102 L72 62 L145 90 L228 50 L315 86 L400 60 L400 140 L0 140 Z"
              fill="#583924"
              opacity="0.55"
            />
            <path
              d="M0 116 L90 82 L175 106 L270 72 L360 104 L400 88 L400 140 L0 140 Z"
              fill="#3f2717"
              opacity="0.82"
            />
            <path
              d="M0 126 Q140 112 260 128 T400 122 L400 140 L0 140 Z"
              fill="#26160d"
              opacity="0.96"
            />
          </>
        )}

        {scene === 'river' && (
          <>
            <circle cx="315" cy="42" r="28" stroke="rgba(255, 255, 255, 0.3)" strokeDasharray="3 3" fill="none" />
            <circle cx="315" cy="42" r="18" fill={`url(#${sunGradId})`} opacity="0.92" />
            <text x="14" y="22" fill="rgba(255, 255, 255, 0.7)" fontSize="8.5" fontFamily="var(--font-mono)" letterSpacing="0.08em">
              22°15′N 89°35′E // ESTUARY EXPEDITION
            </text>
            <path
              d="M0 78 Q90 66 180 78 T400 72 L400 140 L0 140 Z"
              fill="#523827"
              opacity="0.62"
            />
            <path
              d="M0 98 Q120 90 250 100 T400 94 L400 140 L0 140 Z"
              fill="#3b2518"
              opacity="0.85"
            />
            <path
              d="M65 118 Q135 114 205 118"
              stroke="#faefe2"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.65"
            />
            <path
              d="M235 124 Q295 120 355 124"
              stroke="#faefe2"
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity="0.55"
            />
            {/* Mangrove silhouette + river boat */}
            <path
              d="M150 108 L188 108 L180 116 L158 116 Z"
              fill="#1a110a"
            />
            <path d="M168 94 L168 108" stroke="#1a110a" strokeWidth="2" />
            <circle cx="38" cy="78" r="20" fill="#2d1c12" opacity="0.9" />
            <circle cx="66" cy="84" r="16" fill="#382417" opacity="0.9" />
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
