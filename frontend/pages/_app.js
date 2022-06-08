import '../styles/globals.css'
import { Box, ChakraProvider } from '@chakra-ui/react'
import AuthService from '@services/auth'
import { useColorModeValue, SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import Router from 'next/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { extendTheme } from "@chakra-ui/react"
import { Fonts } from '@components/fonts'
import { SessionProvider, signIn, useSession } from 'next-auth/react'
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
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </SessionProvider>
    </ChakraProvider>
  )
}

const checkToken = async (token) => {
  let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auths/auth-validate`
  let checkTokenAuth = await AuthService.validateToken(apiUrl, token)
  return checkTokenAuth.token ? true : false
}

function Auth({ children }) {
  const { data: session, status } = useSession()
  const isUser = !!session?.user
  const bgColor = useColorModeValue('white', 'gray.800')

  React.useEffect(() => {
    if (status === "loading") {
      return
    }

    let isTokenValid = checkToken(session.accessToken)

    if (!isUser || !isTokenValid) {
      signIn()
    }
  }, [isUser, status])

  if (isUser) {
    return children
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return (
    <>
      <Box padding='6' boxShadow='lg' bg={bgColor} h='calc(100vh)'>
        <SkeletonCircle size='10' />
        <SkeletonText mt='4' noOfLines={14} spacing='4' />
      </Box>    
    </>
  )
}