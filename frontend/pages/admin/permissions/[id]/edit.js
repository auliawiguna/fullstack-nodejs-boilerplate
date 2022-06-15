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
    FormErrorMessage,
    InputGroup,
    Input,
    Button,
    FormLabel,
    FormHelperText,
    InputLeftElement,
    Alert,
    Text,
    AlertIcon
} from '@chakra-ui/react'
import * as Yup from 'yup'
import { useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSession, getSession } from 'next-auth/react'
import axios from 'axios'
import { useToast } from '@chakra-ui/react'
import Swal from 'sweetalert2'

const EditPage = (props) => {
    const { data: session, status } = useSession()

    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
    })

    const toast = useToast()

    const formOptions = { resolver: yupResolver(validationSchema) }

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, setError, formState } = useForm(formOptions)

    const { errors } = formState    
    
    const back = async () => {
        Swal.fire({
            title: 'Caution',
            text: "Cancel changes and back to list page?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Proceed'
        }).then(async (result) => {
            if (result.isConfirmed) {
                return router.push("/admin/permissions")
            }
        })
    }

    const submit = async (values) => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${session.accessToken}`
        let url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/permissions/${props.id}`
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
                    return router.push("/admin/permissions")
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
        defaultValues.name = props.item.name ?? null
        reset({ ...defaultValues })
    }, [])

    return (
        <>
            <Head>
                <title>Edit Permission</title>
            </Head>
            <DashboardLayout title="Edit Permission">
                <Breadcrumb mb={4} fontWeight='medium' fontSize='sm'>
                    <BreadcrumbItem>
                        <Link scroll={false} href='/admin/dashboard'>Home</Link>
                    </BreadcrumbItem>

                    <BreadcrumbItem>
                        <Link  scroll={false} href='/admin/permissions'>Permissions</Link>
                    </BreadcrumbItem>

                    <BreadcrumbItem isCurrentPage>
                        <Link  scroll={false} href='#'>Edit Permissions</Link>
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
                                    <FormLabel htmlFor='name'>Name</FormLabel>
                                    <Input
                                        id='name'
                                        type='text'
                                        {...register('name')}
                                    />
                                    <Text color={'red'} className="invalid-feedback">{errors.name?.message}</Text>
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

EditPage.auth = true 

export async function getServerSideProps(context) {
    const { id } = context.params
    let session = await getSession(context)

    axios.defaults.headers.common['Authorization'] = `Bearer ${session.accessToken}`
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/permissions/${id}`
    const item = await axios.get(url).then((response) => {
        if (!response.error) {
            return response.data.data
        }
    })            

    return {
        props: {
            id: id,
            sessions: session,
            item: item
        }
    }
}

export default EditPage