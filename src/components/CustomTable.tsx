'use client';
import { Button, Group, Table } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React from 'react'
import CustomDrawer from './CustomDrawer';
import WebsiteForm from '@/app/dashboard/_viewModules/WebsiteForm';

interface CustomTablePropsType {
  data: any[]
}

const CustomTable = (props: CustomTablePropsType) => {
  const { data } = props;
  const [opened, { open, close }] = useDisclosure(false);


  const rows = data?.map((indvWebsite) => (
    <Table.Tr key={indvWebsite.id}>
      <Table.Td>{indvWebsite.name}</Table.Td>
      <Table.Td>{indvWebsite.url}</Table.Td>
      <Group p={10} align='center' justify='center' component={'td'}>
        <Button size='xs'>View</Button>
        <Button bg={'yellow'} size='xs'>Edit</Button>
        <Button bg={'red'} size='xs'>Delete</Button>
      </Group>
    </Table.Tr>
  ))
  return (
    <>
      <Table p={0}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Website Name</Table.Th>
            <Table.Th>Website URL</Table.Th>
            <Table.Th style={{ textAlign: 'right' }}><Button size="xs" bg={'green'} onClick={open}>Add Website</Button></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <CustomDrawer onClose={close} opened={opened} title='Add Website'>
        <WebsiteForm close={close} />
      </CustomDrawer>
    </>
  )
}

export default CustomTable
