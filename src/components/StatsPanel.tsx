import { motion } from "motion/react";
import { Award, Users, ShieldAlert, Heart, Calendar } from "lucide-react";
import { QurbanStats } from "../types";

interface StatsPanelProps {
  stats?: QurbanStats;
}

const defaultStats: QurbanStats = {
  cows: 2,
  goats: 4,
  shohibulCount: 18,
  distributedPackages: 180,
};

export default function StatsPanel({ stats = defaultStats }: StatsPanelProps) {
  const items = [
    {
      label: "Sapi Qurban",
      value: stats.cows,
      sub: "Kolektif & Mandiri",
      icon: "🐄",
      color: "from-amber-500 to-yellow-600",
    },
    {
      label: "Kambing/Domba",
      value: stats.goats,
      sub: "Ibadah Perorangan",
      icon: "🐐",
      color: "from-emerald-500 to-teal-600",
    },
    {
      label: "Shohibul Qurban",
      value: stats.shohibulCount,
      sub: "Pekurban Terdaftar",
      icon: "👤",
      color: "from-blue-500 to-indigo-600",
    },
    {
      label: "Paket Ditransitkan",
      value: stats.distributedPackages,
      sub: "Besek Ramah Lingkungan",
      icon: "🍱",
      color: "from-orange-500 to-red-600",
    },
  ];

  return (
    <div className="w-full">
      {/* Title with small gold geometric separator */}
      <div className="mb-6 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs text-amber-400 font-sans tracking-wide">
          <Calendar className="h-3.5 w-3.5" />
          Masa Qurban 1447H / 2026
        </div>
        <h2 className="text-xl font-serif font-semibold text-slate-100 mt-2">
          Ikhtisar Syiar Qurban GBI
        </h2>
        <div className="w-16 h-0.5 bg-gradient-to-r from-amber-500 to-transparent mt-2 block mx-auto md:mx-0" />
      </div>

      {/* Grid of beautiful bento cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="p-4 rounded-2xl bg-slate-900/60 border border-emerald-500/15 hover:border-amber-500/35 backdrop-blur-md transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
          >
            {/* Ambient gold glow highlight in hover */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-500 to-amber-500 opacity-20 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-start justify-between mb-4">
              <span className="text-2xl">{item.icon}</span>
              <div className="h-6 px-1.5 py-0.5 text-4xs font-mono rounded bg-slate-800 text-amber-400 border border-amber-500/10 uppercase tracking-widest">
                LIVE_STATUS
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                {item.value}
              </div>
              <div className="text-xs font-sans font-medium text-slate-300 mt-1">
                {item.label}
              </div>
              <div className="text-5xs font-mono text-slate-500 uppercase tracking-wider mt-0.5">
                {item.sub}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
