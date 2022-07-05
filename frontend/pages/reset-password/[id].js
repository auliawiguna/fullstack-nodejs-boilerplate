import { useState } from "react";
import axios from 'axios'
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
} from "@chakra-ui/react";
import NextLink from 'next/link'
import { FaUserAlt, FaLock } from "react-icons/fa";
import AuthService from '@services/auth'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { resetRequest } from '@validations/auth'
import Swal from 'sweetalert2'
import Head from 'next/head'
import { useEffect } from "react"
import { signIn, getCsrfToken } from 'next-auth/react'

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const App = (props) => {

    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);

    const router = useRouter()

    const handleShowClick = () => setShowPassword(!showPassword);

    const formOptions = { resolver: yupResolver(resetRequest) }

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, setError, formState } = useForm(formOptions)

    const { errors } = formState    

    const submit = async ({token, password}) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auths/reset-password`
        return await AuthService.postResetPassword(url, token, props.token.email, password).
        then(result => {
            Swal.fire({
                title: 'Success',
                text: 'Your password has been changed!',
                icon: 'success',
                confirmButtonText: 'Close'
            })      
        
            router.push(`/auth`)
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

    useEffect(() => {
        let defaultValues = {}
        defaultValues.email = props.token.email ?? ''
        reset({ ...defaultValues })
    }, [])

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
                Finalise reset password
                <br />
                Insert your token and and your new password.
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
                        <CFaLock color="gray.300" />
                        </InputLeftElement>
                        <Input type="email" readOnly name="email" {...register('email')} placeholder="Registered Email Address" />
                    </InputGroup>
                    <Text color={'red'} className="invalid-feedback">{errors.email?.message}</Text>
                    </FormControl>

                    <FormControl>
                    <InputGroup>
                        <InputLeftElement
                        pointerEvents="none"
                        >
                        <CFaLock color="gray.300" />
                        </InputLeftElement>
                        <Input type="number" name="token" {...register('token')} placeholder="6 Digits Token" />
                    </InputGroup>
                    <Text color={'red'} className="invalid-feedback">{errors.token?.message}</Text>
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
                    Reset Password
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

export async function getServerSideProps(context) {
    let { id } = context.query

    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auths/reset-password/${id}`
    const token = await axios.get(url).then((response) => {
        if (!response.error) {
            return response.data.data
        }
    })         
    
    return {
        props: {
            env : process.env.NEXT_PUBLIC_API_URL,
            csrfToken: await getCsrfToken(context),
            token: token
        }
    }
}