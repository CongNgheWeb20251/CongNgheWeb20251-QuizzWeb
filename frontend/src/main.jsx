import * as React from 'react'
import './index.css'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '~/redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { injectStore } from '~/utils/authorizeAxios'
import { ToastContainer } from 'react-toastify'
import { ConfirmProvider } from 'material-ui-confirm'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '~/customLib/queryClient'


const persistor = persistStore(store)
injectStore(store)

const rootElement = document.getElementById('root')
// Tránh tạo lại khi reload
if (!rootElement._reactRoot) {
  rootElement._reactRoot = createRoot(rootElement)
}

const root = rootElement._reactRoot

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter basename="/" future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ConfirmProvider defaultOptions ={{ confirmationButtonProps: { color:'error', variant: 'contained' },
          cancellationButtonProps: { color: 'inherit', variant: 'outlined' },
          allowClose: false }}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
          <ToastContainer theme="light" position="top-right" autoClose={1500} />
        </ConfirmProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
)