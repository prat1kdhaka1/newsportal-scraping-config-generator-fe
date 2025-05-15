import SchedulesTable from "@/components/Tables/SchedulesTable";
import { getScheduleListAPI } from "@/lib/api/endpoints/schedule";

export default async function Schedules() {
  const schedules = await getScheduleListAPI();

  return (
    <>
    <p className="text-2xl font-bold">Schedules</p>
    <SchedulesTable data={schedules.data} />
    </>
  )
}
