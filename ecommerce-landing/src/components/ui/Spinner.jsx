export function Spinner({ dark = false }) {
  return <div className={`spinner${dark ? ' spinner-dark' : ''}`} />;
}
