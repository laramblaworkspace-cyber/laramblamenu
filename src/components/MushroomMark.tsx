export function MushroomMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <ellipse cx="32" cy="22" rx="22" ry="14" fill="#7a4a2d" />
      <ellipse cx="32" cy="20" rx="18" ry="11" fill="#a66b3d" />
      <circle cx="22" cy="18" r="3" fill="#d4a574" opacity="0.55" />
      <path
        d="M26 28c0 0 2 18 6 22h6c4-4 6-22 6-22"
        fill="#c9a882"
        stroke="#5c3a24"
        strokeWidth="1.2"
      />
      <path d="M28 48h8" stroke="#5c3a24" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
