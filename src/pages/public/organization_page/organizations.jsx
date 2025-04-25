import { React } from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const Organizations = [
  {
    logo: "/general/ccms_its_logo.jpg",
    name: "Information Technology Society",
  },
  {
    logo: "/general/ccms_sg_logo.jpg",
    name: "CCMS - Student Government",
  },
  {
    logo: "/general/ussg_logo.jpg",
    name: "Union of Supreme Student Government",
  },
  {
    logo: "/general/ccms_its_logo.jpg",
    name: "Information Technology Society",
  },
  {
    logo: "/general/ccms_sg_logo.jpg",
    name: "CCMS - Student Government",
  },
  {
    logo: "/general/ussg_logo.jpg",
    name: "Union of Supreme Student Government",
  },
  {
    logo: "/general/ccms_its_logo.jpg",
    name: "Information Technology Society",
  },
  {
    logo: "/general/ccms_sg_logo.jpg",
    name: "CCMS - Student Government",
  },
  {
    logo: "/general/ussg_logo.jpg",
    name: "Union of Supreme Student Government",
  },
  {
    logo: "/general/ccms_its_logo.jpg",
    name: "Information Technology Society",
  },
  {
    logo: "/general/ccms_sg_logo.jpg",
    name: "CCMS - Student Government",
  },
  {
    logo: "/general/ussg_logo.jpg",
    name: "Union of Supreme Student Government",
  },
];

export default function OrganizationPage() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="flex flex-wrap  items-center container justify-between gap-4 pt-28 mx-auto">
      {Organizations.map((org, index) => (
        <Link
          to="/organization/profile"
          key={index}
          className={`group flex items-center h-48 w-48 hover:w-[26rem] transition-all duration-500 ease-in-out bg-white border border-gray-300 rounded-full overflow-hidden shadow cursor-pointer`}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Logo Section */}
          <div className="min-w-[12rem] h-full flex justify-center items-center bg-white rounded-full border-r border-gray-200">
            <img
              src={org.logo}
              alt={org.name}
              className="w-48 h-48 object-cover rounded-full"
            />
          </div>

          {/* Info Section */}
          <div
            className={`h-full flex items-center text-sm transition-all duration-500 overflow-hidden ${
              hoveredIndex === index
                ? "opacity-100 px-6 w-full"
                : "opacity-0 px-0 w-0"
            }`}
          >
            <div className="text-gray-700 space-y-1">
              <p className="font-semibold">{org.name}</p>
              <p>
                <strong>Established:</strong> 2020
              </p>
              <p>
                <strong>Location:</strong> Main Campus
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
