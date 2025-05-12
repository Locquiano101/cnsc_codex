import EventCalendar from "../newsfeed_page/newsfeed_event_calendar";
import PostTemplate from "../newsfeed_page/newsfeed_post_template";
import { FileRenderer } from "../../../components/file_renderer";
import { faFileAlt, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function OrganizationProfilePage() {
  const documents = [
    { fileName: "letter for reconsideration.docx.pdf", basePath: "/files" },
    { fileName: "letter for reconsideration.docx.pdf", basePath: "/files" },
  ];

  const basePath = `/Proficient Architects of Information Systems/Proposals/asdfasdfasdf/`;

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col container mx-auto px-4">
      {/* Profile Section */}
      <div className="relative w-full h-auto shadow-lg rounded-lg bg-white">
        <div className="w-full h-40 bg-gray-300 rounded-t-lg"></div>
        <div className="absolute top-28 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gray-400 rounded-full border-4 border-white"></div>
        <div className="flex flex-col text-center pt-14 px-4 pb-6">
          <h2 className="text-lg font-bold">Organization Name</h2>
          <p className="text-gray-500 text-sm">
            This is where the description of the org will be displayed.
          </p>
        </div>
        <hr />
        <div className="flex justify-end px-4 py-2">
          <button className="bg-gray-200 text-sm px-3 py-1 rounded flex items-center gap-1">
            Filter
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="w-full py-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Posts */}
        <div className="md:col-span-3">
          <PostTemplate />
        </div>

        {/* Sidebar (visible only on md and up) */}
        <div className="hidden md:flex flex-col gap-4 col-span-1">
          {/* Documents Section */}
          <div className="bg-blue-100 p-4 shadow-lg rounded-lg">
            <h3 className="font-semibold">DOCUMENTS</h3>
            <div className="flex flex-col gap-2 mt-2">
              {documents.map((doc, index) => (
                <div key={index} className="w-full bg-white rounded ">
                  <FileRenderer basePath={basePath} fileName={doc.fileName} />
                </div>
              ))}
              <div className="p-2 w-full flex flex-col justify-center items-center rounded-lg shadow-md bg-white">
                <FontAwesomeIcon
                  icon={faFileAlt}
                  className="text-[3rem] font-black"
                />
                <a
                  href="/general/PRAXIS_CBL.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 text-md underline h-full"
                >
                  (preview) - PRAXIS_CBL.pdf
                </a>
              </div>
            </div>
            <button className="mt-2 bg-blue-500 text-white py-1 px-4 rounded">
              SEE MORE
            </button>
          </div>
          <EventCalendar />
        </div>
      </div>

      {/* Floating buttons - visible on small screens only */}
      <div className="fixed bottom-4 right-4 flex gap-3 z-50 md:hidden  flex-col">
        <a
          href="#"
          className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm hover:bg-cyan-700"
        >
          <FontAwesomeIcon icon={faFileAlt} className="text-lg" />
          Documents
        </a>
        <a
          href="#"
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm hover:bg-orange-600"
        >
          <FontAwesomeIcon icon={faCalendarAlt} className="text-lg" />
          Event Calendar
        </a>
      </div>
    </div>
  );
}
