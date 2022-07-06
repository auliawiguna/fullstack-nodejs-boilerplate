import { DashboardLayout} from '@layouts/dashboard'
import Head from 'next/head'
import React, { useMemo } from 'react'
import TableUI from '@components/table'

const Post = (props) => {


    const columns = useMemo(() => [
        {
            Header: "Post",
            columns: [
                {
                    Header: "Title",
                    accessor: 'title'
                },
            ]
        }
    ], [])
    let data = []
    return (
        <>
            <Head>
                <title>Posts</title>
            </Head>
            <DashboardLayout title="Post">
                <div>
                    <TableUI baseurl={"/admin/posts"} columns={columns} data={data} url={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts`}>

                    </TableUI>
                </div>
            </DashboardLayout>
        </>
    )
}

Post.auth = true 

export default Post