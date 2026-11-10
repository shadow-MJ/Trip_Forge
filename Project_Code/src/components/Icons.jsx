function Svg({ size = 18, children, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export function BrandIcon({ size = 20 }) {
  return (
    <Svg size={size}>
      <path d="M3 6.5L9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20V6.5z" />
      <path d="M9 4v13.5" />
      <path d="M15 6.5V20" />
    </Svg>
  );
}

export function BellIcon({ size = 18 }) {
  return (
    <Svg size={size}>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </Svg>
  );
}

export function PlusIcon({ size = 16 }) {
  return (
    <Svg size={size}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </Svg>
  );
}

export function MapPinIcon({ size = 16 }) {
  return (
    <Svg size={size}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </Svg>
  );
}

export function CalendarIcon({ size = 16 }) {
  return (
    <Svg size={size}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </Svg>
  );
}

export function UsersIcon({ size = 16 }) {
  return (
    <Svg size={size}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Svg>
  );
}

export function ClockIcon({ size = 15 }) {
  return (
    <Svg size={size}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Svg>
  );
}

export function CheckIcon({ size = 16 }) {
  return (
    <Svg size={size}>
      <path d="M20 6L9 17l-5-5" />
    </Svg>
  );
}

export function CloseIcon({ size = 18 }) {
  return (
    <Svg size={size}>
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </Svg>
  );
}

export function TrashIcon({ size = 15 }) {
  return (
    <Svg size={size}>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
    </Svg>
  );
}

export function EditIcon({ size = 15 }) {
  return (
    <Svg size={size}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </Svg>
  );
}

export function CopyIcon({ size = 15 }) {
  return (
    <Svg size={size}>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </Svg>
  );
}

export function ThumbsUpIcon({ size = 15 }) {
  return (
    <Svg size={size}>
      <path d="M7 10v12" />
      <path d="M15 5.88L14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88z" />
    </Svg>
  );
}

export function ThumbsDownIcon({ size = 15 }) {
  return (
    <Svg size={size}>
      <path d="M17 14V2" />
      <path d="M9 18.12L10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88z" />
    </Svg>
  );
}

export function RefreshIcon({ size = 15 }) {
  return (
    <Svg size={size}>
      <path d="M23 4v6h-6" />
      <path d="M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
      <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14" />
    </Svg>
  );
}

export function CloudIcon({ size = 18 }) {
  return (
    <Svg size={size}>
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </Svg>
  );
}

export function ChevronUpIcon({ size = 15 }) {
  return (
    <Svg size={size}>
      <path d="M18 15l-6-6-6 6" />
    </Svg>
  );
}

export function ChevronDownIcon({ size = 15 }) {
  return (
    <Svg size={size}>
      <path d="M6 9l6 6 6-6" />
    </Svg>
  );
}

export function ArrowRightIcon({ size = 15 }) {
  return (
    <Svg size={size}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </Svg>
  );
}

export function ArrowLeftIcon({ size = 15 }) {
  return (
    <Svg size={size}>
      <path d="M19 12H5" />
      <path d="M11 6l-6 6 6 6" />
    </Svg>
  );
}

export function MenuIcon({ size = 18 }) {
  return (
    <Svg size={size}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </Svg>
  );
}

export function AlertCircleIcon({ size = 18 }) {
  return (
    <Svg size={size}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5" />
      <path d="M12 16.5h.01" />
    </Svg>
  );
}

export function CompassIcon({ size = 16 }) {
  return (
    <Svg size={size}>
      <circle cx="12" cy="12" r="9" />
      <polygon points="15.5 8.5 13.5 13.5 8.5 15.5 10.5 10.5 15.5 8.5" />
    </Svg>
  );
}

export function LightbulbIcon({ size = 16 }) {
  return (
    <Svg size={size}>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </Svg>
  );
}

export function PollIcon({ size = 16 }) {
  return (
    <Svg size={size}>
      <path d="M4 19h16" />
      <rect x="6" y="10" width="3" height="6" rx="0.5" />
      <rect x="11" y="5" width="3" height="11" rx="0.5" />
      <rect x="16" y="12" width="3" height="4" rx="0.5" />
    </Svg>
  );
}

export function WalletIcon({ size = 16 }) {
  return (
    <Svg size={size}>
      <path d="M21 7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
    </Svg>
  );
}

export function MessageIcon({ size = 16 }) {
  return (
    <Svg size={size}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </Svg>
  );
}

export function ListCheckIcon({ size = 16 }) {
  return (
    <Svg size={size}>
      <path d="M10 6h11" />
      <path d="M10 12h11" />
      <path d="M10 18h11" />
      <path d="M3 6l1.5 1.5L7 5" />
      <path d="M3 12l1.5 1.5L7 11" />
      <path d="M3 18l1.5 1.5L7 17" />
    </Svg>
  );
}

export function FileTextIcon({ size = 16 }) {
  return (
    <Svg size={size}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </Svg>
  );
}

export function UserIcon({ size = 16 }) {
  return (
    <Svg size={size}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </Svg>
  );
}

export function SettingsIcon({ size = 16 }) {
  return (
    <Svg size={size}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.85 1 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </Svg>
  );
}

export function SunIcon({ size = 16 }) {
  return (
    <Svg size={size}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M17.66 17.66l1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M6.34 17.66l-1.41 1.41" />
      <path d="M19.07 4.93l-1.41 1.41" />
    </Svg>
  );
}

