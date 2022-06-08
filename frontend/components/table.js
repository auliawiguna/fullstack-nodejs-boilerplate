import React, { useMemo, useState, useEffect } from 'react'
import { useTable, usePagination, useSortBy } from 'react-table'
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import _ from 'lodash'
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    chakra
} from '@chakra-ui/react'
import axios from 'axios'
import { useSession } from 'next-auth/react'

export default function TableUI({ columns, data, url }) {
    const { data: session, status } = useSession()
    const isUser = !!session?.user
    const [records, setRecord] = useState([])
    const [page, setPage] = useState(1)
    const [per_page, setPerPage] = useState(5)
  
    React.useEffect(() => {
        fetchData(session)
    }, [isUser, status])

    const fetchData = async (session) => {
        if (!_.isNil(session)) {
            let apiUrl = url
            axios.defaults.headers.common['Authorization'] = `Bearer ${session.accessToken}`
            let records = await axios.get(apiUrl, {
                params: {
                    page: page,
                    per_page: per_page    
                }
            }).then((response) => {
                return response.data.data.rows
            }).catch((error) => {
                return error.message
            })    

            setRecord(records)                
        }
    }


    data = [
        {
            name :''
        }        
    ]
    
    data = records

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({columns, data}, useSortBy)

    return (
        <>
            <TableContainer>
                <Table colorScheme="gray" size="md" variant='simple' {...getTableProps()}>
                    <Thead>
                        { headerGroups.map((headerGroup) => (
                            <Tr {...headerGroup.getHeaderGroupProps()}>
                                { headerGroup.headers.map((column) => (
                                    <Th {...column.getHeaderProps()}>
                                        { column.render('Header') }
                                        <chakra.span pl='4'>
                                            {column.isSorted ? (
                                            column.isSortedDesc ? (
                                                <TriangleDownIcon aria-label='sorted descending' />
                                            ) : (
                                                <TriangleUpIcon aria-label='sorted ascending' />
                                            )
                                            ) : null}
                                        </chakra.span>                                        
                                    </Th>
                                )) }
                            </Tr>
                        )) }
                    </Thead>
                    <Tbody {...getTableBodyProps()}>
                        { 
                            rows.map((row, i) => {
                                prepareRow(row)
                                return (
                                    <Tr {...row.getRowProps()}>
                                        {
                                            row.cells.map((cell) => {
                                                return (
                                                    <Td {...cell.getCellProps()}>
                                                        { cell.render('Cell') }
                                                    </Td>
                                                )
                                            })
                                        }
                                    </Tr>
                                )
                            }) 
                        }
                    </Tbody>
                </Table>
            </TableContainer>
        </>
    )
}