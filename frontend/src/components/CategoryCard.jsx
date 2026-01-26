import { Link } from "react-router-dom";
import { resolveImageUrl } from "../utils/resolveImage.js";

export default function CategoryCard({ category }) {
  if (!category) return null;

  const name = category?.name || "Categoría";
  const description = category?.description || "";
  const imageUrl =
    resolveImageUrl(category?.imageUrl) ||
    "https://via.placeholder.com/800x600?text=Categor%C3%ADa";

  return (
    <article className="card product-card">
      <div className="product-card__imgWrap">
        <img className="product-card__img" src={imageUrl} alt={name} loading="lazy" />
      </div>

      <div className="product-card__body">
        <div className="badge">Categoría</div>
        <h3 className="product-card__title">{name}</h3>
        {description ? <p className="product-card__desc">{description}</p> : null}
      </div>

      <div className="product-card__actions">
        <Link className="btn btn--primary btn--full" to={`/categoria/${category.slug}`}>
          Ver productos
        </Link>
      </div>
    </article>
  );
}
