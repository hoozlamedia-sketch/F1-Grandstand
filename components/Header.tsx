import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  };

  return (
    <header className="bg-black border-b border-neutral-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo + Title */}
        <Link href="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="F1 Grandstand Logo" className="h-10 w-10" />
          <span className="text-xl font-bold text-yellow-500">F1 Grandstand</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex space-x-6 text-white">
          <Link href="/news" className="hover:text-yellow-400">News</Link>
          <Link href="/videos" className="hover:text-yellow-400">Videos</Link>
          <Link href="/about" className="hover:text-yellow-400">About</Link>
        </nav>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search F1..."
            className="px-3 py-1 rounded-l bg-neutral-900 text-white border border-neutral-700 focus:outline-none"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-yellow-500 text-black rounded-r font-semibold hover:bg-yellow-400"
          >
            🔍
          </button>
        </form>
      </div>
    </header>
  );
}
