"use client";
import { createWebsiteAPI } from '@/lib/api/endpoints/website';
import { Box, Button, Stack, TextInput } from '@mantine/core';
import { useFormik } from 'formik';
import React, { useState } from 'react'
import * as Yup from "yup";
import { revalidateWebsiteList } from '../../action';
import { notifications } from '@mantine/notifications';

interface CreateWebsiteFormProps {
  close: () => void;
}

const CreateWebsiteForm = ({ close }: CreateWebsiteFormProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (submitData: { name: string; url: string }) => {
    setLoading(true);
    try {
      await createWebsiteAPI(submitData);
      revalidateWebsiteList()
      close();
      notifications.show({
        color: 'green',
        title: 'Sucess',
        position: 'top-right',
        message: 'Website added successfully!',
      })
    } catch (error) {
      console.log(error)
      notifications.show({
        color: 'red',
        title: 'Failed',
        position: 'top-right',
        message: `Failed to create website: ${error instanceof Error ? error.message : 'Unknown error'}`,
      })
    } finally {
      setLoading(false);
    }
  }

  const CREATE_WEBSITE_SCHEMA = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    url: Yup.string().required('URL is required'),
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      url: '',
    },
    onSubmit: handleSubmit,
    validationSchema: CREATE_WEBSITE_SCHEMA,
  })

  return (
    <Box
      p={'lg'}
      bg="var(--mantine-color-gray-light)"
    >
      <form onSubmit={formik.handleSubmit}>
        <Stack>
          <Box>
            <TextInput
              name='name'
              label="Website Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && formik.errors.name}
            />
          </Box>
          <Box>
            <TextInput
              name='url'
              label="Website URL"
              value={formik.values.url}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.url && formik.errors.url}
            />
          </Box>
          <Button
            type='submit'
            loading={loading}
          >
            Add Website
          </Button>
        </Stack>
      </form>
    </Box>
  )
}

export default CreateWebsiteForm
