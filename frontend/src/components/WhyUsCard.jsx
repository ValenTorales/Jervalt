export default function WhyUsCard({ icon, title, children }) {
  return (
    <div className="card why-card">
      <div className="why-card__icon" aria-hidden="true">
        {icon}
      </div>
      <div className="why-card__title">{title}</div>
      <div className="why-card__text">{children}</div>
    </div>
  );
}
