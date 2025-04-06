import Layout from "@/components/Layout";
import { store } from "@/store";
import "@/styles/globals.css";
import { theme } from "@/util/theme";
import { ThemeProvider } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

export default function App({ Component, pageProps :  { session, ...pageProps } }: AppProps) {
  return (
    <Provider store={store}>
      <SessionProvider session={session}>
        <ThemeProvider theme={theme} >
          <LocalizationProvider dateAdapter={AdapterDayjs} >
          <Layout>
            <Component {...pageProps} />
          </Layout>
          </LocalizationProvider>
        </ThemeProvider>
      </SessionProvider> 
    </Provider>
  )
}
