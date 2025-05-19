import OssdOrganizations from "./ossd_organization";

export default function DeanOverview({ organization, user }) {
  return (
    <div className="h-full grid grid-cols-6 grid-rows-5 gap-4 p-4">
      {/* Box 1 - Display organization data */}
      <div className="border col-span-5 row-span-4 overflow-y-auto p-4">
        <OssdOrganizations organization={organization} user={user} />
      </div>

      {/* Boxes 2–8 */}
      <div className="border col-span-1">2</div>
      <div className="border col-span-1">3</div>
      <div className="border col-span-4 row-span-2">5</div>
      <div className="border col-span-2 row-span-1">4</div>
      <div className="border col-span-2 row-span-1">6</div>
      <div className="border col-span-3">7</div>
      <div className="border col-span-3">8</div>
    </div>
  );
}
