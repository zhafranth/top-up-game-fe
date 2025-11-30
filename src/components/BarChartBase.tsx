import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";

export type BarChartDatum = Record<string, string | number>;

interface BarChartBaseProps {
  data: BarChartDatum[];
  xKey: string; // key for X axis (categorical)
  yKey: string; // key for Y axis (numeric)
  height?: number; // pixels
  barColor?: string; // hex or CSS color
  yAxisFormatter?: (value: number) => string;
  showLabels?: boolean;
  labelPosition?: "top" | "insideTop";
}

/**
 * BarChartBase
 * Komponen reusable berbasis Recharts untuk menampilkan bar chart sederhana.
 * - Mendukung responsive container
 * - Grid, tooltip, legend default
 * - Custom formatter untuk Y axis
 */
export function BarChartBase({
  data,
  xKey,
  yKey,
  height = 280,
  barColor = "#6366f1", // indigo-500
  yAxisFormatter,
  showLabels = true,
  labelPosition = "top",
}: BarChartBaseProps) {
  // Tambahkan padding dinamis di atas nilai maksimum agar label tidak terpotong
  const maxY = Array.isArray(data) && data.length > 0
    ? data.reduce((max, item) => {
        const raw = item[yKey];
        const val = typeof raw === "number" ? raw : Number(raw);
        return Math.max(max, isNaN(val) ? 0 : val);
      }, 0)
    : 0;
  const pad = Math.max(1, Math.ceil(maxY * 0.1));
  const yDomain: [number, number] = [0, maxY > 0 ? maxY + pad : 1];

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.15)"
          />
          <XAxis
            dataKey={xKey}
            tick={{ fill: "currentColor" }}
            tickLine={false}
            axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
          />
          <YAxis
            tick={{ fill: "currentColor" }}
            tickFormatter={yAxisFormatter}
            tickLine={false}
            axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
            allowDecimals={false}
            domain={yDomain}
          />
          <Tooltip cursor={{ fill: "rgba(99,102,241,0.08)" }} />
          <Legend />
          <Bar
            dataKey={yKey}
            name="Total"
            fill={barColor}
            radius={[6, 6, 0, 0]}
          >
            {showLabels && (
              <LabelList dataKey={yKey} position={labelPosition} offset={6} />
            )}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
