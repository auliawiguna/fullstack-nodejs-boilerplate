import { DashboardLayout } from '@layouts/dashboard'
import Head from 'next/head'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { FaSave, FaArrowLeft } from 'react-icons/fa'
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
    CheckboxGroup,
    Checkbox
} from '@chakra-ui/react'
import * as Yup from 'yup'
import { useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { getSession } from 'next-auth/react'
import axios from 'axios'
import { useToast } from '@chakra-ui/react'
import Swal from 'sweetalert2'

const CreatePage = (props) => {
    const session = props.sessions

    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()

    const validationSchema = Yup.object().shape({
        first_name: Yup.string().required('First name is required'),
        last_name: Yup.string().required('Last name is required'),
        email: Yup.string().email().required('Email is required'),
        password: Yup.string().required('Password is required'),
        role_id: Yup.array()
        .min(1, 'Pick at least two items')
    })

    const toast = useToast()

    const formOptions = { resolver: yupResolver(validationSchema) }

    // get functions to build form with useForm() hook
    const { register, handleSubmit, setError, formState } = useForm(formOptions)

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
                return router.push("/admin/users")
            }
          })
    }

    const submit = async (values) => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${session.accessToken}`
        let url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users`
        try {
            setIsLoading(true)            
            await axios.post(url, values).then((response) => {
                if (!response.error) {
                    toast({
                        position: 'top-right',
                        title: 'Success.',
                        description: "Record Created.",
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                    })                
                    setIsLoading(false)
                    return router.push("/admin/users")
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
    
    return (
        <>
            <Head>
                <title>Create User</title>
            </Head>
            <DashboardLayout title="Create User">
                <Breadcrumb mb={4} fontWeight='medium' fontSize='sm'>
                    <BreadcrumbItem>
                        <Link scroll={false} href='/admin/dashboard'>Home</Link>
                    </BreadcrumbItem>

                    <BreadcrumbItem>
                        <Link scroll={false} href='/admin/users'>Users</Link>
                    </BreadcrumbItem>

                    <BreadcrumbItem isCurrentPage>
                        <Link  scroll={false} href='#'>Create Users</Link>
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
                                    <Text color={'red'} className="invalid-feedback">{errors.name?.message}</Text>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel htmlFor='last_name'>Last Name</FormLabel>
                                    <Input
                                        id='last_name'
                                        type='text'
                                        {...register('last_name')}
                                    />
                                    <Text color={'red'} className="invalid-feedback">{errors.name?.message}</Text>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel htmlFor='email'>Email</FormLabel>
                                    <Input
                                        id='email'
                                        type='email'
                                        {...register('email')}
                                    />
                                    <Text color={'red'} className="invalid-feedback">{errors.name?.message}</Text>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel htmlFor='password'>Password</FormLabel>
                                    <Input
                                        id='password'
                                        type='password'
                                        {...register('password')}
                                    />
                                    <Text color={'red'} className="invalid-feedback">{errors.name?.message}</Text>
                                </FormControl>
                                
                                <FormControl>
                                    <FormLabel htmlFor='password'>Role</FormLabel>
                                    <CheckboxGroup colorScheme='green'>
                                        <Stack spacing={[1, 5]} direction={['column', 'row']}>
                                            { props.roles.map((role) => (
                                                <Checkbox {...register('role_id')}  value={ role.id.toString() }>{ role.name }</Checkbox>
                                            )) }
                                        </Stack>
                                    </CheckboxGroup>                                    
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

CreatePage.auth = true 

export async function getServerSideProps(context) {
    let session = await getSession(context)
    axios.defaults.headers.common['Authorization'] = `Bearer ${session.accessToken}`
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/roles`
    let roles = []
    await axios.get(url).then((response) => {
        roles = response.data.data.rows
    })            

    return {
        props: {
            sessions: session,
            roles: roles
        }
    }
}

export default CreatePage