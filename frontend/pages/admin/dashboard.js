import {Layout, DashboardLayout} from '@layouts/dashboard'
import Head from 'next/head'
import { useSession, signIn, signOut } from "next-auth/react"

const DashboardIndex = () => {
    return (
        <>
            <Head>
                <title>Dashboard</title>
            </Head>
            <DashboardLayout>
                <div>this is dashboard page</div>
            </DashboardLayout>
        </>
    )
}

DashboardIndex.auth = true 

export default DashboardIndex