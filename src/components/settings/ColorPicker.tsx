import { useRef } from 'react';

const PRESETS = [
  { label: 'Blue',   color: '#2563EB' },
  { label: 'Indigo', color: '#4F46E5' },
  { label: 'Purple', color: '#7C3AED' },
  { label: 'Pink',   color: '#DB2777' },
  { label: 'Red',    color: '#DC2626' },
  { label: 'Orange', color: '#EA580C' },
  { label: 'Green',  color: '#059669' },
  { label: 'Teal',   color: '#0D9488' },
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-gray-700">Accent Colour</p>
      <div className="flex items-center gap-2 flex-wrap">
        {PRESETS.map(({ label, color }) => (
          <button
            key={color}
            type="button"
            title={label}
            onClick={() => onChange(color)}
            className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer"
            style={{
              backgroundColor: color,
              borderColor: value === color ? 'white' : color,
              outline: value === color ? `2px solid ${color}` : 'none',
              outlineOffset: 2,
            }}
          />
        ))}

        {/* Custom colour picker */}
        <div className="relative">
          <button
            type="button"
            title="Custom colour"
            onClick={() => inputRef.current?.click()}
            className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 overflow-hidden transition-all"
            style={{
              background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
              outline: !PRESETS.some((p) => p.color === value) ? `2px solid ${value}` : 'none',
              outlineOffset: 2,
            }}
          />
          <input
            ref={inputRef}
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
          />
        </div>

        {/* Current colour preview */}
        <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
          <div
            className="w-6 h-6 rounded border border-gray-200"
            style={{ backgroundColor: value }}
          />
          <span className="text-xs font-mono text-gray-500 uppercase">{value}</span>
        </div>
      </div>
    </div>
  );
}
