import { useState } from "react";
import NewsFeedSidePanel from "./newsfeed_side_panel";
import PostTemplate from "./newsfeed_post_template";
import EventCalendar from "./newsfeed_event_calendar";

export default function NewsFeedPage() {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-red-700 text-white flex items-center justify-between px-4 md:px-8 h-16 shadow-md z-50">
        {/* Hamburger Menu */}
        <button className="text-white md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {/* Logo */}
        <div className="flex-grow text-center">
          <img
            src="public/general/cnsc_codex.png" // <-- replace with your logo path
            alt="Logo"
            className="h-15 inline"
          />
        </div>

        {/* Empty div for spacing */}
        <div className="w-6 md:hidden"></div>
      </header>

      {/* Page Content */}
      <div className="pt-20 px-4 md:px-8">
        {/* Layout */}
        <div className="flex flex-col space-y-6 md:space-y-0 md:grid md:grid-cols-5 md:gap-x-6 mx-auto">
          {/* Side Panel - Left (desktop only) */}
          <div className="hidden md:block col-span-1 sticky top-28">
            <NewsFeedSidePanel />
          </div>

          {/* Main Content */}
          <div className="col-span-3 w-full">
            <PostTemplate />
          </div>

          {/* Event Calendar - Right (desktop only) */}
          <div className="hidden md:block col-span-1 sticky top-28">
            <EventCalendar />
          </div>
        </div>

        {/* Floating Mobile Buttons */}
        <div className="fixed bottom-6 right-6 flex flex-col space-y-4 md:hidden">
          {/* Documents Button */}
          <button
            id="con"
            onClick={() => {
              console.log("Documents button clicked");
              // Example: You can trigger openDocuments() function here
            }}
            className="bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg"
          >
            Documents
          </button>

          {/* Event Calendar Button */}
          <button
            id="con"
            onClick={() => {
              console.log("Event Calendar button clicked");
              // Example: You can trigger openEventCalendar() function here
            }}
            className="bg-orange-500 text-white px-5 py-3 rounded-full shadow-lg"
          >
            Event Calendar
          </button>
        </div>
      </div>
    </div>
  );
}
