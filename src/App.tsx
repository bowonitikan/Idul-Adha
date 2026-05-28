import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  Search,
  RefreshCw,
  MapPin,
  ChevronUp,
  SlidersHorizontal,
  Compass,
  FileText,
  Calendar,
  Sparkles,
  Volume2,
  ExternalLink
} from "lucide-react";
import { BlogPost, QurbanStats } from "./types";
import ThreeBg from "./components/ThreeBg";
import AudioPlayer from "./components/AudioPlayer";
import StatsPanel from "./components/StatsPanel";
import PostCard from "./components/PostCard";
import PostDetail from "./components/PostDetail";

export default function App() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>("local");

  // Selection & Discovery States
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Fetch Blogger posts from server-side proxy
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/blogger-posts");
      if (!res.ok) {
        throw new Error(`Gagal memuat postingan: ${res.statusText}`);
      }
      const data = await res.json();
      setPosts(data.posts || []);
      setDataSource(data.source || "blogger");
    } catch (err: any) {
      console.error("Gagal menghubungkan ke API server:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    // Scroll listener for back-to-top bubble
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Compute available unique tags/categories
  const categories = useMemo(() => {
    const list = new Set<string>();
    list.add("Semua");
    posts.forEach((post) => {
      post.categories.forEach((cat) => {
        // Convert categories to descriptive short words
        if (cat) list.add(cat);
      });
    });
    return Array.from(list);
  }, [posts]);

  // Filtered post selector
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategory === "Semua" ||
        post.categories.includes(selectedCategory);

      return matchSearch && matchCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-emerald-995 to-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 relative overflow-x-hidden pb-12">
      
      {/* 1. Immersive 3D Three.js Geometric & Celestial Particles Background */}
      <ThreeBg intensity={1.2} />

      {/* Decorative Top Ambient Islamic Star Pattern Gradients */}
      <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent pointer-events-none -z-5 animate-pulse" style={{ animationDuration: "10s" }} />

      {/* Background radial soft light blobs */}
      <div className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-700/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] right-[-10%] w-[50vw] h-[50vw] bg-amber-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* 2. Top Navigation header */}
      <header className="sticky top-0 z-35 w-full bg-slate-950/70 backdrop-blur-lg border-b border-emerald-500/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Brand Logo with golden dome/star accent */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 via-emerald-600 to-teal-500 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-950/20">
              <div className="h-full w-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                <Compass className="h-5 w-5 text-amber-400 rotate-45" />
              </div>
            </div>
            <div>
              <span className="font-serif font-semibold tracking-wide text-sm sm:text-base text-slate-100 bg-clip-text">
                QURBAN <span className="text-amber-400 font-serif">1447H</span>
              </span>
              <div className="flex items-center gap-1 text-5xs font-mono text-slate-400 uppercase tracking-widest leading-none mt-0.5">
                <MapPin className="h-2 w-2 text-emerald-500" />
                <span>Masjid Al Ikhlas GBI</span>
              </div>
            </div>
          </div>

          {/* Quick Header Buttons */}
          <div className="flex items-center gap-3">
            {/* Blogger badge indicator */}
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-5xs font-mono rounded bg-slate-900 border border-emerald-500/20 ${dataSource === "blogger" ? "text-amber-400" : "text-emerald-400"}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${dataSource === "blogger" ? "bg-amber-400" : "bg-emerald-400"} animate-pulse`} />
              {dataSource === "blogger" ? "LIVE_BLOGGER_CONNECTED" : "LOCAL_EMERALD_BUFFER"}
            </span>

            <button
              id="btn-manual-sync"
              onClick={fetchPosts}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-emerald-500/10 hover:border-amber-500/20 text-slate-400 hover:text-amber-400 rounded-lg cursor-pointer transition-colors"
              title="Perbarui Data"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* 3. Immersive Hero visual spotlight */}
      <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-12 text-center max-w-4xl mx-auto px-4 z-10 select-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/60 border border-emerald-500/20 rounded-full text-xs text-emerald-300 backdrop-blur-sm mb-6"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-spin" style={{ animationDuration: "10s" }} />
          <span>Portal Informasi 3D & Publikasi Qurban Digital</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight text-slate-100"
        >
          Syiar Agung <span className="text-amber-400 italic">Qurban</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto mt-4 leading-relaxed font-sans"
        >
          Selamat datang di platform publikasi digital terpadu kegiatan penyembelihan, pendistribusian, edukasi, dan hikmah ibadah Idul Qurban di lingkup warga Perumahan Griya Bantar Indah Purwokerto.
        </motion.p>

        {/* Real-Time UTC Info strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 mt-8 bg-slate-950/80 border border-slate-900 rounded-xl text-5xs font-mono text-slate-500 uppercase tracking-widest shadow-md"
        >
          <span>UP-TO-DATE: 2026-05-28</span>
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          <span>SYSTEM_ONLINE_SECURE</span>
        </motion.div>
      </section>

      {/* Main body wrappers */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-4 space-y-16">
        
        {/* SECTION A: Live Interactive Qurban Numbers (StatsPanel component) */}
        <section className="bg-slate-950/40 border border-emerald-500/5 rounded-3xl p-6 md:p-8 backdrop-blur-md">
          <StatsPanel />
        </section>

        {/* SECTION B: Blogger Content Filtering Console */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-emerald-500/10">
            {/* Left title */}
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-semibold text-slate-100 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-amber-400" />
                Catatan Syiar & Publikasi Resmi
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Kumpulan kabar berita, pendaftaran, tata laksana, dan panduan ibadah langsung dari blogger resmi.
              </p>
            </div>

            {/* Right: Search Console of entries */}
            <div className="relative max-w-xs w-full">
              <input
                id="inp-search-post"
                type="text"
                placeholder="Cari artikel publikasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-slate-950/80 border border-emerald-500/15 focus:border-amber-500/50 rounded-full text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-all duration-300 shadow-inner"
              />
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
            </div>
          </div>

          {/* Sub-Filters: Interactive category tabs */}
          <div className="flex flex-wrap items-center gap-2 select-none overflow-x-auto pb-2 scrollbar-none">
            <div className="text-4xs font-mono text-slate-500 uppercase tracking-widest mr-2 flex items-center gap-1">
              <SlidersHorizontal className="h-3 w-3" /> Filters:
            </div>
            
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  id={`btn-filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-sans font-medium pointer-events-auto cursor-pointer transition-all duration-300 capitalize border ${
                    isActive
                      ? "bg-amber-500 border-amber-500 text-slate-950 font-semibold shadow-[0_2px_10px_rgba(245,158,11,0.2)]"
                      : "bg-slate-900/60 hover:bg-slate-905 border-emerald-500/10 hover:border-amber-500/30 text-slate-300"
                  }`}
                >
                  {cat === "Semua" ? "Semua Artikel" : cat}
                </button>
              );
            })}
          </div>

          {/* SECTION C: Blogger Posts Grid Display (PostCard items) */}
          {loading ? (
            // Exquisite loading state
            <div className="py-24 flex flex-col items-center justify-center text-center">
              <div className="relative flex items-center justify-center mb-4">
                <RefreshCw className="h-10 w-10 text-amber-500 animate-spin" />
                <div className="absolute inset-0 h-10 w-10 rounded-full border border-dashed border-emerald-500/40 animate-ping opacity-60" />
              </div>
              <p className="text-xs font-mono text-slate-400 tracking-wider uppercase">
                Menghubungkan ke Blogger Feed...
              </p>
              <p className="text-4xs font-mono text-slate-600 uppercase mt-1">
                MEMBACA DATA https://idulqurbanperumgbi.blogspot.com/
              </p>
            </div>
          ) : error && posts.length === 0 ? (
            // Error fallbacks triggers
            <div className="p-8 rounded-2xl bg-red-950/10 border border-red-500/20 text-center max-w-md mx-auto space-y-4">
              <div className="text-red-400">⚠️ Gagal memuat postingan terupdate</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Koneksi internet bermasalah atau feed RSS blogger tidak merespons. Sila periksa jaringan atau tekan segarkan.
              </p>
              <button
                id="btn-retry-sync"
                onClick={fetchPosts}
                className="px-4 py-2 bg-slate-900 border border-red-500/30 text-red-400 hover:text-white rounded-full text-xs cursor-pointer transition-all"
              >
                Coba Sinkron Ulang
              </button>
            </div>
          ) : filteredPosts.length === 0 ? (
            // Filter match not found state
            <div className="py-16 text-center rounded-2xl bg-slate-900/40 border border-slate-900 max-w-sm mx-auto">
              <FileText className="h-8 w-8 text-slate-600 mx-auto mb-3" />
              <div className="text-sm font-semibold text-slate-300">Tidak Ada Artikel Cocok</div>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto px-4">
                Tidak ditemukan hasil untuk kueri pencarian atau filter "{selectedCategory}". Coba ubah kata kunci Anda.
              </p>
            </div>
          ) : (
            // Core Staggered Post Layout Grid
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredPosts.map((post, index) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    index={index}
                    onClick={() => setSelectedPost(post)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>

        {/* SECTION D: Extra Interactive About Masjid Al Ikhlas widget */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-950/30 border border-emerald-500/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
          <div className="space-y-4 flex flex-col justify-center">
            <div className="inline-flex items-center gap-1 text-5xs font-mono text-amber-400 uppercase tracking-widest">
              <span>PROFIL • SEKRETARIAT_MASJID</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-semibold text-slate-100">
              Masjid Al Ikhlas Perum GBI
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Masjid Al Ikhlas berdiri sebagai pilar ukhuwah, pembinaan keimanan, dan wadah aksi kemanusiaan bagi warga Perumahan Griya Bantar Indah (GBI) Purwokerto. Kami terus berinovasi mengoptimalkan sarana digital untuk memublikasikan pertanggungjawaban amaliah demi menjaga transparansi umat Islam.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Kec. Purwokerto Barat</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span>Kab. Banyumas</span>
              </div>
            </div>
          </div>

          {/* Map & Blog Reference block */}
          <div className="h-full min-h-[180px] bg-slate-950/90 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
            {/* Islamic geometric background art (watermark style) */}
            <div className="absolute right-0 bottom-0 text-slate-900 translate-x-12 translate-y-12 shrink-0 group-hover:text-amber-500/5 transition-colors duration-500 font-serif text-[180px] select-none pointer-events-none">
              ★
            </div>

            <div className="z-5 space-y-2">
              <div className="text-2xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">Tautan Cepat Blogger Utama</div>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Anda juga dapat berkunjung langsung ke halaman utama Blogger kami untuk melihat rekam jejak historis syiar-syiar sebelumnya.
              </p>
            </div>

            <a
              id="lnk-external-blogger"
              href="https://idulqurbanperumgbi.blogspot.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="z-5 mt-4 inline-flex items-center gap-2 text-2xs font-sans font-bold text-amber-400 uppercase tracking-wider self-start group/lnk pointer-events-auto cursor-pointer"
            >
              Kunjungi Blogger Asli
              <ExternalLink className="h-4 w-4 text-amber-500 group-hover/lnk:translate-x-0.5 group-hover/lnk:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </section>
      </main>

      {/* 4. Mandatory Footer specifying user guidelines:
          - "Masjid Al Ikhlas. Perumahan Griya Bantar Indah Purwokerto."
          - "Publikasi (c) 2026"
      */}
      <footer className="mt-20 border-t border-slate-900 bg-slate-950/80 backdrop-blur-md pt-8 pb-10 relative z-10 text-center select-none">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          {/* Ornamental Separator */}
          <div className="flex items-center justify-center gap-3">
            <span className="w-16 h-px bg-gradient-to-r from-transparent to-amber-500/20" />
            <span className="text-amber-500 text-xs">◆</span>
            <span className="w-16 h-px bg-gradient-to-l from-transparent to-amber-500/20" />
          </div>

          <p className="text-xs sm:text-sm font-sans font-medium text-slate-300 tracking-wide">
            Masjid Al Ikhlas. Perumahan Griya Bantar Indah Purwokerto.
          </p>

          <p className="text-5xs font-mono text-slate-500 tracking-widest uppercase">
            Sistem Informasi Qurban Digital • Versi Web 3.0 Epic
          </p>

          <p className="text-4xs font-mono text-amber-500/65 uppercase tracking-widest">
            Publikasi (c) 2026
          </p>
        </div>
      </footer>

      {/* 5. Custom Automatic Background Music System (AudioPlayer component) */}
      <AudioPlayer />

      {/* 6. Post Reader Detailed Overlay Modal Panel with seamless scale transitions */}
      <PostDetail
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />

      {/* 7. Floating scroll back to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            id="btn-scroll-top"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={scrollToTop}
            className="fixed bottom-20 right-6 h-11 w-11 rounded-full cursor-pointer bg-slate-900 border border-emerald-500/35 hover:border-amber-400 text-slate-200 hover:text-amber-400 flex items-center justify-center shadow-lg hover:shadow-amber-500/10 transition-colors z-40 focus:outline-none"
            title="Kembali ke Atas"
          >
            <ChevronUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
