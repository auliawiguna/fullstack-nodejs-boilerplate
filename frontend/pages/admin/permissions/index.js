import {Layout, DashboardLayout} from '@layouts/dashboard'
import Head from 'next/head'
import React, { useMemo, useState, useEffect } from 'react'
import TableUI from '@components/table'
import AuthService from '@services/auth'
import axios from 'axios'

const Permission = (props) => {
    const [records, setRecord] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            let userToken = AuthService.userValue
            let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/permissions`
            axios.defaults.headers.common['Authorization'] = `Bearer ${userToken.token}`
            let records = await axios.get(apiUrl, {
            }).then((response) => {
                return response.data.data.rows
            }).catch((error) => {
                return error.message
            })    

            setRecord(records)
        }
        fetchData()
    }, [])

    const columns = useMemo(() => [
        {
            Header: "Permission",
            columns: [
                {
                    Header: "Name",
                    accessor: 'name'
                },
                {
                    Header: "Description",
                    accessor: 'description'
                },
            ]
        }
    ])
    let data = records
    return (
        <>
            <Head>
                <title>Permissions</title>
            </Head>
            <DashboardLayout title="Permission">
                <div>
                    <TableUI columns={columns} data={data}>

                    </TableUI>
                </div>
            </DashboardLayout>
        </>
    )
}

export default Permission