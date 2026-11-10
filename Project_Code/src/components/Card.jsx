import './Card.css';

export default function Card({
  title,
  subtitle,
  action,
  children,
  className = '',
  padding = 'default',
  interactive = false,
}) {
  return (
    <section
      className={`tf-card tf-card--${padding} ${interactive ? 'tf-card--interactive' : ''} ${className}`}
    >
      {(title || subtitle || action) && (
        <div className="tf-card__header">
          <div className="tf-card__heading-group">
            {title && <h2 className="tf-card__title">{title}</h2>}
            {subtitle && <p className="tf-card__subtitle">{subtitle}</p>}
          </div>
          {action && <div className="tf-card__action">{action}</div>}
        </div>
      )}
      <div className="tf-card__body">{children}</div>
    </section>
  );
}

