"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SignInPopup({ onClose }: { onClose: () => void }) {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSignIn() {
    if (!mobile || mobile.length < 10) { setError("Please enter a valid 10-digit mobile number."); return; }
    if (!password) { setError("Please enter your password."); return; }
    setError(""); setLoading(true);

    const email = `${mobile}@uss.app`;
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    
    if (signInError) { setError("Invalid mobile number or password. Please contact the owner."); setLoading(false); return; }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
    setLoading(false);
    
    if (profile?.role === "owner") { router.push("/dashboard"); onClose(); }
    else if (profile?.role === "technician") { router.push("/technician"); onClose(); }
    else if (profile?.role === "customer") { router.push("/portal"); onClose(); }
    else { setError("Account not set up correctly. Please contact the owner."); }
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 18, padding: "36px 32px", maxWidth: 420, width: "100%", boxShadow: "0 0 0 1px rgba(14,165,233,0.15), 0 24px 60px rgba(0,0,0,0.18)", position: "relative" }}>

        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "#f1f5f9", border: "none", borderRadius: 8, width: 32, height: 32, color: "#64748b", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#0ea5e9", textTransform: "uppercase", marginBottom: 6 }}>WELCOME TO ULTIMATE SERVICE SOLUTIONS</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0c4a6e" }}>Your Protection Starts Here</h2>
        </div>

        {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#dc2626", marginBottom: 14 }}>{error}</div>}

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 5, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>Mobile Number</label>
          <input type="tel" maxLength={10} placeholder="Registered mobile number" value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, ""))} onKeyDown={e => e.key === "Enter" && handleSignIn()} style={{ width: "100%", padding: "11px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, background: "#f1f5f9", color: "#0c4a6e", outline: "none", fontFamily: "inherit" }} />
        </div>

        <div style={{ marginBottom: 8, position: "relative" }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 5, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>Password</label>
          <input type={showPassword ? "text" : "password"} placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSignIn()} style={{ width: "100%", padding: "11px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, background: "#f1f5f9", color: "#0c4a6e", outline: "none", fontFamily: "inherit" }} />
          <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 10, top: 34, background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            )}
          </button>
        </div>

        <div style={{ textAlign: "right", marginBottom: 20 }}>
          <span style={{ fontSize: 12, color: "#0ea5e9", cursor: "pointer" }}>Forgot password? Call +91 87008 93598</span>
        </div>

        <button onClick={handleSignIn} disabled={loading} style={{ width: "100%", background: "#0ea5e9", color: "white", padding: "13px", borderRadius: 9, border: "none", fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", marginTop: 16 }}>🔒 Your information is private and will never be shared.</p>
      </div>
    </div>
  );
}
