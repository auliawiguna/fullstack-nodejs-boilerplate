import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import { RouteGuard } from '@components/authguard'
import Router from 'next/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { extendTheme } from "@chakra-ui/react"
import { Fonts } from '@components/fonts'

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
})
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

function MyApp({ Component, pageProps }) {
  return ( 
    <ChakraProvider theme={theme}>
      <Fonts />
      <RouteGuard>
        <Component {...pageProps} /> 
      </RouteGuard>
    </ChakraProvider>
  )
}

export default MyApp
