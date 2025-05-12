'use client';
import { Button, Group, Table } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useState } from 'react'
import CustomDrawer from '../CustomDrawer';
import Link from 'next/link';
import ConfirmModal from '../ConfirmModal';
import { deleteWebsiteAPI, startExtractionAPI } from '@/lib/api/endpoints/website';
import { revalidateWebsiteList } from '@/app/dashboard/action';
import { notifications } from '@mantine/notifications';
import CreateWebsiteForm from '@/app/dashboard/_viewModules/WebsiteForm/CreateForm';
import UpdateWebsiteForm from '@/app/dashboard/_viewModules/WebsiteForm/UpdateForm';
import BulkCreateCateogryForm from '@/app/dashboard/_viewModules/CategoryForm/BulkCreateForm';

interface WebsiteType {
  id: string;
  name: string;
  url: string;
  is_active: boolean;
  category_processing_status: string;
  created_at: string;
  updated_at: string;
}

interface CustomTablePropsType {
  data: WebsiteType[]
}

const WebsiteTable = (props: CustomTablePropsType) => {
  const { data } = props;
  const [action, setAction] = useState<string>('create')
  const [opened, { open, close }] = useDisclosure(false);
  const [openedConfirm, { open: openConfirm, close: closeConfirm }] = useDisclosure(false);
  const [id, setId] = useState<string | ''>('');



  const handleClickAdd = () => {
    setAction('create');
    open();
  }

  const handleClickEdit = (id: string) => () => {
    setAction('update');
    setId(id);
    open();
  }

  const handleClickDelete = (id: string) => () => {
    openConfirm();
    setAction('delete');
    setId(id);
  }

  const handleConfirmDelete = async () => {
    await deleteWebsiteAPI(id);
    closeConfirm();

    notifications.show({
      title: 'Success',
      message: 'Website deleted successfully',
      color: 'green',
      position: 'top-right',
      autoClose: 3000
    })
    revalidateWebsiteList()
  }

  const handleExtractCategories = async (id: string) => {
    console.log('hkhkhkh')
    notifications.show({
      title: 'Success',
      message: 'Category extraction started successfully!',
      color: 'green',
      position: 'top-right',
      autoClose: 3000
    })
    await startExtractionAPI(id);
  };

  const rows = data?.map((indvWebsite) => (
    <Table.Tr key={indvWebsite.id}>
      <Table.Td>{indvWebsite.name}</Table.Td>
      <Table.Td>{indvWebsite.url}</Table.Td>
      <Table.Td>{indvWebsite.is_active ? 'Active' : 'Inactive'}</Table.Td>
      <Group p={10} align='center' justify='center' component={'td'}>
        <Link href={`/website/${indvWebsite.id}`}>View</Link>
        <Button size='xs' bg={'orange'} onClick={handleClickEdit(indvWebsite.id)}>Edit</Button>
        <Button size='xs' bg={'red'} onClick={handleClickDelete(indvWebsite.id)}>Delete</Button>
        {/* <Button
          size='xs'
          color={
            indvWebsite.category_processing_status === "completed"
              ? 'blue'
              : indvWebsite.category_processing_status === 'pending'
                ? 'teal'
                : 'gray'
          }
          loading={indvWebsite.category_processing_status === "processing"}
          onClick={
            indvWebsite.category_processing_status === 'pending'
              ? handleExtractCategories(indvWebsite.id)
              : indvWebsite.category_processing_status === 'completed'
                ? () => {
                  setId(indvWebsite.id);
                  setAction('viewtemp');
                  open();
                }
                : undefined // no-op for processing
          }
          disabled={indvWebsite.category_processing_status == "processing"}
        >
          {indvWebsite.category_processing_status == "pending"
            ? 'Extract Categories'
            : indvWebsite.category_processing_status == "processing"
              ? 'Processing'
              : indvWebsite.category_processing_status == "completed"
                ? 'View Extracted Categories'
                : '...'}
        </Button> */}

        {
          indvWebsite.category_processing_status === "completed" ? <Button size='xs' bg={'blue'} onClick={() => {
            setId(indvWebsite.id);
            setAction('viewtemp');
            open();
            // handleExtractCategories(indvWebsite.id)
          }

          }
          > View Categories</Button> : <Button size='xs' bg={'green'} onClick={() => {
            console.log('clickkckckkc')
            handleExtractCategories(indvWebsite.id)
          }}>Extract Categories</Button>
        }


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
            <Table.Th>Active Status</Table.Th>
            <Table.Th style={{ textAlign: 'right' }}><Button size="xs" bg={'green'} onClick={handleClickAdd}>Add Website</Button></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <CustomDrawer onClose={close} opened={opened} title='Add/Edit Website' size='50%'>
        {
          action === 'create' ? (
            <CreateWebsiteForm close={close} />
          ) : action === 'update' ? (
            <UpdateWebsiteForm website={data.find(website => website.id === id) as WebsiteType} close={close} />
          ) : action === 'viewtemp' ? (
            <BulkCreateCateogryForm website_id={id} close={close} />
          ) : null
        }
      </CustomDrawer>
      <ConfirmModal close={closeConfirm} opened={openedConfirm} title='Delete Website?'>
        <>
          <Group >
            <Button onClick={closeConfirm} variant='outline'>Cancel</Button>
            <Button onClick={handleConfirmDelete} variant='outline' color='red'>Delete</Button>
          </Group>
        </>
      </ConfirmModal>
    </>
  )
}

export default WebsiteTable