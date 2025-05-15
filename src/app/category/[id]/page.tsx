import ContentsCard from "@/components/Cards/ContentsCard";
import ArticleLinksTable from "@/components/Tables/ArticleLinksTable";
import RegexpTable from "@/components/Tables/RegexpTable";
import { getArticleLinkListAPI } from "@/lib/api/endpoints/article-links";
import { getCategoryByIdAPI } from "@/lib/api/endpoints/category";
import { getConfigListAPI } from "@/lib/api/endpoints/config";
import { getContentListAPI } from "@/lib/api/endpoints/content";
import { Stack, Text } from "@mantine/core";


export default async function Page({ params }: { params: { id: string } }) {
  const idParam = await params;
  const categoryData = await getCategoryByIdAPI(idParam.id);
  const articleLinkData = await getArticleLinkListAPI(idParam.id);
  const configData = await getConfigListAPI(idParam.id)
  const contentData = await getContentListAPI(idParam.id, 0, 50);
  return (
    <Stack>
      <Text>{categoryData?.data?.url}</Text>
      <ArticleLinksTable data={articleLinkData?.data} category_id={idParam.id} />
      <RegexpTable data={configData?.data}></RegexpTable>
      <ContentsCard data={contentData?.data}></ContentsCard>
    </Stack>
  );
}
