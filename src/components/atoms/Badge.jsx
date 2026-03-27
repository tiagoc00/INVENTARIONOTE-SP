export function Badge({ children, colorConfig, className = '' }) {
  if (colorConfig) {
    return (
      <span 
        className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${className}`}
        style={{
          background: colorConfig.cl,
          color: colorConfig.tag,
          borderColor: colorConfig.tag + '44',
          borderWidth: '1px'
        }}
      >
        {children}
      </span>
    );
  }

  return (
    <span className={`px-3 py-1 bg-surface2 text-text-muted rounded-full text-xs font-semibold border border-border inline-flex items-center gap-1.5 ${className}`}>
      {children}
    </span>
  );
}
