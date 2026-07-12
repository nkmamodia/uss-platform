"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function EnquiryPopup({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ full_name: "", mobile: "", email: "", service_type: "", property_type: "", city: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const inputStyle = { width: "100%", padding: "10px 13px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, background: "#f8fafc", color: "#0c4a6e", outline: "none", fontFamily: "inherit" };
  const labelStyle = { display: "block" as const, fontSize: 12, fontWeight: 600 as const, color: "#64748b", marginBottom: 5, letterSpacing: "0.04em", textTransform: "uppercase" as const };

  async function handleSubmit() {
    if (!form.full_name.trim()) { setError("Please enter your full name."); return; }
    if (!form.mobile || form.mobile.length < 10) { setError("Please enter a valid 10-digit mobile number."); return; }
    if (!form.service_type) { setError("Please select a service."); return; }
    if (!form.property_type) { setError("Please select property type."); return; }
    setError(""); setLoading(true);
    const { error: dbError } = await supabase.from("enquiries").insert([form]);
    setLoading(false);
    if (dbError) { setError("Something went wrong. Please try again."); return; }
    setSuccess(true);
    setTimeout(() => onClose(), 3000);
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 18, padding: "36px 32px", maxWidth: 520, width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 0 0 1px rgba(14,165,233,0.15), 0 24px 60px rgba(0,0,0,0.18)", position: "relative" }}>

        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "#f1f5f9", border: "none", borderRadius: 8, width: 32, height: 32, color: "#64748b", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>

        {success ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0c4a6e", marginBottom: 10 }}>Request Submitted!</h2>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>Thank you! We will call you within 2 hours on working days.<br />Closing automatically...</p>
          </div>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#0ea5e9", textTransform: "uppercase", marginBottom: 6 }}>ULTIMATE SERVICE SOLUTIONS</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0c4a6e" }}>Book a Free Inspection</h2>
              <p style={{ fontSize: 13, color: "#64748b", marginTop: 6 }}>No obligation — we visit, assess, and quote for free.</p>
            </div>

            {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#dc2626", marginBottom: 14 }}>{error}</div>}

            <div className="form-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div><label style={labelStyle}>Full Name *</label><input type="text" placeholder="Your name" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} style={inputStyle} /></div>
              <div><label style={labelStyle}>Mobile Number *</label><input type="tel" maxLength={10} placeholder="+91 XXXXX XXXXX" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value.replace(/\D/g, "") })} style={inputStyle} /></div>
            </div>

            <div style={{ marginBottom: 12 }}><label style={labelStyle}>Email Address</label><input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} /></div>

            <div className="form-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={labelStyle}>Service Required *</label>
                <select value={form.service_type} onChange={e => setForm({ ...form, service_type: e.target.value })} style={inputStyle}>
                  <option value="">Select service</option>
                  <option>General Pest Control</option>
                  <option>Termite Treatment</option>
                  <option>Rodent Control</option>
                  <option>Mosquito / Fly Control</option>
                  <option>Bed Bug Treatment</option>
                  <option>Commercial Fumigation</option>
                  <option>Sanitisation & Disinfection</option>
                  <option>Bee / Wasp Removal</option>
                  <option>Wood Borer Treatment</option>
                  <option>AMC — Residential</option>
                  <option>AMC — Commercial</option>
                  <option>AMC — Industrial</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Property Type *</label>
                <select value={form.property_type} onChange={e => setForm({ ...form, property_type: e.target.value })} style={inputStyle}>
                  <option value="">Select type</option>
                  <option>Apartment / Flat</option>
                  <option>Independent House / Villa</option>
                  <option>Office / Retail</option>
                  <option>Restaurant / Hotel</option>
                  <option>Factory / Warehouse</option>
                  <option>Hospital / Clinic</option>
                  <option>School / Institution</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 12 }}><label style={labelStyle}>City / Area</label><input type="text" placeholder="e.g. Gurugram, Sector 45" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={inputStyle} /></div>
            <div style={{ marginBottom: 20 }}><label style={labelStyle}>Additional Details</label><textarea rows={3} placeholder="Describe the pest problem, property size, or any specific requirements..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ ...inputStyle, resize: "vertical" }} /></div>

            <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", background: "#0b2038", color: "white", padding: "13px", borderRadius: 9, border: "none", fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Submitting..." : "Submit Request — We'll Call You"}
            </button>
            <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", marginTop: 12 }}>🔒 Your information is private and will never be shared. We respond within 2 hours on working days.</p>
          </>
        )}
      </div>
    </div>
  );
}
