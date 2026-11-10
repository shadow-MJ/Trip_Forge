import './EmptyState.css';

export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="tf-empty">
      {icon && <div className="tf-empty__icon">{icon}</div>}
      <h3 className="tf-empty__title">{title}</h3>
      {description && <p className="tf-empty__description">{description}</p>}
      {action && <div className="tf-empty__action">{action}</div>}
    </div>
  );
}

