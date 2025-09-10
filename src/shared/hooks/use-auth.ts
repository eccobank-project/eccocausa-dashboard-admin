import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export const useAuth = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error logging out:", error.message);
      } else {
        navigate("/auth/login");
      }
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return {
    logout,
  };
};