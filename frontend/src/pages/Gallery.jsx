import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../components/PageHeader'
import Lightbox from '../components/Lightbox'
import { CardSkeleton, EmptyState } from '../components/Loader'
import { useCollection } from '../lib/useCollection'
import { mediaUrl } from '../lib/api'

export default function Gallery() {
  const { data: photos, loading } = useCollection('/gallery')
  const [album, setAlbum] = useState('All')
  const [openIndex, setOpenIndex] = useState(null)

  const albums = useMemo(
    () => ['All', ...Array.from(new Set(photos.map((p) => p.album).filter(Boolean)))],
    [photos],
  )
  const shown = album === 'All' ? photos : photos.filter((p) => p.album === album)

  return (
    <>
      <PageHeader
        title="Image gallery"
        subtitle="Smiles and memories from travellers we have driven around the island."
        image="/images/gallery-6.svg"
        crumbs={['Gallery']}
      />

      <section className="container-x py-16">
        <div className="flex flex-wrap justify-center gap-2">
          {albums.map((a) => (
            <button
              key={a}
              onClick={() => setAlbum(a)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                album === a ? 'bg-leaf text-white shadow-card' : 'bg-white text-ink/65 hover:text-ink'
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        <div className="mt-12">
          {loading ? (
            <CardSkeleton count={6} />
          ) : shown.length === 0 ? (
            <EmptyState title="No photos in this album yet" hint="New pictures are added after every trip." />
          ) : (
            <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
              {shown.map((photo, i) => (
                <motion.button
                  key={photo.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
                  onClick={() => setOpenIndex(i)}
                  className="group relative block w-full overflow-hidden rounded-3xl shadow-card"
                >
                  <img
                    src={mediaUrl(photo.url)}
                    alt={photo.caption || ''}
                    loading="lazy"
                    className="w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                  {photo.caption && (
                    <span className="absolute inset-x-0 bottom-0 p-5 text-left text-sm text-white opacity-0 transition group-hover:opacity-100">
                      {photo.caption}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </section>

      <Lightbox
        images={shown}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onPrev={() => setOpenIndex((i) => (i === null ? i : (i - 1 + shown.length) % shown.length))}
        onNext={() => setOpenIndex((i) => (i === null ? i : (i + 1) % shown.length))}
      />
    </>
  )
}
