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
      <header className="sticky top-3 sm:top-4 z-50 w-[94%] sm:w-[90%] max-w-7xl mx-auto mb-6 sm:mb-10">
        <nav className="glass-panel rounded-2xl px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border border-white/10 shadow-xl">
          <Link
            to="/"
            className="inline-flex items-center text-xs sm:text-sm font-semibold transition-colors hover:opacity-80"
            style={{ color: 'var(--accent)' }}
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 shrink-0" /> Back to Portfolio
          </Link>
          <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold truncate ml-2" style={{ color: 'var(--text-muted)' }}>
            All Articles Archive
          </span>
        </nav>
      </header>

      {/* Main Container */}
      <main className="w-[94%] sm:w-[90%] max-w-7xl mx-auto">
        <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-14 mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-white/10">
            <div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-2 sm:mb-3" style={{ color: 'var(--text-primary)' }}>
                All <span style={{ color: 'var(--accent)' }}>Articles</span>
              </h1>
              <p className="text-xs sm:text-base leading-relaxed max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
                Engineering write-ups, deep dives, architectural guides, and programming tutorials.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}
                className="w-full pl-10 pr-8 py-2.5 rounded-xl text-base sm:text-sm border border-white/10 placeholder-gray-500 focus:outline-none focus:border-accent transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ color: 'var(--text-muted)' }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80 text-xs cursor-pointer"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="py-24 text-center">
              <div
                className="w-10 h-10 border-4 rounded-full animate-spin mx-auto mb-4"
                style={{ borderColor: 'var(--accent-dim)', borderTopColor: 'var(--accent)' }}
              />
              <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>Loading all articles...</span>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="py-20 text-center text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
              No articles found matching "{searchQuery}".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 pt-6 sm:pt-8">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="rounded-2xl border border-white/10 overflow-hidden flex flex-col group hover:border-accent hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-300"
                  style={{ backgroundColor: 'var(--bg-surface)' }}
                >
                  {blog.cover_image_url && (
                    <div className="overflow-hidden aspect-video relative" style={{ backgroundColor: 'var(--bg-base)' }}>
                      <img
                        src={blog.cover_image_url}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                  )}

                  <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] sm:text-xs font-mono mb-1.5 sm:mb-2 block" style={{ color: 'var(--accent)' }}>
                        {new Date(blog.published_at || blog.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <h2
                        className="text-lg sm:text-xl font-bold mb-2 group-hover:text-accent transition"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {blog.title}
                      </h2>
                      <p className="text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
                        {blog.excerpt || blog.content?.replace(/[#*`_>]/g, '')}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <Link
                        to={`/blog/${blog.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold hover:opacity-80 transition"
                        style={{ color: 'var(--accent)' }}
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
