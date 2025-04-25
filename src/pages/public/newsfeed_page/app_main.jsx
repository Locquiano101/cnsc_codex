import { useState } from "react";
import NewsFeedSidePanel from "./newsfeed_side_panel";
import PostTemplate from "./newsfeed_post_template";
import EventCalendar from "./newsfeed_event_calendar";

export default function NewsFeedPage() {
  return (
    <>
      <div className="grid grid-cols-5 gap-x-4 w-9/10 pt-28 mx-auto">
        {/* Side Panel - Left */}
        <div className="col-span-1">
          <div className="sticky top-28">
            <NewsFeedSidePanel />
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-3">
          <PostTemplate />
        </div>

        {/* Event Calendar - Right */}
        <div className="col-span-1">
          <div className="sticky top-28">
            <EventCalendar />
          </div>
        </div>
      </div>
    </>
  );
}
