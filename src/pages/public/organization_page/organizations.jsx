import React, { useState } from "react";
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
    logo: "/general/ussg_logo.jpg",
    name: "Union of Supreme Student Government",
  },
  {
    logo: "/general/ussg_logo.jpg",
    name: "Union of Supreme Student Government",
  },
  {
    logo: "/general/ussg_logo.jpg",
    name: "Union of Supreme Student Government",
  },
  {
    logo: "/general/ussg_logo.jpg",
    name: "Union of Supreme Student Government",
  },
  {
    logo: "/general/ussg_logo.jpg",
    name: "Union of Supreme Student Government",
  },
  {
    logo: "/general/ussg_logo.jpg",
    name: "Union of Supreme Student Government",
  },
  {
    logo: "/general/ussg_logo.jpg",
    name: "Union of Supreme Student Government",
  },
  // Add more...
];

export default function OrganizationPage() {
  return (
    <div className="container mx-auto px-4 py-28">
      <h1 className="text-4xl font-extrabold text-center text-cnsc-primary-color mb-16">
        Recognized Student Organizations
      </h1>

      <div className="flex flex-wrap justify-center gap-10 bg-gray-100 p-20 rounded- shadow-2xs">
        {Organizations.map((org, index) => (
          <Link
            to="/organization/profile"
            key={index}
            className="relative w-48 h-48 rounded-full bg-white border-2 border-gray-200 shadow-xl overflow-hidden group transition-all duration-500 hover:w-[25rem] hover:shadow-2xl hover:scale-[1.03]"
          >
            {/* Glow Ring Animation */}
            <div className="absolute top-0 left-0 w-full h-full rounded-full bg-gradient-to-br from-cnsc-primary-color to-cnsc-secondary-color opacity-0 group-hover:opacity-20 blur-md z-0 transition-all duration-500" />

            {/* Logo */}
            <div className="w-48 h-48 flex items-center justify-center bg-white border-r border-gray-200 rounded-full z-10">
              <img
                src={org.logo}
                alt={org.name}
                className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Text Slide In */}
            <div className="absolute left-48 top-0 h-full w-[calc(100%-12rem)] flex flex-col justify-center px-6 opacity-0 group-hover:opacity-100 translate-x-8 group-hover:translate-x-0 transition-all duration-500 ease-in-out">
              <h2 className="text-xl font-bold text-cnsc-primary-color">
                {org.name}
              </h2>
              <p className="text-sm text-gray-700 mt-1">
                <strong>Established:</strong> 2020
              </p>
              <p className="text-sm text-gray-700">
                <strong>Location:</strong> Main Campus
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
