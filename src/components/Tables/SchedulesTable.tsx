'use client'
import { Button, Group, Table } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useState } from 'react'
import CustomDrawer from '../CustomDrawer';
import CreateScheduleForm from '@/app/schedules/_viewModules/ScheduleForms/CreateForm';
import ConfirmModal from '../ConfirmModal';
import { notifications } from '@mantine/notifications';
import { revalidateScheduleList } from '@/app/schedules/action';
import { deleteScheduleAPI } from '@/lib/api/endpoints/schedule';
import UpdateScheduleForm from '@/app/schedules/_viewModules/ScheduleForms/UpdateForm';

interface SchedulesTablePropsType {
    data: any[]
}

interface ScheduleType {
    id: string;
    website_id: string;
    interval_ms: number;
    is_active: boolean;
}
const SchedulesTable = (props: SchedulesTablePropsType) => {
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
          await deleteScheduleAPI(id);
          closeConfirm();
      
          notifications.show({
            title: 'Success',
            message: 'Schedule deleted successfully',
            color: 'green',
            position: 'top-right',
            autoClose: 3000
          })
          revalidateScheduleList()
        }
    


    const rows = data?.map((indvSchedule) => (
        <Table.Tr key={indvSchedule.id}>
          <Table.Td>{indvSchedule.website.name}</Table.Td>
          <Table.Td>{indvSchedule.website.url}</Table.Td>
          <Table.Td>{indvSchedule.interval_ms}</Table.Td>
          <Table.Td>{indvSchedule.is_active ? 'Active' : 'Inactive'}</Table.Td>
          <Group  component={'td'} justify='center'>
            <Button size="xs" bg={'orange'} onClick={handleClickEdit(indvSchedule.id)}>Edit</Button>
            <Button size="xs" bg={'red'} onClick={handleClickDelete(indvSchedule.id)}>Delete</Button>
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
                <Table.Th>Interval (Seconds)</Table.Th>
                <Table.Th>Active Status</Table.Th>
                <Table.Th style={{ textAlign: 'right' }}><Button size="xs" bg={'green'}  onClick={handleClickAdd}>Add Schedule</Button></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
          <CustomDrawer onClose={close} opened={opened} title='Add/Edit Schedule' size='50%'>
        {
          action === 'create' ? (
            <CreateScheduleForm close={close} />
          ) : action === 'update' ? (
            <UpdateScheduleForm schedule={data.find(schedule => schedule.id === id) as ScheduleType} close={close} />
          ) : null
        }
      </CustomDrawer>
      <ConfirmModal close={closeConfirm} opened={openedConfirm} title='Delete Schedule?'>
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

export default SchedulesTable