import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, MapPin } from 'lucide-react'
import { api, mediaUrl } from '../lib/api'
import { useCollection } from '../lib/useCollection'
import { EmptyState } from '../components/Loader'
import Reveal from '../components/Reveal'

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const { data: posts } = useCollection('/posts')

  useEffect(() => {
    window.scrollTo({ top: 0 })
    setLoading(true)
    setFailed(false)
    api
      .get(`/posts/${slug}`)
      .then((res) => setPost(res.data))
      .catch(() => setFailed(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="container-x py-32"><div className="h-72 animate-pulse rounded-3xl bg-shell" /></div>

  if (failed || !post) {
    return (
      <div className="container-x py-32">
        <EmptyState
          title="That story isn't published"
          hint="It may have been renamed. Browse the current destination guides instead."
          action={<Link to="/blog" className="btn-primary mt-2">All destinations</Link>}
        />
      </div>
    )
  }

  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 3)
  const date = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

  return (
    <>
      <div className="relative h-[58vh] min-h-[360px] overflow-hidden">
        <img src={mediaUrl(post.coverImage)} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/30" />
        <div className="container-x relative flex h-full flex-col justify-end pb-12 text-white">
          <p className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.2em] text-mango">
            {post.district && <span className="flex items-center gap-1.5"><MapPin size={13} /> {post.district}</span>}
            {date && <span className="flex items-center gap-1.5"><CalendarDays size={13} /> {date}</span>}
          </p>
          <h1 className="mt-3 max-w-3xl text-[clamp(2.2rem,6vw,3.8rem)] font-semibold leading-tight">{post.title}</h1>
        </div>
      </div>

      <article className="container-x grid gap-12 py-16 lg:grid-cols-[1fr,300px]">
        <Reveal className="max-w-2xl">
          <p className="text-lg leading-relaxed text-ink/80">{post.excerpt}</p>
          <div className="mt-8 space-y-5 leading-relaxed text-ink/75">
            {(post.content || '').split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {post.gallery?.length > 1 && (
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {post.gallery.map((img, i) => (
                <img key={i} src={mediaUrl(img)} alt="" className="w-full rounded-2xl object-cover shadow-card" />
              ))}
            </div>
          )}

          <Link to="/blog" className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-leaf">
            <ArrowLeft size={16} /> All destinations
          </Link>
        </Reveal>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="card p-6">
            <h2 className="text-lg">Visit this with us</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/65">
              {post.bestTime ? `Best time to go: ${post.bestTime}. ` : ''}
              We'll build it into a route that fits the rest of your trip.
            </p>
            <Link to="/contact" className="btn-primary mt-4 w-full">Ask about this trip</Link>
          </div>

          {more.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg">More destinations</h2>
              <ul className="mt-4 space-y-4">
                {more.map((p) => (
                  <li key={p.id}>
                    <Link to={`/blog/${p.slug}`} className="flex items-center gap-3 group">
                      <img src={mediaUrl(p.coverImage)} alt="" className="h-14 w-16 rounded-xl object-cover" />
                      <span>
                        <span className="block text-sm font-semibold group-hover:text-leaf">{p.title}</span>
                        <span className="block text-xs text-ink/50">{p.district}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </article>
    </>
  )
}
