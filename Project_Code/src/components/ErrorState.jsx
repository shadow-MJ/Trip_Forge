import { AlertCircleIcon, RefreshIcon } from './Icons';
import './ErrorState.css';

export default function ErrorState({
  title = 'Could not load data',
  message = 'Something went wrong while fetching this section.',
  onRetry,
}) {
  return (
    <div className="tf-error" role="alert">
      <div className="tf-error__content">
        <span className="tf-error__icon">
          <AlertCircleIcon size={18} />
        </span>
        <div>
          <h3 className="tf-error__title">{title}</h3>
          <p className="tf-error__message">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button type="button" className="btn btn-secondary btn-sm" onClick={onRetry}>
          <RefreshIcon size={14} />
          Try again
        </button>
      )}
    </div>
  );
}

