import Header from "@/components/Header";
import Footer from "@/components/Footer";
import blogs from "@/data/blogs.json";
import Image from "next/image";

export default function BlogPage() {
  return (
    <main className="page-glow min-h-dv flex flex-col">
      <Header />

      <section className="container-edge mt-10 copy mb-10">
        <h1 className="text-3xl font-semibold">Blogs</h1>
        <p className="mt-2 text-white/70">
          Insights, tutorials, and thoughts on full-stack development.
        </p>

        <div className="mt-8 grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogs
            .filter((b) => b.published)
            .map((blog) => (
              <a
                key={blog.id}
                href={blog.url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group card overflow-hidden flex flex-col
                  transform-gpu
                  md:hover:scale-[1.02] md:transition-transform
                  /* lighten weight on mobile to avoid jank */
                  backdrop-blur-none shadow-none
                  md:backdrop-blur-md md:shadow-lg
                  /* only render when near viewport */
                  [content-visibility:auto] [contain-intrinsic-size:300px]
                "
              >
                {/* Cover */}
                <div className="relative h-36 sm:h-40 w-full">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover"
                    priority={false}
                    loading="lazy"
                    decoding="async"
                    placeholder={blog.blur ? "blur" : undefined}
                    blurDataURL={blog.blur}
                    sizes="(max-width: 640px) 100vw,
                          (max-width: 1024px) 50vw,
                          33vw"
                    // Optional: hint lower network priority for scrolled lists
                    fetchPriority="low"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-4 sm:p-5">
                  <h3 className="text-lg font-semibold md:group-hover:underline">
                    {blog.title}
                  </h3>
                  <p className="mt-2 text-sm text-white/80 line-clamp-2">
                    {blog.description}
                  </p>

                  {/* Meta */}
                  <div className="mt-4 flex items-center gap-3 text-xs text-white/70">
                    <div className="flex flex-col">
                      <span className="font-medium text-white/90">
                        {blog.author}
                      </span>
                      <span>
                        {new Date(blog.createdDate).toLocaleDateString()} · {blog.readingTime}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {blog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="badge bg-[rgb(var(--accentAlt))] text-black"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}