import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { AuthProvider } from "@/context/AuthContext"
import { AppProvider } from "@/context/AppContext"

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </AuthProvider>
  )
}

