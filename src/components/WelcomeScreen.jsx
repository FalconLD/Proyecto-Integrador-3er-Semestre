import { motion, AnimatePresence } from 'framer-motion';
import {
  Droplet,
  ArrowRight,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useFormValidation } from '../utils/useFormValidation';
import '../index.css'; // Asegúrate de incluir los estilos para quitar spinners

export default function WelcomeScreen({ onComplete }) {
  
  const validate = (data) => {
    const errors = {};
  
    const soloLetrasMinusculas = /^[a-z]+$/;
    const soloNumeros = /^[0-9]+$/; 
    const emailPuce = /^[a-z]+@puce\.edu\.ec$/; 
  
    // --- Validación de Nombre ---
    if (!data.nombre || data.nombre.trim() === '') {
      errors.nombre = 'El nombre es obligatorio';
    } else if (data.nombre.trim().length < 3) {
      errors.nombre = 'Ingrese su nombre completo';
    } else if (!soloLetrasMinusculas.test(data.nombre)) {
      errors.nombre = 'Solo se permiten letras en minúsculas';
    }
  
    // --- Validación de Edad ---
    const edadTexto = String(data.edad || '').trim();
  
    if (!data.edad) {
      errors.edad = 'La edad es obligatoria';
    } else if (!soloNumeros.test(edadTexto)) {
      errors.edad = 'Solo se permiten números';
    } else if (parseInt(data.edad) < 16) {
      errors.edad = 'La edad mínima es de 16 años';
    } else if (edadTexto.length < 2) {
      errors.edad = 'Tu edad debe tener al menos dos dígitos';
    } 
  
    // --- Validación de Correo ---
    if (!data.email || data.email.trim() === '') {
      errors.email = 'El correo es obligatorio';
    } else if (!data.email.endsWith('@puce.edu.ec')) {
      errors.email = 'Debe usar correo institucional @puce.edu.ec';
    } else if (data.email.trim().length < 20) {
      errors.email = 'Tu correo es demasiado corto para ser autenticado';
    } else if (!emailPuce.test(data.email)) {
      errors.email = 'Solo se aceptan correos con letras en minúsculas';
    } 
  
    return errors;
  };

  const {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormValidation(
    { nombre: '', edad: '', email: '' },
    validate
  );

  const shake = {
    x: [0, -8, 8, -6, 6, -3, 3, 0],
    transition: { duration: 0.4 }
  };

  const pop = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 },
    transition: { type: 'spring', stiffness: 400, damping: 20 }
  }; 

  const inputState = (field) => {
    if (!touched[field]) return 'border-slate-200';
    return errors[field]
      ? 'border-red-400 focus:ring-red-100'
      : 'border-slate-300 focus:ring-slate-200';
  };

  const shouldShake = (field) => touched[field] && errors[field];

  const handleEmailBlur = () => {
    handleBlur('email');
  
    if (
      values.email &&
      !values.email.includes('@')
    ) {
      handleChange('email', `${values.email}@puce.edu.ec`);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white/80 backdrop-blur-xl p-10 rounded-[2rem] shadow-xl border border-white/50"
      >

        {/* Icono */}
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 
              rounded-3xl flex items-center justify-center text-white shadow-lg"
          >
            <Droplet size={32} fill="currentColor" />
          </motion.div>
        </div>

        {/* Título */}
        <h1 className="text-4xl font-extrabold text-center 
          bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-8">
          WaterMark
        </h1>

        <form onSubmit={handleSubmit(onComplete)} className="space-y-5">

          {/* Nombre completo */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Nombre de usuario
            </label>
            <motion.div animate={shouldShake('nombre') ? shake : {}} className="relative">
              <input
                placeholder="ejemplo: juanperez"
                value={values.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                onBlur={() => handleBlur('nombre')}
                className={`w-full p-4 rounded-xl bg-white border text-slate-700 placeholder:text-slate-400
                  focus:ring-2 outline-none transition ${inputState('nombre')}`}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <AnimatePresence>
                  {touched.nombre && values.nombre.trim().length > 0 && errors.nombre && (
                    <motion.div {...pop}>
                      <XCircle className="text-red-500" size={20} />
                    </motion.div>
                  )}
                  {touched.nombre && values.nombre.trim().length >= 3 && !errors.nombre && (
                    <motion.div {...pop}>
                      <CheckCircle className="text-green-500" size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
            {touched.nombre && values.nombre.trim().length > 0 && errors.nombre && (
              <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>
            )}
          </div>

          {/* Edad y correo */}
          <div className="grid grid-cols-3 gap-4">

            {/* Edad */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Edad
              </label>
              <motion.div animate={shouldShake('edad') ? shake : {}} className="relative">
                <input
                  type="number"
                  placeholder="21"
                  value={values.edad}
                  onChange={(e) => handleChange('edad', e.target.value)}
                  onBlur={() => handleBlur('edad')}
                  className={`w-full p-4 rounded-xl bg-white border text-slate-700 placeholder:text-slate-400
                    focus:ring-2 outline-none transition ${inputState('edad')} no-spinners`}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <AnimatePresence>
                    {touched.edad && values.edad && errors.edad && (
                      <motion.div {...pop}>
                        <XCircle className="text-red-500" size={20} />
                      </motion.div>
                    )}
                    {touched.edad && values.edad && !errors.edad && (
                      <motion.div {...pop}>
                        <CheckCircle className="text-green-500" size={20} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
              {touched.edad && values.edad && errors.edad && (
                <p className="text-xs text-red-500 mt-1">{errors.edad}</p>
              )}
            </div>

            {/* Correo */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Correo institucional
              </label>
              <motion.div animate={shouldShake('email') ? shake : {}} className="relative">
              <input
                type="email"
                placeholder="usuario"
                value={values.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={handleEmailBlur}
                className={`w-full p-4 rounded-xl bg-white border text-slate-700 placeholder:text-slate-400
                  focus:ring-2 outline-none transition ${inputState('email')}`}
              />

                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <AnimatePresence>
                    {touched.email && values.email && errors.email && (
                      <motion.div {...pop}>
                        <XCircle className="text-red-500" size={20} />
                      </motion.div>
                    )}
                    {touched.email && values.email && !errors.email && (
                      <motion.div {...pop}>
                        <CheckCircle className="text-green-500" size={20} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
              {touched.email && values.email && errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-4 rounded-2xl font-semibold text-white shadow-md
              transition-all ${isValid
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02]'
                : 'bg-slate-300 cursor-not-allowed'
              }`}
          >
            Entrar al Sistema <ArrowRight className="inline ml-2" size={18} />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
