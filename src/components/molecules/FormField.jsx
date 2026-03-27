import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';

export function FormField({ label, type = 'text', options, monospace, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.3px]">
        {label}
      </label>
      {type === 'select' ? (
        <Select {...props}>
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </Select>
      ) : (
        <Input type={type} monospace={monospace} {...props} />
      )}
    </div>
  );
}
