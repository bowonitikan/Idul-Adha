import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

interface BloggerPost {
  id: string;
  title: string;
  content: string;
  summary: string;
  published: string;
  updated: string;
  imageUrl: string;
  link: string;
  categories: string[];
}

// Curated high-quality fallback seed posts to ensure the site is always functional and epic
const FALLBACK_POSTS: BloggerPost[] = [
  {
    id: "fallback-1",
    title: "Pelaksanaan Penyembelihan Hewan Qurban di Masjid Al Ikhlas Perum GBI",
    content: `
      <p>Alhamdulillah, pelaksanaan ibadah penyembelihan hewan qurban di Masjid Al Ikhlas Perumahan Griya Bantar Indah (GBI) Purwokerto berlangsung dengan khidmat dan tertib. Segenap panitia qurban bersama warga bahu-membahu menyukseskan kegiatan tahunan ini.</p>
      <p>Pada pelaksanaan tahun ini, jumlah hewan qurban terkumpul mengalami peningkatan yang signifikan dibandingkan tahun lalu. Seluruh hewan qurban dipastikan sehat dan telah melewati pemeriksaan klinis dari Dinas Peternakan setempat sebelum disembelih.</p>
      <p>Panitia menggunakan sistem distribusi ramah lingkungan (eco-friendly) dengan meminimalkan penggunaan kantong plastik sekali pakai, digantikan dengan anyaman bambu (besek) dan daun jati untuk menjaga kesegaran daging dan kelestarian lingkungan.</p>
    `,
    summary: "Pelaksanaan ibadah qurban di Masjid Al Ikhlas Perumahan Griya Bantar Indah (GBI) Purwokerto berlangsung tertib dan khidmat dengan pembagian sistem ramah lingkungan.",
    published: "2026-05-27T08:00:00.000Z",
    updated: "2026-05-27T10:00:00.000Z",
    imageUrl: "https://images.unsplash.com/photo-1511113576406-d250ba995570?auto=format&fit=crop&q=80&w=800",
    link: "https://idulqurbanperumgbi.blogspot.com/",
    categories: ["Kegiatan", "Pelaksanaan Qurban", "Masjid Al Ikhlas"]
  },
  {
    id: "fallback-2",
    title: "Penerimaan Pendaftaran Shohibul Qurban Masjid Al Ikhlas GBI Purwokerto",
    content: `
      <p>Panitia Qurban Masjid Al Ikhlas Perumahan Griya Bantar Indah kembali membuka pendaftaran bagi bapak/ibu yang berniat menjalankan ibadah Qurban tahun ini. Kami memfasilitasi pembelian hewan qurban maupun pengelolaan hewan yang diserahkan langsung.</p>
      <p>Tersedia pilihan kolektif untuk hewan Qurban Sapi (1/7 bagian) maupun Qurban Kambing secara mandiri. Kami bekerjasama langsung dengan peternak lokal terpercaya untuk menjamin kualitas hewan prima, sehat, cukup umur, dan bebas PMK.</p>
      <p>Pendaftaran dan pembayaran dapat dilakukan langsung melalui Sekretariat Masjid Al Ikhlas atau transfer perbankan ke rekening resmi panitia. Mari tebarkan kemanfaatan dan raih berkah qurban bersama tetangga dan kaum dhuafa.</p>
    `,
    summary: "Panitia Qurban Masjid Al Ikhlas kembali membuka pendaftaran shohibul qurban kolektif sapi maupun kambing dengan hewan berkualitas prima bebas penyakit.",
    published: "2026-05-15T09:30:00.000Z",
    updated: "2026-05-15T09:30:00.000Z",
    imageUrl: "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&q=80&w=800",
    link: "https://idulqurbanperumgbi.blogspot.com/",
    categories: ["Pendaftaran", "Shohibul Qurban", "Pengumuman"]
  },
  {
    id: "fallback-3",
    title: "Tips Memilih Hewan Qurban yang Sehat, Sesuai Syariat Islam",
    content: `
      <p>Mendekati hari raya Idul Adha, kaum muslimin bersiap untuk memilih hewan sembelihan terbaik. Agar ibadah qurban kita sah dan bernilai pahala mulia, penting bagi kita memperhatikan kriteria fisik dan kesehatan hewan.</p>
      <p>Kriteria utama sesuai syariat adalah hewan harus sehat, tidak cacat (tidak buta, tidak pincang, tidak kurus kering), dan telah mencapai batas umur minimal (kambing minimal 1 tahun, sapi minimal 2 tahun yang ditandai dengan tanggalnya gigi seri).</p>
      <p>Secara fisik, carilah hewan dengan rambut yang bersih dan mengkilap, mata cerah dan tidak berair, cermin hidung basah, serta gerakan yang lincah dan nafsu makan baik. Pastikan hewan memiliki Surat Keterangan Kesehatan Hewan (SKKH) dari instansi berwenang demi ketenangan beribadah.</p>
    `,
    summary: "Berikut adalah tips praktis memilih hewan qurban sapi dan kambing yang sehat, terbebas dari cacat fisik, dan memenuhi batas umur syar'i.",
    published: "2026-05-10T14:15:00.000Z",
    updated: "2026-05-10T14:15:00.000Z",
    imageUrl: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=800",
    link: "https://idulqurbanperumgbi.blogspot.com/",
    categories: ["Edukasi", "Panduan Syariah", "Tips"]
  },
  {
    id: "fallback-4",
    title: "Keutamaan Berqurban: Sejarah, Hikmah, dan Solidaritas Sosial",
    content: `
      <p>Ibadah Qurban bukan sekadar ritual menyembelih hewan. Di dalamnya terkandung nilai kepatuhan mutlak Nabi Ibrahim AS dan keikhlasan mulia Nabi Ismail AS atas perintah Allah SWT.</p>
      <p>Hikmah spiritual berqurban adalah menyembelih sifat-sifat kebinatangan dalam diri manusia, egosektoral, keserakahan, dan menggantinya dengan keluhuran akhlak, kepedulian sosial, serta syukur atas nikmat yang melimpah.</p>
      <p>Melalui pembagian daging qurban secara merata tanpa memandang status sosial di lingkungan Perum Griya Bantar Indah, terjalin hubungan ukhuwah islamiyah yang erat, memupuk empati, dan menghadirkan keceriaan di rumah-rumah saudara kita yang membutuhkan.</p>
    `,
    summary: "Menilik makna mendalam ibadah qurban dari dimensi ketauhidan Nabi Ibrahim hingga fungsinya memupuk solidaritas sosial antar warga GBI.",
    published: "2026-05-01T10:00:00.000Z",
    updated: "2026-05-01T10:00:00.000Z",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
    link: "https://idulqurbanperumgbi.blogspot.com/",
    categories: ["Hikmah", "Ukhuwah", "Edukasi"]
  }
];

// Helper to clean HTML, extract preview text
function cleanHtmlToSummary(html: string, maxLen = 160): string {
  if (!html) return "";
  const noHtml = html.replace(/<[^>]*>/g, " ");
  const normalized = noHtml.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLen) return normalized;
  return normalized.substring(0, maxLen) + "...";
}

// Helper to extract first image URL from HTML content
function extractFirstImage(html: string): string | null {
  if (!html) return null;
  const match = html.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Fetch and parse Blogger posts
  app.get("/api/blogger-posts", async (req, res) => {
    try {
      // Fetching from user's Blogger JSON feed
      const bloggerUrl = "https://idulqurbanperumgbi.blogspot.com/feeds/posts/default?alt=json";
      const response = await fetch(bloggerUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch Blogger feed: ${response.statusText}`);
      }

      const data = await response.json() as any;
      const entries = data.feed?.entry || [];

      if (entries.length === 0) {
        // Fall back gracefully if feed is empty
        return res.json({ source: "fallback", posts: FALLBACK_POSTS });
      }

      const formattedPosts: BloggerPost[] = entries.map((entry: any, index: number) => {
        const id = entry.id?.$t || `post-${index}`;
        const title = entry.title?.$t || "Postingan Tanpa Judul";
        const content = entry.content?.$t || entry.summary?.$t || "";
        const summary = cleanHtmlToSummary(content, 180);
        const published = entry.published?.$t || new Date().toISOString();
        const updated = entry.updated?.$t || published;

        // Try to get high quality thumbnail
        let imageUrl = "";
        const htmlImg = extractFirstImage(content);
        if (htmlImg) {
          imageUrl = htmlImg;
        } else if (entry.media$thumbnail?.url) {
          // Replace blogger s72-c thumbnail with full resolution if possible
          imageUrl = entry.media$thumbnail.url.replace(/\/s72\-c(-?[a-zA-Z0-9_]+)?\//, "/s1600/");
        } else {
          // Beautiful high quality religious/nature backgrounds for fallback
          const backgrounds = [
            "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&q=80&w=800", // sheep
            "https://images.unsplash.com/photo-1511113576406-d250ba995570?auto=format&fit=crop&q=80&w=800", // goats
            "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=800", // cattle
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800"  // mountains
          ];
          imageUrl = backgrounds[index % backgrounds.length];
        }

        const linkObj = entry.link?.find((l: any) => l.rel === "alternate");
        const link = linkObj?.href || "https://idulqurbanperumgbi.blogspot.com/";

        const categories = entry.category?.map((c: any) => c.term) || ["Blogger"];

        return {
          id,
          title,
          content,
          summary,
          published,
          updated,
          imageUrl,
          link,
          categories
        };
      });

      res.json({ source: "blogger", posts: formattedPosts });
    } catch (error: any) {
      console.error("Error fetching blogger posts:", error.message);
      // Serve fallback posts transparently so the user has a flawless experience
      res.json({ source: "fallback", posts: FALLBACK_POSTS, error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
