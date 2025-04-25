// src/components/PopUp.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";

export default function PopUp({ title, text, onClose, ButtonText }) {
  const navigate = useNavigate();
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupText, setPopupText] = useState("");

  const handleDone = () => {
    onClose(); // hide the modal
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };
  const handleClosePopup = () => setPopupVisible(false);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/25 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-2/3 max-w-lg rounded bg-cnsc-primary-color p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-4 text-white text-3xl font-bold"
          onClick={handleClosePopup}
        >
          ×
        </button>
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        <p className="text-white">{text}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 rounded bg-white text-black hover:bg-gray-100"
          >
            {ButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
