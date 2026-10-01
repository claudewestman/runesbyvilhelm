import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ArtworksProvider } from './contexts/ArtworksContext'
import GalleryPage from './pages/GalleryPage'
import ProductPage from './pages/ProductPage'
import AdminPage from './pages/AdminPage'
import siteConfig from './config/site'

const router = createBrowserRouter([
  { path: '/', element: <GalleryPage /> },
  { path: `/${siteConfig.productPath}/:slug`, element: <ProductPage /> },
  { path: '/admin', element: <AdminPage /> },
])

export default function App() {
  return (
    <ArtworksProvider>
      <RouterProvider router={router} />
    </ArtworksProvider>
  )
}
