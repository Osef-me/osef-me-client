import './App.css'
import { Route, Routes } from 'react-router-dom'
import { BeatmapDetailPage, BeatmapsetRedirectPage, CurrentPage, ListPage, SettingsPage } from '@/components/pages'
import AppNavbar from '@/components/templates/Navbar/Navbar'
import { ThemeProvider } from '@/context/ThemeContext'
import DownloadPanel from '@/components/organisms/DownloadPanel/DownloadPanel'
import ToastContainer from '@/components/atoms/feedback/Toast/ToastContainer'
import { useToast } from '@/hooks/useToast'

const App = () => {
  const toast = useToast()

  return (
    <ThemeProvider>
      <AppNavbar />
      <main className="w-full mx-auto px-2 sm:px-4 lg:px-8 mt-6">
        <Routes>
          <Route path="/" element={<ListPage />} />
          <Route path="/current" element={<CurrentPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/beatmapsets/:beatmapsetOsuId" element={<BeatmapsetRedirectPage />} />
          <Route
            path="/beatmapsets/:beatmapsetOsuId/:beatmapOsuId"
            element={<BeatmapDetailPage />}
          />
        </Routes>
      </main>
      <DownloadPanel />
      <ToastContainer toasts={toast.toasts} onRemoveToast={toast.removeToast} />
    </ThemeProvider>
  )
}

export default App
