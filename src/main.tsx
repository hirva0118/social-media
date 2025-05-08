// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <BrowserRouter>
    <ToastContainer style={{width:"200px",fontSize:"13px",padding:"10px",right:"10px",left:"unset"}} position='top-right' />
    <Provider store={store}>
    <App />

    </Provider>
    </BrowserRouter>
  // </StrictMode>,
)
