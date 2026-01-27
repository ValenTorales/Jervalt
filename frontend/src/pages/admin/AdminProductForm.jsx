import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios.js";
import { uploadImage } from "../../api/upload.js";
import { resolveImageUrl } from "../../utils/resolveImage.js"; // <-- ojo el nombre del archivo
// Si tu helper se llama resolveImage.js, cambiá esta línea a:
// import { resolveImageUrl } from "../../utils/resolveImage.js";

export default function AdminProductForm({ mode }) {
  const nav = useNavigate();
  const { id } = useParams();

  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
    categoryId: "",
    isActive: true,
  });

  const onChange = (k) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [k]: v }));
  };

  const doUpload = async () => {
    if (!file) return alert("Seleccioná una imagen");

    try {
      setUploading(true);

      // Sube al backend y devuelve algo como "/uploads/products/img_....jpg"
      const url = await uploadImage(file, "products");

      // Guarda la URL en el form (esto se va a guardar en SQLite)
      setForm((f) => ({ ...f, imageUrl: url }));

      // Limpia selección
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      alert(err?.response?.data?.message || "No se pudo subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);

        // 1) cargar categorías
        const { data: cdata } = await api.get("/categories");
        const listCats = Array.isArray(cdata) ? cdata : [];
        if (!alive) return;
        setCats(listCats);

        // 2) si edit, cargar producto
        if (mode === "edit") {
          const { data: p } = await api.get(`/products/admin/${id}`);
          if (!alive) return;

          setForm({
            name: p.name || "",
            description: p.description || "",
            imageUrl: p.imageUrl || "",
            categoryId: p.categoryId ? String(p.categoryId) : "",
            isActive: Boolean(p.isActive),
          });
        } else {
          // create: set default category si hay
          setForm((f) => ({
            ...f,
            categoryId: listCats[0]?.id ? String(listCats[0].id) : "",
          }));
        }
      } catch (err) {
        alert(err?.response?.data?.message || "No se pudo cargar el formulario");
        nav("/admin/productos");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [mode, id, nav]);

  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      description: form.description,
      imageUrl: form.imageUrl,
      categoryId: form.categoryId ? Number(form.categoryId) : null,
      isActive: form.isActive,
    };

    try {
      if (mode === "edit") {
        await api.put(`/products/${id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      nav("/admin/productos");
    } catch (err) {
      alert(err?.response?.data?.message || "No se pudo guardar");
    }
  };

  const previewSrc = form.imageUrl ? resolveImageUrl(form.imageUrl) : "";
  const flecha = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 20" fill="none" stroke="#ffffff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
      <path d="M11 17h6l-4 -5l4 -5h-6l-4 5z" />
    </svg>;
  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h2 className="admin-page__title">
            {mode === "edit" ? "Editar producto" : "Nuevo producto"}
          </h2>
          <p className="admin-page__desc">Completá los datos del producto</p>
        </div>
            <Link
              to="/admin/productos"
              className="btn"
              style={{
                marginBottom: 6,
                backgroundColor: "#0a234b",
                color: "#ffffff",
                padding: "10px 16px",
                borderRadius: "14px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center" }}>{flecha}</span>
              <span style={{ fontWeight: 800 }}>Volver</span>
            </Link>
      </div>

      <form className="card admin-form" onSubmit={submit}>
        {loading ? (
          <div>Cargando...</div>
        ) : (
          <>
            <label className="field">
              <span>Nombre</span>
              <input className="input" value={form.name} onChange={onChange("name")} required />
            </label>

            <label className="field">
              <span>Descripción</span>
              <textarea
                className="input"
                rows={4}
                value={form.description}
                onChange={onChange("description")}
              />
            </label>

            {/* URL manual (opcional) */}
            <label className="field">
              <span>Imagen (URL)</span>
              <input
                className="input"
                value={form.imageUrl}
                onChange={onChange("imageUrl")}
                placeholder="Pegá una URL o subí una imagen abajo"
              />
            </label>

            {/* Upload de archivo */}
            <label className="field">
              <span>Subir imagen (archivo)</span>
              <input
                ref={fileInputRef}
                className="input"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  className="btn"
                  type="button"
                  onClick={doUpload}
                  disabled={!file || uploading}
                  style={{ border: "var(--border)" }}
                >
                  {uploading ? "Subiendo..." : "Subir imagen"}
                </button>

                {file ? (
                  <button
                    className="btn"
                    type="button"
                    onClick={() => {
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    style={{ border: "var(--border)" }}
                  >
                    Quitar archivo
                  </button>
                ) : null}
              </div>
            </label>

            {/* Preview */}
            {previewSrc ? (
              <div className="card" style={{ padding: 12 }}>
                <div style={{ fontWeight: 900, marginBottom: 8 }}>Preview</div>
                <img
                  src={previewSrc}
                  alt="preview"
                  style={{
                    width: "100%",
                    maxHeight: 260,
                    objectFit: "cover",
                    borderRadius: 12,
                    border: "1px solid rgba(0,0,0,.08)",
                  }}
                />
                <div className="muted" style={{ marginTop: 8, fontSize: 12, wordBreak: "break-all" }}>
                  {form.imageUrl}
                </div>
              </div>
            ) : null}

            <label className="field">
              <span>Categoría</span>
              <select className="input" value={form.categoryId} onChange={onChange("categoryId")}>
                <option value="">Sin categoría</option>
                {cats.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="check">
              <input type="checkbox" checked={form.isActive} onChange={onChange("isActive")} />
              <span>Activo (visible en el catálogo)</span>
            </label>

            <button className="btn btn--primary btn--full" type="submit" disabled={uploading}>
              {mode === "edit" ? "Guardar cambios" : "Crear producto"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
