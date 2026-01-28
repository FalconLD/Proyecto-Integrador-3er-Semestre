import { useState } from 'react';

export function useFormValidation(initialState, validateFn) {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Cambios en inputs
  const handleChange = (field, value) => {
    const newValues = { ...values, [field]: value };
    setValues(newValues);
    setErrors(validateFn(newValues));
  };

  // Marcar campo como tocado
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Envío del formulario
  const handleSubmit = (onSuccess) => (e) => {
    e.preventDefault();

    const validationErrors = validateFn(values);
    setErrors(validationErrors);

    // Marcar todos los campos como tocados
    const allTouched = Object.keys(values).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    if (Object.keys(validationErrors).length === 0) {
      onSuccess(values);
    }
  };

  const isValid =
    Object.keys(errors).length === 0 &&
    Object.keys(touched).length === Object.keys(values).length;

  return {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
  };
}
