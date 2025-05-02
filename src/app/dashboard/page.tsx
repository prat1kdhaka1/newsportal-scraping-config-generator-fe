import DashboardComponent from "@/components/Dashboard";
import { getWebsiteListAPI } from "@/lib/api/endpoints/website";
export default async function Dashboard() {
  const websiteList = await getWebsiteListAPI();
  const data = websiteList?.data

  return (
    <>
      <DashboardComponent data={data} />
    </>
  )
}
