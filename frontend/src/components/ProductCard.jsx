import { resolveImageUrl } from "../utils/resolveImage.js";

const WA_PHONE = import.meta.env.VITE_WA_PHONE || "";

function waLink(message) {
  const phone = String(WA_PHONE).replace(/[^\d]/g, "");
  const text = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${text}`;
}

export default function ProductCard({ product }) {
  if (!product) return null;

  const name = product.name || "Producto";
  const category =
    product.categoryName || product.category?.name || "Categoría";
  const description = product.description || "";

  // ✅ resolver imagen (backend /uploads o cloudinary)
  const imageUrl =
    resolveImageUrl(product.imageUrl) ||
    "https://via.placeholder.com/800x600?text=Producto";

  const msg = `Hola! Quería consultar si tienen stock y precio de: ${name}. Gracias!`;

  return (
    <article className="card product-card">
      <div className="product-card__imgWrap">
        <img
          className="product-card__img"
          src={imageUrl}
          alt={name}
          loading="lazy"
        />
      </div>

      <div className="product-card__body">
        <div className="badge">{category}</div>
        <h3 className="product-card__title">{name}</h3>

        {description ? (
          <p className="product-card__desc">{description}</p>
        ) : null}
      </div>

      <div className="product-card__actions">
        <a
          className="btn btn--primary btn--full"
          href={waLink(msg)}
          target="_blank"
          rel="noreferrer"
        >
          Consultar Precio
        </a>
      </div>
    </article>
  );
}
