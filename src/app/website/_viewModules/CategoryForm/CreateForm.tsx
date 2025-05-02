import { createCategoryAPI } from '@/lib/api/endpoints/category';
import { Box, Button, Stack, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useFormik } from 'formik';
import React, { useState } from 'react'
import * as Yup from "yup";
import { revalidateCategoryList } from '../../action';

interface CreateCategoryFormProps {
  close: () => void;
  website_id: string;
}

const CreateCategoryForm = ({ close, website_id }: CreateCategoryFormProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (submitData: { url: string }) => {
    setLoading(true);
    try {
      await createCategoryAPI({ website_id, url: submitData.url });
      revalidateCategoryList()
      close();
      notifications.show({
        color: 'green',
        title: 'Sucess',
        position: 'top-right',
        message: 'Category added successfully!',
      })
    } catch (error) {
      console.log(error)
      notifications.show({
        color: 'red',
        title: 'Failed',
        position: 'top-right',
        message: `Failed to create category: ${error instanceof Error ? error.message : 'Unknown error'}`,
      })
    } finally {
      setLoading(false);
    }
  }


  const CREATE_CATEGORY_SCHEMA = Yup.object().shape({
    url: Yup.string().required('URL is required'),
  })

  const formik = useFormik({
    initialValues: {
      url: '',
    },
    onSubmit: handleSubmit,
    validationSchema: CREATE_CATEGORY_SCHEMA,
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
              label="Category URL"
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
            Add Category
          </Button>
        </Stack>
      </form>
    </Box>
  )
}

export default CreateCategoryForm