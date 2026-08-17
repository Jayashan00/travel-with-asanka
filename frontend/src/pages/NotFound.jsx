import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container-x grid min-h-[70vh] place-items-center py-24 text-center">
      <div>
        <p className="font-display text-7xl font-semibold text-leaf">404</p>
        <h1 className="mt-4 text-3xl">This road doesn't go anywhere</h1>
        <p className="mx-auto mt-3 max-w-md text-ink/65">
          The page you were looking for has moved or never existed. Head back to the start and pick a new route.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary">Back to home</Link>
          <Link to="/contact" className="btn-ghost">Contact us</Link>
        </div>
      </div>
    </div>
  )
}
