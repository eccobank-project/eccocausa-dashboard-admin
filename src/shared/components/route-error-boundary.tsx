import { AlertCircle, RefreshCw } from "lucide-react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function RouteErrorBoundary() {
  const error = useRouteError();

  let errorMessage: string;
  let errorStatus: number | null = null;

  if (isRouteErrorResponse(error)) {
    errorMessage = error.data?.message || error.statusText;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else {
    errorMessage = "Se produjo un error inesperado";
  }

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-semibold text-2xl">{errorStatus ? `Error ${errorStatus}` : "Error"}</h2>
          <p className="text-muted-foreground">{errorMessage}</p>
        </div>

        <div className="flex justify-center gap-4">
          <Button onClick={handleRetry} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reintentar
          </Button>
          <Button onClick={() => window.history.back()}>Volver</Button>
        </div>
      </div>
    </div>
  );
}
