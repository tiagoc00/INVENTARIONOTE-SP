import { Input } from '../atoms/Input';

export function SearchBox({ value, onChange, placeholder = "Buscar...", className = '' }) {
  return (
    <div className={`flex items-center gap-2 bg-bg border border-border rounded-lg px-3 py-1.5 focus-within:border-accent transition-colors ${className}`}>
      <span className="text-text-muted text-lg">🔍</span>
      <Input 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        className="!border-none !px-0 !py-0 !bg-transparent !focus:border-none focus:ring-0 w-48"
      />
    </div>
  );
}
