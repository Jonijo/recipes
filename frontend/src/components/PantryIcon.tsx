export function PantryIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <rect x="14" y="20" width="36" height="34" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M18 20v-4a2 2 0 012-2h24a2 2 0 012 2v4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M22 14V9m20 5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M20 36c3-2 6-2 9 0s6 2 9 0 6-2 9 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="24" cy="46" r="1.5" fill="currentColor" />
      <circle cx="32" cy="46" r="1.5" fill="currentColor" />
      <circle cx="40" cy="46" r="1.5" fill="currentColor" />
    </svg>
  );
}
