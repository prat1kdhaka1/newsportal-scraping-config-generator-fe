import { updateArticleLinkAPI } from '@/lib/api/endpoints/article-links';
import { Box, Button, Stack, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useFormik } from 'formik';
import React, { useState } from 'react'
import * as Yup from "yup";
import { revalidateArticleLink } from '../../action';


interface ArticleLinkType {
  id: string;
  category_id: string;
  url: string;
}

interface UpdateArticleLinkFormPropsType {
  close: () => void;
  article_link: ArticleLinkType;
}


const UpdateArticleLinkForm = ({ close, article_link }: UpdateArticleLinkFormPropsType) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (submitData: { url: string; }) => {
    setLoading(true);
    try {
      await updateArticleLinkAPI(article_link.id, article_link.category_id, submitData);
      revalidateArticleLink(article_link.id)
      close();
      notifications.show({
        color: 'green',
        title: 'Sucess',
        position: 'top-right',
        autoClose: 3000,
        message: 'Article link updated successfully!',
      })
    } catch (error) {
      console.log(error);
      notifications.show({
        color: 'red',
        title: 'Failed',
        position: 'top-right',
        autoClose: 3000,
        message: `Failed to update article link: ${error instanceof Error ? error.message : 'Unknown error'}`,
      })
    } finally {
      setLoading(false);
    }
  }

  const UPDATE_ARTICLE_LINK_SCHEMA = Yup.object().shape({
    url: Yup.string().required('URL is required'),
  })

  const formik = useFormik({
    initialValues: {
      url: article_link.url,
    },
    validationSchema: UPDATE_ARTICLE_LINK_SCHEMA,
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
              label="Article URL"
              value={formik.values.url}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.url && formik.errors.url ? String(formik.errors.url) : undefined}
            />
          </Box>
          <Button
            type='submit'
            loading={loading}
          >
            Update Article Link
          </Button>
        </Stack>
      </form>
    </Box>
  )
}

export default UpdateArticleLinkForm
