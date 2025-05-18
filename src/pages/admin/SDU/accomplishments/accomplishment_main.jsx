import OrganizationPage from "../../../public/organization_page/organizations";
import EventsPieChart from "./accomplishment_events_counter";
import AccomplishmentsTable from "./accomplishment_table";
import OrganizationLeaderboard from "./accomplishment_top_org";

export default function SDUAccomplishmentMain() {
  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex h-[45%] gap-6">
        <div className="flex-1 shadow-2xl w-3/5 bg-gray-300 rounded-[24px]">
          <EventsPieChart />
        </div>
        <div className=" shadow-2xl w-2/5 bg-gray-300 rounded-[24px] overflow-hidden">
          <OrganizationLeaderboard />
        </div>
      </div>
      {/*TABLE*/}
      <div className="flex-3/4 text-lg shadow-2xl overflow-hidden bg-gray-300 rounded-[24px]">
        <AccomplishmentsTable />
      </div>
    </div>
  );
}
