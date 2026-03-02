"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { useState } from "react";

interface IncidentChartProps {
    data: {
        name: string;
        total: number;
    }[];
}

export default function IncidentChart({ data }: IncidentChartProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    // Custom Tooltip for premium look
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 flex flex-col gap-1 min-w-[120px]">
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                        Bulan {label}
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-500/50"></div>
                        <p className="text-2xl font-black text-slate-800 tracking-tighter">
                            {payload[0].value} <span className="text-sm font-medium text-slate-500">Insiden</span>
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-full min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 0,
                        left: -20,
                        bottom: 0,
                    }}
                    onMouseMove={(state) => {
                        if (state && state.activeTooltipIndex !== undefined) {
                            setActiveIndex(Number(state.activeTooltipIndex));
                        }
                    }}
                    onMouseLeave={() => setActiveIndex(null)}
                >
                    <defs>
                        <linearGradient id="colorTotalHover" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={1} />
                            <stop offset="95%" stopColor="#dc2626" stopOpacity={0.8} />
                        </linearGradient>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f87171" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.6} />
                        </linearGradient>
                        <linearGradient id="colorTotalZero" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f1f5f9" stopOpacity={1} />
                            <stop offset="95%" stopColor="#e2e8f0" stopOpacity={1} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1f5f9"
                    />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94a3b8", fontSize: 12 }}
                        dx={-10}
                    />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: "transparent" }}
                    />
                    <Bar
                        dataKey="total"
                        radius={[6, 6, 6, 6]}
                        animationDuration={1500}
                        animationEasing="ease-out"
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={
                                    entry.total === 0
                                        ? "url(#colorTotalZero)"
                                        : index === activeIndex
                                            ? "url(#colorTotalHover)"
                                            : "url(#colorTotal)"
                                }
                                className="transition-all duration-300"
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
