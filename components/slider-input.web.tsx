export default function SliderInput({ value, minimumValue, maximumValue, step, onValueChange }: any) {
  return (
    <input
      type="range"
      min={minimumValue ?? 0}
      max={maximumValue ?? 10}
      step={step ?? 1}
      value={value}
      onChange={e => onValueChange?.(parseFloat(e.target.value))}
      style={{ width: "100%" }}
    />
  );
}