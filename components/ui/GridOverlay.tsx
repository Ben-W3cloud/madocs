export default function GridOverlay({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`azk-grid ${className}`} />;
}
