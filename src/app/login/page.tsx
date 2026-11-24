"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Waves, Loader2, Info, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { isSupabaseConfigured, crearClienteSupabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [verContrasena, setVerContrasena] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avisoRecuperacion, setAvisoRecuperacion] = useState<string | null>(null);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!correo.includes("@")) {
      setError("Escribe un correo electrónico válido.");
      return;
    }
    if (contrasena.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setCargando(true);
    try {
      const supabase = crearClienteSupabase();
      const { error: errorAuth } = await supabase.auth.signInWithPassword({
        email: correo,
        password: contrasena,
      });
      if (errorAuth) {
        setError(
          errorAuth.message === "Invalid login credentials"
            ? "Correo o contraseña incorrectos."
            : errorAuth.message
        );
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo conectar con el servidor de autenticación.");
    } finally {
      setCargando(false);
    }
  };

  const recuperarContrasena = async () => {
    setError(null);
    setAvisoRecuperacion(null);
    if (!correo.includes("@")) {
      setError("Escribe tu correo arriba para poder enviarte el enlace de recuperación.");
      return;
    }
    try {
      const supabase = crearClienteSupabase();
      const { error: errorReset } = await supabase.auth.resetPasswordForEmail(correo);
      if (errorReset) {
        setError(errorReset.message);
        return;
      }
      setAvisoRecuperacion("Si el correo existe, se envió un enlace de recuperación.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar la recuperación.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg text-ink">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_15%_0%,rgba(56,189,248,0.16),transparent),radial-gradient(ellipse_60%_50%_at_100%_100%,rgba(94,234,212,0.12),transparent)]" />

      <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Columna izquierda: formulario */}
      <div className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16">
        <div className="glass mx-auto w-full max-w-sm rounded-3xl p-8">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent2">
                <Waves className="h-5 w-5 text-zinc-950" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight text-ink">Atoyac</p>
                <p className="text-[11px] leading-tight text-muted">Centro de monitoreo ambiental</p>
              </div>
            </div>
            <ThemeToggle />
          </div>

          <h1 className="text-xl font-semibold text-ink">Inicio de sesión institucional</h1>
          <p className="mt-1 text-sm text-muted">HackaTec Nacional 2026 · Gestión pública ambiental</p>

          {!isSupabaseConfigured && (
            <div className="mt-5 flex gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-200">
              <Info className="h-4 w-4 shrink-0" />
              <span>
                La autenticación real todavía no está configurada en este
                despliegue (faltan las credenciales de Supabase). El
                formulario de abajo existe y es funcional, pero no podrá
                completar el inicio de sesión hasta que se configure. Usa el
                acceso de demostración mientras tanto.
              </span>
            </div>
          )}

          <form onSubmit={enviar} className="mt-6 space-y-4">
            <div>
              <label htmlFor="correo" className="mb-1 block text-sm font-medium text-ink">Correo electrónico</label>
              <input
                id="correo"
                type="email"
                autoComplete="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full rounded-xl border border-line bg-card px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="nombre@dependencia.gob.mx"
              />
            </div>

            <div>
              <label htmlFor="contrasena" className="mb-1 block text-sm font-medium text-ink">Contraseña</label>
              <div className="relative">
                <input
                  id="contrasena"
                  type={verContrasena ? "text" : "password"}
                  autoComplete="current-password"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  className="w-full rounded-xl border border-line bg-card px-3 py-2 pr-9 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setVerContrasena((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                  aria-label={verContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {verContrasena ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-700 dark:text-red-300">
                {error}
              </p>
            )}
            {avisoRecuperacion && (
              <p className="rounded-md bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-300">
                {avisoRecuperacion}
              </p>
            )}

            <div className="flex items-center justify-between text-sm">
              <button type="button" onClick={recuperarContrasena} className="text-accent hover:underline">
                Recuperar contraseña
              </button>
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {cargando && <Loader2 className="h-4 w-4 animate-spin" />}
              Iniciar sesión
            </button>
          </form>

          <div className="mt-6 border-t border-line pt-6">
            <Link
              href="/dashboard"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-accent/5"
            >
              Ver demostración (acceso para jueces)
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-2 text-center text-[11px] text-muted">
              Entorno aislado, sin permisos sobre información operativa real.
            </p>
          </div>
        </div>
      </div>

      {/* Columna derecha: identidad visual de la cuenca */}
      <div className="relative hidden items-center justify-center overflow-hidden lg:flex">
        <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full opacity-80">
          <path
            d="M210 0 C 180 60, 230 110, 190 170 S 150 260, 180 320 L 170 400 L 400 400 L 400 0 Z"
            fill="var(--accent)"
            opacity="0.12"
          />
          <path
            d="M230 0 C 200 70, 245 120, 205 180 S 175 270, 200 400"
            stroke="var(--accent)"
            strokeWidth="3"
            fill="none"
            opacity="0.45"
          />
          <circle cx="205" cy="180" r="4" fill="var(--accent2)" />
          <circle cx="190" cy="260" r="4" fill="var(--accent2)" />
          <circle cx="198" cy="320" r="4" fill="var(--accent)" />
        </svg>
        <div className="glass relative z-10 max-w-sm rounded-3xl px-10 py-8 text-center">
          <h2 className="text-2xl font-semibold text-ink">Cuenca del Alto Atoyac</h2>
          <p className="mt-3 text-sm text-muted">
            10 humedales documentados por INEGI, monitoreo propio en desarrollo
            para HackaTec Nacional 2026.
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
