import { DashboardLayout } from '@layouts/dashboard'
import Head from 'next/head'
import axios from 'axios'
import { getSession } from 'next-auth/react'
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Switch,
    useToast
} from '@chakra-ui/react'


const PermissionMatrixIndex = (props) => {
    
    let session = props.sessions

    const toast = useToast()

    const changeRolePermission = async (roleId, permissionId, state=true) => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${session.accessToken}`
        let url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/role-matrices/${state ? 'assign' : 'delete'}`
        try {
            await axios.patch(url, {
                role_id: roleId,
                permission_id: permissionId
            }).then((response) => {
                if (!response.error) {
                    toast({
                        position: 'top-right',
                        title: 'Success.',
                        description: "Record Updated.",
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                    })                
                }            
            })            
        } catch (error) {
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
                <title>Permission Matrix</title>
            </Head>
            <DashboardLayout title="Permission Matrix">
                <TableContainer>
                    <Table border={'InactiveBorder'} colorScheme="gray" size="md" fontSize={'md'} variant='striped'>
                        <Thead>
                            <Tr>
                                <Th>Roles/Permissions</Th>
                                { props.roles.map((role) => (
                                    <Th key={ `th${role.id}` }>{ role.name }</Th>
                                )) }

                            </Tr>
                        </Thead>
                        <Tbody>
                            { props.permissions.map((permission) => (
                                <Tr key={ `tr${permission.id}` }>
                                    <Th>{ permission.name }</Th>
                                    { props.roles.map((role) => (
                                        <Td key={ `td${role.id}-${permission.id}` }>
                                                <Switch key={ `switch${role.id}-${permission.id}` } onChange={(e) => { 
                                                    changeRolePermission(role.id, permission.id, e.target.checked)
                                                }} defaultChecked={ props.permissionsMatrix.includes(`${role.id}-${permission.id}`) } />
                                        </Td>
                                    )) }
                                </Tr>
                            )) }
                        </Tbody>
                    </Table>
                </TableContainer>

            </DashboardLayout>
        </>
    )
}

PermissionMatrixIndex.auth = true 

export async function getServerSideProps(context) {
    let session = await getSession(context)

    axios.defaults.headers.common['Authorization'] = `Bearer ${session.accessToken}`

    let roles = []
    let permissions = []
    let permissionsMatrix = []


    await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/roles`).then((response) => {
        roles = response.data.data.rows
    })            

    await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/permissions`).then((response) => {
        permissions = response.data.data.rows
    })            

    await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/role-matrices`).then((response) => {
        permissionsMatrix = response.data.data.map((matrix) => `${matrix.role_id}-${matrix.permission_id}` )
    })            

    return {
        props: {
            sessions: session,
            roles: roles,
            permissions: permissions,
            permissionsMatrix: permissionsMatrix
        }
    }
}


export default PermissionMatrixIndex