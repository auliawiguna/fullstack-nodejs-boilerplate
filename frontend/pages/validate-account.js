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
  PinInput, 
  PinInputField,
  HStack,
  Alert,
  AlertIcon,
  FormControl,
  Text,
} from "@chakra-ui/react";
import NextLink from 'next/link'
import { FaUserAlt, FaLock } from "react-icons/fa";
import AuthService from '@services/auth'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { verify } from '@validations/auth'
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

  const formOptions = { resolver: yupResolver(verify) }

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

  const submit = async ({token}) => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auths/validate`
    return await AuthService.validateAccount(url, token).
    then(async (result) => {
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

  return (
    <>
      <Head>
        <title>Validate your account</title>
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
          <Heading color="facebook.500">
            Validate your account
          </Heading>
          <Box minW={{ base: "90%", md: "468px" }}>
            <Alert status='info' mb={4}>
              <AlertIcon />
              Validate your account before proceeding.<br />Kindly check your email inbox or spam folder<br />to retrieve 6-digits token and verify it below.
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
                    <Input type="number" name="token" {...register('token')} placeholder="6 Digits Token" />
                  </InputGroup>
                  <Text color={'red'} className="invalid-feedback">{errors.token?.message}</Text>
                </FormControl>
                <Button
                  borderRadius={0}
                  type="submit"
                  variant="solid"
                  colorScheme="facebook"
                  width="full"
                >
                  Verify
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
          <br />
          <NextLink color="teal.500" href={ '/' } >
            Back to Homepage
          </NextLink>
        </Box>
      </Flex>
    </>
  );
};

App.auth = true 

export default App

export async function getServerSideProps(context) {
  return {
      props: {
        env : process.env.NEXT_PUBLIC_API_URL,
        csrfToken: await getCsrfToken(context)
      }
  }
}