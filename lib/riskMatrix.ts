// lib/riskMatrix.ts

// Standar Warna & Label Matriks Risiko (Standar Telkom/Umum)
export const RISK_LEVELS = {
  EXTREME: { label: "EXTREME", color: "bg-red-600 text-white", border: "border-red-600" },
  HIGH:    { label: "HIGH",    color: "bg-orange-500 text-white", border: "border-orange-500" },
  MEDIUM:  { label: "MEDIUM",  color: "bg-yellow-400 text-black", border: "border-yellow-400" },
  LOW:     { label: "LOW",     color: "bg-green-600 text-white", border: "border-green-600" },
};

// Fungsi Pintar: Masukkan Probability & Severity -> Keluar Level-nya
export function calculateRiskLevel(probability: number, severity: number) {
  const score = probability * severity;

  // Logika Matriks 5x5 (Sesuaikan jika Telkom punya standar beda)
  // Score 15 - 25 = Extreme
  // Score 10 - 14 = High
  // Score 5 - 9   = Medium
  // Score 1 - 4   = Low

  if (score >= 15) return { score, ...RISK_LEVELS.EXTREME };
  if (score >= 10) return { score, ...RISK_LEVELS.HIGH };
  if (score >= 5)  return { score, ...RISK_LEVELS.MEDIUM };
  return { score, ...RISK_LEVELS.LOW };
}