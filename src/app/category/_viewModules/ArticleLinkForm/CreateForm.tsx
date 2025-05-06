import { createArticleLinkAPI } from '@/lib/api/endpoints/article-links';
import { Box, Button, Stack, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useFormik } from 'formik';
import React, { useState } from 'react'
import * as Yup from "yup";
import { revalidateArticleLinkList } from '../../action';

interface CreateArticleLinkFormPropsType {
  close: () => void;
  category_id: string;
}

const CreateArticleLinkForm = ({ close, category_id }: CreateArticleLinkFormPropsType) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (submitData: { url: string }) => {
    setLoading(true);
    try {
      await createArticleLinkAPI({ category_id, url: submitData.url });
      revalidateArticleLinkList()
      close();
      notifications.show({
        color: 'green',
        title: 'Sucess',
        position: 'top-right',
        message: 'Article link added successfully!',
      })
    } catch (error) {
      console.log(error)
      notifications.show({
        color: 'red',
        title: 'Failed',
        position: 'top-right',
        message: `Failed to create article link: ${error instanceof Error ? error.message : 'Unknown error'}`,
      })
    } finally {
      setLoading(false);
    }
  }


  const CREATE_ARTICLE_LINK_SCHEMA = Yup.object().shape({
    url: Yup.string().required('URL is required'),
  })

  const formik = useFormik({
    initialValues: {
      url: '',
    },
    onSubmit: handleSubmit,
    validationSchema: CREATE_ARTICLE_LINK_SCHEMA,
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
              label="Artilce URL"
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
            Add Article Link
          </Button>
        </Stack>
      </form>
    </Box>
  )
}

export default CreateArticleLinkForm