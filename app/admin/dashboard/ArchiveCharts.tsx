"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
  AreaChart,
  Area
} from "recharts";

interface ArchiveChartsProps {
  typeData: { name: string; value: number }[];
  yearData: { name: string; total: number }[];
}

const COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#10b981", 
  "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#64748b"
];

export default function ArchiveCharts({ typeData, yearData }: ArchiveChartsProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-xl border border-slate-100 flex flex-col gap-1 min-w-[120px] text-xs">
          <p className="font-bold text-slate-800">{payload[0].name}</p>
          <p className="font-semibold text-red-600">
            {payload[0].value} Dokumen
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomAreaTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-xl border border-slate-100 flex flex-col gap-1 min-w-[120px] text-xs">
          <p className="text-slate-500 font-semibold uppercase tracking-wider mb-1">Tahun {label}</p>
          <p className="text-xl font-black text-slate-800">
            {payload[0].value} <span className="text-xs font-medium text-slate-500">Dokumen</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. CHART JENIS DOKUMEN */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col relative overflow-hidden">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800">Dokumen Berdasarkan Jenis</h3>
          <p className="text-slate-500 text-xs mt-0.5">Pembagian file digitalisasi berdasarkan rumpun/jenis surat</p>
        </div>
        
        <div className="w-full h-[280px] flex items-center justify-center">
          {typeData.length === 0 ? (
            <div className="text-slate-400 text-sm font-medium">Belum ada data untuk ditampilkan</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '10px', fontWeight: 600, color: '#475569', paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 2. CHART TREN TAHUNAN */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col relative overflow-hidden">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800">Tren Arsip Dokumen Tahunan</h3>
          <p className="text-slate-500 text-xs mt-0.5">Jumlah pengarsipan dokumen dari tahun ke tahun</p>
        </div>

        <div className="w-full h-[280px]">
          {yearData.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-medium">Belum ada data untuk ditampilkan</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={yearData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorYearDocs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  dx={-10}
                />
                <Tooltip content={<CustomAreaTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorYearDocs)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
