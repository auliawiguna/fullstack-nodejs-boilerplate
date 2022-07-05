import { signIn, useSession } from 'next-auth/react'
import { Box, useColorModeValue, SkeletonCircle, Skeleton, SkeletonText, Flex } from '@chakra-ui/react'
import AuthService from '@services/auth'
import React from 'react'
import _ from 'lodash'
import { useRouter } from 'next/router'

const checkToken = async (token) => {
    let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auths/auth-validate`
    let checkTokenAuth = await AuthService.validateToken(apiUrl, token)
    return checkTokenAuth
}

const Authenticated = ({ children }) => {
    const { data: session, status } = useSession()
    const isUser = !!session?.user
    const bgColor = useColorModeValue('white', 'gray.800')
    const router = useRouter()
  
    React.useEffect(() => {
      if (status === "loading") {
        return
      }

      if (!session) {
        signIn()        
      }

      const fetchData = async () => {
        return await checkToken(session.accessToken)
      }

      let isTokenValid = fetchData()
      .then((result) => {
        if (!isUser || !result.token) {
          signIn()
        }
        if (isUser && _.isNil(result.user.validated_at)) {
          router.push({
            pathname: '/validate-account',
          })
        }
      })
      .catch()
  
  


    }, [isUser, status])
  
    if (isUser) {
      return children
    }
  
    // Session is being fetched, or no user.
    // If no user, useEffect() will redirect.
    return (
      <>
        <Flex w={'full'} mb={4}>
          <Box w={'100%'} padding='6' boxShadow='lg' bg={bgColor} h='40px'>
            <Skeleton h='40px' />
          </Box>    
        </Flex>
        <Flex w={'full'}>
          <Box w={'20%'} padding='6' boxShadow='lg' bg={bgColor} h='calc(100vh)'>
            <Skeleton h='calc(100vh)' />
          </Box>    
          <Box w={'80%'} padding='6' boxShadow='lg' bg={bgColor} h='calc(100vh)'>
            <SkeletonText mt='4' noOfLines={80} spacing='4' />
          </Box>    

        </Flex>
      </>
    )
}

export default Authenticated