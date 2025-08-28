export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 py-10">
      <div className="container-edge flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm/6 text-white/70">
          © {new Date().getFullYear()} Jitendra Kumar Tiwari.
        </p>

        <div className="flex gap-3 text-sm">
          <a
            className="badge hover:bg-white/20"
            href="https://github.com/jkjitendra"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>

          <a
            className="badge hover:bg-white/20"
            href="https://www.linkedin.com/in/jitendra-tiwari-004943182"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>

          <a
            className="badge hover:bg-white/20"
            href="mailto:jitendrakumartiwari849@gmail.com"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}