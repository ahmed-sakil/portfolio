import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { ArrowLeft, Search } from 'lucide-react';
import SmoothScroll from '../../components/SmoothScroll';
import { sortItemsBySlot } from '../../utils/sortHelper';
import { updatePageMeta } from '../../utils/pageMeta';

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    updatePageMeta({ title: 'Articles & Publications | Sakil Ahmed' });

    const fetchBlogs = async () => {
      try {
        const res = await api.get('/blogs');
        setBlogs(res.data);
      } catch (err) {
        console.error('Error fetching all blogs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Ensure sorted by slot with unslotted items placed at the end
  const sortedBlogs = useMemo(() => sortItemsBySlot(blogs), [blogs]);

  // Filter blogs by search query
  const filteredBlogs = useMemo(() => {
    if (!searchQuery.trim()) return sortedBlogs;
    const q = searchQuery.toLowerCase();
    return sortedBlogs.filter(
      (b) =>
        b.title?.toLowerCase().includes(q) ||
        b.content?.toLowerCase().includes(q) ||
        b.slug?.toLowerCase().includes(q)
    );
  }, [sortedBlogs, searchQuery]);

  return (
    <div className="min-h-screen pb-24 relative" style={{ color: 'var(--text-primary)', zIndex: 1 }}>
      <SmoothScroll />

      {/* Floating Header */}
      <header className="sticky top-4 z-50 w-[90%] max-w-7xl mx-auto mb-10">
        <nav className="glass-panel rounded-2xl px-6 py-4 flex items-center justify-between border border-white/10 shadow-xl">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-semibold transition-colors hover:opacity-80"
            style={{ color: 'var(--accent)' }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Portfolio
          </Link>
          <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>
            All Articles Archive
          </span>
        </nav>
      </header>

      {/* Main Container */}
      <main className="w-[90%] max-w-7xl mx-auto">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 md:p-14 mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
                All <span style={{ color: 'var(--accent)' }}>Articles</span>
              </h1>
              <p className="text-sm sm:text-base leading-relaxed max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
                Engineering write-ups, deep dives, architectural guides, and programming tutorials.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs cursor-pointer"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="py-24 text-center">
              <div className="w-10 h-10 border-4 border-teal-400/20 border-t-teal-400 rounded-full animate-spin mx-auto mb-4" />
              <span className="text-sm text-teal-400 font-medium">Loading all articles...</span>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="py-20 text-center" style={{ color: 'var(--text-muted)' }}>
              No articles found matching "{searchQuery}".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="rounded-2xl border border-white/10 overflow-hidden flex flex-col group hover:border-teal-400/50 hover:shadow-[0_0_20px_rgba(0,229,160,0.18)] transition-all duration-300"
                  style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                >
                  {blog.cover_image_url && (
                    <div className="overflow-hidden aspect-video relative">
                      <img
                        src={blog.cover_image_url}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-mono text-teal-400 mb-2 block">
                        {new Date(blog.published_at || blog.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <h2 className="text-xl font-bold text-white mb-2 group-hover:text-teal-300 transition">
                        {blog.title}
                      </h2>
                      <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
                        {blog.content?.replace(/[#*`_>]/g, '')}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <Link
                        to={`/blog/${blog.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-400 hover:text-teal-300 transition"
                      >
                        Read Article &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AllBlogs;
