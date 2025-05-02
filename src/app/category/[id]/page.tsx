import { getCategoryByIdAPI } from "@/lib/api/endpoints/category";
import { Stack, Text } from "@mantine/core";


export default async function Page({ params }: { params: { id: string } }) {
  const idParam = await params;
  const categoryData = await getCategoryByIdAPI(idParam.id);
  return (
    <Stack>
      <Text>Category Page {idParam.id}</Text>
      <Text>{categoryData?.data?.url}</Text>
    </Stack>
  );
}
