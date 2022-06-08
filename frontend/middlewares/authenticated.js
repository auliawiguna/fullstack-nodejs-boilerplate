import { SessionProvider, signIn, useSession } from 'next-auth/react'
import { Box, ChakraProvider, useColorModeValue, SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import AuthService from '@services/auth'
import React from 'react'

const checkToken = async (token) => {
    let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auths/auth-validate`
    let checkTokenAuth = await AuthService.validateToken(apiUrl, token)
    return checkTokenAuth.token ? true : false
}
  

const Authenticated = ({ children }) => {
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

export default Authenticated