import {Layout, DashboardLayout} from '@layouts/dashboard'
import Head from 'next/head'

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