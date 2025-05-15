"use client";
import {
  createScheduleAPI,
  getSchedulePageDataAPI,
} from "@/lib/api/endpoints/schedule";
import {
  Box,
  Button,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { revalidateScheduleList } from "../../action";

interface CreateScheduleFormPropsType {
  close: () => void;
}
const CreateScheduleForm = ({ close }: CreateScheduleFormPropsType) => {
  const [loading, setLoading] = useState(false);
  const [pageDataLoading, setPageDataLoading] = useState(false);
  const [pageData, setPageData] = useState<any>([]);

  useEffect(() => {
    setPageDataLoading(true);
    async function fetchData() {
      const res = await getSchedulePageDataAPI();
      setPageData(res.data);

      setPageDataLoading(false);
    }
    fetchData();
  }, []);

  const handleSubmit = async (submitData: {
    website_id: string;
    interval_ms: number;
  }) => {
    setLoading(true);
    try {
      await createScheduleAPI({
        website_id: submitData.website_id,
        interval_ms: submitData.interval_ms,
      });
      close();
      notifications.show({
        color: "green",
        title: "Sucess",
        position: "top-right",
        message: "Schedule created successfully!",
      });
      revalidateScheduleList();
    } catch (error) {
      console.log(error);
      notifications.show({
        color: "red",
        title: "Failed",
        position: "top-right",
        message: `Failed to create schedule: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    } finally {
      setLoading(false);
    }
  };

  const CREATE_SCHEDULE_SCHEMA = Yup.object().shape({
    website_id: Yup.string().required("Website is required"),
    interval_ms: Yup.number().required("Interval is required"),
  });

  const formik = useFormik({
    initialValues: {
      website_id: "",
      interval_ms: 0,
    },
    onSubmit: handleSubmit,
    validationSchema: CREATE_SCHEDULE_SCHEMA,
  });

  return (
    <Box p={"lg"} bg="var(--mantine-color-gray-light)">
      <form onSubmit={formik.handleSubmit}>
        <Stack>
          <Box>
            <NumberInput
              name="interval_ms"
              label="Interval in Seconds"
              value={formik.values.interval_ms}
              onChange={(value) =>
                formik.setFieldValue("interval_ms", value || 0)
              }
              onBlur={formik.handleBlur}
              error={formik.touched.interval_ms && formik.errors.interval_ms}
            />
          </Box>
          <Box>
            <Select
              name="website_id"
              label="Website"
              placeholder="Select a website"
              data={pageData.map((website) => ({
                value: website.id,
                label: website.name,
              }))}
              value={formik.values.website_id}
              onChange={(value) => formik.setFieldValue("website_id", value)}
              onBlur={formik.handleBlur}
              error={formik.touched.website_id && formik.errors.website_id}
              disabled={pageDataLoading}
            />
          </Box>
          <Button type="submit" loading={loading}>
            Create Schedule
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default CreateScheduleForm;
