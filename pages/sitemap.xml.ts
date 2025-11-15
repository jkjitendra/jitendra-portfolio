import { GetServerSideProps } from "next";

const BASE_URL = "https://www.jkjitendra.in";

function generateSiteMap(pages: string[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${pages
       .map((page) => {
         return `
       <url>
           <loc>${BASE_URL}${page}</loc>
           <lastmod>${new Date().toISOString()}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>${page === "/" ? "1.0" : "0.8"}</priority>
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // Add routes you want in sitemap
  const staticPages = ["/", "/blogs", "/jitendra_resume.pdf", "/tech-radar"];

  const sitemap = generateSiteMap(staticPages);

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

// This page itself doesn’t render anything
export default function SiteMap() {
  return null;
}