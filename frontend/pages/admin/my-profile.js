import { DashboardLayout } from '@layouts/dashboard'
import Head from 'next/head'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { FaSave, FaArrowLeft } from 'react-icons/fa'
import { useEffect } from "react"

import {
    Breadcrumb,
    BreadcrumbItem,
    Box,
    Stack,
    FormControl,
    Input,
    Button,
    FormLabel,
    Text,
    useToast
} from '@chakra-ui/react'
import { useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSession, getSession } from 'next-auth/react'
import axios from 'axios'
import { profile } from '@validations/user'
import { backDialog } from '@utils/swal'

const ProfilePage = (props) => {

    let session = props.sessions

    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()

    const toast = useToast()

    const formOptions = { resolver: yupResolver(profile) }

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, setError, formState } = useForm(formOptions)

    const { errors } = formState    
    
    const back = () => { return backDialog(router, "/admin/users") }

    const submit = async (values) => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${session.accessToken}`
        let url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/profiles/update`
        try {
            setIsLoading(true)            
            await axios.put(url, values).then((response) => {
                if (!response.error) {
                    toast({
                        position: 'top-right',
                        title: 'Success.',
                        description: "Record Updated.",
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                    })                
                    setIsLoading(false)
                }            
            })            
        } catch (error) {
            setIsLoading(false)
            toast({
                position: 'top-right',
                title: 'Error.',
                description: error.response.data.message,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })                            
        }
    }


    useEffect(() => {
        let defaultValues = {}
        defaultValues.first_name = props.profile.first_name ?? null
        defaultValues.last_name = props.profile.last_name ?? null
        defaultValues.email = props.profile.email ?? null
        reset({ ...defaultValues })
    }, [])

    return (
        <>
            <Head>
                <title>My Profile</title>
            </Head>
            <DashboardLayout title="My Profile">
                <Breadcrumb mb={4} fontWeight='medium' fontSize='sm'>
                    <BreadcrumbItem>
                        <Link scroll={false} href='/admin/dashboard'>Home</Link>
                    </BreadcrumbItem>

                    <BreadcrumbItem isCurrentPage>
                        <Link  scroll={false} href='#'>My Profile</Link>
                    </BreadcrumbItem>
                </Breadcrumb>
                <div>
                    <Box w={{sm: "full", md:'50%', lg:'50%' }}>
                    <form onSubmit={handleSubmit(submit)}>
                            <Stack
                            spacing={4}
                            p="1rem"
                            >
                                <FormControl isRequired>
                                    <FormLabel htmlFor='first_name'>First Name</FormLabel>
                                    <Input
                                        id='first_name'
                                        type='text'
                                        {...register('first_name')}
                                    />
                                    <Text color={'red'} className="invalid-feedback">{errors.first_name?.message}</Text>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel htmlFor='last_name'>Last Name</FormLabel>
                                    <Input
                                        id='last_name'
                                        type='text'
                                        {...register('last_name')}
                                    />
                                    <Text color={'red'} className="invalid-feedback">{errors.last_name?.message}</Text>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel htmlFor='email'>Email</FormLabel>
                                    <Input
                                        id='email'
                                        type='email'
                                        {...register('email')}
                                    />
                                    <Text color={'red'} className="invalid-feedback">{errors.email?.message}</Text>
                                </FormControl>
                                <FormControl mt={10}>
                                    <FormLabel htmlFor='old_password'>Old Password</FormLabel>
                                    <Input
                                        id='old_password'
                                        type='password'
                                        {...register('old_password')}
                                    />
                                    <Text color={'red'} className="invalid-feedback">{errors.old_password?.message}</Text>
                                </FormControl>
                                <FormControl>
                                    <FormLabel htmlFor='password'>New Password</FormLabel>
                                    <Input
                                        id='password'
                                        type='password'
                                        {...register('password')}
                                    />
                                    <Text color={'red'} className="invalid-feedback">{errors.password?.message}</Text>
                                </FormControl>
                                <FormControl>
                                    <FormLabel htmlFor='password_confirmation'>Confirm New Password</FormLabel>
                                    <Input
                                        id='password_confirmation'
                                        type='password'
                                        {...register('password_confirmation')}
                                    />
                                    <Text color={'red'} className="invalid-feedback">{errors.password_confirmation?.message}</Text>
                                </FormControl>

                                <Stack direction='row' spacing={4}>
                                    <Button
                                        leftIcon={<FaArrowLeft />}
                                        isLoading={isLoading}
                                        borderRadius={0}
                                        type="button"
                                        onClick={() => {back()}}
                                        variant="outline"
                                        colorScheme="orange"
                                        width="50%"
                                    >
                                        Back
                                    </Button>

                                    <Button
                                        leftIcon={<FaSave />}
                                        isLoading={isLoading}
                                        loadingText='Submitting'                            
                                        borderRadius={0}
                                        type="submit"
                                        variant="outline"
                                        colorScheme="teal"
                                        width="50%"
                                    >
                                        Submit
                                    </Button>
                                </Stack>                            
                            </Stack>
                        </form>
                    </Box>
                </div>
            </DashboardLayout>
        </>
    )
}

ProfilePage.auth = true 

export async function getServerSideProps(context) {
    let session = await getSession(context)

    if (!session) {
        return {
            props: {
                sessions: null,
                profile: null,
            }
        }    
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${session.accessToken}`
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/profiles/active-profile`
    const profile = await axios.get(url).then((response) => {
        if (!response.error) {
            let returnedData = response.data.data
            return returnedData
        }
    })           
    
    return {
        props: {
            sessions: session,
            profile: profile,
        }
    }
}

export default ProfilePage