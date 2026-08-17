import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { SiteProvider } from './lib/SiteContext'
import { WishlistProvider } from './lib/WishlistContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SiteProvider>
        <WishlistProvider>
          <App />
        </WishlistProvider>
      </SiteProvider>
    </BrowserRouter>
  </React.StrictMode>,
)