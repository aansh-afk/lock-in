import { useState } from "react";
import { useAuth } from "../../lib/auth";
import { Eye, EyeOff } from "lucide-react";

export function SignIn() {
  const { signIn, signUp } = useAuth();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      if (flow === "signIn") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (err: any) {
      const msg = err.message || "";
      if (msg.includes("InvalidSecret") || msg.includes("InvalidPassword") || msg.includes("Invalid password")) {
        setError(
          flow === "signIn"
            ? "Wrong password. Try again or sign up below."
            : "Account already exists with a different password."
        );
      } else if (msg.includes("Could not find user") || msg.includes("No user found")) {
        setError("No account with that email. Sign up below.");
      } else if (msg.includes("already exists") || msg.includes("duplicate")) {
        setError("Account already exists. Switch to sign in.");
      } else {
        setError(msg || "Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-h-dvh bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Wheel */}
        <div className="flex justify-center mb-8">
          <svg viewBox="0 0 200 200" className="w-24 h-24">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="#FAD399"
              strokeWidth="2"
              opacity="0.6"
            />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <line
                key={i}
                x1="100"
                y1="100"
                x2={100 + 85 * Math.cos((angle * Math.PI) / 180)}
                y2={100 + 85 * Math.sin((angle * Math.PI) / 180)}
                stroke="#FAD399"
                strokeWidth="1.5"
                opacity="0.4"
              />
            ))}
            <circle
              cx="100"
              cy="100"
              r="20"
              fill="none"
              stroke="#FAD399"
              strokeWidth="2"
              opacity="0.8"
            />
            <circle cx="100" cy="100" r="4" fill="#FAD399" opacity="0.9" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-center mb-1 text-white">
          The Wheel
        </h1>
        <p className="text-white/40 text-center text-sm mb-8">
          The wheel turns. Always forward.
        </p>

        <form onSubmit={handleSubmit} className="glass-card space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="glass-input"
          />

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              className="glass-input pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-[#555] hover:text-[#FAD399] transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="glass-button-primary w-full"
          >
            {loading ? "..." : flow === "signIn" ? "Sign In" : "Sign Up"}
          </button>

          <button
            type="button"
            onClick={() => {
              setFlow((f) => (f === "signIn" ? "signUp" : "signIn"));
              setError("");
            }}
            className="w-full text-center text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            {flow === "signIn"
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
