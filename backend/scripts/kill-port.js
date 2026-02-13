/**
 * Libera el puerto del backend (3001 por defecto) antes de arrancar.
 * Mata cualquier proceso que lo esté usando para que el servidor pueda escuchar ahí.
 */
const { execSync } = require('child_process');

const PORT = Number(process.env.PORT) || 3001;

function killPort(port) {
  try {
    if (process.platform === 'win32') {
      const cmd = `Get-NetTCPConnection -LocalPort ${port} -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }`;
      execSync('powershell', ['-NoProfile', '-Command', cmd], { stdio: 'ignore', windowsHide: true });
    } else {
      execSync(`lsof -ti:${port} | xargs kill -9 2>/dev/null || true`, { stdio: 'ignore' });
    }
  } catch (_) {
    // Ignorar errores (p. ej. ningún proceso en el puerto)
  }
}

killPort(PORT);
