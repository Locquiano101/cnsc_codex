import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faSignsPost,
} from "@fortawesome/free-solid-svg-icons";

const todos = {
  "2025-03-10": [
    "event from praxis",
    "CNSC LOCAL HAYAG",
    "CNSC LOCAL HAYAG",
    "CNSC LOCAL HAYAG",
    "CNSC LOCAL HAYAG",
    "CNSC LOCAL HAYAG",
    "CNSC LOCAL HAYAG",
  ],
  "2025-04-10": ["Project deadline"],
  "2025-04-30": ["Meeting with client"],
  "2025-04-16": ["Meeting with client"],
  "2025-02-12": ["Meeting with client"],
  "2025-04-26": ["Meeting with client"],
};

const EventCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const changeMonth = (direction) => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + direction, 1)
    );
    setSelectedDate(null);
  };

  const renderDays = () => {
    const days = [];
    let day = startDate;
    while (day <= endDate) {
      const dayKey = format(day, "yyyy-MM-dd");
      const hasTodos = todos[dayKey];

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(dayKey)}
          className={`items-center p-1 cursor-pointer ${
            !isSameMonth(day, monthStart) ? "text-gray-400" : ""
          } ${
            isSameDay(day, new Date())
              ? "bg-cnsc-primary-color text-white rounded"
              : ""
          } ${hasTodos ? "bg-cnsc-secondary-color rounded" : ""}`}
        >
          {format(day, "d")}
        </div>
      );
      day = addDays(day, 1);
    }
    return days;
  };

  return (
    <div className=" sticky top-0">
      <h1 className=" pt-4 text-cnsc-primary-color mb-4 text-center font-bold text-2xl">
        Event Calendar
      </h1>
      <div className="w-auto border h-auto border-cnsc-primary-color/75 m-2 bg-cnsc-primary-color/5 shadow-lg rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => changeMonth(-1)}
            className="px-4 py-2 bg-cnsc-secondary-color/75 rounded"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <h2 className="text-lg font-bold">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <button
            onClick={() => changeMonth(1)}
            className="px-4 py-2 bg-cnsc-secondary-color/75 rounded"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="font-bold">
              {day}
            </div>
          ))}
          {renderDays()}
        </div>
      </div>
      {selectedDate && todos[selectedDate] && (
        <div className="w-auto border h-auto border-cnsc-primary-color m-2 mt-4 bg-cnsc-primary-color/10 shadow-lg rounded-lg p-4">
          <h3 className="font-bold">Tasks for {selectedDate}</h3>
          <ul>
            {todos[selectedDate].map((todo, index) => (
              <li key={index} className="list-disc ml-4">
                {todo}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;
