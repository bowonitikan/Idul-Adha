import { motion } from "motion/react";
import { Calendar, ArrowUpRight, User, Tag } from "lucide-react";
import { BlogPost } from "../types";

interface PostCardProps {
  key?: string | number;
  post: BlogPost;
  onClick: () => void;
  index: number;
}

export default function PostCard({ post, onClick, index }: PostCardProps) {
  // Format Date gracefully: e.g. "27 Mei 2026"
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
      className="group relative cursor-pointer"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500 blur-xl -z-10" />

      {/* Main card box with golden translucent border */}
      <div className="h-full bg-slate-900/40 hover:bg-slate-900/60 border border-emerald-500/10 hover:border-amber-500/35 backdrop-blur-md rounded-3xl overflow-hidden transition-all duration-500 flex flex-col justify-between">
        
        {/* Banner image wrapper */}
        <div className="relative aspect-video w-full overflow-hidden select-none bg-slate-950">
          <motion.img
            src={post.imageUrl}
            alt={post.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full h-full object-cover object-center transform group-hover:brightness-105 transition-all duration-500"
            onError={(e) => {
              // Custom stock backup image in case image fails
              e.currentTarget.src = "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&q=80&w=800";
            }}
          />
          {/* Subtle vignette gradient cover */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

          {/* Quick Floating Date Stamp */}
          <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 bg-slate-950/80 border border-emerald-500/20 rounded-full text-4xs font-mono text-emerald-300 backdrop-blur-md">
            <Calendar className="h-3 w-3 text-amber-500" />
            {formatDate(post.published)}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-grow flex flex-col justify-between">
          <div>
            {/* Primary Category Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3.5">
              {post.categories.slice(0, 3).map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-950/40 border border-emerald-500/15 rounded-full text-5xs font-medium text-emerald-400 capitalize"
                >
                  <Tag className="h-2 w-2 text-amber-500/70" />
                  {cat}
                </span>
              ))}
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-lg font-serif font-semibold text-slate-100 group-hover:text-amber-400 leading-snug transition-colors duration-300">
              {post.title}
            </h3>

            {/* Summary Text Snippet */}
            <p className="text-xs text-slate-400 line-clamp-3 mt-2.5 leading-relaxed">
              {post.summary}
            </p>
          </div>

          {/* Card footer/cta detail */}
          <div className="mt-5 pt-4 border-t border-slate-900 flex items-center justify-between text-4xs font-mono text-slate-500 group-hover:text-slate-300 transition-colors">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3 text-emerald-500/60" />
              PANITIA_AL_IKHLAS
            </span>

            <span className="inline-flex items-center gap-0.5 text-amber-400 font-sans text-2xs font-semibold group-hover:translate-x-1 transition-transform">
              BACA SELENGKAPNYA
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
