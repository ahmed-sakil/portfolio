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
        <div className="w-10 h-10 border-4 border-teal-400/20 border-t-teal-400 rounded-full animate-spin mb-4" />
        <span className="text-lg font-medium text-teal-400">Loading Article...</span>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h2 className="text-3xl font-bold text-red-400 mb-4">Blog Post Not Found</h2>
        <Link to="/" className="admin-btn-primary">
          <ArrowLeft className="w-4 h-4 mr-2" /> Return to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 relative" style={{ color: 'var(--text-primary)', zIndex: 1 }}>
      
      {/* Floating Glass Navbar (85-90% width) */}
      <header className="sticky top-4 z-50 w-[90%] max-w-5xl mx-auto mb-10">
        <nav className="glass rounded-2xl px-6 py-4 flex items-center justify-between border border-white/10 shadow-xl">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-semibold transition-colors"
            style={{ color: 'var(--accent)' }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Portfolio
          </Link>
          <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>
            Article
          </span>
        </nav>
      </header>

      {/* Main Blog Article (85-90% width, Glass Background) */}
      <article className="w-[90%] max-w-5xl mx-auto">
        <div className="glass rounded-3xl p-8 md:p-14 shadow-2xl">
          
          {blog.cover_image_url && (
            <div className="rounded-2xl overflow-hidden aspect-video max-h-[460px] w-full mb-10 border border-white/10">
              <img
                src={blog.cover_image_url}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <header className="mb-10 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-400/10 border border-teal-400/20 text-teal-400 text-xs font-semibold mb-4">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(blog.published_at).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
              {blog.title}
            </h1>
          </header>

          <div
            className="whitespace-pre-wrap font-sans text-base md:text-lg leading-relaxed max-w-3xl mx-auto pt-8 border-t border-white/10"
            style={{ color: 'var(--text-secondary)' }}
          >
            {blog.content}
          </div>

          <div className="mt-14 pt-8 border-t border-white/10 text-center">
            <Link to="/" className="admin-btn-secondary">
              <ArrowLeft className="w-4 h-4" /> Back to Portfolio
            </Link>
          </div>

        </div>
      </article>

    </div>
  );
};

export default BlogPost;
