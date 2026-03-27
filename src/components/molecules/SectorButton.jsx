export function SectorButton({ name, count, colorConfig, isActive, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg border-none bg-transparent font-medium text-[13px] text-left cursor-pointer transition-all relative
        ${isActive ? 'text-text bg-surface2' : 'text-text-dim hover:bg-surface2 hover:text-text'}
      `}
    >
      {isActive && (
        <div 
          className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full" 
          style={{ background: colorConfig?.cor || 'var(--accent)' }}
        />
      )}
      <div 
        className="w-2 h-2 rounded-full shrink-0" 
        style={{ background: colorConfig?.cor || '#555' }}
      />
      {name}
      <span className={`ml-auto font-mono text-[11px] px-1.5 py-px rounded-full text-text-muted ${isActive ? 'bg-bg' : 'bg-surface'}`}>
        {count}
      </span>
    </button>
  );
}
