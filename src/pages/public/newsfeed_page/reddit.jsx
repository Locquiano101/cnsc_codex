import React from "react";

const data = {
  sidebar: {
    home: ["Popular", "Answers: BETA", "Explore", "All"],
    customFeeds: ["Create a custom feed"],
    recent: ["ImpracticalJokers", "ChatGPTJailbreak", "buhaydigital"],
    communities: ["Create a community", "adviceph", "arime", "whimsuggest"],
    catPost: {
      community: "cats",
      time: "3 hr ago",
      title: "Japanese cat",
    },
  },
  posts: [
    {
      community: "impserialJokers",
      title: "I went to Temu and I think I got the wrong item",
      upvotes: null,
      comments: null,
    },
    {
      community: "MicrosoftTejatSim",
      title: "How do I activate DLS5 3.1 have 4080 GPU but won't...",
      upvotes: 90,
      comments: 11,
    },
    {
      community: "overclocking",
      title: "How do I start overclocking my CPU and GPU?",
      upvotes: 5,
      comments: 10,
    },
    {
      community: "Kerosalba",
      title: "where can I read konsouhat?",
      upvotes: 64,
      comments: 19,
    },
    {
      community: "finishtgssls",
      title: "If Inca joined the Fire Force instead",
      upvotes: 7,
      comments: 12,
    },
    {
      community: "ChatSupport",
      title: "black myth wulong crack?",
      upvotes: 214,
      comments: 20,
    },
  ],
};

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
  "2025-02-15": ["Project deadline"],
  "2025-02-20": ["Meeting with client"],
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

// Post component
const Post = ({
  community,
  title,
  upvotes,
  comments,
  author = "u/anonymous",
  timestamp = "2 hours ago",
}) => {
  return (
    <div className="bg-white rounded-md shadow border flex mb-4">
      {/* Upvote Sidebar */}
      <div className="flex flex-col rounded-md items-center p-2 bg-gray-50 text-gray-500">
        <button className="hover:text-orange-500">▲</button>
        <span className="font-semibold">{upvotes}</span>
        <button className="hover:text-blue-500">▼</button>
      </div>

      {/* Post Content */}
      <div className="flex-1 p-4">
        <div className="text-xs text-gray-500 mb-1">
          <span className="text-black font-semibold">r/{community}</span> ·
          Posted by {author} {timestamp}
        </div>

        <h3 className="text-lg font-semibold text-blue-800 hover:underline cursor-pointer mb-2">
          {title}
        </h3>

        <div className="text-xs text-gray-500 mt-2 flex items-center space-x-4">
          <button className="hover:underline">{comments} Comments</button>
          <button className="hover:underline">Share</button>
          <button className="hover:underline">Save</button>
        </div>
      </div>
    </div>
  );
};

// Sidebar section component
const SidebarSection = ({ title, items, isCommunity = false }) => {
  return (
    <div className="mb-4 bg-white rounded-md border border-gray-200 overflow-hidden">
      {title && (
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
          <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            {title}
          </h4>
        </div>
      )}
      <ul>
        {items.map((item, index) => (
          <li
            key={index}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            {isCommunity ? `r/${item}` : item}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Main Sidebar component
const Sidebar = ({ catPost }) => {
  const { home, customFeeds, recent, communities } = data.sidebar;

  return (
    <div className="w-60 bg-white p-4 h-screen sticky top-0 overflow-y-auto">
      <h1 className="font-bold text-xl mb-6">reddit</h1>

      <SidebarSection items={home} />
      <hr className="my-4 border-gray-200" />
      <SidebarSection title="CUSTOM FEEDS" items={customFeeds} />
      <hr className="my-4 border-gray-200" />
      <SidebarSection title="RECENT" items={recent} isCommunity />
      <hr className="my-4 border-gray-200" />
      <SidebarSection title="COMMUNITIES" items={communities} isCommunity />

      <div className="mt-6">
        <div className="flex items-center text-xs text-gray-500 mb-1">
          <span className="text-gray-400">//{catPost.community}</span>
          <span className="mx-1">·</span>
          <span>{catPost.time}</span>
        </div>
        <h3 className="font-medium">{catPost.title}</h3>
      </div>
    </div>
  );
};

// Feed component
const Feed = ({ posts }) => {
  return (
    <div className="flex-1 p-5 max-w-2xl">
      <h2 className="text-lg font-bold mb-4">RECENT POSTS</h2>
      {posts.map((post, index) => (
        <Post key={index} {...post} />
      ))}
    </div>
  );
};

// Main App component
export default function RedditLanding() {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar catPost={data.sidebar.catPost} />
      <Feed posts={data.posts} />
      <EventCalendar />
    </div>
  );
}
