import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { ArrowLeft, Calendar } from 'lucide-react';
import { updatePageMeta } from '../../utils/pageMeta';

const BlogPost = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs/${slug}`);
        setBlog(res.data);
        if (res.data?.title) {
          updatePageMeta({ title: `${res.data.title} | Sakil Ahmed` });
        }
      } catch (err) { 
        console.error(err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div
          className="w-10 h-10 border-4 rounded-full animate-spin mb-4"
          style={{ borderColor: 'var(--accent-dim)', borderTopColor: 'var(--accent)' }}
        />
        <span className="text-lg font-medium" style={{ color: 'var(--accent)' }}>Loading Article...</span>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Blog Post Not Found</h2>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs transition"
          style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverted)' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Return to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 relative" style={{ color: 'var(--text-primary)', zIndex: 1 }}>
      
      {/* Floating Glass Navbar */}
      <header className="sticky top-3 sm:top-4 z-50 w-[94%] sm:w-[90%] max-w-5xl mx-auto mb-6 sm:mb-10">
        <nav className="glass-panel rounded-2xl px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border border-white/10 shadow-xl">
          <Link
            to="/#blogs"
            className="inline-flex items-center text-xs sm:text-sm font-semibold transition-colors active:scale-95 min-h-[36px]"
            style={{ color: 'var(--accent)' }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Portfolio
          </Link>
          <span className="text-[11px] sm:text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>
            Article
          </span>
        </nav>
      </header>

      {/* Main Blog Article */}
      <article className="w-[94%] sm:w-[90%] max-w-5xl mx-auto">
        <div
          className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-14 shadow-2xl border border-white/10"
          style={{ backgroundColor: 'var(--bg-surface)' }}
        >
          
          {blog.cover_image_url && (
            <div className="rounded-xl sm:rounded-2xl overflow-hidden aspect-video max-h-[460px] w-full mb-6 sm:mb-10 border border-white/10" style={{ backgroundColor: 'var(--bg-base)' }}>
              <img
                src={blog.cover_image_url}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <header className="mb-6 sm:mb-10 text-center max-w-3xl mx-auto">
            <div
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold mb-3 sm:mb-4 border"
              style={{
                borderColor: 'var(--accent-dim)',
                backgroundColor: 'var(--accent-dim)',
                color: 'var(--accent)'
              }}
            >
              <Calendar className="w-3.5 h-3.5" />
              {new Date(blog.published_at).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black leading-tight mb-4 tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {blog.title}
            </h1>
          </header>

          <div
            className="whitespace-pre-wrap font-sans text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto pt-6 sm:pt-8 border-t border-white/10 break-words"
            style={{ color: 'var(--text-secondary)' }}
          >
            {blog.content}
          </div>

          <div className="mt-8 sm:mt-14 pt-6 sm:pt-8 border-t border-white/10 text-center">
            <Link
              to="/#blogs"
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-white/10 bg-white/5 hover:bg-white/10 active:scale-95 transition"
              style={{ color: 'var(--text-primary)' }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Portfolio
            </Link>
          </div>

        </div>
      </article>

    </div>
  );
};

export default BlogPost;
