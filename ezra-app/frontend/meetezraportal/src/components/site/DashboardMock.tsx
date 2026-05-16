import {
  Calendar,
  FileText,
  LayoutDashboard,
  MapPin,
  Rocket,
  Settings,
  Shield,
  ShoppingCart,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardMock() {
  return (
    <div className="rounded-2xl overflow-hidden border border-surface-700 bg-surface-925 shadow-elevated">
      <div className="flex items-center gap-3 px-4 py-3 bg-surface-900 border-b border-surface-800">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-danger-500/60" />
          <div className="w-3 h-3 rounded-full bg-warning-500/60" />
          <div className="w-3 h-3 rounded-full bg-success-500/60" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="px-4 py-1 rounded-md bg-surface-800 text-xs text-surface-400">
            app.meetezra.bot/dashboard
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="w-48 bg-surface-900 border-r border-surface-800 p-4 hidden md:block">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-ezra-400 to-ezra-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">E</span>
            </div>
            <span className="text-white text-sm font-semibold">Ezra</span>
          </div>
          <div className="space-y-1">
            {[
              { icon: LayoutDashboard, label: "Dashboard", active: true },
              { icon: ShoppingCart, label: "Ezra Sales", active: false },
              { icon: Shield, label: "Ezra LP", active: false },
              { icon: Calendar, label: "Scheduling", active: false },
              { icon: Rocket, label: "Exponential", active: false },
              { icon: MapPin, label: "Locations", active: false },
              { icon: FileText, label: "Reports", active: false },
              { icon: Settings, label: "Settings", active: false },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm",
                    item.active
                      ? "bg-ezra-500/10 text-ezra-400"
                      : "text-surface-400"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white text-sm font-semibold">
                Executive Dashboard
              </h3>
              <p className="text-surface-500 text-xs">
                Dogwood Franchise Group — 24 Locations
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 rounded-md bg-surface-800 text-xs text-surface-400">
                Today
              </div>
              <div className="px-2 py-1 rounded-md bg-ezra-500/10 text-xs text-ezra-400">
                7d
              </div>
              <div className="px-2 py-1 rounded-md bg-surface-800 text-xs text-surface-400">
                30d
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {[
              {
                label: "Total Revenue",
                value: "$847,230",
                change: "+12.4%",
                up: true,
              },
              {
                label: "Avg Ticket",
                value: "$127.50",
                change: "+3.2%",
                up: true,
              },
              { label: "Labor %", value: "34.8%", change: "-1.1%", up: true },
              { label: "Rebooking", value: "68%", change: "-2.3%", up: false },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="p-3 rounded-xl bg-surface-850 border border-surface-800"
              >
                <p className="text-surface-500 text-xs mb-1">{kpi.label}</p>
                <p className="text-white font-semibold text-lg">{kpi.value}</p>
                <p
                  className={cn(
                    "text-xs mt-0.5",
                    kpi.up ? "text-success-500" : "text-danger-500"
                  )}
                >
                  {kpi.change}
                </p>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-surface-850 border border-surface-800 p-4 mb-4">
            <p className="text-surface-400 text-xs mb-3">
              Revenue Trend — Last 7 Days
            </p>
            <div className="flex items-end gap-2 h-24">
              {[65, 72, 58, 80, 74, 88, 92].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-gradient-to-t from-ezra-600 to-ezra-400"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-surface-850 border border-surface-800 p-4">
            <p className="text-surface-400 text-xs mb-2">Active Alerts</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-danger-500" />
                <span className="text-surface-300">
                  Henderson — refund rate 340% above average
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-warning-500" />
                <span className="text-surface-300">
                  Scottsdale — overtime threshold exceeded
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-success-500" />
                <span className="text-surface-300">
                  Tempe — highest SRPH in portfolio ($142/hr)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
