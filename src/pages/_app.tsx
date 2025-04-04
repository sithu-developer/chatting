import Layout from "@/components/Layout";
import { store } from "@/store";
import "@/styles/globals.css";
import { theme } from "@/util/theme";
import { ThemeProvider } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";

export default function App({ Component, pageProps :  { session, ...pageProps } }: AppProps) {
  return (
    <Provider store={store}>
      <SessionProvider session={session}>
        <ThemeProvider theme={theme} >
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </SessionProvider> 
    </Provider>
  )
}
