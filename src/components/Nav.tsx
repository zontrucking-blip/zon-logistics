import Image from "next/image";

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-[#253344]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Zonport"
            width={140}
            height={36}
            className="h-9 w-auto object-contain"
            priority
          />
        </a>

        <a
          href="#get-toolkit"
          className="bg-[#D1B66B] hover:bg-[#B29B5B] text-[#253344] font-bold text-sm px-5 py-2.5 rounded-lg transition-colors"
        >
          Get the free toolkit →
        </a>
      </div>
    </nav>
  );
}
