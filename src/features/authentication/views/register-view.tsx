import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleIcon, MicrosoftIcon } from "../components/eccobank-logo";
import { supabase } from "@/shared/lib/supabase";
import { useOAuth } from "@/shared/hooks/use-oauth";

const RegisterView = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const router = useNavigate();

  const { loading: oAuthLoading, signInWithOAuth } = useOAuth({
    onError: setError,
    onSuccess: () => {
      // OAuth success will be handled by redirect
    },
  });

  const isLoading = loading || oAuthLoading;

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!((name && email ) && password)) {
      setError("Por favor completa todos los campos");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess("Cuenta creada exitosamente. Revisa tu correo para confirmar tu cuenta.");
        setTimeout(() => {
          router("/auth/login");
        }, 3000);
      }
    } catch (err) {
      setError("Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    await signInWithOAuth("google");
  };

  const handleMicrosoftRegister = async () => {
    await signInWithOAuth("azure");
  };

  return (
    <>
      <form onSubmit={handleEmailRegister}>
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="sr-only">
              Nombre completo
            </label>
            <input
              type="text"
              id="name"
              placeholder="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className="w-full border-gray-200 border-b py-2 text-lg placeholder-gray-400 transition-colors focus:border-gray-900 focus:outline-none disabled:opacity-50"
            />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full border-gray-200 border-b py-2 text-lg placeholder-gray-400 transition-colors focus:border-gray-900 focus:outline-none disabled:opacity-50"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full border-gray-200 border-b py-2 text-lg placeholder-gray-400 transition-colors focus:border-gray-900 focus:outline-none disabled:opacity-50"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-8 w-full cursor-pointer rounded-lg bg-black px-4 py-3 font-semibold text-white shadow-sm transition-all duration-300 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-gray-200 border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">O regístrate con</span>
        </div>
      </div>

      <div className="space-y-4">
        <button
          type="button"
          onClick={handleGoogleRegister}
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 px-4 py-2.5 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <GoogleIcon />
          <span className="font-medium text-gray-600">Continuar con Google</span>
        </button>
        <button
          type="button"
          onClick={handleMicrosoftRegister}
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 px-4 py-2.5 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <MicrosoftIcon />
          <span className="font-medium text-gray-600">Continuar con Microsoft</span>
        </button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-500 text-sm">
          ¿Ya tienes una cuenta?{" "}
          <button
            type="button"
            onClick={() => router("/auth/login")}
            className="font-semibold text-gray-900 hover:underline"
          >
            Inicia sesión
          </button>
        </p>
      </div>
    </>
  );
};

export default RegisterView;
