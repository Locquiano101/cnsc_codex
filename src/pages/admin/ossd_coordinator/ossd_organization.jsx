export default function DeanOrganizationBoard({ organizations = [] }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Organizations</h2>
      {organizations.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <ul className="space-y-2">
          {organizations.map((org) => (
            <li key={org._id} className="p-3 border rounded shadow bg-white">
              <p>
                <strong>Name:</strong> {org.org_name}
              </p>
              <p>
                <strong>Acronym:</strong> {org.org_acronym}
              </p>
              <p>
                <strong>President:</strong> {org.org_president}
              </p>
              <p>
                <strong>Department:</strong>{" "}
                {org.org_type.Departments[0].Department}
              </p>
              <p>
                <strong>Course:</strong> {org.org_type.Departments[0].Course}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
