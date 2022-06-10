import { DashboardLayout} from '@layouts/dashboard'
import Head from 'next/head'
import React, { useMemo } from 'react'
import TableUI from '@components/table'

const Permission = (props) => {


    const columns = useMemo(() => [
        {
            Header: "Permission",
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
                <title>Permissions</title>
            </Head>
            <DashboardLayout title="Permission">
                <div>
                    <TableUI baseurl={"/admin/permissions"} columns={columns} data={data} url={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/permissions`}>

                    </TableUI>
                </div>
            </DashboardLayout>
        </>
    )
}

export default Permission