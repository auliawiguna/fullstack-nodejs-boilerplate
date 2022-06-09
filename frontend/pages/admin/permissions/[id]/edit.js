import { DashboardLayout } from '@layouts/dashboard'
import Head from 'next/head'
import Link from 'next/link'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
  } from '@chakra-ui/react'

const EditPage = () => {
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
                <div>this is dashboard page</div>
            </DashboardLayout>
        </>
    )
}

EditPage.auth = true 

export default EditPage