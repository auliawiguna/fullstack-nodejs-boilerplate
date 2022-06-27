import { DashboardLayout} from '@layouts/dashboard'
import Head from 'next/head'
import React, { useMemo } from 'react'
import TableUI from '@components/table'

const Role = (props) => {


    const columns = useMemo(() => [
        {
            Header: "Role",
            columns: [
                {
                    Header: "Name",
                    accessor: 'name'
                },
            ]
        }
    ], [])
    let data = []
    return (
        <>
            <Head>
                <title>Roles</title>
            </Head>
            <DashboardLayout title="Role">
                <div>
                    <TableUI baseurl={"/admin/roles"} columns={columns} data={data} url={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/roles`}>

                    </TableUI>
                </div>
            </DashboardLayout>
        </>
    )
}

Role.auth = true 

export default Role