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
} from '@chakra-ui/react'
import { useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { getSession } from 'next-auth/react'
import axios from 'axios'
import { useToast } from '@chakra-ui/react'
import { backDialog } from '@utils/swal'
import { create } from '@validations/role'

const CreatePage = (props) => {
    // const { data: session, status } = useSession()
    const session = props.sessions

    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()

    const validationSchema = create

    const toast = useToast()

    const formOptions = { resolver: yupResolver(validationSchema) }

    // get functions to build form with useForm() hook
    const { register, handleSubmit, setError, formState } = useForm(formOptions)

    const { errors } = formState    
    
    const back = () => { return backDialog(router, "/admin/roles") }

    const submit = async (values) => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${session.accessToken}`
        let url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/roles`
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
                    return router.push("/admin/roles")
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
                <title>Create Role</title>
            </Head>
            <DashboardLayout title="Create Role">
                <Breadcrumb mb={4} fontWeight='medium' fontSize='sm'>
                    <BreadcrumbItem>
                        <Link scroll={false} href='/admin/dashboard'>Home</Link>
                    </BreadcrumbItem>

                    <BreadcrumbItem>
                        <Link scroll={false} href='/admin/roles'>Roles</Link>
                    </BreadcrumbItem>

                    <BreadcrumbItem isCurrentPage>
                        <Link  scroll={false} href='#'>Create Roles</Link>
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

CreatePage.auth = true 

export async function getServerSideProps(context) {
    let session = await getSession(context)
    return {
        props: {
            sessions: session,
        }
    }
}

export default CreatePage