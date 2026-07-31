interface ScoreInputProps {
  value: number | null
  onChange: (value: number | null) => void
  disabled?: boolean
}

export function ScoreInput({ value, onChange, disabled }: ScoreInputProps) {
  return (
    <input
      type="number"
      min={0}
      value={value ?? ''}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
      className="w-12 rounded-md border border-neutral-700 bg-neutral-900 px-1 py-0.5 text-center text-sm text-neutral-100 focus:border-green-500 focus:outline-none disabled:opacity-40"
    />
  )
}
