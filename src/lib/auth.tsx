import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

type AuthContextType = {
  userId: Id<"users"> | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType>(null!);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<Id<"users"> | null>(() => {
    const stored = localStorage.getItem("wheel_user_id");
    return stored ? (stored as Id<"users">) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  const signInMutation = useMutation(api.users.signIn);
  const signUpMutation = useMutation(api.users.signUp);
  const currentUser = useQuery(api.users.currentUser, { userId: userId ?? undefined });

  // Validate stored userId
  useEffect(() => {
    if (userId === null) {
      setIsLoading(false);
      return;
    }
    if (currentUser === undefined) return; // still loading
    if (currentUser === null) {
      // User was deleted, clear
      localStorage.removeItem("wheel_user_id");
      setUserId(null);
    }
    setIsLoading(false);
  }, [userId, currentUser]);

  const signIn = useCallback(async (email: string, password: string) => {
    const id = await signInMutation({ email, password });
    localStorage.setItem("wheel_user_id", id);
    setUserId(id);
  }, [signInMutation]);

  const signUp = useCallback(async (email: string, password: string) => {
    const id = await signUpMutation({ email, password });
    localStorage.setItem("wheel_user_id", id);
    setUserId(id);
  }, [signUpMutation]);

  const signOut = useCallback(() => {
    localStorage.removeItem("wheel_user_id");
    setUserId(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userId,
        isAuthenticated: userId !== null && currentUser !== null,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
