export function QtyControl({ value, onChange, max = 999 }) {
  return (
    <div className="qty-control">
      <button className="qty-btn" onClick={() => onChange(Math.max(1, value - 1))}>−</button>
      <span className="qty-num">{value}</span>
      <button className="qty-btn" onClick={() => onChange(Math.min(max, value + 1))}>+</button>
    </div>
  );
}
