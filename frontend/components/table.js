import Link from 'next/link'
import React, { useMemo, useState, useEffect } from 'react'
import { useTable, usePagination, useSortBy } from 'react-table'
import { TriangleDownIcon, TriangleUpIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Button, ButtonGroup, Stack } from '@chakra-ui/react'
import _ from 'lodash'
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    chakra
} from '@chakra-ui/react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
  } from '@chakra-ui/react'

export default function TableUI({ columns, data, url, baseurl }) {
    const { data: session, status } = useSession()
    const isUser = !!session?.user
    const [records, setRecord] = useState([])
    const [totalPages, setTotalPages] = useState(1)
    const [totalRecords, setTotalRecords] = useState(1)
    const [page, setPage] = useState(1)
    const [per_page, setPerPage] = useState(5)
  
    React.useEffect(() => {
        fetchData(session, 1, 10)
    }, [isUser, status])

    const fetchData = async (session, page, per_page ) => {
        if (!_.isNil(session)) {
            setPage(page)
            let apiUrl = url
            axios.defaults.headers.common['Authorization'] = `Bearer ${session.accessToken}`
            let records = await axios.get(apiUrl, {
                params: {
                    page: page,
                    per_page: per_page    
                }
            }).then((response) => {
                return response.data.data
            }).catch((error) => {
                return error.message
            })    

            if (!_.isNil(records.rows)) {
                setRecord(records.rows)                
            }
            if (!_.isNil(records.pages)) {
                setTotalPages(records.pages)                
            }
            if (!_.isNil(records.count)) {
                setTotalRecords(records.pages)                
            }
        }
    }

    const PaginationPanel = () => {
        const items = []
        if (totalPages>1) {
            if (page>1) {
                items.push(<Button key={"previous_page"} onClick={() => {fetchData(session, page-1, 10)}}  leftIcon={<ChevronLeftIcon />} colorScheme='facebook' variant='outline'>Previous Page</Button>)
            }
            if (totalPages<=10) {
                for (let index = 1; index <= totalPages; index++) {
                    items.push(<Button key={index} onClick={() => {fetchData(session, index, 10)}} isActive={page==index} colorScheme='facebook' variant='outline'>{index}</Button>)
                }
            } else {
                if (page<=4) {
                    for (let index = 1; index <= 5; index++) {
                        items.push(<Button key={index} onClick={() => {fetchData(session, index, 10)}} isActive={page==index} colorScheme='facebook' variant='outline'>{index}</Button>)
                    }                
                    items.push(<Button key={'separator1'} colorScheme='facebook' variant='outline'>{'...'}</Button>)
                    items.push(<Button key={totalPages} onClick={() => {fetchData(session, totalPages, 10)}} isActive={page==totalPages} colorScheme='facebook' variant='outline'>{totalPages}</Button>)
                } else if (page>4 && page<totalPages-4) {
                    items.push(<Button key={1} onClick={() => {fetchData(session, 1, 10)}} isActive={page==1} colorScheme='facebook' variant='outline'>{'1'}</Button>)
                    items.push(<Button key={'separator1'} colorScheme='facebook' variant='outline'>{'...'}</Button>)
                    items.push(<Button mr={5} onClick={() => {fetchData(session, page-1, 10)}} colorScheme='facebook' variant='outline'>{page-1}</Button>)
                    items.push(<Button mr={5} onClick={() => {fetchData(session, page, 10)}} isActive colorScheme='facebook' variant='outline'>{page}</Button>)
                    items.push(<Button mr={5} onClick={() => {fetchData(session, page+1, 10)}} colorScheme='facebook' variant='outline'>{page+1}</Button>)
                    items.push(<Button key={'separator2'} colorScheme='facebook' variant='outline'>{'...'}</Button>)
                    items.push(<Button key={totalPages} onClick={() => {fetchData(session, totalPages, 10)}} isActive={page==totalPages} colorScheme='facebook' variant='outline'>{totalPages}</Button>)
                } else {
                    items.push(<Button key={1} onClick={() => {fetchData(session, 1, 10)}} isActive={page==1} colorScheme='facebook' variant='outline'>{'1'}</Button>)
                    items.push(<Button key={'separator2'} colorScheme='facebook' variant='outline'>{'...'}</Button>)
                    for (let index = totalPages-4; index <= totalPages; index++) {
                        items.push(<Button key={index} onClick={() => {fetchData(session, index, 10)}} isActive={page==index} colorScheme='facebook' variant='outline'>{index}</Button>)
                    }
                }
            }
            if (page<totalPages) {
                items.push(<Button key={"next_page"} onClick={() => {fetchData(session, page+1, 10)}}  rightIcon={<ChevronRightIcon />} colorScheme='facebook' variant='outline'>Next Page</Button>)
            }

            return items
        }
        return (<></>)
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
                                <Th></Th>
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
                                        <Td alignContent={'start'}>
                                            <Menu>
                                                <MenuButton size={'sm'} as={Button} rightIcon={<ChevronDownIcon />}>
                                                    Actions
                                                </MenuButton>
                                                <MenuList>
                                                    <MenuItem size={'sm'}><Link href={ `${baseurl}/${row.original.id}/edit` }>Edit</Link></MenuItem>
                                                    <MenuItem size={'sm'}>Delete</MenuItem>
                                                </MenuList>
                                            </Menu>                                            
                                        </Td>
                                    </Tr>
                                )
                            }) 
                        }
                    </Tbody>
                </Table>
                <Stack mb={16} spacing={2} direction="row" align='center'>
                    <PaginationPanel />
                </Stack>
            </TableContainer>
        </>
    )
}