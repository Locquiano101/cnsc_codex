import { useEffect, useState } from "react";
import { FetchOrganizations } from "../../../../api/fetch_organizations";
import { ProfilePictureRenderer } from "../../../../components/file_renderer";

export default function OrganizationViewSDU() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getOrganizations() {
      try {
        const data = await FetchOrganizations();
        setOrganizations(data);
      } catch (error) {
        console.error("Failed to load organizations", error);
      } finally {
        setLoading(false);
      }
    }

    getOrganizations();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3  gap-x-4 w-full h-full">
      {organizations.map((org) => (
        <div
          key={org._id}
          className="flex gap-4 rounded-2xl bg-white shadow-2xl p-4 h-[300px]"
        >
          <div className="h-20 w-20 aspect-square">
            <ProfilePictureRenderer OrgLogo={org.logo} OrgName={org.org_name} />
          </div>
          <div>{org.org_name}</div>
        </div>
      ))}
    </div>
  );
}
