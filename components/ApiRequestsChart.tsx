"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  TooltipItem,
} from "chart.js";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartDataPoint {
  date: string;
  GET: number;
  POST: number;
  PUT: number;
  PATCH: number;
  DELETE: number;
  OPTIONS: number;
  total: number;
}

interface ApiRequestsChartProps {
  chartData: ChartDataPoint[];
}

const methodColors: Record<string, string> = {
  GET: "#10b981", // green
  POST: "#3b82f6", // blue
  PUT: "#f59e0b", // amber
  PATCH: "#8b5cf6", // purple
  DELETE: "#ef4444", // red
  OPTIONS: "#6b7280", // gray
};

export default function ApiRequestsChart({ chartData }: ApiRequestsChartProps) {
  // Trend calculation
  const calculateTrend = () => {
    if (chartData.length < 2) return { trend: 0, direction: "stable" };

    const recent =
      chartData.slice(-3).reduce((sum, d) => sum + d.total, 0) /
      Math.min(3, chartData.length);
    const older =
      chartData.slice(0, -3).reduce((sum, d) => sum + d.total, 0) /
      Math.max(1, chartData.length - 3);

    const change = ((recent - older) / (older || 1)) * 100;

    return {
      trend: Math.abs(change).toFixed(1),
      direction: change > 5 ? "up" : change < -5 ? "down" : "stable",
    };
  };

  const { trend, direction } = calculateTrend();

  // Chart.js data
  const data = {
    labels: chartData.map((d) => d.date),
    datasets: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"].map(
      (method) => ({
        label: method,
        data: chartData.map((d) => d[method as keyof ChartDataPoint]),
        borderColor: methodColors[method],
        backgroundColor: methodColors[method] + "55", // semi-transparent
        fill: false,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      })
    ),
  };

  // Chart.js options
  const options: ChartOptions<"line"> = {
    responsive: true,
    interaction: {
      mode: "nearest",
      intersect: false,
    },
    plugins: {
      legend: {
        display: false, // hide default legend
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: function (tooltipItem: TooltipItem<"line">) {
            const label = tooltipItem.dataset.label || "";
            const value = tooltipItem.raw;
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#6b7280",
        },
        grid: {
          color: "rgba(156, 163, 175, 0.2)",
        },
      },
      y: {
        ticks: {
          color: "#6b7280",
        },
        grid: {
          color: "rgba(156, 163, 175, 0.2)",
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Trend Indicator */}
      {chartData.length > 1 && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
          {direction === "up" && (
            <>
              <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-950/30">
                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm text-green-600 dark:text-green-400 font-semibold">
                +{trend}% increase
              </span>
            </>
          )}
          {direction === "down" && (
            <>
              <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-950/30">
                <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-sm text-red-600 dark:text-red-400 font-semibold">
                {trend}% decrease
              </span>
            </>
          )}
          {direction === "stable" && (
            <>
              <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
                <Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>
              <span className="text-sm text-muted-foreground font-semibold">
                Stable traffic
              </span>
            </>
          )}
          <span className="text-sm text-muted-foreground">
            in recent activity
          </span>
        </div>
      )}

      {/* Chart */}
      <div className="p-6 bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
        <Line data={data} options={options} />

        {/* Custom HTML legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"].map(
            (method) => (
              <div
                key={method}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: methodColors[method] }}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {method}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
