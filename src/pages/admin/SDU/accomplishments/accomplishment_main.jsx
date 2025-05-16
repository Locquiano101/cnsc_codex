import AccomplishmentsTable from "./accomplishment_table";
import OrganizationLeaderboard from "./accomplishment_top_org";

export default function SDUAccomplishmentMain() {
  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex flex-1 gap-6">
        <div className="flex-1 shadow-2xl bg-gray-300 rounded-[24px]"></div>
        <div className="flex-1 shadow-2xl bg-gray-300 rounded-[24px]   overflow-auto">
          <OrganizationLeaderboard />
        </div>
      </div>
      {/*TABLE*/}
      <div className="flex-3/4 shadow-2xl overflow-hidden bg-gray-300 rounded-[24px]">
        <AccomplishmentsTable />
      </div>
    </div>
  );
}
