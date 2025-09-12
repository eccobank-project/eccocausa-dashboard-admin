import { useEffect, useState } from "react";

import { supabase } from "../lib/supabase";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(() => {
      setLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session ? "User logged in" : "User logged out");
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="dark scheme-only-dark grid min-h-screen place-items-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-gray-900 border-b-2" />
          <p className="mt-2 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
