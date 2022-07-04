import { DashboardLayout} from '@layouts/dashboard'
import Head from 'next/head'
import React, { useMemo } from 'react'
import TableUI from '@components/table'

const User = (props) => {


    const columns = useMemo(() => [
        {
            Header: "User",
            columns: [
                {
                    Header: "First Name",
                    accessor: 'first_name'
                },
                {
                    Header: "Last Name",
                    accessor: 'last_name'
                },
                {
                    Header: "Email",
                    accessor: 'email'
                },
                {
                    Header: "Roles",
                    accessor: 'roles_name'
                },
                {
                    Header: "Created At",
                    accessor: 'created_at'
                },
            ]
        }
    ], [])
    let data = []
    return (
        <>
            <Head>
                <title>Users</title>
            </Head>
            <DashboardLayout title="User">
                <div>
                    <TableUI baseurl={"/admin/users"} columns={columns} data={data} url={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users`}>

                    </TableUI>
                </div>
            </DashboardLayout>
        </>
    )
}

User.auth = true 

export default User