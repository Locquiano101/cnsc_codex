import EventCalendar from "../newsfeed_page/newsfeed_event_calendar";
import PostTemplate from "../newsfeed_page/newsfeed_post_template";
import { FileRenderer } from "../../../components/file_renderer";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function OrganizationProfilePage() {
  const documents = [
    { fileName: "letter for reconsideration.docx.pdf", basePath: "/files" },
    { fileName: "letter for reconsideration.docx.pdf", basePath: "/files" },
  ];

  const basePath = `/Proficient Architects of Information Systems/Proposals/asdfasdfasdf/`;

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col container mx-auto items-center">
      {/* Profile Section */}
      <div className="relative w-full h-auto shadow-lg rounded-lg ">
        <div className="w-full h-40 bg-gray-300 rounded-lg"></div>
        <div
          className="absolute top-30 left-1/2
         transform -translate-x-1/2 w-20 h-20 bg-gray-400 rounded-full border-4 border-white"
        ></div>
        <div className="flex flex-col text-center pt-12 gap-4 p-4 ">
          <h2 className="text-lg font-bold ">Organization Name</h2>
          <p className="text-gray-500 ">
            This is where the description of the org will be displayed.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full py-4 grid grid-cols-4 gap-6">
        {/* Posts */}
        <div className="col-span-3">
          <PostTemplate />
        </div>

        {/* Sidebar */}
        <div className="col-span-1 flex flex-col gap-4">
          {/* Documents Section */}

          <div className="bg-blue-100 p-4 shadow-lg rounded-lg">
            <h3 className="font-semibold">DOCUMENTS</h3>
            <div className="flex flex-col gap-2 mt-2">
              {documents.map((doc, index) => (
                <div key={index} className="w-full bg-white rounded ">
                  <FileRenderer basePath={basePath} fileName={doc.fileName} />
                </div>
              ))}
              <div className=" p-2 w-full flex flex-col justify-center items-center rounded-lg shadow-md bg-white">
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
    </div>
  );
}
