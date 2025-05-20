import OssdOrganizations from "./ossd_organization";

export default function DeanOverview({ organization, user }) {
  return (
    <div className="col-span-5 row-span-4 overflow-y-auto p-4">
      <OssdOrganizations organization={organization} user={user} />
    </div>
  );
}
