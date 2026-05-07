export default function DatePicker({ value, onChange }: any) {
  return (
    <input
      type="datetime-local"
      value={value?.toISOString().slice(0, 16)}
      onChange={e => onChange?.({}, new Date(e.target.value))}
      style={{ fontSize: 16, padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
    />
  );
}