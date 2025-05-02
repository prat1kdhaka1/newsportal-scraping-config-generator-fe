import WebsiteCard from "@/components/Cards/WebsiteCard";
import CategoryTable from "@/components/Tables/CategoryTable";
import { getCategoryListAPI } from "@/lib/api/endpoints/category";
import { getWebsiteByIdAPI } from "@/lib/api/endpoints/website";
import { Center, Stack, Text } from "@mantine/core";


export default async function Page({ params }: { params: { id: string } }) {
  const idParam = await params;
  const data = await getWebsiteByIdAPI(idParam.id);
  const categoryData = await getCategoryListAPI(idParam.id);
  console.log(categoryData.data)

  return (
    <Stack>
      <WebsiteCard {...data?.data} />
      <CategoryTable data={categoryData.data} website_id={idParam.id} />
    </Stack>
  );
}
