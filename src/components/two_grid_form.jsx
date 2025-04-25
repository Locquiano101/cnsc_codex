import React, { useState } from "react";

export const TwoGridForm = ({ fields, formData, onChange }) => {

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
      {fields.map((field) => (
        <div key={field.id} className="flex flex-col gap-1 w-full">
          <label htmlFor={field.id}>
            <span className="text-red-600 text-2xl mr-2">*</span>
            {field.label}
          </label>
          <input
            type={field.type || "text"}
            id={field.id}
            className="border rounded px-4 py-2"
            placeholder={field.placeholder}
            value={formData[field.id] || ""}
            onChange={handleChange}
          />
        </div>
      ))}
    </div>
  );
};

export const SingleForm = ({ fields, formData, onChange }) => {
  const handleChange = (e) => {
    onChange({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
      {fields.map((field) => (
        <div key={field.id} className="flex flex-col gap-1 w-full">
          <label htmlFor={field.id}>
            <span className="text-red-600 text-2xl mr-2">*</span>
            {field.label}
          </label>
          <input
            type={field.type || "text"}
            id={field.id}
            className="border rounded px-4 py-2"
            placeholder={field.placeholder}
            value={formData[field.id] || ""}
            onChange={handleChange}
          />
        </div>
      ))}
    </div>
  );
};
