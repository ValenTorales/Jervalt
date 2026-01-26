import { Navigate } from "react-router-dom";
import { isAuthed } from "./auth";

export default function ProtectedRoute({ children }) {
  if (!isAuthed()) return <Navigate to="/admin/login" replace />;
  return children;
}
