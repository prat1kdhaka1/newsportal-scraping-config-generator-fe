'use client';
import { Button, Group, Table } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useState } from 'react'
import CustomDrawer from '../CustomDrawer';
import Link from 'next/link';
import ConfirmModal from '../ConfirmModal';
import { notifications } from '@mantine/notifications';
import { deleteCategoryAPI, extractArticleLinksAPI } from '@/lib/api/endpoints/category';
import CreateCategoryForm from '@/app/website/_viewModules/CategoryForm/CreateForm';
import UpdateCategoryForm from '@/app/website/_viewModules/CategoryForm/UpdateForm';
import { revalidateCategoryList } from '@/app/website/action';
import BulkCreateArticleLinkForm from '@/app/category/_viewModules/ArticleLinkTempForm/BulkCreate';

interface CategoryTablePropsType {
  data: any[]
  website_id: string
}

const CategoryTable = (props: CategoryTablePropsType) => {
  const { data, website_id } = props;
  const [action, setAction] = useState<string>('create')
  const [opened, { open, close }] = useDisclosure(false);
  const [openedConfirm, { open: openConfirm, close: closeConfirm }] = useDisclosure(false);
  const [id, setId] = useState<string | ''>('');

  const handleExtractArticleLinks = async (id: string) => {
    notifications.show({
          title: 'Success',
          message: 'Article links extraction started successfully!',
          color: 'green',
          position: 'top-right',
          autoClose: 3000
        })
    await extractArticleLinksAPI({ "category_id": id });

  }

  const handleClickAdd = () => {
    setAction('create');
    open();
  }


  const handleClickEdit = (id: string) => () => {
    setAction('edit');
    setId(id);
    open();

  }

  const handleClickDelete = (id: string) => () => {
    openConfirm();
    setAction('delete');
    setId(id);
  }

  const handleConfirmDelete = async () => {
    await deleteCategoryAPI(id);
    closeConfirm();

    notifications.show({
      title: 'Success',
      message: 'Category deleted successfully',
      color: 'green',
      position: 'top-right',
      autoClose: 3000
    })
    revalidateCategoryList();
  }


  const rows = data?.map((indvCategory) => (
    <Table.Tr key={indvCategory.id}>
      {/* <Table.Td>{indvCategory.website_id}</Table.Td> */}
      <Table.Td>{indvCategory.url}</Table.Td>
      <Table.Td>{indvCategory.is_active ? 'Active' : 'Inactive'}</Table.Td>
      <Group p={10} align='center' justify='center' component={'td'}>
        <Link href={`/category/${indvCategory.id}`}>View</Link>
        <Button size='xs' bg={'orange'} onClick={handleClickEdit(indvCategory.id)}>Edit</Button>
        <Button size='xs' bg={'red'} onClick={handleClickDelete(indvCategory.id)}>Delete</Button>
        {
          indvCategory.al_processing_status === "completed" ? <Button size='xs' bg={'blue'} onClick={() => {
            setId(indvCategory.id);
            setAction('viewtemp');
            open();
            handleExtractArticleLinks(indvCategory.id)
          }

          }
          > View Article Links</Button> : <Button size='xs' bg={'green'} onClick={() => handleExtractArticleLinks(indvCategory.id)}>Extract Article Links</Button>
        }

        <Button size='xs' bg={'green'} >Generate Regex</Button>
      </Group>
    </Table.Tr>
  ))
  return (
    <>
      <Table p={0}>
        <Table.Thead>
          <Table.Tr>
            {/* <Table.Th>Website ID</Table.Th> */}
            <Table.Th>Category URL</Table.Th>
            <Table.Th>Active Status</Table.Th>
            <Table.Th style={{ textAlign: 'right' }}><Button size="xs" bg={'green'} onClick={handleClickAdd}>Add Category</Button></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <CustomDrawer onClose={close} opened={opened} title='Add/Edit Category' size='75%'>
        {action === 'create' ? <CreateCategoryForm website_id={website_id} close={close} /> : action === 'viewtemp' ? <BulkCreateArticleLinkForm category_id={id} close={close} /> :
          <UpdateCategoryForm category={data.find(category => category.id === id)} close={close} />}
      </CustomDrawer>
      <ConfirmModal close={closeConfirm} opened={openedConfirm} title='Delete Category?'>
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

export default CategoryTable