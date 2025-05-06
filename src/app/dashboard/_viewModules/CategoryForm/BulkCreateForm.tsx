"use client";
import * as Yup from "yup";
import React, { useEffect, useState } from 'react'
import { useFormik } from "formik";
import { ActionIcon, Box, Button, Checkbox, Group, Loader, Stack, TextInput, Title } from "@mantine/core";

import { getTempCategoryListAPI } from "@/lib/api/endpoints/category-temp";

interface WebsiteType {
  id: string;
  name: string;
  url: string;
  is_active: boolean;
}

interface UpdateWebsiteFormProps {
  close: () => void;
  website_id: string;
}

const BulkCreateCateogryForm = ({ close, website_id }: UpdateWebsiteFormProps) => {
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState([]);
  const [nextId, setNextId] = useState(1000); // for new fields not from API

  const formik = useFormik({
    initialValues: {
      dynamicFields: {},
    },
    onSubmit: (values) => {
      console.log('Submitted values:', values);
    },
  });


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await getTempCategoryListAPI(website_id);
      const data = res.data;
      setFields(data);

      const dynamicInitialValues = {};
      data.forEach((item) => {
        dynamicInitialValues[`item_${item.id}`] = item.url;
      });

      formik.setValues({ dynamicFields: dynamicInitialValues });
      setLoading(false);
    };

    fetchData();
  }, []);


  const handleRemoveField = (itemId) => {
    setFields((prev) => prev.filter((item) => item.id !== itemId));
    formik.setValues((prevValues) => {
      const updated = { ...prevValues.dynamicFields };
      delete updated[`item_${itemId}`];
      return {
        ...prevValues,
        dynamicFields: updated,
      };
    });
  };


  const handleAddField = () => {
    const newId = nextId;
    setNextId((id) => id + 1);

    const newField = { id: newId, name: '' };
    setFields((prev) => [...prev, newField]);

    formik.setValues((prevValues) => ({
      ...prevValues,
      dynamicFields: {
        ...prevValues.dynamicFields,
        [`item_${newId}`]: '',
      },
    }));
  };

  if (loading) {
    return <Loader />
  }

  return (
    <Box p="lg" bg="var(--mantine-color-gray-light)">
      <form onSubmit={formik.handleSubmit}>
        <Stack>
          <Title order={4}>Extracted Category URLs</Title>
          {fields.map((item) => (
            <Group key={item.id} align="center" wrap="wrap">
              <TextInput
                name={`dynamicFields.item_${item.id}`}
                label={`URL`}
                w={'100%'}
                value={formik.values.dynamicFields?.[`item_${item.id}`] || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.dynamicFields?.[`item_${item.id}`] &&
                    formik.errors.dynamicFields?.[`item_${item.id}`]
                    ? String(formik.errors.dynamicFields?.[`item_${item.id}`])
                    : undefined
                }
              />
              <Button
                color="red"
                variant="light"
                size="xs"
                onClick={() => handleRemoveField(item.id)}
              >
                Remove
              </Button>
            </Group>
          ))}
          <Group>
            <Button
              variant="light"
              onClick={handleAddField}
              type="button"
            >
              Add Field
            </Button>
          </Group>
          <Button type="submit">Submit</Button>
        </Stack>
      </form>
    </Box>
  );
}

export default BulkCreateCateogryForm
