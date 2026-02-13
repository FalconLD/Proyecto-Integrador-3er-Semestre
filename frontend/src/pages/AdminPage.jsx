import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  Droplets,
  Trophy,
  Info,
  Shield,
  UserCog,
  Key,
  List,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Toaster, toast } from "sonner";
import { PERMISOS, PERMISOS_POR_GRUPO, LISTA_PERMISOS, permisosEfectivosParaEditor } from "../config/permisos";

export default function AdminPage({ defaultVista }) {
  const { pathname } = useLocation();
  const { tienePermiso } = useAuth();
  const [data, setData] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [editandoPermisos, setEditandoPermisos] = useState(null);
  const [vista, setVista] = useState(() => {
    if (defaultVista) return defaultVista;
    if (pathname === "/admin/permisos") return "permisos";
    if (pathname === "/admin/roles") return "roles";
    if (pathname === "/admin/usuarios") return "usuarios";
    return "resumen";
  });
  useEffect(() => {
    if (pathname === "/admin/permisos") setVista("permisos");
    else if (pathname === "/admin/roles") setVista("roles");
    else if (pathname === "/admin/usuarios") setVista("usuarios");
    else if (pathname === "/admin") setVista("resumen");
  }, [pathname]);
  const [roles, setRoles] = useState([]);
  const [permisosCatalogo, setPermisosCatalogo] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [loadingPermisos, setLoadingPermisos] = useState(false);
  const [modalPermiso, setModalPermiso] = useState(null);
  const [modalRol, setModalRol] = useState(null);

  const puedeGestionar =
    tienePermiso(PERMISOS.USUARIOS_LISTAR) ||
    tienePermiso(PERMISOS.USUARIOS_EDITAR_ROL) ||
    tienePermiso(PERMISOS.ADMIN_VER_PANEL) ||
    tienePermiso("gestionar_usuarios") ||
    tienePermiso("ver_panel_admin");
  const puedeEditarRol =
    tienePermiso(PERMISOS.USUARIOS_EDITAR_ROL) ||
    tienePermiso(PERMISOS.ADMIN_VER_PANEL) ||
    tienePermiso("gestionar_usuarios") ||
    tienePermiso("ver_panel_admin");
  const puedeAsignarPermisos =
    tienePermiso(PERMISOS.USUARIOS_ASIGNAR_PERMISOS) ||
    tienePermiso(PERMISOS.ADMIN_VER_PANEL) ||
    tienePermiso("asignar_permisos") ||
    tienePermiso("ver_panel_admin");

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

  useEffect(() => {
    if (!puedeGestionar && vista !== "permisos") return;
    setLoadingRoles(true);
    api.admin
      .getRoles()
      .then((list) => setRoles(list))
      .catch(() => setRoles([]))
      .finally(() => setLoadingRoles(false));
  }, [puedeGestionar, vista]);

  useEffect(() => {
    if (vista !== "permisos" && !puedeAsignarPermisos) return;
    setLoadingPermisos(true);
    api.admin
      .getPermisosCatalogo()
      .then((list) => setPermisosCatalogo(list))
      .catch(() => setPermisosCatalogo([]))
      .finally(() => setLoadingPermisos(false));
  }, [vista, puedeAsignarPermisos]);

  const handleCambiarRol = async (id, payload) => {
    try {
      await api.admin.cambiarRol(id, payload);
      const updated = typeof payload === "object" && payload.roleId != null
        ? { roleId: payload.roleId, role: roles.find((r) => r.id === payload.roleId)?.nombre ?? "user" }
        : { role: payload, roleId: roles.find((r) => r.nombre === payload)?.id ?? null };
      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...updated } : u))
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

      {/* NAVEGACIÓN DEL PANEL: pestañas para Resumen, Permisos y Roles */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <p className="text-sm font-medium text-slate-600 mb-3">
          Elige la sección a gestionar:
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setVista("resumen")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition border-2 ${
              vista === "resumen"
                ? "bg-sky-500 text-white border-sky-500 shadow-md"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
            }`}
          >
            <BarChart3 size={20} /> Resumen
          </button>
          <button
            type="button"
            onClick={() => setVista("permisos")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition border-2 ${
              vista === "permisos"
                ? "bg-sky-500 text-white border-sky-500 shadow-md"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
            }`}
          >
            <Key size={20} /> Permisos (catálogo)
          </button>
          <button
            type="button"
            onClick={() => setVista("roles")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition border-2 ${
              vista === "roles"
                ? "bg-sky-500 text-white border-sky-500 shadow-md"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
            }`}
          >
            <List size={20} /> Roles (crear, editar, eliminar)
          </button>
          {puedeGestionar && (
            <button
              type="button"
              onClick={() => setVista("usuarios")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition border-2 ${
                vista === "usuarios"
                  ? "bg-sky-500 text-white border-sky-500 shadow-md"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
              }`}
            >
              <Users size={20} /> Usuarios
            </button>
          )}
        </div>
      </div>

      {/* VISTA PERMISOS */}
      {vista === "permisos" && (
        <VistaPermisos
          permisos={permisosCatalogo}
          loading={loadingPermisos}
          onReload={() => {
            setLoadingPermisos(true);
            api.admin.getPermisosCatalogo().then(setPermisosCatalogo).catch(() => setPermisosCatalogo([])).finally(() => setLoadingPermisos(false));
          }}
          modal={modalPermiso}
          setModal={setModalPermiso}
          puedeEditar={puedeAsignarPermisos}
        />
      )}

      {/* VISTA ROLES */}
      {vista === "roles" && (
        <VistaRoles
          roles={roles}
          permisosCatalogo={permisosCatalogo}
          loading={loadingRoles}
          onReload={() => {
            setLoadingRoles(true);
            api.admin.getRoles().then(setRoles).catch(() => setRoles([])).finally(() => setLoadingRoles(false));
          }}
          modal={modalRol}
          setModal={setModalRol}
          puedeEditar={puedeGestionar}
        />
      )}

      {/* VISTA USUARIOS — solo gestión de usuarios */}
      {vista === "usuarios" && puedeGestionar && (
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
                    <th className="text-left py-3 px-2 font-semibold text-slate-600">Nombre</th>
                    <th className="text-left py-3 px-2 font-semibold text-slate-600">Email</th>
                    <th className="text-left py-3 px-2 font-semibold text-slate-600">Edad</th>
                    <th className="text-left py-3 px-2 font-semibold text-slate-600">Rol</th>
                    <th className="text-left py-3 px-2 font-semibold text-slate-600">Permisos</th>
                    {(puedeGestionar || puedeAsignarPermisos) && (
                      <th className="text-left py-3 px-2 font-semibold text-slate-600">Acciones</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-2 font-medium text-slate-800">{u.nombre}</td>
                      <td className="py-3 px-2 text-slate-600">{u.email}</td>
                      <td className="py-3 px-2 text-slate-600">{u.edad}</td>
                      <td className="py-3 px-2">
                        {puedeEditarRol && roles.length > 0 ? (
                          <select
                            value={u.roleId ?? (u.role === "admin" || u.role === "Administrador" ? roles.find((r) => r.nombre === "Administrador")?.id : roles.find((r) => r.nombre === "Usuario")?.id) ?? ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val) handleCambiarRol(u.id, { roleId: parseInt(val, 10) });
                            }}
                            className="text-sm border border-slate-200 rounded-lg px-2 py-1 bg-white"
                          >
                            {roles.map((r) => (
                              <option key={r.id} value={r.id}>{r.nombre}</option>
                            ))}
                          </select>
                        ) : puedeEditarRol ? (
                          <span className="text-slate-400 text-xs">Cargando roles…</span>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              u.role === "admin" || u.role === "Administrador" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <Shield size={12} className={u.role === "admin" || u.role === "Administrador" ? "" : "opacity-50"} />
                            {u.role || "user"}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        {editandoPermisos === u.id && puedeAsignarPermisos ? (
                          <PermisosEditor
                            permisos={u.permisos || []}
                            permisosPorGrupo={PERMISOS_POR_GRUPO}
                            onGuardar={(p) => handleGuardarPermisos(u.id, p)}
                            onCancelar={() => setEditandoPermisos(null)}
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-slate-600 text-xs">
                              {(u.permisos || []).length > 0 ? (u.permisos || []).join(", ") : "—"}
                            </span>
                            {puedeAsignarPermisos && (
                              <button
                                type="button"
                                onClick={() => setEditandoPermisos(editandoPermisos === u.id ? null : u.id)}
                                className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                              >
                                Editar
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                      {(puedeGestionar || puedeAsignarPermisos) && <td className="py-3 px-2" />}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}

      {/* VISTA RESUMEN */}
      {vista === "resumen" && (
        <>
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
                        {puedeEditarRol && roles.length > 0 ? (
                          <select
                            value={u.roleId ?? (u.role === "admin" || u.role === "Administrador" ? roles.find((r) => r.nombre === "Administrador")?.id : roles.find((r) => r.nombre === "Usuario")?.id) ?? ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val) handleCambiarRol(u.id, { roleId: parseInt(val, 10) });
                            }}
                            className="text-sm border border-slate-200 rounded-lg px-2 py-1 bg-white"
                          >
                            {roles.map((r) => (
                              <option key={r.id} value={r.id}>{r.nombre}</option>
                            ))}
                          </select>
                        ) : puedeEditarRol ? (
                          <span className="text-slate-400 text-xs">Cargando roles…</span>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              u.role === "admin" || u.role === "Administrador"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <Shield size={12} className={u.role === "admin" || u.role === "Administrador" ? "" : "opacity-50"} />
                            {u.role || "user"}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        {editandoPermisos === u.id && puedeAsignarPermisos ? (
                          <PermisosEditor
                            permisos={u.permisos || []}
                            permisosPorGrupo={PERMISOS_POR_GRUPO}
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
        </>
      )}
    </motion.section>
  );
}

function VistaPermisos({ permisos, loading, onReload, modal, setModal, puedeEditar }) {
  const [form, setForm] = useState({ nombre: "", grupo: "", descripcion: "" });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const isEdit = modal?.id != null;

  const openCreate = () => {
    setForm({ nombre: "", grupo: "", descripcion: "" });
    setModal({ id: null });
  };
  const openEdit = (p) => {
    setForm({ nombre: p.nombre, grupo: p.grupo || "", descripcion: p.descripcion || "" });
    setModal({ id: p.id, nombre: p.nombre });
  };
  const closeModal = () => setModal(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre?.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }
    setSaving(true);
    const payload = { nombre: form.nombre.trim(), grupo: form.grupo?.trim() || null, descripcion: form.descripcion?.trim() || null };
    const promise = isEdit
      ? api.admin.updatePermiso(modal.id, payload)
      : api.admin.createPermiso(payload);
    promise
      .then(() => {
        toast.success(isEdit ? "Permiso actualizado" : "Permiso creado");
        closeModal();
        onReload();
      })
      .catch((err) => toast.error(err.message || "Error al guardar"))
      .finally(() => setSaving(false));
  };

  const handleDelete = (id) => {
    if (!window.confirm("¿Eliminar este permiso? Puede afectar a roles que lo usan.")) return;
    setDeletingId(id);
    api.admin
      .deletePermiso(id)
      .then(() => {
        toast.success("Permiso eliminado");
        onReload();
      })
      .catch((err) => toast.error(err.message || "Error al eliminar"))
      .finally(() => setDeletingId(null));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-800">Catálogo de permisos</h2>
        <div className="flex gap-2">
          <button type="button" onClick={onReload} className="text-sm px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50">
            Actualizar
          </button>
          {puedeEditar && (
            <button type="button" onClick={openCreate} className="flex items-center gap-1 text-sm px-3 py-1.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700">
              <Plus size={16} /> Crear permiso
            </button>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <p className="p-6 text-slate-500">Cargando permisos…</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-600">Nombre</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Grupo</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Descripción</th>
                {puedeEditar && <th className="w-24 py-3 px-2 text-right font-medium text-slate-600">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {(permisos || []).map((p) => (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono text-slate-800">{p.nombre}</td>
                  <td className="py-3 px-4 text-slate-600">{p.grupo || "—"}</td>
                  <td className="py-3 px-4 text-slate-500">{p.descripcion || "—"}</td>
                  {puedeEditar && (
                    <td className="py-3 px-2 text-right">
                      <button type="button" onClick={() => openEdit(p)} className="p-1.5 text-slate-500 hover:text-sky-600 rounded" title="Editar"><Pencil size={14} /></button>
                      <button type="button" onClick={() => handleDelete(p.id)} disabled={deletingId === p.id} className="p-1.5 text-slate-500 hover:text-red-600 rounded disabled:opacity-50" title="Eliminar"><Trash2 size={14} /></button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && (!permisos || permisos.length === 0) && (
          <p className="p-6 text-slate-500">No hay permisos en el catálogo.</p>
        )}
      </div>

      {modal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={closeModal}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">{isEdit ? "Editar permiso" : "Nuevo permiso"}</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Nombre (ej. recurso.accion)</label>
                <input type="text" value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2" placeholder="admin.ver_panel" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Grupo</label>
                <input type="text" value={form.grupo} onChange={(e) => setForm((f) => ({ ...f, grupo: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2" placeholder="admin" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Descripción</label>
                <input type="text" value={form.descripcion} onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2" placeholder="Opcional" />
              </div>
              <div className="flex gap-2 justify-end mt-2">
                <button type="button" onClick={closeModal} className="px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50">Cancelar</button>
                <button type="submit" disabled={saving} className="px-3 py-1.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50">{saving ? "Guardando…" : "Guardar"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function VistaRoles({ roles, permisosCatalogo, loading, onReload, modal, setModal, puedeEditar }) {
  const [form, setForm] = useState({ nombre: "", descripcion: "", permisoIds: [] });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const isEdit = modal?.id != null;
  const rolActual = modal?.id != null ? roles.find((r) => r.id === modal.id) : null;

  const openCreate = () => {
    setForm({ nombre: "", descripcion: "", permisoIds: [] });
    setModal({ id: null });
  };
  const openEdit = (r) => {
    setForm({
      nombre: r.nombre,
      descripcion: r.descripcion || "",
      permisoIds: (r.permisos || []).map((p) => p.id),
    });
    setModal({ id: r.id, nombre: r.nombre });
  };
  const closeModal = () => setModal(null);

  const togglePermiso = (id) => {
    setForm((f) => ({
      ...f,
      permisoIds: f.permisoIds.includes(id) ? f.permisoIds.filter((x) => x !== id) : [...f.permisoIds, id],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre?.trim()) {
      toast.error("El nombre del rol es obligatorio");
      return;
    }
    setSaving(true);
    const payload = { nombre: form.nombre.trim(), descripcion: form.descripcion?.trim() || null, permisoIds: form.permisoIds };
    const promise = isEdit
      ? api.admin.updateRole(modal.id, payload)
      : api.admin.createRole(payload);
    promise
      .then(() => {
        toast.success(isEdit ? "Rol actualizado" : "Rol creado");
        closeModal();
        onReload();
      })
      .catch((err) => toast.error(err.message || "Error al guardar"))
      .finally(() => setSaving(false));
  };

  const handleDelete = (id, nombre, usuariosCount) => {
    if (usuariosCount > 0) {
      toast.error(`${usuariosCount} usuario(s) tienen este rol. Reasigna antes de eliminar.`);
      return;
    }
    if (nombre === "Administrador") {
      toast.error("No se puede eliminar el rol Administrador");
      return;
    }
    if (!window.confirm(`¿Eliminar el rol "${nombre}"?`)) return;
    setDeletingId(id);
    api.admin
      .deleteRole(id)
      .then(() => {
        toast.success("Rol eliminado");
        onReload();
      })
      .catch((err) => toast.error(err.message || "Error al eliminar"))
      .finally(() => setDeletingId(null));
  };

  const permisosPorGrupo = (permisosCatalogo || []).reduce((acc, p) => {
    const g = p.grupo || "Otros";
    if (!acc[g]) acc[g] = [];
    acc[g].push(p);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-800">Roles</h2>
        <div className="flex gap-2">
          <button type="button" onClick={onReload} className="text-sm px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50">Actualizar</button>
          {puedeEditar && (
            <button type="button" onClick={openCreate} className="flex items-center gap-1 text-sm px-3 py-1.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700">
              <Plus size={16} /> Crear rol
            </button>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <p className="p-6 text-slate-500">Cargando roles…</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-600">Nombre</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Descripción</th>
                <th className="text-center py-3 px-4 font-medium text-slate-600">Permisos</th>
                <th className="text-center py-3 px-4 font-medium text-slate-600">Usuarios</th>
                {puedeEditar && <th className="w-24 py-3 px-2 text-right font-medium text-slate-600">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {(roles || []).map((r) => (
                <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-medium text-slate-800">{r.nombre}</td>
                  <td className="py-3 px-4 text-slate-500">{r.descripcion || "—"}</td>
                  <td className="py-3 px-4 text-center text-slate-600">{(r.permisos || []).length}</td>
                  <td className="py-3 px-4 text-center text-slate-600">{r.usuariosCount ?? 0}</td>
                  {puedeEditar && (
                    <td className="py-3 px-2 text-right">
                      <button type="button" onClick={() => openEdit(r)} className="p-1.5 text-slate-500 hover:text-sky-600 rounded" title="Editar"><Pencil size={14} /></button>
                      <button type="button" onClick={() => handleDelete(r.id, r.nombre, r.usuariosCount ?? 0)} disabled={deletingId === r.id || r.nombre === "Administrador"} className="p-1.5 text-slate-500 hover:text-red-600 rounded disabled:opacity-50" title="Eliminar"><Trash2 size={14} /></button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && (!roles || roles.length === 0) && (
          <p className="p-6 text-slate-500">No hay roles.</p>
        )}
      </div>

      {modal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={closeModal}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">{isEdit ? "Editar rol" : "Nuevo rol"}</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Nombre</label>
                <input type="text" value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2" placeholder="Ej. Soporte" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Descripción</label>
                <input type="text" value={form.descripcion} onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2" placeholder="Opcional" />
              </div>
              <div>
                <span className="block text-sm font-medium text-slate-600 mb-2">Permisos del rol</span>
                <div className="border border-slate-200 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                  {Object.entries(permisosPorGrupo).map(([grupo, list]) => (
                    <div key={grupo}>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-1">{grupo}</p>
                      <div className="flex flex-wrap gap-2">
                        {list.map((p) => (
                          <label key={p.id} className="flex items-center gap-1.5 text-sm cursor-pointer">
                            <input type="checkbox" checked={form.permisoIds.includes(p.id)} onChange={() => togglePermiso(p.id)} />
                            <span className="font-mono text-slate-700">{p.nombre}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  {permisosCatalogo?.length === 0 && <p className="text-slate-500 text-sm">No hay permisos en el catálogo. Crea algunos en la pestaña Permisos.</p>}
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-2">
                <button type="button" onClick={closeModal} className="px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50">Cancelar</button>
                <button type="submit" disabled={saving} className="px-3 py-1.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50">{saving ? "Guardando…" : "Guardar"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function PermisosEditor({ permisos, permisosPorGrupo, onGuardar, onCancelar }) {
  const [seleccionados, setSeleccionados] = useState(
    () => permisosEfectivosParaEditor(permisos || [])
  );

  const toggle = (p) => {
    setSeleccionados((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });
  };

  const lista = permisosPorGrupo?.length > 0
    ? permisosPorGrupo.flatMap(({ permisos: ps }) => ps)
    : LISTA_PERMISOS;

  return (
    <div className="flex flex-col gap-2">
      {permisosPorGrupo?.length > 0 ? (
        permisosPorGrupo.map(({ grupo, permisos: ps }) => (
          <div key={grupo} className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-slate-500 uppercase w-24">{grupo}</span>
            {ps.map((p) => (
              <label key={p} className="flex items-center gap-1 text-xs cursor-pointer">
                <input type="checkbox" checked={seleccionados.has(p)} onChange={() => toggle(p)} />
                <span>{p}</span>
              </label>
            ))}
          </div>
        ))
      ) : (
        lista.map((p) => (
          <label key={p} className="flex items-center gap-1 text-xs cursor-pointer">
            <input type="checkbox" checked={seleccionados.has(p)} onChange={() => toggle(p)} />
            <span>{p}</span>
          </label>
        ))
      )}
      <div className="flex gap-2 mt-1">
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
