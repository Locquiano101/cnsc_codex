export default function DeanOverview({ organizations = [] }) {
  return (
    <div className="h-full grid grid-cols-6 grid-rows-5 gap-4 p-4">
      {/* Box 1 - Display organization data */}
      <div className="border col-span-4 row-span-2 overflow-y-auto p-4">
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

      {/* Boxes 2–8 */}
      <div className="border col-span-2">2</div>
      <div className="border col-span-2">3</div>
      <div className="border col-span-4 row-span-2">5</div>
      <div className="border col-span-2 row-span-1">4</div>
      <div className="border col-span-2 row-span-1">6</div>
      <div className="border col-span-3">7</div>
      <div className="border col-span-3">8</div>
    </div>
  );
}
