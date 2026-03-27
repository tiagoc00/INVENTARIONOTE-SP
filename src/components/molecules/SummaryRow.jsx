export function SummaryRow({ label, value, colorClass = "" }) {
  return (
    <div className="flex justify-between items-center mb-1.5 last:mb-0">
      <span className="text-[11px] text-text-dim">{label}</span>
      <span className={`text-[13px] font-semibold font-mono ${colorClass}`}>{value}</span>
    </div>
  );
}
