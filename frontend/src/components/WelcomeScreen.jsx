import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Droplet,
  ArrowRight,
  UserPlus,
  LogIn,
} from 'lucide-react';
import { useFormValidation } from '../utils/useFormValidation';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Toaster, toast } from 'sonner';
import '../index.css';

const MODE_LOGIN = 'login';
const MODE_REGISTER = 'register';

const validateRegisterPersonal = (data) => {
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.nombre || data.nombre.trim().length < 2) {
    errors.nombre = 'Nombre requerido (mínimo 2 caracteres)';
  }
  const edad = parseInt(data.edad, 10);
  if (!data.edad || isNaN(edad) || edad < 16 || edad > 120) {
    errors.edad = 'Edad entre 16 y 120';
  }
  if (!data.email || !emailRegex.test(data.email)) {
    errors.email = 'Correo electrónico válido requerido';
  }
  return errors;
};

const validateLogin = (data) => {
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.email = 'Correo electrónico válido requerido';
  }
  if (!data.password || data.password.length < 6) {
    errors.password = 'Contraseña mínima 6 caracteres';
  }
  return errors;
};

const validateRegister = (data) => {
  const errors = { ...validateRegisterPersonal(data) };
  if (!data.password || data.password.length < 6) {
    errors.password = 'Contraseña mínima 6 caracteres';
  }
  if (data.password && data.passwordConfirm && data.password !== data.passwordConfirm) {
    errors.passwordConfirm = 'Las contraseñas no coinciden';
  }
  return errors;
};

export default function WelcomeScreen() {
  const { login, setLoading } = useAuth();
  const [mode, setMode] = useState(MODE_LOGIN);
  const [loading, setLoadingState] = useState(false);

  const doLoading = (v) => {
    setLoadingState(v);
    setLoading?.(v);
  };

  const loginForm = useFormValidation(
    { email: '', password: '' },
    validateLogin
  );
  const registerForm = useFormValidation(
    { nombre: '', edad: '', email: '', password: '', passwordConfirm: '' },
    validateRegister
  );

  const inputState = (form, field) => {
    if (!form.touched[field]) return 'border-slate-200';
    return form.errors[field]
      ? 'border-red-400 focus:ring-red-100'
      : 'border-slate-300 focus:ring-slate-200';
  };

  const handleLoginSubmit = async (values) => {
    doLoading(true);
    try {
      const res = await api.auth.login(values.email.trim(), values.password);
      login(res.user, res.token);
    } catch (err) {
      toast.error('Error al iniciar sesión', { description: err.message });
    } finally {
      doLoading(false);
    }
  };

  const handleRegisterSubmit = async (values) => {
    doLoading(true);
    try {
      const res = await api.auth.register({
        nombre: values.nombre.trim(),
        email: values.email.trim(),
        edad: parseInt(values.edad, 10),
        password: values.password,
      });
      login(res.user, res.token);
      toast.success('Cuenta creada correctamente');
    } catch (err) {
      toast.error('Error al registrarse', { description: err.message });
    } finally {
      doLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
      <Toaster position="top-center" richColors closeButton />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white/80 backdrop-blur-xl p-10 rounded-[2rem] shadow-xl border border-white/50"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-lg"
          >
            <Droplet size={32} fill="currentColor" />
          </motion.div>
        </div>
        <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
          WaterMark
        </h1>

        {/* Tabs: Entrar | Registrarse */}
        <div className="flex gap-2 mb-6 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setMode(MODE_LOGIN)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${
              mode === MODE_LOGIN ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <LogIn size={16} /> Entrar
          </button>
          <button
            type="button"
            onClick={() => setMode(MODE_REGISTER)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${
              mode === MODE_REGISTER ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <UserPlus size={16} /> Registrarse
          </button>
        </div>

        <AnimatePresence mode="wait">
          {mode === MODE_LOGIN && (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={loginForm.handleSubmit(handleLoginSubmit)}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Correo</label>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={loginForm.values.email}
                  onChange={(e) => loginForm.handleChange('email', e.target.value)}
                  onBlur={() => loginForm.handleBlur('email')}
                  className={`w-full p-4 rounded-xl bg-white border text-slate-700 placeholder:text-slate-400 focus:ring-2 outline-none transition ${inputState(loginForm, 'email')}`}
                />
                {loginForm.touched.email && loginForm.errors.email && (
                  <p className="text-xs text-red-500 mt-1">{loginForm.errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Contraseña</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginForm.values.password}
                  onChange={(e) => loginForm.handleChange('password', e.target.value)}
                  onBlur={() => loginForm.handleBlur('password')}
                  className={`w-full p-4 rounded-xl bg-white border text-slate-700 placeholder:text-slate-400 focus:ring-2 outline-none transition ${inputState(loginForm, 'password')}`}
                />
                {loginForm.touched.password && loginForm.errors.password && (
                  <p className="text-xs text-red-500 mt-1">{loginForm.errors.password}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={!loginForm.isValid || loading}
                className={`w-full py-4 rounded-2xl font-semibold text-white shadow-md transition-all ${
                  loginForm.isValid && !loading
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02]'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                {loading ? 'Entrando…' : 'Iniciar sesión'} <ArrowRight className="inline ml-2" size={18} />
              </button>
            </motion.form>
          )}

          {mode === MODE_REGISTER && (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={registerForm.handleSubmit(handleRegisterSubmit)}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Nombre</label>
                <input
                  placeholder="Ej. María"
                  value={registerForm.values.nombre}
                  onChange={(e) => registerForm.handleChange('nombre', e.target.value)}
                  onBlur={() => registerForm.handleBlur('nombre')}
                  className={`w-full p-4 rounded-xl bg-white border text-slate-700 placeholder:text-slate-400 focus:ring-2 outline-none transition ${inputState(registerForm, 'nombre')}`}
                />
                {registerForm.touched.nombre && registerForm.errors.nombre && (
                  <p className="text-xs text-red-500 mt-1">{registerForm.errors.nombre}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Edad</label>
                  <input
                    type="number"
                    placeholder="21"
                    value={registerForm.values.edad}
                    onChange={(e) => registerForm.handleChange('edad', e.target.value)}
                    onBlur={() => registerForm.handleBlur('edad')}
                    className={`w-full p-4 rounded-xl bg-white border text-slate-700 placeholder:text-slate-400 focus:ring-2 outline-none transition no-spinners ${inputState(registerForm, 'edad')}`}
                  />
                  {registerForm.touched.edad && registerForm.errors.edad && (
                    <p className="text-xs text-red-500 mt-1">{registerForm.errors.edad}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Correo</label>
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={registerForm.values.email}
                    onChange={(e) => registerForm.handleChange('email', e.target.value)}
                    onBlur={() => registerForm.handleBlur('email')}
                    className={`w-full p-4 rounded-xl bg-white border text-slate-700 placeholder:text-slate-400 focus:ring-2 outline-none transition ${inputState(registerForm, 'email')}`}
                  />
                  {registerForm.touched.email && registerForm.errors.email && (
                    <p className="text-xs text-red-500 mt-1">{registerForm.errors.email}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Contraseña</label>
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={registerForm.values.password}
                  onChange={(e) => registerForm.handleChange('password', e.target.value)}
                  onBlur={() => registerForm.handleBlur('password')}
                  className={`w-full p-4 rounded-xl bg-white border text-slate-700 placeholder:text-slate-400 focus:ring-2 outline-none transition ${inputState(registerForm, 'password')}`}
                />
                {registerForm.touched.password && registerForm.errors.password && (
                  <p className="text-xs text-red-500 mt-1">{registerForm.errors.password}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Confirmar contraseña</label>
                <input
                  type="password"
                  placeholder="Repite la contraseña"
                  value={registerForm.values.passwordConfirm}
                  onChange={(e) => registerForm.handleChange('passwordConfirm', e.target.value)}
                  onBlur={() => registerForm.handleBlur('passwordConfirm')}
                  className={`w-full p-4 rounded-xl bg-white border text-slate-700 placeholder:text-slate-400 focus:ring-2 outline-none transition ${inputState(registerForm, 'passwordConfirm')}`}
                />
                {registerForm.touched.passwordConfirm && registerForm.errors.passwordConfirm && (
                  <p className="text-xs text-red-500 mt-1">{registerForm.errors.passwordConfirm}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={!registerForm.isValid || loading}
                className={`w-full py-4 rounded-2xl font-semibold text-white shadow-md transition-all ${
                  registerForm.isValid && !loading
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02]'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                {loading ? 'Creando cuenta…' : 'Registrarse'} <ArrowRight className="inline ml-2" size={18} />
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
