"use client";
import * as Yup from "yup";
import React, { useState } from 'react'
import { useFormik } from "formik";
import { Box, Button, Checkbox, Stack, TextInput } from "@mantine/core";
import { updateWebsiteAPI } from "@/lib/api/endpoints/website";
import { revalidateWebsite } from "../../action";
import { notifications } from "@mantine/notifications";

interface WebsiteType {
  id: string;
  name: string;
  url: string;
  is_active: boolean;
}

interface UpdateWebsiteFormProps {
  close: () => void;
  website: WebsiteType;
}

const UpdateWebsiteForm = ({ close, website }: UpdateWebsiteFormProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (submitData: { name: string; url: string; is_active: boolean }) => {
    setLoading(true);
    try {
      await updateWebsiteAPI(website.id, submitData);
      revalidateWebsite(website.id);
      close();
      notifications.show({
        color: 'green',
        title: 'Sucess',
        position: 'top-right',
        message: 'Website updated successfully!',
      })
    } catch (error) {
      console.log(error);
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


  const UPDATE_WEBSITE_SCHEMA = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    url: Yup.string().required('URL is required'),
    is_active: Yup.boolean().required('Active Status is required'),
  })

  const formik = useFormik({
    initialValues: {
      name: website.name,
      url: website.url,
      is_active: website.is_active,
    },
    onSubmit: handleSubmit,
    validationSchema: UPDATE_WEBSITE_SCHEMA,
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
              error={formik.touched.name && formik.errors.name ? String(formik.errors.name) : undefined}
            />
          </Box>
          <Box>
            <TextInput
              name='url'
              label="Website URL"
              value={formik.values.url}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.url && formik.errors.url ? String(formik.errors.url) : undefined}
            />
          </Box>
          <Box>
            <Checkbox
              name='is_active'
              label="Active Status"
              checked={formik.values.is_active}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.is_active && formik.errors.is_active ? String(formik.errors.is_active) : undefined}
            />
          </Box>
          <Button
            type='submit'
            loading={loading}
          >
            Update Website
          </Button>
        </Stack>
      </form>
    </Box>
  )
}

export default UpdateWebsiteForm
