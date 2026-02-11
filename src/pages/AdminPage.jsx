import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  Droplets,
  Trophy,
  Info,
  Shield,
  UserCog,
} from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Toaster, toast } from "sonner";

const PERMISOS_DISPONIBLES = [
  "ver_panel_admin",
  "ver_estadisticas_avanzadas",
  "gestionar_usuarios",
  "asignar_permisos",
];

export default function AdminPage() {
  const { tienePermiso } = useAuth();
  const [data, setData] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [editandoPermisos, setEditandoPermisos] = useState(null);

  const puedeGestionar = tienePermiso("gestionar_usuarios") || tienePermiso("ver_panel_admin");
  const puedeAsignarPermisos =
    tienePermiso("asignar_permisos") || tienePermiso("ver_panel_admin");

  useEffect(() => {
    setLoading(true);
    api.admin
      .getSummary()
      .then((d) => {
        setData(d);
        setError(null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!puedeGestionar) return;
    setLoadingUsuarios(true);
    api.admin
      .getUsuarios()
      .then((list) => setUsuarios(list))
      .catch(() => setUsuarios([]))
      .finally(() => setLoadingUsuarios(false));
  }, [puedeGestionar]);

  const handleCambiarRol = async (id, nuevoRol) => {
    try {
      await api.admin.cambiarRol(id, nuevoRol);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: nuevoRol } : u))
      );
      toast.success("Rol actualizado");
    } catch (e) {
      toast.error("Error al cambiar rol", { description: e.message });
    }
  };

  const handleGuardarPermisos = async (id, permisos) => {
    try {
      await api.admin.asignarPermisos(id, permisos);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, permisos } : u))
      );
      setEditandoPermisos(null);
      toast.success("Permisos actualizados");
    } catch (e) {
      toast.error("Error al guardar permisos", { description: e.message });
    }
  };

  if (loading) {
    return (
      <p className="text-center text-slate-500 py-10">
        Cargando panel administrativo…
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 py-10">
        Error al cargar resumen: {error}
      </p>
    );
  }

  if (!data) return null;

  const {
    totalUsuarios,
    totalRegistros,
    promedioGlobal,
    topUsuarios,
    indicadores,
  } = data;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <Toaster position="top-center" richColors closeButton />

      {/* HEADER */}
      <div className="bg-gradient-to-r from-sky-500 to-indigo-600 p-8 md:p-10 rounded-3xl shadow-xl text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
            <BarChart3 size={26} />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold">
              Panel Administrador H2O
            </h2>
            <p className="text-sm md:text-base text-sky-100">
              Logros globales, gestión de usuarios y permisos
            </p>
          </div>
        </div>
        <div className="text-right text-xs md:text-sm text-sky-100">
          <p className="font-semibold uppercase tracking-[0.2em]">
            Proyecto Integrador PUCE
          </p>
          <p>Azure SQL • MongoDB • React</p>
        </div>
      </div>

      {/* MÉTRICAS PRINCIPALES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Usuarios registrados
            </p>
            <p className="text-2xl font-extrabold text-slate-900">
              {totalUsuarios}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Droplets size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Registros diarios
            </p>
            <p className="text-2xl font-extrabold text-slate-900">
              {totalRegistros}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <Trophy size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Promedio global
            </p>
            <p className="text-2xl font-extrabold text-slate-900">
              {promedioGlobal} L/día
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Objetivo OMS: {indicadores?.objetivoOMS || 150} L/día
            </p>
          </div>
        </motion.div>
      </div>

      {/* GESTIÓN DE USUARIOS */}
      {puedeGestionar && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-md border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <UserCog className="text-sky-500" size={22} />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              Gestión de usuarios
            </h3>
          </div>

          {loadingUsuarios ? (
            <p className="text-slate-500 py-4">Cargando usuarios…</p>
          ) : usuarios.length === 0 ? (
            <p className="text-slate-500 py-4">No hay usuarios.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-2 font-semibold text-slate-600">
                      Nombre
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-slate-600">
                      Email
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-slate-600">
                      Edad
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-slate-600">
                      Rol
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-slate-600">
                      Permisos
                    </th>
                    {(puedeGestionar || puedeAsignarPermisos) && (
                      <th className="text-left py-3 px-2 font-semibold text-slate-600">
                        Acciones
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="py-3 px-2 font-medium text-slate-800">
                        {u.nombre}
                      </td>
                      <td className="py-3 px-2 text-slate-600">{u.email}</td>
                      <td className="py-3 px-2 text-slate-600">{u.edad}</td>
                      <td className="py-3 px-2">
                        {puedeGestionar ? (
                          <select
                            value={u.role || "user"}
                            onChange={(e) =>
                              handleCambiarRol(u.id, e.target.value)
                            }
                            className="text-sm border border-slate-200 rounded-lg px-2 py-1 bg-white"
                          >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              u.role === "admin"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <Shield
                              size={12}
                              className={u.role === "admin" ? "" : "opacity-50"}
                            />
                            {u.role || "user"}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        {editandoPermisos === u.id && puedeAsignarPermisos ? (
                          <PermisosEditor
                            permisos={u.permisos || []}
                            onGuardar={(p) => handleGuardarPermisos(u.id, p)}
                            onCancelar={() => setEditandoPermisos(null)}
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-slate-600 text-xs">
                              {(u.permisos || []).length > 0
                                ? (u.permisos || []).join(", ")
                                : "—"}
                            </span>
                            {puedeAsignarPermisos && (
                              <button
                                type="button"
                                onClick={() =>
                                  setEditandoPermisos(
                                    editandoPermisos === u.id ? null : u.id
                                  )
                                }
                                className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                              >
                                Editar
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                      {(puedeGestionar || puedeAsignarPermisos) && (
                        <td className="py-3 px-2" />
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}

      {/* LOGROS GLOBALES / INDICADORES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 space-y-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <Info className="text-sky-500" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              Indicadores de sostenibilidad
            </h3>
          </div>

          <p className="text-sm text-slate-600">
            <span className="font-semibold">
              {indicadores?.bajoObjetivoOMS || 0} estudiantes
            </span>{" "}
            se mantienen por debajo del objetivo de{" "}
            <span className="font-semibold">
              {indicadores?.objetivoOMS || 150} L/día
            </span>{" "}
            recomendado por la OMS.
          </p>

          <p className="text-xs text-slate-500 mt-2">
            Este indicador puede usarse en la matriz de sostenibilidad y en las
            justificaciones de impacto del proyecto (Azure SQL como fuente de
            verdad).
          </p>
        </motion.div>

        {/* TOP USUARIOS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-md border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="text-amber-500" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              Top 5 usuarios más eficientes
            </h3>
          </div>

          {topUsuarios && topUsuarios.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {topUsuarios.map((u, idx) => (
                <li
                  key={u.usuarioId}
                  className="flex items-center justify-between bg-slate-50 rounded-2xl px-4 py-2 border border-slate-100"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      #{idx + 1} {u.nombre}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {u.registros} registros • promedio {u.avgConsumption} L/día
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 text-sm">
              Aún no hay suficientes datos para calcular el ranking global.
            </p>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}

function PermisosEditor({ permisos, onGuardar, onCancelar }) {
  const [seleccionados, setSeleccionados] = useState(
    () => new Set(permisos || [])
  );

  const toggle = (p) => {
    setSeleccionados((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {PERMISOS_DISPONIBLES.map((p) => (
        <label
          key={p}
          className="flex items-center gap-1 text-xs cursor-pointer"
        >
          <input
            type="checkbox"
            checked={seleccionados.has(p)}
            onChange={() => toggle(p)}
          />
          <span>{p}</span>
        </label>
      ))}
      <div className="flex gap-2 ml-2">
        <button
          type="button"
          onClick={() => onGuardar(Array.from(seleccionados))}
          className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="text-xs px-2 py-1 border border-slate-300 rounded hover:bg-slate-50"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
