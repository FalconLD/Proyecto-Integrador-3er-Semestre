import { Component } from 'react';

/**
 * Captura errores de renderizado tras el login y muestra un mensaje
 * en lugar de dejar la pantalla en blanco (sobre todo en navegadores externos).
 */
export class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleLogout = () => {
    this.setState({ hasError: false, error: null });
    const { onLogout } = this.props;
    if (typeof onLogout === 'function') {
      onLogout();
    } else {
      localStorage.removeItem('h2o_token');
      localStorage.removeItem('h2o_user');
      window.location.href = '/';
    }
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const message = this.state.error?.message || String(this.state.error);
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Algo salió mal</h2>
            <p className="text-sm text-slate-600 mb-4">
              Si acabas de iniciar sesión, este error puede aparecer solo en algunos navegadores.
            </p>
            <pre className="text-xs bg-slate-100 p-3 rounded-lg overflow-auto max-h-32 text-red-700 mb-6">
              {message}
            </pre>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={this.handleRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Reintentar
              </button>
              <button
                type="button"
                onClick={this.handleLogout}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
