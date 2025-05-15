"use client";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Box, Button, NumberInput, Select, Stack } from "@mantine/core";
import { getWebsiteByIdAPI } from "@/lib/api/endpoints/website";
import { notifications } from "@mantine/notifications";
import {
  getSchedulePageDataAPI,
  updateScheduleAPI,
} from "@/lib/api/endpoints/schedule";
import { revalidateSchedule, revalidateScheduleList } from "../../action";

interface ScheduleType {
  id: string;
  website_id: string;
  interval_ms: number;
}

interface UpdateScheduleFormPropsType {
  close: () => void;
  schedule: ScheduleType;
}

const UpdateScheduleForm = ({
  close,
  schedule,
}: UpdateScheduleFormPropsType) => {
  const [loading, setLoading] = useState(false);

  const [pageDataLoading, setPageDataLoading] = useState(false);
  const [pageData, setPageData] = useState<any>([]);
  const [websiteData, setWebsiteData] = useState<any>([]);

  useEffect(() => {
    setPageDataLoading(true);
    async function fetchData() {
      const res = await getSchedulePageDataAPI();
      setPageData(res.data);

      setPageDataLoading(false);
    }
    async function fetchWebsiteData() {
      const res = await getWebsiteByIdAPI(schedule.website_id);
      setWebsiteData(res.data);

      setPageDataLoading(false);
    }
    fetchData();
    fetchWebsiteData();
  }, []);

  const handleSubmit = async (submitData: {
    website_id: string;
    interval_ms: number;
  }) => {
    setLoading(true);
    try {
      // Make sure you have updateScheduleAPI imported and use the correct endpoint
      await updateScheduleAPI(schedule.id, submitData);
      // Make sure you have revalidateSchedule function
      revalidateSchedule(schedule.id);
      close();
      notifications.show({
        color: "green",
        title: "Success",
        position: "top-right",
        message: "Schedule updated successfully!",
      });
    } catch (error) {
      console.error(error);
      notifications.show({
        color: "red",
        title: "Failed",
        position: "top-right",
        message: `Failed to update schedule: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    } finally {
      setLoading(false);
    }
  };

  const UPDATE_SCHEDULE_SCHEMA = Yup.object().shape({
    website_id: Yup.string().required("Website ID is required"),
    interval_ms: Yup.string().required("Interval is required"),
  });

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      website_id: websiteData.id || "",
      interval_ms: schedule.interval_ms,
    },
    onSubmit: handleSubmit,
    validationSchema: UPDATE_SCHEDULE_SCHEMA,
  });

  if (pageDataLoading || !websiteData.id) {
    return <Box p="lg">Loading...</Box>;
  }

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
              placeholder="Select website"
              data={pageData.map((website) => ({
                value: website.id,
                label: website.name,
              }))}
              value={formik.values.website_id}
              onChange={(value) =>
                formik.setFieldValue("website_id", value || "")
              }
              onBlur={formik.handleBlur}
              error={formik.touched.website_id && formik.errors.website_id}
              disabled={pageDataLoading}
            />
          </Box>
          <Button type="submit" loading={loading} disabled={pageDataLoading}>
            Create Schedule
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default UpdateScheduleForm;
