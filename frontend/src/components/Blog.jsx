import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Search } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { CardSkeleton, EmptyState } from '../components/Loader'
import { useCollection } from '../lib/useCollection'
import { mediaUrl } from '../lib/api'

export default function Blog() {
  const { data: posts, loading } = useCollection('/posts')
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return posts
    return posts.filter((p) =>
      [p.title, p.district, p.excerpt].filter(Boolean).some((v) => v.toLowerCase().includes(q)),
    )
  }, [posts, query])

  return (
    <>
      <PageHeader
        title="Destinations"
        subtitle="Guides to the places our guests ask about most, with the timings that actually matter."
        image="/images/places/galle-fort.jpg"
        crumbs={['Destinations']}
      />

      <section className="container-x py-16">
        <div className="mx-auto flex max-w-md items-center gap-3 rounded-full border border-ink/12 bg-white px-5 py-3 shadow-card">
          <Search size={18} className="text-ink/40" />
          <input
            className="w-full bg-transparent text-sm outline-none placeholder:text-ink/35"
            placeholder="Search a place — Ella, safari, beach…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search destinations"
          />
        </div>

        <div className="mt-12">
          {loading ? (
            <CardSkeleton count={6} />
          ) : results.length === 0 ? (
            <EmptyState
              title="No destination matches that search"
              hint="Try a district name like Kandy or Badulla, or clear the search to see everything."
            />
          ) : (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                  className="card group flex flex-col overflow-hidden transition hover:-translate-y-1.5 hover:shadow-lift"
                >
                  <Link to={`/blog/${post.slug}`} className="block overflow-hidden">
                    <img
                      src={mediaUrl(post.coverImage)}
                      alt={post.title}
                      loading="lazy"
                      className="h-56 w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-leaf">
                      <MapPin size={13} /> {post.district || post.category}
                    </p>
                    <h2 className="mt-2 text-2xl leading-snug">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/65">{post.excerpt}</p>
                    {post.bestTime && (
                      <p className="mt-4 text-xs text-ink/45">Best time · {post.bestTime}</p>
                    )}
                    <Link to={`/blog/${post.slug}`} className="mt-4 text-sm font-semibold text-leaf">
                      Continue reading →
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
