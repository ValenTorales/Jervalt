import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import { setToken } from "./auth";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await api.post("/auth/login", {
        email: email.trim(),
        password: pass,
      });

      setToken(data.token);
      nav("/admin/productos");
    } catch (err) {
      const msg = err?.response?.data?.message || "No se pudo iniciar sesión";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth">
      <div className="admin-auth__card card">
        <h2 className="admin-auth__title">Panel de Administración</h2>
        <p className="admin-auth__desc">Ingresá para gestionar productos y categorías</p>

        <form onSubmit={submit} className="admin-auth__form">
          <label className="field">
            <span>Email</span>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>

          <label className="field">
            <span>Contraseña</span>
            <input
              className="input"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </label>

          <button className="btn btn--primary btn--full" type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
