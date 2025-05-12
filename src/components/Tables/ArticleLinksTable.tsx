'use client';
import { Button, Group, Table } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useState } from 'react'
import CustomDrawer from '../CustomDrawer';
import ConfirmModal from '../ConfirmModal';
import { notifications } from '@mantine/notifications';
import { deleteArticleLinkAPI } from '@/lib/api/endpoints/article-links';
import { revalidateArticleLinkList } from '@/app/category/action';
import CreateArticleLinkForm from '@/app/category/_viewModules/ArticleLinkForm/CreateForm';
import UpdateArticleLinkForm from '@/app/category/_viewModules/ArticleLinkForm/UpdateForm';

interface ArticleLinksTablePropsType {
  data: any[]
  category_id: string
}

const ArticleLinksTable = (props: ArticleLinksTablePropsType) => {
  const { data, category_id } = props;
  const [action, setAction] = useState<string>('create')
  const [opened, { open, close }] = useDisclosure(false);
  const [openedConfirm, { open: openConfirm, close: closeConfirm }] = useDisclosure(false);
  const [id, setId] = useState<string | ''>('');


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
    await deleteArticleLinkAPI(id);
    closeConfirm();

    notifications.show({
      title: 'Success',
      message: 'Article link deleted successfully',
      color: 'green',
      position: 'top-right',
      autoClose: 3000
    })
    revalidateArticleLinkList();

  }


  const rows = data?.map((indvArticleLink) => (
    <Table.Tr key={indvArticleLink.id}>
      {/* <Table.Td>{indvArticleLink.category_id}</Table.Td> */}
      <Table.Td>{indvArticleLink.url}</Table.Td>
      <Group p={10} align='center' justify='center' component={'td'}>
        {/* <Link href={`/category/${indvArticleLink.id}`}>View</Link> */}
        <Button size='xs' bg={'orange'} onClick={handleClickEdit(indvArticleLink.id)}>Edit</Button>
        <Button size='xs' bg={'red'} onClick={handleClickDelete(indvArticleLink.id)}>Delete</Button>
      </Group>
    </Table.Tr>
  ))
  return (
    <>
      <Table p={0}>
        <Table.Thead>
          <Table.Tr>
            {/* <Table.Th>Category ID</Table.Th> */}
            <Table.Th>Article URL</Table.Th>
            <Table.Th style={{ textAlign: 'right' }}><Button size="xs" bg={'green'} onClick={handleClickAdd}>Add Article Link</Button></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <CustomDrawer onClose={close} opened={opened} title='Add/Edit Category'>
        {action === 'create' ? <CreateArticleLinkForm category_id={category_id} close={close} /> : <UpdateArticleLinkForm article_link={data.find(article_link => article_link.id === id)} close={close} />}
      </CustomDrawer>
      <ConfirmModal close={closeConfirm} opened={openedConfirm} title='Delete Article Link?'>
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

export default ArticleLinksTable