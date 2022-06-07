import React from "react"
import { useTable } from 'react-table'
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
  } from '@chakra-ui/react'

export default function TableUI({ columns, data }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({columns, data})

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