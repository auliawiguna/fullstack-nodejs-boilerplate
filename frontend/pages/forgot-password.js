import { useState } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Alert,
  AlertIcon,
  Avatar,
  FormControl,
  Text,
} from "@chakra-ui/react";
import NextLink from 'next/link'
import { FaUserAlt, FaLock } from "react-icons/fa";
import AuthService from '@services/auth'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { forgot } from '@validations/auth'
import Swal from 'sweetalert2'
import Head from 'next/head'
import { signIn, getCsrfToken } from 'next-auth/react'

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const App = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const router = useRouter()

  const formOptions = { resolver: yupResolver(forgot) }

  // get functions to build form with useForm() hook
  const { register, handleSubmit, setError, formState } = useForm(formOptions)

  const { errors } = formState    

  const submit = async ({email}) => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auths/forgot-password`
    return await AuthService.resetPassword(url, email).
    then(result => {
      router.push(`/reset-password/${result.token}`)
    })
    .catch(error => {
      Swal.fire({
        title: 'Error!',
        text: error.response.data.message,
        icon: 'error',
        confirmButtonText: 'Close'
      })      
    })
  }

  return (
    <>
      <Head>
        <title>Reset Password</title>
      </Head>    
      <Flex
        flexDirection="column"
        width="100wh"
        height="100vh"
        backgroundColor="gray.200"
        justifyContent="center"
        alignItems="center"
      >
        <Stack
          flexDir="column"
          mb="2"
          justifyContent="center"
          alignItems="center"
        >
          <Avatar bg="facebook.500" />
          <Heading color="facebook.500">
            Reset Password
          </Heading>
          <Box minW={{ base: "90%", md: "468px" }}>
            <Alert status='info' mb={4}>
              <AlertIcon />
              Lost your password?
              <br />
              No worries, insert your email address
              <br />
              and we'll send a token for you to reset
              <br />
              your password.
            </Alert>            
            
            <form onSubmit={handleSubmit(submit)}>
              <Stack
                spacing={4}
                p="1rem"
                backgroundColor="whiteAlpha.900"
                boxShadow="md"
              >
                <FormControl>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                    >
                      <CFaUserAlt color="gray.300" />
                    </InputLeftElement>
                    <Input type="email" name="email" {...register('email')} placeholder="Registered Email Address" />
                  </InputGroup>
                  <Text color={'red'} className="invalid-feedback">{errors.username?.message}</Text>
                </FormControl>
                <Button
                  borderRadius={0}
                  type="submit"
                  variant="solid"
                  colorScheme="facebook"
                  width="full"
                >
                  Send Reset Password Token
                </Button>
              </Stack>
            </form>
          </Box>
        </Stack>
        <Box
          justifyContent="center"
          alignItems="center"
          textAlign={"center"}
        >
          New to us?{" "}
          <NextLink color="teal.500" href={ '/register' }>
            Sign Up
          </NextLink>
          <br />
          &nbsp; or &nbsp;
          <br />
          <NextLink color="teal.500" href={ '/' } >
            Back to Homepage
          </NextLink>
        </Box>
      </Flex>
    </>
  );
};

App.redirectIfAuthenticated = true 

export default App

// export async function getStaticProps() {
//   return {
//       props: {
//         env : process.env.NEXT_PUBLIC_API_URL,
//         naats: 'asa'
//       }
//   }
// }
export async function getServerSideProps(context) {
  return {
      props: {
        env : process.env.NEXT_PUBLIC_API_URL,
        csrfToken: await getCsrfToken(context)
      }
  }
}