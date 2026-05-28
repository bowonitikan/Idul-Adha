import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, User, ExternalLink, Bookmark, ShieldCheck } from "lucide-react";
import { BlogPost } from "../types";

interface PostDetailProps {
  post: BlogPost | null;
  onClose: () => void;
}

export default function PostDetail({ post, onClose }: PostDetailProps) {
  // Prevent background scroll when detail modal is open
  useEffect(() => {
    if (post) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [post]);

  if (!post) return null;

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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto bg-slate-950/80 backdrop-blur-xl"
      >
        {/* Click outside to close */}
        <div className="absolute inset-0 cursor-zoom-out" onClick={onClose} />

        {/* Modal Card content */}
        <motion.div
          initial={{ y: 50, scale: 0.95, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 30, scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 180 }}
          className="relative w-full max-w-4xl bg-slate-900 border border-emerald-500/20 shadow-[0_0_50px_rgba(245,158,11,0.15)] rounded-3xl overflow-hidden z-10 flex flex-col my-auto max-h-[85vh]"
        >
          {/* Top Sticky Header for Controls */}
          <div className="sticky top-0 bg-slate-900/90 backdrop-blur-md px-6 py-4 border-b border-slate-800/60 flex items-center justify-between z-25">
            <div className="flex items-center gap-2 text-4xs font-mono text-emerald-400">
              <Bookmark className="h-3 w-3 text-amber-500" />
              <span>PUBLIKASI_BACAAN_QURBAN</span>
            </div>

            <motion.button
              id="btn-close-detail"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="h-9 w-9 rounded-full cursor-pointer bg-slate-950 border border-slate-800 hover:border-amber-500/30 text-slate-400 hover:text-amber-400 flex items-center justify-center transition-all duration-300 shadow-md"
            >
              <X className="h-4 w-4" />
            </motion.button>
          </div>

          {/* Scrollable Container */}
          <div className="overflow-y-auto flex-grow">
            {/* Lead Poster Feature Header */}
            <div className="relative aspect-video sm:aspect-[2.2/1] w-full overflow-hidden bg-slate-950">
              <img
                src={post.imageUrl}
                alt={post.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&q=80&w=800";
                }}
              />
              {/* Vibrant Gold & Emerald overlay edge fade */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-slate-950/25" />
              
              {/* Floating banner titles */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.categories.map((cat) => (
                    <span
                      key={cat}
                      className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-5xs font-semibold text-amber-400 uppercase tracking-wider"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-slate-100 leading-tight">
                  {post.title}
                </h1>
              </div>
            </div>

            {/* Read Article Content Sheet */}
            <div className="px-6 py-8 sm:px-8 sm:py-10">
              {/* Meta tags detail strip */}
              <div className="flex flex-wrap gap-y-3 gap-x-6 items-center text-xs text-slate-400 border-b border-slate-800/60 pb-5 mb-8">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-slate-950 flex items-center justify-center text-amber-500 border border-amber-500/20 text-3xs font-mono">
                    MI
                  </div>
                  <div>
                    <div className="font-sans font-medium text-slate-200">Masjid Al Ikhlas</div>
                    <div className="text-4xs font-mono text-slate-500 uppercase tracking-wider">PANITIA QURBAN</div>
                  </div>
                </div>

                <div className="h-4 w-px bg-slate-800 hidden sm:block" />

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-emerald-400" />
                  <span>Diterbitkan pada {formatDate(post.published)}</span>
                </div>

                <div className="h-4 w-px bg-slate-800 hidden sm:block" />

                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-4xs text-emerald-300 font-mono">
                  <ShieldCheck className="h-3 w-3" />
                  VERIFIED_BLOGGER
                </div>
              </div>

              {/* HTML post body content */}
              <article 
                className="prose prose-invert prose-emerald max-w-none text-slate-300 select-text leading-relaxed font-sans text-sm sm:text-base space-y-4"
              >
                <div 
                  dangerouslySetInnerHTML={{ __html: post.content }}
                  className="[&>p]:mb-4 [&>p]:leading-relaxed [&>a]:text-amber-400 [&>a]:underline [&>img]:rounded-2xl [&>img]:my-6 [&>img]:border [&>img]:border-slate-800"
                />
              </article>

              {/* End of content line sign-off */}
              <div className="flex flex-col items-center justify-center text-center mt-12 pt-8 border-t border-slate-800/40">
                <div className="h-2 w-2 rounded-full bg-amber-500 mb-2" />
                <div className="text-5xs font-mono text-slate-500 tracking-widest uppercase">MASJID AL IKHLAS • GRIYA BANTAR INDAH</div>
                <div className="text-xs text-slate-400 mt-2 max-w-md">
                  Mari dukung terus kegiatan kepanitian dan pembangunan spiritual di warga lingkungan Perum GBI Purwokerto.
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Footer CTA to view original */}
          <div className="sticky bottom-0 bg-slate-950/90 backdrop-blur-md px-6 py-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 z-20">
            <span className="text-4xs font-mono text-slate-500">
              ID_POST: {post.id}
            </span>

            <motion.a
              id="lnk-blogger-original"
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 bg-slate-900 border border-amber-500/20 hover:border-amber-400 text-amber-400 font-sans font-medium rounded-full cursor-pointer transition-all duration-300 flex items-center gap-2 text-2xs uppercase tracking-wider"
            >
              Lihat di Blogger Asli
              <ExternalLink className="h-3.5 w-3.5" />
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
