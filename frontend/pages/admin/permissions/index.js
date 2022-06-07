import {Layout, DashboardLayout} from '@layouts/dashboard'
import Head from 'next/head'

const DashboardIndex = () => {
    return (
        <>
            <Head>
                <title>Permissions</title>
            </Head>
            <DashboardLayout title="Permission">
                <div>this is dashboard page</div>
            </DashboardLayout>
        </>
    )
}


export default DashboardIndex