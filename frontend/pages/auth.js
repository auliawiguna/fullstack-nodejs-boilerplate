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
  Link,
  Avatar,
  FormControl,
  Text,
  FormHelperText,
  InputRightElement
} from "@chakra-ui/react";
import NextLink from 'next/link'
import { FaUserAlt, FaLock } from "react-icons/fa";
import AuthService from '@services/auth'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { signin } from '@validations/auth'
import Swal from 'sweetalert2'
import { ROUTE } from '@config/constants'
import Head from 'next/head'
import { signIn, getCsrfToken } from 'next-auth/react'

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const App = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const handleShowClick = () => setShowPassword(!showPassword);

  const router = useRouter()

  const formOptions = { resolver: yupResolver(signin) }

  // get functions to build form with useForm() hook
  const { register, handleSubmit, setError, formState } = useForm(formOptions)

  const { errors } = formState    

  const submitAxios = async ({username, password}) => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auths/sign-in`
    return await AuthService.login(url, username, password).
    then(() => {
      router.push(router.query.returnUrl || ROUTE.DASHBOARD)
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

  const submit = async ({username, password}) => {
    const res = await signIn('credentials', {
      redirect: false,
      username: username,
      password: password,
      callbackUrl:router.query.returnUrl || ROUTE.DASHBOARD
    })
    if (res?.error) {
      Swal.fire({
        title: 'Error!',
        text: res.error,
        icon: 'error',
        confirmButtonText: 'Close'
      })      
      setErrorMessage(res.error)
    } else {
      setErrorMessage(false)
    }
    if (res.url) {
      router.push(res.url)
    }
  }

  return (
    <>
      <Head>
        <title>Sign In</title>
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
            Welcome
          </Heading>
          <Box minW={{ base: "90%", md: "468px" }}>
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
                    <Input type="email" name="username" {...register('username')} placeholder="Registered Email Address" />
                  </InputGroup>
                  <Text color={'red'} className="invalid-feedback">{errors.username?.message}</Text>
                </FormControl>
                <FormControl>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      color="gray.300"
                    >
                      <CFaLock color="gray.300" />
                    </InputLeftElement>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      name="password"
                      {...register('password')}
                    />
                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormHelperText textAlign="right">
                    <NextLink href={ '/forgot-password' }>forgot password?</NextLink>
                  </FormHelperText>
                  <Text color={'red'} className="invalid-feedback">{errors.name?.password}</Text>
                </FormControl>
                <Button
                  borderRadius={0}
                  type="submit"
                  variant="solid"
                  colorScheme="facebook"
                  width="full"
                >
                  Sign In
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