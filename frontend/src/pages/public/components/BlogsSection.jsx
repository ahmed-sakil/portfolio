import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { sortItemsBySlot } from '../../../utils/sortHelper';

const BlogsSection = ({ blogs = [] }) => {
  // Sort with slots first (Slot 1, 2, 3...) and unslotted at the end
  const sortedBlogs = useMemo(() => sortItemsBySlot(blogs), [blogs]);

  if (!sortedBlogs || sortedBlogs.length === 0) return null;

  return (
    <section id="blogs" className="w-[92%] sm:w-[90%] max-w-7xl mx-auto mb-20 sm:mb-28 md:mb-36 scroll-mt-28">
      <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-14 relative overflow-hidden">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-14">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-2 sm:mb-3">
            Latest <span style={{ color: 'var(--accent)' }}>Articles</span>
          </h2>
          <p className="text-xs sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Thoughts, tutorials, and engineering write-ups.
          </p>
        </div>

        {/* Featured Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {sortedBlogs.map((blog) => (
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
              <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] sm:text-xs font-mono text-teal-400 mb-1.5 sm:mb-2 block">
                    {new Date(blog.published_at || blog.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-teal-300 transition">
                    {blog.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
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

        {/* Short View All Button linking to dedicated /blogs page */}
        <div className="mt-10 flex justify-center">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 border border-teal-400/40 bg-teal-400/10 text-teal-300 hover:bg-teal-400 hover:text-black hover:shadow-[0_0_20px_rgba(0,229,160,0.4)]"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogsSection;
