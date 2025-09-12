import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AuthErrorViewProps {
  onReturnToLogin?: () => void;
}

const AuthErrorView = ({ onReturnToLogin }: AuthErrorViewProps) => {
  const navigate = useNavigate();

  const handleReturnToLogin = () => {
    if (onReturnToLogin) {
      onReturnToLogin();
    } else {
      navigate("/auth/login", { replace: true });
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <div className="mb-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-destructive/20 bg-destructive/10">
            <svg
              className="h-8 w-8 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </div>
        <h1 className="mb-2 font-bold text-3xl text-foreground">Acceso no autorizado</h1>
        <p className="text-lg text-muted-foreground">
          Tu cuenta no tiene permisos para acceder a EccoBank
        </p>
      </div>

      {/* Main Error Card */}
      <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
        {/* Error Badge */}
        <div className="mb-6 flex items-center justify-center">
          <div className="rounded-full border border-destructive/20 bg-destructive/10 px-4 py-2 font-medium text-destructive text-sm">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Permisos insuficientes
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8 text-center">
          <h2 className="mb-4 font-semibold text-foreground text-xl">
            No puedes acceder en este momento
          </h2>
          <div className="mb-6 rounded-lg border border-border bg-muted p-4">
            <p className="text-muted-foreground text-sm">
              <strong className="text-foreground">¿Por qué veo este mensaje?</strong>
              <br />
              Tu cuenta de Google no está registrada en nuestro sistema como un usuario autorizado
              para acceder a EccoBank.
            </p>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Solo los usuarios previamente registrados por el administrador pueden acceder a la
            plataforma. Si necesitas acceso, por favor contacta al soporte técnico.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={handleReturnToLogin}
            className="w-full rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90"
          >
            Volver al inicio de sesión
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              (window.location.href =
                "mailto:soporte@eccobank.com?subject=Solicitud de acceso a EccoBank&body=Hola, necesito acceso a la plataforma EccoBank. Mi email de Google es: ")
            }
            className="w-full rounded-xl border-2 border-border px-6 py-3 font-semibold text-foreground transition-all duration-200 hover:border-border hover:bg-muted"
          >
            Contactar soporte
          </Button>
        </div>

        {/* Help Information */}
        <div className="mt-8 border-border border-t pt-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3 text-muted-foreground text-sm">
              <svg
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <strong className="text-foreground">Para obtener acceso:</strong>
                <br />
                Envía un email al administrador del sistema incluyendo tu dirección de correo de
                Google.
              </div>
            </div>
            <div className="flex items-start gap-3 text-muted-foreground text-sm">
              <svg
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <strong className="text-foreground">Tiempo de respuesta:</strong>
                <br />
                Normalmente procesamos las solicitudes dentro de 24-48 horas laborales.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-muted-foreground text-sm">
          ¿Problemas técnicos?{" "}
          <a
            href="mailto:soporte@eccobank.com"
            className="font-medium text-primary hover:text-primary/80"
          >
            Reportar problema
          </a>
        </p>
      </div>
    </div>
  );
};

export default AuthErrorView;
