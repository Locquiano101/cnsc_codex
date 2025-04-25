const PostContext = [
  {
    type: "documents",
    owner: "Proficient Architects Of Information Systems",
    owner_profile: "../general/ccms_praxis_logo.jpg",
    caption:
      "Proficient Architects of Information Systems Constitution and By-Laws",
    fileDirectory: "../general/PRAXIS_CBL.pdf",
    postedAt: Date.now(),
  },
  {
    type: "images",
    owner: "Union of Supreme Student Government",
    owner_profile: "../general/ussg_logo.jpg",
    caption: "Event Photos: Hayag",
    fileDirectory: [
      "./general/hayag_(1).jpg",
      "./general/hayag_(2).jpg",
      "./general/hayag_(3).jpg",
      "./general/hayag_(4).jpg",
      "./general/hayag_(4).jpg",
      "./general/hayag_(4).jpg",
    ],
    postedAt: Date.now(),
  },
  {
    type: "images",
    owner: "Union of Supreme Student Government",
    owner_profile: "../general/ussg_logo.jpg",
    caption: "Event Photos: Hayag",
    fileDirectory: [
      "./general/hayag_(1).jpg",
      "./general/hayag_(2).jpg",
      "./general/hayag_(3).jpg",
      "./general/hayag_(4).jpg",
      "./general/hayag_(4).jpg",
      "./general/hayag_(4).jpg",
    ],
    postedAt: Date.now(),
  },
  {
    type: "images",
    owner: "Union of Supreme Student Government",
    owner_profile: "../general/ussg_logo.jpg",
    caption: "Event Photos: Hayag",
    fileDirectory: [
      "./general/hayag_(1).jpg",
      "./general/hayag_(2).jpg",
      "./general/hayag_(3).jpg",
      "./general/hayag_(4).jpg",
      "./general/hayag_(4).jpg",
      "./general/hayag_(4).jpg",
    ],
    postedAt: Date.now(),
  },
];

export default function PostTemplate() {
  return (
    <div className="py-4 px-8 space-y-4 w-full h-auto ">
      {PostContext.map((post, index) => (
        <div
          key={index}
          className=" bg-gray-300 rounded-lg shadow-md px-8 py-6"
        >
          {/* Profile and Org Name */}
          <div className="flex items-center space-x-3">
            <img
              src={post.owner_profile}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h1 className="text-sm font-semibold">{post.owner}</h1>
              <p className="text-xs text-gray-500">
                {new Date(post.postedAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Post Caption */}
          <div className="mt-3 text-sm text-gray-800">
            <p>{post.caption}</p>
          </div>

          {/* File Display */}
          <div className="mt-3">
            {post.type === "documents" ? (
              <embed
                src={`${post.fileDirectory}#toolbar=0&navpanes=0&scrollbar=0`}
                className="w-full h-[700px] border-none"
                title="PDF Viewer"
              />
            ) : post.type === "images" ? (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {post.fileDirectory.slice(0, 4).map((img, index) => (
                  <div
                    key={index}
                    className="relative border border-gray-500 rounded-lg"
                  >
                    <img
                      src={img}
                      alt={`Post Image ${index + 1}`}
                      className="w-full h-[16rem] object-cover rounded-lg cursor-pointer"
                    />
                    {index === 3 && post.fileDirectory.length > 4 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold rounded-lg">
                        +{post.fileDirectory.length - 4}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
