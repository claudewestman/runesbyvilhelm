import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ArtworksProvider } from './contexts/ArtworksContext'
import GalleryPage from './pages/GalleryPage'
import ArtworkPage from './pages/ArtworkPage'
import AdminPage from './pages/AdminPage'

const router = createBrowserRouter([
  { path: '/', element: <GalleryPage /> },
  { path: '/artwork/:slug', element: <ArtworkPage /> },
  { path: '/admin', element: <AdminPage /> },
])

export default function App() {
  return (
    <ArtworksProvider>
      <RouterProvider router={router} />
    </ArtworksProvider>
  )
}
