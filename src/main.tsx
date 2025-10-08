import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { TauriEventProvider } from '@/context/TauriEventProvider'
import App from './App'

const rootEl = document.getElementById('root')
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl)
  root.render(
    <BrowserRouter>
      <TauriEventProvider>
        <App />
      </TauriEventProvider>
    </BrowserRouter>
  )
}
