// import { faEye, faPencil } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { useEffect } from "react";
// import { fetchAccreditationAPI } from "../../../api/accreditation";
// // export default function Accredititation() {
// //   useEffect(() => {
// //     // Define an async function within the effect
// //     fetchAccreditationAPI();
// //     // Optionally, return a cleanup function if needed
// //   }, []);
// //   const sampleOrganizations = [
// //     "Organization 1, Renewal, Accredited",
// //     "Organization 2, Recognition, Pending",
// //     "Organization 3, Renewal,  Require Hard Copy Documents ",
// //   ];

// //   return (
// //     <div className="flex flex-col gap-4 p-4">
// //       <h1 className="text-center text-2xl font-bold">
// //         STUDENT ORGANIZATION ACCREDITATION
// //       </h1>
// //       <div className="overflow-x-auto">
// //         <table className="min-w-full bg-white  -gray-200">
// //           <thead>
// //             <tr className="bg-gray-200">
// //               <th className=" px-4 py-2 text-left">Organization Name</th>
// //               <th className=" px-4 py-2 text-left">Accreditation Type</th>
// //               <th className=" px-4 py-2 text-left">Overall Status</th>
// //               <th className=" px-4 py-2 text-left"></th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {sampleOrganizations.map((orgStr, index) => {
// //               // Split the string into parts based on commas
// //               const [orgName, accreditationType, overallStatus] = orgStr
// //                 .split(",")
// //                 .map((s) => s.trim());
// //               return (
// //                 <tr key={index} className="">
// //                   <td className=" px-4 py-2">{orgName}</td>
// //                   <td className=" px-4 py-2">{accreditationType}</td>
// //                   <td className=" px-4 py-2">{overallStatus}</td>
// //                   <td className="px-4 py-2 flex justify-around">
// //                     <FontAwesomeIcon
// //                       icon={faEye}
// //                       className="text-white px-4 py-2 bg-cnsc-accent-1-color"
// //                     />
// //                     <FontAwesomeIcon
// //                       icon={faPencil}
// //                       className="text-white px-4 py-2 bg-cnsc-secondary-color"
// //                     />
// //                   </td>
// //                 </tr>
// //               );
// //             })}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // }

import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ROUTER } from "./App";

export const Sandbox3 = () => {
  const [accreditations, setAccreditations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch accreditation data on mount
  useEffect(() => {
    const fetchAccreditations = async () => {
      try {
        const response = await axios.get(`${API_ROUTER}/get-accreditation`);
        const accreds = response.data.accreditations;

        setAccreditations(accreds);
      } catch (err) {
        console.error("Error fetching accreditation:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccreditations();
  }, []);

  // Helper function to determine if a file is an image based on its extension
  const isImageFile = (filename) => {
    return /\.(jpg|jpeg|png|gif)$/i.test(filename);
  };

  if (loading) return <div>Loading data…</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Accreditation Data</h1>
      {accreditations.map((acc) => {
        const safeOrgName = encodeURIComponent(acc.org_name);
        return (
          <div
            key={acc._id}
            className="mb-8 border border-gray-300 p-4 rounded-lg"
          >
            <h2 className="text-xl font-semibold mb-2">{acc.org_name}</h2>
            <table className="w-full text-left border-collapse mb-4">
              <tbody>
                <tr>
                  <th className="border px-3 py-2 w-1/4">Accreditation Type</th>
                  <td className="border px-3 py-2">
                    {acc.accreditation_status?.accreditation_type || "N/A"}
                  </td>
                </tr>
                <tr>
                  <th className="border px-3 py-2">Overall Status</th>
                  <td className="border px-3 py-2">
                    {acc.accreditation_status?.over_all_status || "N/A"}
                  </td>
                </tr>
                <tr>
                  <th className="border px-3 py-2">Adviser</th>
                  <td className="border px-3 py-2">
                    {acc.adviser_name} ({acc.adviser_email})
                  </td>
                </tr>
                <tr>
                  <th className="border px-3 py-2">Organization Logo</th>
                  <td className="border px-3 py-2">
                    {acc.logo ? (
                      <img
                        src={`/${safeOrgName}/Accreditation/photos/${acc.logo}`}
                        alt={`${acc.org_name} logo`}
                        className="max-w-[200px] border rounded"
                      />
                    ) : (
                      "No Logo"
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            {acc.accreditation_status?.documents_and_status?.length > 0 && (
              <>
                <h3 className="font-semibold mb-2">Documents</h3>
                <table className="w-full border border-gray-300 text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-3 py-2 w-1/3">Label</th>
                      <th className="border px-3 py-2 w-1/6">Status</th>
                      <th className="border px-3 py-2">File</th>
                    </tr>
                  </thead>
                  <tbody>
                    {acc.accreditation_status.documents_and_status.map(
                      (doc) => (
                        <tr key={doc._id}>
                          <td className="border px-3 py-2">{doc.label}</td>
                          <td className="border px-3 py-2">{doc.Status}</td>
                          <td className="border px-3 py-2">
                            {doc.file ? (
                              isImageFile(doc.file) ? (
                                <img
                                  src={`/${safeOrgName}/Accreditation/documents/${doc.file}`}
                                  alt={doc.label}
                                  className="max-w-[150px] rounded"
                                />
                              ) : (
                                <a
                                  href={`/${safeOrgName}/Accreditation/documents/${doc.file}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-blue-600 underline"
                                >
                                  {doc.file} - View
                                </a>
                              )
                            ) : (
                              "No File"
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
