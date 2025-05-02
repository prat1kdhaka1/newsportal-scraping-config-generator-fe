import { updateCategoryAPI } from '@/lib/api/endpoints/category';
import { Box, Button, Checkbox, Stack, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useFormik } from 'formik';
import React, { useState } from 'react'
import * as Yup from "yup";
import { revalidateCategory } from '../../action';


interface CategoryType {
  id: string;
  website_id: string;
  url: string;
  is_active: boolean;
}

interface UpdateCategoryFormProps {
  close: () => void;
  category: CategoryType;
}


const UpdateCategoryForm = ({ close, category }: UpdateCategoryFormProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (submitData: { url: string; is_active: boolean, }) => {
    setLoading(true);
    try {
      await updateCategoryAPI(category.id, category.website_id, submitData);
      revalidateCategory(category.id)
      close();
      notifications.show({
        color: 'green',
        title: 'Sucess',
        position: 'top-right',
        autoClose: 3000,
        message: 'Category updated successfully!',
      })
    } catch (error) {
      console.log(error);
      notifications.show({
        color: 'red',
        title: 'Failed',
        position: 'top-right',
        autoClose: 3000,
        message: `Failed to update category: ${error instanceof Error ? error.message : 'Unknown error'}`,
      })
    } finally {
      setLoading(false);
    }
  }

  const UPDATE_CATEGORY_SCHEMA = Yup.object().shape({
    url: Yup.string().required('URL is required'),
    is_active: Yup.boolean().required('Active Status is required'),
  })

  const formik = useFormik({
    initialValues: {
      url: category.url,
      is_active: category.is_active,
    },
    validationSchema: UPDATE_CATEGORY_SCHEMA,
    onSubmit: handleSubmit,
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

export default UpdateCategoryForm
