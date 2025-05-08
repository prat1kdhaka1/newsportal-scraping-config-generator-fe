'use client';
import { Button, Group, Table } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useEffect, useRef, useState } from 'react'
import CustomDrawer from '../CustomDrawer';
import Link from 'next/link';
import ConfirmModal from '../ConfirmModal';
import { checkExtractionStatusAPI, deleteWebsiteAPI, startExtractionAPI } from '@/lib/api/endpoints/website';
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
  const [processingWebsites, setProcessingWebsites] = useState<Set<string>>(new Set());
  const [completedWebsites, setCompletedWebsites] = useState<Set<string>>(new Set());
  const [pendingWebsites, setPendingWebsites] = useState<Set<string>>(new Set());

  // Ref to store the EventSource instance
  const eventSourceRef = useRef<EventSource | null>(null);

  // Establish SSE connection on mount
  useEffect(() => {
    eventSourceRef.current = checkExtractionStatusAPI(
      (message) => {
        try {
          // Remove the "data: " prefix and convert Python values to JavaScript values
          const jsonStr = message
            .replace('data: ', '')
            .replace(/'/g, '"')
            .replace(/True/g, 'true')
            .replace(/False/g, 'false');

          const data = JSON.parse(jsonStr) as WebsiteType[];

          const processingIds = data
            .filter((website) => website.category_processing_status === 'processing')
            .map((website) => website.id);

          const completedIds = data
            .filter((website) => website.category_processing_status === 'completed')
            .map((website) => website.id);

          const pendingIds = data.filter((website) => website.category_processing_status === 'pending')
            .map((website) => website.id);

          setProcessingWebsites(new Set(processingIds));
          setCompletedWebsites(new Set(completedIds));
          setPendingWebsites(new Set(pendingIds));

        } catch (error) {
          console.error('Error parsing SSE message:', error);
        }
      },
      (error) => {
        console.error('SSE error:', error);
      }
    );

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        console.log("SSE connection closed on unmount.");
      }
    };
  }, []);

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

  const handleExtractCategories = (id: string) => async () => {
    await startExtractionAPI(id);
    setProcessingWebsites(prev => new Set([...prev, id]));
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
        <Button
          size='xs'
          color={
            pendingWebsites.has(indvWebsite.id)
              ? 'blue'
              : completedWebsites.has(indvWebsite.id)
                ? 'teal'
                : 'gray'
          }
          loading={processingWebsites.has(indvWebsite.id)}
          onClick={
            pendingWebsites.has(indvWebsite.id)
              ? handleExtractCategories(indvWebsite.id)
              : completedWebsites.has(indvWebsite.id)
                ? () => {
                  setId(indvWebsite.id);
                  setAction('viewtemp');
                  open();
                }
                : undefined // no-op for processing
          }
          disabled={!pendingWebsites.has(indvWebsite.id) && !completedWebsites.has(indvWebsite.id)}
        >
          {pendingWebsites.has(indvWebsite.id)
            ? 'Generate'
            : processingWebsites.has(indvWebsite.id)
              ? 'Processing'
              : completedWebsites.has(indvWebsite.id)
                ? 'View'
                : '...'}
        </Button>

      </Group>
    </Table.Tr>
  ))

  console.log(processingWebsites)
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