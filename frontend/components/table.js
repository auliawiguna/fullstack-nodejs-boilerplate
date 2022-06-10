import Link from 'next/link'
import React, { useState } from 'react'
import { useTable, useSortBy } from 'react-table'
import { TriangleDownIcon, TriangleUpIcon, EditIcon, DeleteIcon, ChevronLeftIcon, ChevronRightIcon, SearchIcon, PlusSquareIcon } from '@chakra-ui/icons'
import { Button, ButtonGroup, Stack, Flex, InputGroup, Input, InputRightElement, Box } from '@chakra-ui/react'
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
                items.push(<Button size={'sm'} key={"previous_page"} onClick={() => {fetchData(session, page-1, 10)}}  leftIcon={<ChevronLeftIcon />} colorScheme='facebook' variant='outline'>Previous Page</Button>)
            }
            if (totalPages<=10) {
                for (let index = 1; index <= totalPages; index++) {
                    items.push(<Button size={'sm'} key={index} onClick={() => {fetchData(session, index, 10)}} isActive={page==index} colorScheme='facebook' variant='outline'>{index}</Button>)
                }
            } else {
                if (page<=4) {
                    for (let index = 1; index <= 5; index++) {
                        items.push(<Button size={'sm'} key={index} onClick={() => {fetchData(session, index, 10)}} isActive={page==index} colorScheme='facebook' variant='outline'>{index}</Button>)
                    }                
                    items.push(<Button size={'sm'} key={'separator1'} colorScheme='facebook' variant='outline'>{'...'}</Button>)
                    items.push(<Button size={'sm'} key={totalPages} onClick={() => {fetchData(session, totalPages, 10)}} isActive={page==totalPages} colorScheme='facebook' variant='outline'>{totalPages}</Button>)
                } else if (page>4 && page<totalPages-4) {
                    items.push(<Button size={'sm'} key={1} onClick={() => {fetchData(session, 1, 10)}} isActive={page==1} colorScheme='facebook' variant='outline'>{'1'}</Button>)
                    items.push(<Button size={'sm'} key={'separator1'} colorScheme='facebook' variant='outline'>{'...'}</Button>)
                    items.push(<Button size={'sm'} mr={5} onClick={() => {fetchData(session, page-1, 10)}} colorScheme='facebook' variant='outline'>{page-1}</Button>)
                    items.push(<Button size={'sm'} mr={5} onClick={() => {fetchData(session, page, 10)}} isActive colorScheme='facebook' variant='outline'>{page}</Button>)
                    items.push(<Button size={'sm'} mr={5} onClick={() => {fetchData(session, page+1, 10)}} colorScheme='facebook' variant='outline'>{page+1}</Button>)
                    items.push(<Button size={'sm'} key={'separator2'} colorScheme='facebook' variant='outline'>{'...'}</Button>)
                    items.push(<Button size={'sm'} key={totalPages} onClick={() => {fetchData(session, totalPages, 10)}} isActive={page==totalPages} colorScheme='facebook' variant='outline'>{totalPages}</Button>)
                } else {
                    items.push(<Button size={'sm'} key={1} onClick={() => {fetchData(session, 1, 10)}} isActive={page==1} colorScheme='facebook' variant='outline'>{'1'}</Button>)
                    items.push(<Button size={'sm'} key={'separator2'} colorScheme='facebook' variant='outline'>{'...'}</Button>)
                    for (let index = totalPages-4; index <= totalPages; index++) {
                        items.push(<Button size={'sm'} key={index} onClick={() => {fetchData(session, index, 10)}} isActive={page==index} colorScheme='facebook' variant='outline'>{index}</Button>)
                    }
                }
            }
            if (page<totalPages) {
                items.push(<Button size={'sm'} key={"next_page"} onClick={() => {fetchData(session, page+1, 10)}}  rightIcon={<ChevronRightIcon />} colorScheme='facebook' variant='outline'>Next Page</Button>)
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
                <Flex mb={5}>
                    <Box w={{sm:'100%', md:'50%', lg:'50%'}}>
                        <InputGroup size='md' pl={1}>
                            <Input
                                colorScheme={'facebook'}
                                variant={'outline'}
                                focusBorderColor={'gray'}
                                pr='4.5rem'
                                type={'text'}
                                placeholder='Search'
                            />
                            <InputRightElement width='6.5rem'>
                                <Button size='sm' variant={'ghost'} outline={0} m="2" colorScheme='gray' leftIcon={<SearchIcon />}>
                                    Search
                                </Button>
                            </InputRightElement>
                        </InputGroup>         
                    </Box>
                    <Box w={{sm:'100%', md:'50%', lg:'50%'}}>
                        <Link href={ `${baseurl}/create` }>
                            <Button rightIcon={<PlusSquareIcon />} float='right' colorScheme='facebook' variant='outline'>
                                Add New
                            </Button>
                        </Link>
                    </Box>
                </Flex>                

                <Table border={'InactiveBorder'} colorScheme="gray" size="sm" fontSize={'md'} variant='striped' {...getTableProps()}>
                    <Thead>
                        { headerGroups.map((headerGroup) => (
                            <Tr key={headerGroup.key} {...headerGroup.getHeaderGroupProps()}>
                                { headerGroup.headers.map((column, columnIndex) => (
                                    <Th key={`header_column${columnIndex}`} {...column.getHeaderProps()}>
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
                            rows.map((row, indexRow) => {
                                prepareRow(row)
                                return (
                                    <Tr key={`row${indexRow}`} {...row.getRowProps()}>
                                        {
                                            row.cells.map((cell, indexCell) => {
                                                return (
                                                    <Td key={`row${indexRow}_${indexCell}`} {...cell.getCellProps()}>
                                                        { cell.render('Cell') }
                                                    </Td>
                                                )
                                            })
                                        }
                                        <Td alignContent={'start'}>
                                            <ButtonGroup variant='outline' float={'right'} spacing='2'>
                                                <Link href={ `${baseurl}/${row.original.id}/edit` }><Button size={'sm'} colorScheme='blue' leftIcon={<EditIcon />}>Edit</Button></Link>
                                                <Button size={'sm'} colorScheme='red' leftIcon={<DeleteIcon />}>Delete</Button>
                                            </ButtonGroup>
                                            {/* <Menu size={'sm'}>
                                                <MenuButton
                                                    as={IconButton}
                                                    aria-label='Options'
                                                    icon={<DragHandleIcon />}
                                                    variant='outline'
                                                />
                                                <MenuList>
                                                    <MenuItem>
                                                        <Link href={ `${baseurl}/${row.original.id}/edit` }>Edit</Link>
                                                    </MenuItem>
                                                </MenuList>
                                            </Menu>                                             */}
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