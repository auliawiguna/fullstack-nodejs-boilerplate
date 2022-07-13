import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import Router from 'next/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { extendTheme } from "@chakra-ui/react"
import { Fonts } from '@components/fonts'
import { SessionProvider } from 'next-auth/react'
import Authenticated from '@middlewares/authenticated'
import RedirectIfAuthenticated from '@middlewares/redirectIfAuthenticated'
import React from 'react'

const theme = extendTheme({
  fonts: {
    heading: "Open Sans",
    body: "Raleway",
  },
  breakpoints: {
    sm: "320px",
    md: "768px",
    lg: "960px",
    xl: "1200px",
  },  
  components: {
    Button: {
      // 2. We can add a new button size or extend existing
      sizes: {
        xl: {
          h: '56px',
          fontSize: 'lg',
          px: '32px',
        },
        sm: {
          h: '32px',
          fontSize: 'sm',
          px: '12px',
        },
      },
    },
  },  
})
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <ChakraProvider theme={theme}>
      <Fonts />
      <SessionProvider session={session}>
        {
          Component.auth ? (
            <Authenticated>
              <Component {...pageProps} />
            </Authenticated>
          ) : Component.redirectIfAuthenticated ? (
            <RedirectIfAuthenticated>
              <Component {...pageProps} />
            </RedirectIfAuthenticated>
          ) : (
            <Component {...pageProps} />
          )          
        }
      </SessionProvider>
    </ChakraProvider>
  )
}