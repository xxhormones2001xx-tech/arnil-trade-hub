import { createFileRoute } from "@tanstack/react-router";

// TODO: replace with your project URL once a project name or custom domain is set.
const BASE_URL = "";

const paths = ["/", "/investing", "/trading", "/markets", "/pricing", "/about", "/contact", "/faq", "/login", "/open-account"];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = paths.map((p) => `  <url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq></url>`).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
