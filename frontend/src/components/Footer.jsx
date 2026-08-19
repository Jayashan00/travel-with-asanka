import { Link } from 'react-router-dom'
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  MessageCircle,
} from 'lucide-react'
import { useSite } from '../lib/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 bg-ink text-white/75">
      <div className="container-x grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-2xl text-white">
            {settings?.brandName || 'Denoah Lanka Holidays'}
          </p>

          <p className="mt-3 max-w-sm text-sm leading-relaxed">
            {settings?.tagline || 'Travel With Shan around Sri Lanka.'}{' '}
            Based in Kandy, driving the whole island.
          </p>

          <div className="mt-6 flex gap-3">
            {[
              {
                href: settings?.facebookUrl,
                Icon: Facebook,
                label: 'Facebook',
              },
              {
                href: settings?.instagramUrl,
                Icon: Instagram,
                label: 'Instagram',
              },
              {
                href: `mailto:${
                  settings?.contactEmail || 'travelwithshankandy@gmail.com'
                }`,
                Icon: Mail,
                label: 'Email',
              },
              {
                href: `https://wa.me/${settings?.whatsapp || '94764412050'}`,
                Icon: MessageCircle,
                label: 'WhatsApp',
              },
            ]
              .filter((s) => s.href)
              .map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/20 transition hover:border-mango hover:text-mango"
                >
                  <Icon size={17} />
                </a>
              ))}
          </div>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-mango">
            Explore
          </p>

          <ul className="space-y-2 text-sm">
            {[
              ['/tours', 'Tour packages'],
              ['/vehicles', 'Vehicles & tariffs'],
              ['/blog', 'Destinations'],
              ['/gallery', 'Gallery'],
              ['/reviews', 'Reviews'],
              ['/about', 'About us'],
              ['/contact', 'Contact'],
            ].map(([to, label]) => (
              <li key={to}>
                <Link
                  to={to}
                  className="transition hover:text-mango"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-mango">
            Get in touch
          </p>

          <ul className="space-y-3 text-sm">
            <li className="flex gap-2">
              <MapPin
                size={16}
                className="mt-0.5 shrink-0 text-mango"
              />
              {settings?.contactAddress || 'Peradeniya, Kandy, Sri Lanka'}
            </li>

            <li className="flex gap-2">
              <Phone
                size={16}
                className="mt-0.5 shrink-0 text-mango"
              />

              <a
                href={`tel:${(
                  settings?.contactPhone || '+94764412050'
                ).replace(/\s/g, '')}`}
                className="hover:text-mango"
              >
                {settings?.contactPhone || '+94 76 441 2050'}
              </a>
            </li>

            <li className="flex gap-2">
              <Mail
                size={16}
                className="mt-0.5 shrink-0 text-mango"
              />

              <a
                href={`mailto:${
                  settings?.contactEmail || 'travelwithshankandy@gmail.com'
                }`}
                className="hover:text-mango"
              >
                {settings?.contactEmail || 'travelwithshankandy@gmail.com'}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="container-x flex flex-col items-center justify-between gap-2 text-xs sm:flex-row">
          <p>
            © {year}{' '}
            {settings?.brandName || 'Denoah Lanka Holidays'}. All rights
            reserved.
          </p>

          <Link
            to="/admin"
            className="transition hover:text-mango"
          >
            Site admin
          </Link>
        </div>
      </div>
    </footer>
  )
}