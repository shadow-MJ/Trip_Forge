import './Loader.css';

export default function Loader({ label = 'Loading...', inline = false }) {
  return (
    <div
      className={`tf-loader ${inline ? 'tf-loader--inline' : 'tf-loader--block'}`}
      role="status"
      aria-live="polite"
    >
      <span className="tf-loader__spinner" aria-hidden="true" />
      <span className="tf-loader__label">{label}</span>
    </div>
  );
}

