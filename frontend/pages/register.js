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
  InputRightElement
} from "@chakra-ui/react"
import NextLink from 'next/link'
import { FaUserAlt, FaLock, FaEdit } from "react-icons/fa";
import AuthService from '@services/auth'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { signup } from '@validations/auth'
import Swal from 'sweetalert2'
import { ROUTE } from '@config/constants'
import Head from 'next/head'
import { signIn, getCsrfToken } from 'next-auth/react'

const CFaUserAlt = chakra(FaUserAlt)
const CFaLock = chakra(FaLock)
const CFaEdit = chakra(FaEdit)

const App = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const handleShowClick = () => setShowPassword(!showPassword);

  const router = useRouter()

  const formOptions = { resolver: yupResolver(signup) }

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

  const submit = async ({email, first_name, last_name, password}) => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auths/sign-up`
    return await AuthService.signup(url, email, first_name, last_name, password).
    then(async () => {
      const res = await signIn('credentials', {
        redirect: false,
        username: email,
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
        <title>Sign Up</title>
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
            <Alert status='info' mb={4}>
              <AlertIcon />
              Please complete the registration first,<br/>consider to use valid email address.
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
                    <Input type="email" name="email" {...register('email')} placeholder="Email Address" />
                  </InputGroup>
                  <Text color={'red'} className="invalid-feedback">{errors.email?.message}</Text>
                </FormControl>

                <FormControl>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                    >
                      <CFaEdit color="gray.300" />
                    </InputLeftElement>
                    <Input type="text" name="first_name" {...register('first_name')} placeholder="First Name" />
                  </InputGroup>
                  <Text color={'red'} className="invalid-feedback">{errors.first_name?.message}</Text>
                </FormControl>

                <FormControl>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                    >
                      <CFaEdit color="gray.300" />
                    </InputLeftElement>
                    <Input type="text" name="last_name" {...register('last_name')} placeholder="Last Name" />
                  </InputGroup>
                  <Text color={'red'} className="invalid-feedback">{errors.last_name?.message}</Text>
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
                  <Text color={'red'} className="invalid-feedback">{errors.password?.message}</Text>
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
                      placeholder="Password Confirmation"
                      name="password_confirmation"
                      {...register('password_confirmation')}
                    />
                  </InputGroup>
                  <Text color={'red'} className="invalid-feedback">{errors.password_confirmation?.message}</Text>
                </FormControl>
                
                <Button
                  borderRadius={0}
                  type="submit"
                  variant="solid"
                  colorScheme="facebook"
                  width="full"
                >
                  Sign Up
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
          Already have an account?{" "}
          <NextLink color="teal.500" href={ '/auth' }>
            Sign In
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