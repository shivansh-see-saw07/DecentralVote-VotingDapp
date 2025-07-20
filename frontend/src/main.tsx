import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App.tsx"
import "./index.css"
import { Providers } from "./components/providers.tsx"
import { ThemeProvider } from "./components/theme-provider.tsx"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Providers>
          <App />
        </Providers>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
