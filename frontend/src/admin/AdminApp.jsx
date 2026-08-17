import { useEffect, useState } from 'react'
import { Link, Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import {
  CalendarCheck, Car, ExternalLink, Images, LayoutDashboard, LogOut, Mail,
  MapPinned, MessageSquareQuote, Settings, Sparkles, Menu, X,
} from 'lucide-react'
import { api, auth } from '../lib/api'
import Toast from '../components/Toast'
import Login from './Login'
import Dashboard from './Dashboard'
import SettingsEditor from './SettingsEditor'
import CrudManager from './CrudManager'
import Inbox from './Inbox'
import Bookings from './Bookings'

const nav = [
  { to: '/admin', label: 'Overview', Icon: LayoutDashboard, end: true },
  { to: '/admin/bookings', label: 'Bookings', Icon: CalendarCheck },
  { to: '/admin/messages', label: 'Messages', Icon: Mail },
  { to: '/admin/settings', label: 'Site content', Icon: Settings },
  { to: '/admin/vehicles', label: 'Vehicles', Icon: Car },
  { to: '/admin/posts', label: 'Destinations', Icon: MapPinned },
  { to: '/admin/gallery', label: 'Gallery', Icon: Images },
  { to: '/admin/testimonials', label: 'Reviews', Icon: MessageSquareQuote },
  { to: '/admin/services', label: 'Services', Icon: Sparkles },
]

export default function AdminApp() {
  const [ready, setReady] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const [toast, setToast] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!auth.token) {
      setReady(true)
      return
    }
    api
      .get('/admin/auth/me')
      .then(() => setSignedIn(true))
      .catch(() => auth.clear())
      .finally(() => setReady(true))
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const id = setTimeout(() => setToast(null), 4200)
    return () => clearTimeout(id)
  }, [toast])

  const notify = (t) => setToast(t)

  const signOut = () => {
    auth.clear()
    setSignedIn(false)
    navigate('/admin/login')
  }

  if (!ready) return <div className="grid min-h-screen place-items-center bg-sand text-ink/50">Loading…</div>

  if (!signedIn) {
    return (
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    )
  }

  return (
    <div className="min-h-screen bg-sand">
      <div className="mx-auto flex max-w-[1400px]">
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 bg-ink px-4 py-6 text-white/75 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-2">
            <Link to="/admin" className="font-display text-lg text-white">Asanka admin</Link>
            <button className="lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <X size={18} />
            </button>
          </div>

          <nav className="mt-8 space-y-1">
            {nav.map(({ to, label, Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                    isActive ? 'bg-white/12 text-white' : 'hover:bg-white/6 hover:text-white'
                  }`
                }
              >
                <Icon size={17} /> {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-10 space-y-1 border-t border-white/10 pt-4">
            <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-white/6 hover:text-white">
              <ExternalLink size={17} /> View the site
            </a>
            <button onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-white/6 hover:text-white">
              <LogOut size={17} /> Sign out
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-5 py-6 sm:px-8 sm:py-10">
          <button
            className="mb-6 flex items-center gap-2 rounded-xl border border-ink/12 bg-white px-4 py-2 text-sm lg:hidden"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={16} /> Menu
          </button>

          <Routes>
            <Route index element={<Dashboard notify={notify} />} />
            <Route path="login" element={<Navigate to="/admin" replace />} />
            <Route path="bookings" element={<Bookings notify={notify} />} />
            <Route path="messages" element={<Inbox notify={notify} />} />
            <Route path="settings" element={<SettingsEditor notify={notify} />} />
            <Route path="vehicles" element={<VehiclesAdmin notify={notify} />} />
            <Route path="posts" element={<PostsAdmin notify={notify} />} />
            <Route path="gallery" element={<GalleryAdmin notify={notify} />} />
            <Route path="testimonials" element={<TestimonialsAdmin notify={notify} />} />
            <Route path="services" element={<ServicesAdmin notify={notify} />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}

function VehiclesAdmin({ notify }) {
  return (
    <CrudManager
      notify={notify}
      title="Vehicles"
      intro="The fleet shown on the site, with prices and photos."
      path="vehicles"
      emptyRecord={{
        name: '', category: 'Car', image: '', description: '', seats: 4, luggage: 2,
        transmission: 'Automatic', fuel: 'Petrol', airConditioned: true, pricePerKm: 80,
        pricePerDay: 12000, freeKmPerDay: 100, features: '', bestSelling: false, topRated: false,
        active: true, sortOrder: 0,
      }}
      columns={[
        { key: 'image', label: 'Photo', type: 'image' },
        { key: 'name', label: 'Name' },
        { key: 'category', label: 'Type' },
        { key: 'pricePerKm', label: 'Per km' },
        { key: 'active', label: 'Live', type: 'boolean' },
      ]}
      fields={[
        { key: 'name', label: 'Vehicle name' },
        { key: 'category', label: 'Type', type: 'select', options: ['Car', 'Van', 'SUV', 'Bus', 'Tuk tuk'] },
        { key: 'image', label: 'Main photo', type: 'image', full: true },
        { key: 'description', label: 'Description', type: 'textarea', full: true },
        { key: 'seats', label: 'Seats', type: 'number' },
        { key: 'luggage', label: 'Luggage (bags)', type: 'number' },
        { key: 'transmission', label: 'Gearbox', type: 'select', options: ['Automatic', 'Manual'] },
        { key: 'fuel', label: 'Fuel', type: 'select', options: ['Petrol', 'Diesel', 'Hybrid', 'Electric'] },
        { key: 'pricePerKm', label: 'Price per km (LKR)', type: 'number' },
        { key: 'pricePerDay', label: 'Price per day (LKR)', type: 'number' },
        { key: 'freeKmPerDay', label: 'Free km per day', type: 'number' },
        { key: 'sortOrder', label: 'Position in the list', type: 'number' },
        { key: 'features', label: 'Included with hire', type: 'list', full: true, hint: 'One per line.' },
        { key: 'airConditioned', label: 'Air conditioned' },
        { key: 'bestSelling', label: 'Show “Best selling” badge', type: 'checkbox' },
        { key: 'topRated', label: 'Show “Top rated” badge', type: 'checkbox' },
        { key: 'active', label: 'Show on the site', type: 'checkbox' },
      ].map((f) => (f.key === 'airConditioned' ? { ...f, type: 'checkbox' } : f))}
    />
  )
}

function PostsAdmin({ notify }) {
  return (
    <CrudManager
      notify={notify}
      title="Destinations"
      intro="Guides shown under Destinations and on the homepage."
      path="posts"
      searchKeys={['title', 'district']}
      emptyRecord={{
        title: '', category: 'Location', excerpt: '', content: '', coverImage: '',
        district: '', bestTime: '', published: true, featured: false,
      }}
      columns={[
        { key: 'coverImage', label: 'Photo', type: 'image' },
        { key: 'title', label: 'Title' },
        { key: 'district', label: 'District' },
        { key: 'published', label: 'Published', type: 'boolean' },
      ]}
      fields={[
        { key: 'title', label: 'Title' },
        { key: 'district', label: 'District' },
        { key: 'coverImage', label: 'Cover photo', type: 'image', full: true },
        { key: 'excerpt', label: 'Short summary', type: 'textarea', rows: 3, full: true },
        { key: 'content', label: 'Full text', type: 'textarea', rows: 10, full: true, hint: 'Leave a blank line between paragraphs.' },
        { key: 'bestTime', label: 'Best time to visit' },
        { key: 'category', label: 'Category' },
        { key: 'published', label: 'Published', type: 'checkbox' },
        { key: 'featured', label: 'Feature on the homepage', type: 'checkbox' },
      ]}
    />
  )
}

function GalleryAdmin({ notify }) {
  return (
    <CrudManager
      notify={notify}
      title="Gallery photos"
      intro="Pictures shown on the gallery page, grouped into albums."
      path="gallery"
      searchKeys={['caption', 'album']}
      emptyRecord={{ url: '', caption: '', album: 'Tours', sortOrder: 0, active: true }}
      columns={[
        { key: 'url', label: 'Photo', type: 'image' },
        { key: 'caption', label: 'Caption' },
        { key: 'album', label: 'Album' },
        { key: 'active', label: 'Live', type: 'boolean' },
      ]}
      fields={[
        { key: 'url', label: 'Photo', type: 'image', full: true },
        { key: 'caption', label: 'Caption', full: true },
        { key: 'album', label: 'Album', hint: 'New album names create a new filter button.' },
        { key: 'sortOrder', label: 'Position', type: 'number' },
        { key: 'active', label: 'Show on the site', type: 'checkbox' },
      ]}
    />
  )
}

function TestimonialsAdmin({ notify }) {
  return (
    <CrudManager
      notify={notify}
      title="Reviews"
      intro="Guest reviews. New ones sent from the site stay hidden until you approve them."
      path="testimonials"
      emptyRecord={{ name: '', country: '', source: 'Google', rating: 5, message: '', approved: true, featured: false, avatar: '' }}
      columns={[
        { key: 'name', label: 'Guest' },
        { key: 'country', label: 'Country' },
        { key: 'source', label: 'From' },
        { key: 'approved', label: 'Approved', type: 'boolean' },
      ]}
      fields={[
        { key: 'name', label: 'Guest name' },
        { key: 'country', label: 'Country' },
        { key: 'source', label: 'Where it came from', type: 'select', options: ['Google', 'TripAdvisor', 'Facebook', 'Website'] },
        { key: 'rating', label: 'Rating out of 5', type: 'number' },
        { key: 'avatar', label: 'Guest photo', type: 'image', full: true },
        { key: 'message', label: 'Review', type: 'textarea', rows: 5, full: true },
        { key: 'approved', label: 'Show on the site', type: 'checkbox' },
        { key: 'featured', label: 'Feature on the homepage', type: 'checkbox' },
      ]}
    />
  )
}

function ServicesAdmin({ notify }) {
  return (
    <CrudManager
      notify={notify}
      title="Services"
      intro="The service cards on the homepage."
      path="services"
      searchKeys={['title']}
      emptyRecord={{ title: '', description: '', icon: 'map', image: '', sortOrder: 0, active: true }}
      columns={[
        { key: 'title', label: 'Service' },
        { key: 'icon', label: 'Icon' },
        { key: 'sortOrder', label: 'Position' },
        { key: 'active', label: 'Live', type: 'boolean' },
      ]}
      fields={[
        { key: 'title', label: 'Service name' },
        { key: 'icon', label: 'Icon', type: 'select', options: ['map', 'plane', 'bed', 'luggage', 'binoculars', 'route', 'car'] },
        { key: 'description', label: 'Description', type: 'textarea', full: true },
        { key: 'image', label: 'Picture (optional)', type: 'image', full: true },
        { key: 'sortOrder', label: 'Position', type: 'number' },
        { key: 'active', label: 'Show on the site', type: 'checkbox' },
      ]}
    />
  )
}
