import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios.js";
import { uploadImage } from "../../api/upload.js";
import { resolveImageUrl } from "../../utils/resolveImage.js";

export default function AdminCategoryForm({ mode }) {
  const nav = useNavigate();
  const { id } = useParams();

  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [loading, setLoading] = useState(mode === "edit");
  const [form, setForm] = useState({
    name: "",
    slug: "",
    imageUrl: "",
    description: "",
  });

  const onChange = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const doUpload = async () => {
    if (!file) return alert("Seleccioná una imagen");

    try {
      setUploading(true);

      // Sube al backend y devuelve "/uploads/categories/img_....jpg"
      const url = await uploadImage(file, "categories");

      setForm((f) => ({ ...f, imageUrl: url }));

      // limpiar selección
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      alert(err?.response?.data?.message || "No se pudo subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (mode !== "edit") return;

    (async () => {
      try {
        setLoading(true);

        // No tenemos GET /categories/:id, lo resolvemos con lista:
        const { data } = await api.get("/categories");
        const cat = (Array.isArray(data) ? data : []).find(
          (x) => String(x.id) === String(id)
        );

        if (!cat) {
          alert("Categoría no encontrada");
          nav("/admin/categorias");
          return;
        }

        setForm({
          name: cat.name || "",
          slug: cat.slug || "",
          imageUrl: cat.imageUrl || "",
          description: cat.description || "",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [mode, id, nav]);

  const submit = async (e) => {
    e.preventDefault();

    try {
      if (mode === "edit") {
        await api.put(`/categories/${id}`, form);
      } else {
        await api.post("/categories", form);
      }
      nav("/admin/categorias");
    } catch (err) {
      alert(err?.response?.data?.message || "No se pudo guardar");
    }
  };

  const previewSrc = form.imageUrl ? resolveImageUrl(form.imageUrl) : "";

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h2 className="admin-page__title">
            {mode === "edit" ? "Editar categoría" : "Nueva categoría"}
          </h2>
          <p className="admin-page__desc">Completá los datos de la categoría</p>
        </div>
        <Link className="btn" to="/admin/categorias">
          ← Volver
        </Link>
      </div>

      <form className="card admin-form" onSubmit={submit}>
        {loading ? (
          <div>Cargando...</div>
        ) : (
          <>
            <label className="field">
              <span>Nombre</span>
              <input
                className="input"
                value={form.name}
                onChange={onChange("name")}
                required
              />
            </label>

            <label className="field">
              <span>Slug (opcional)</span>
              <input
                className="input"
                value={form.slug}
                onChange={onChange("slug")}
                placeholder="ej: materiales (si lo dejás vacío se genera solo)"
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
                <div
                  className="muted"
                  style={{ marginTop: 8, fontSize: 12, wordBreak: "break-all" }}
                >
                  {form.imageUrl}
                </div>
              </div>
            ) : null}

            <label className="field">
              <span>Descripción</span>
              <textarea
                className="input"
                rows={4}
                value={form.description}
                onChange={onChange("description")}
              />
            </label>

            <button className="btn btn--primary btn--full" type="submit" disabled={uploading}>
              {mode === "edit" ? "Guardar cambios" : "Crear categoría"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
