'use client';

// ===========================================
// EZRA PORTAL - Chart Card Component
// ===========================================

import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from 'recharts';
import { cn } from '@/lib/utils';
import { formatCurrency, formatCompactNumber, formatShortDate } from '@/lib/formatters';

// ============ Chart Card Wrapper ============

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  height?: number;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  action,
  className,
  height = 300,
}) => {
  return (
    <div
      className={cn(
        'rounded-xl bg-white dark:bg-surface-850',
        'border border-surface-200 dark:border-surface-700/50',
        'p-6',
        className
      )}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-heading-sm text-surface-900 dark:text-surface-100">
            {title}
          </h3>
          {subtitle && (
            <p className="text-body-sm text-surface-500 dark:text-surface-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div style={{ height }}>{children}</div>
    </div>
  );
};

// ============ Custom Tooltip ============

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
    dataKey: string;
  }>;
  label?: string;
  formatter?: (value: number) => string;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  formatter = (v) => formatCurrency(v),
}) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-surface-900 dark:bg-surface-800 text-white rounded-lg shadow-elevated p-3 text-sm">
      <p className="text-surface-400 mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-surface-300">{entry.name}:</span>
          <span className="font-semibold">{formatter(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

// ============ Revenue Line Chart ============

interface RevenueChartProps {
  data: Array<{ date: string; revenue: number }>;
  className?: string;
}

export const RevenueLineChart: React.FC<RevenueChartProps> = ({ data, className }) => {
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#27272a"
        />
        <XAxis
          dataKey="date"
          tickFormatter={(v) => formatShortDate(v)}
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#71717a', fontSize: 12 }}
          dy={10}
        />
        <YAxis
          tickFormatter={(v) => formatCompactNumber(v, { style: 'currency' })}
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#71717a', fontSize: 12 }}
          dx={-10}
          width={60}
        />
        <Tooltip
          content={<CustomTooltip formatter={(v) => formatCurrency(v)} />}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="#06b6d4"
          strokeWidth={2}
          fill="url(#revenueGradient)"
          dot={false}
          activeDot={{ r: 6, fill: '#06b6d4', stroke: '#fff', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// ============ Bar Chart for Locations ============

interface LocationBarChartProps {
  data: Array<{ name: string; revenue: number; target: number }>;
  className?: string;
}

export const LocationBarChart: React.FC<LocationBarChartProps> = ({
  data,
  className,
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={false}
          stroke="#27272a"
        />
        <XAxis
          type="number"
          tickFormatter={(v) => formatCompactNumber(v, { style: 'currency' })}
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#71717a', fontSize: 12 }}
        />
        <YAxis
          type="category"
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#a1a1aa', fontSize: 12 }}
          width={100}
        />
        <Tooltip
          content={<CustomTooltip formatter={(v) => formatCurrency(v)} />}
        />
        <Legend />
        <Bar
          dataKey="revenue"
          name="Revenue"
          fill="#06b6d4"
          radius={[0, 4, 4, 0]}
          barSize={16}
        />
        <Bar
          dataKey="target"
          name="Target"
          fill="#3f3f46"
          radius={[0, 4, 4, 0]}
          barSize={16}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

// ============ Donut Chart ============

interface DonutChartProps {
  data: Array<{ name: string; value: number; fill: string }>;
  className?: string;
  showLegend?: boolean;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  className,
  showLegend = true,
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <PieChart margin={{ top: 5, right: 5, bottom: 25, left: 5 }}>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={50}
          outerRadius={70}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => `${value}%`}
          contentStyle={{
            backgroundColor: '#18181b',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 12px',
          }}
          itemStyle={{ color: '#fff' }}
        />
        {showLegend && (
          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span className="text-surface-400 text-sm">{value}</span>
            )}
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  );
};

// ============ Service vs Product Bar Chart ============

interface ServiceProductChartProps {
  data: Array<{ date: string; serviceRevenue: number; productRevenue: number }>;
  className?: string;
}

export const ServiceProductChart: React.FC<ServiceProductChartProps> = ({
  data,
  className,
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#27272a"
        />
        <XAxis
          dataKey="date"
          tickFormatter={(v) => formatShortDate(v)}
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#71717a', fontSize: 12 }}
          dy={10}
        />
        <YAxis
          tickFormatter={(v) => formatCompactNumber(v, { style: 'currency' })}
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#71717a', fontSize: 12 }}
          dx={-10}
          width={60}
        />
        <Tooltip
          content={<CustomTooltip formatter={(v) => formatCurrency(v)} />}
        />
        <Legend />
        <Bar
          dataKey="serviceRevenue"
          name="Services"
          stackId="a"
          fill="#06b6d4"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="productRevenue"
          name="Products"
          stackId="a"
          fill="#8b5cf6"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ChartCard;
