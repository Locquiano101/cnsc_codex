import {
  faClose,
  faFile,
  faFileAlt,
  faFolder,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export const FileRenderer = ({ basePath, fileName }) => {
  const isImage = /\.(jpe?g|png|gif|bmp|webp|svg)$/.test(fileName);
  const raw = `${basePath}/${isImage ? "photos" : "documents"}/${fileName}`;
  const url = encodeURI(raw);

  const [showModal, setShowModal] = useState(false);
  if (isImage) {
    return (
      <div className="object-cover h-70 object-center  rounded-lg flex-shrink-0 flex flex-wrap relative overflow-hidden">
        <img
          src={url}
          alt={fileName}
          className="w-full h-70x-2 rounded-lg object-cover cursor-pointer"
          onClick={() => setShowModal(true)}
        />

        {showModal && (
          <div
            className="fixed inset-0 bg-black/25 w-full bg-opacity-70 flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
          >
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <FontAwesomeIcon
                icon={faClose}
                className="text-[32px]  text-red-600 absolute top-2 right-4 cursor-pointer"
                onClick={() => setShowModal(false)}
              />
              <img
                src={url}
                alt={fileName}
                className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className=" p-2 w-full space-y-4 flex flex-col justify-center items-center rounded-lg shadow-md bg-white">
      <FontAwesomeIcon icon={faFileAlt} className="text-[3rem] font-black" />
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 text-md underline h-full"
      >
        (preview) - {fileName}
      </a>
    </div>
  );
};

export const FileRendererPinned = ({ basePath, fileName }) => {
  const isImage = /\.(jpe?g|png|gif|bmp|webp|svg)$/.test(fileName);
  const url = encodeURI(basePath);

  const [showModal, setShowModal] = useState(false);
  if (isImage) {
    return (
      <div className="object-cover  rounded-lg flex-shrink-0 flex flex-wrap relative">
        <img
          src={url}
          alt={fileName}
          className="h-100 w-auto mx-2 rounded-lg object-cover cursor-pointer"
          onClick={() => setShowModal(true)}
        />

        {showModal && (
          <div
            className="fixed inset-0 bg-black/25 w-full bg-opacity-70 flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
          >
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <FontAwesomeIcon
                icon={faClose}
                className="text-[32px]  text-red-600 absolute top-2 right-4 cursor-pointer"
                onClick={() => setShowModal(false)}
              />
              <img
                src={url}
                alt={fileName}
                className="h-full w-full  rounded-lg shadow-lg"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className=" p-2 w-full space-y-4 flex flex-col justify-center items-center rounded-lg shadow-md bg-white">
      <FontAwesomeIcon icon={faFileAlt} className="text-[3rem] font-black" />
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 text-md underline h-full"
      >
        (preview) - {fileName}
      </a>
    </div>
  );
};

export const FileRendererAll = ({ basePath, fileName }) => {
  const isImage = /\.(jpe?g|png|gif|bmp|webp|svg)$/i.test(fileName);
  const url = encodeURI(basePath);

  const [showModal, setShowModal] = useState(false);
  if (isImage) {
    return (
      <div className="object-cover rounded-lg ">
        <img
          src={url}
          alt={fileName}
          className="w-full h-full rounded-lg object-cover cursor-pointer"
          onClick={() => setShowModal(true)}
        />

        {showModal && (
          <div
            className="fixed inset-0 bg-black/25 w-full bg-opacity-70 flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
          >
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <FontAwesomeIcon
                icon={faClose}
                className="text-[52px] font-black text-red-600 absolute top-2 right-4 cursor-pointer"
                onClick={() => setShowModal(false)}
              />
              <img
                src={url}
                alt={fileName}
                className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className=" p-2 w-full flex flex-col justify-center items-center rounded-lg  bg-white">
      <FontAwesomeIcon icon={faFileAlt} className="text-[3rem] font-black" />
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 text-md underline h-full"
      >
        (preview) - {fileName}
      </a>
    </div>
  );
};

export function DocumentSection({ title, files, basePath }) {
  const [status, setStatus] = useState("pending");
  const [notes, setNotes] = useState("");

  if (!files || (Array.isArray(files) && files.length === 0)) {
    return (
      <section>
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="italic text-sm">None</p>
      </section>
    );
  }

  const fileList = Array.isArray(files) ? files : [files];

  return (
    <section className="border p-4 rounded shadow-sm mb-6 bg-gray-50">
      <h3 className="font-semibold mb-2">{title}</h3>

      <div className="space-y-2 mb-4">
        {fileList.map((file, i) => (
          <FileRenderer key={i} basePath={basePath} fileName={file} />
        ))}
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex gap-4">
          <label>
            <input
              type="radio"
              name={`${title}-status`}
              value="approved"
              checked={status === "approved"}
              onChange={() => setStatus("approved")}
            />
            <span className="ml-1">Approved</span>
          </label>
          <label>
            <input
              type="radio"
              name={`${title}-status`}
              value="revision"
              checked={status === "revision"}
              onChange={() => setStatus("revision")}
            />
            <span className="ml-1">Revision</span>
          </label>
        </div>

        {status === "revision" && (
          <textarea
            className="w-full h-24 border rounded p-2"
            placeholder="Enter revision notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        )}
      </div>
    </section>
  );
}

export function ProfilePictureRenderer({ OrgName, OrgLogo }) {
  console.log("alshdask", OrgName);
  const path = `/${OrgName}/Accreditation/Accreditation/photos/${OrgLogo}  `;

  return (
    <img
      src={OrgLogo ? path : "/general/cnsc_codex_ver_2.svg"}
      className="h-full w-full rounded-full aspect-square object-cover"
      alt="Organization Logo"
      onError={(e) => {
        e.target.src = "/general/default-org-logo.svg";
      }}
    />
  );
}
