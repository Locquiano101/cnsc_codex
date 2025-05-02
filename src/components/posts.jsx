import React from "react";
import PropTypes from "prop-types";

/**
 * PostCard - A reusable component for rendering various types of posts
 * @param {Object} props - Component props
 * @param {Object} props.post - Post data object
 * @param {string} props.post.type - Type of post ('documents', 'images', etc.)
 * @param {string} props.post.owner - Name of the post owner/organization
 * @param {string} props.post.owner_profile - URL to the owner's profile image
 * @param {string} props.post.caption - Post caption text
 * @param {string|Array} props.post.fileDirectory - File path or array of file paths
 * @param {number} props.post.postedAt - Timestamp when the post was created
 * @param {Object} props.className - Additional CSS classes for the post card
 * @param {number} props.maxImagesToShow - Maximum number of images to show before showing a count
 * @param {number} props.documentHeight - Height of embedded documents in pixels
 * @param {number} props.imageHeight - Height of images in pixels
 * @returns {JSX.Element} - Rendered component
 */
export const PostCard = ({
  post,
  className = "",
  maxImagesToShow = 4,
  imageHeight = 256, // 16rem
}) => {
  return (
    <div className={`bg-gray-300 rounded-lg shadow-md px-8 py-6 ${className}`}>
      {/* Profile and Org Name */}
      <div className="flex items-center space-x-3">
        <img
          src={post.owner_profile}
          alt={`${post.owner} profile`}
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
        {post.type === "documents" && (
          <embed
            src={`${post.fileDirectory}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full border-none h-92 "
            title="PDF Viewer"
          />
        )}

        {post.type === "images" && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {post.fileDirectory.slice(0, maxImagesToShow).map((img, index) => (
              <div
                key={index}
                className="relative border border-gray-500 rounded-lg"
              >
                <img
                  src={img}
                  alt={`Post Image ${index + 1}`}
                  className="w-full object-cover rounded-lg cursor-pointer"
                  style={{ height: `${imageHeight}px` }}
                />
                {index === maxImagesToShow - 1 &&
                  post.fileDirectory.length > maxImagesToShow && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold rounded-lg">
                      +{post.fileDirectory.length - maxImagesToShow}
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    type: PropTypes.string.isRequired,
    owner: PropTypes.string.isRequired,
    owner_profile: PropTypes.string.isRequired,
    caption: PropTypes.string.isRequired,
    fileDirectory: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]).isRequired,
    postedAt: PropTypes.number.isRequired,
  }).isRequired,
  className: PropTypes.string,
  maxImagesToShow: PropTypes.number,
  documentHeight: PropTypes.number,
  imageHeight: PropTypes.number,
};

/**
 * PostFeed - A component for rendering a feed of posts
 * @param {Object} props - Component props
 * @param {Array} props.posts - Array of post objects
 * @param {string} props.className - Additional CSS classes for the container
 * @param {string} props.postClassName - Additional CSS classes for each post card
 * @param {number} props.maxImagesToShow - Maximum number of images to show before showing a count
 * @param {number} props.documentHeight - Height of embedded documents in pixels
 * @param {number} props.imageHeight - Height of images in pixels
 * @returns {JSX.Element} - Rendered component
 */

export const PostFeed = ({
  posts,
  className = "",
  postClassName = "",
  maxImagesToShow = 4,
  documentHeight = 700,
  imageHeight = 256,
}) => {
  return (
    <div className={` ${className}`}>
      {posts.map((post, index) => (
        <PostCard
          key={index}
          post={post}
          className={postClassName}
          maxImagesToShow={maxImagesToShow}
          documentHeight={documentHeight}
          imageHeight={imageHeight}
        />
      ))}
    </div>
  );
};

PostFeed.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      owner: PropTypes.string.isRequired,
      owner_profile: PropTypes.string.isRequired,
      caption: PropTypes.string.isRequired,
      fileDirectory: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]).isRequired,
      postedAt: PropTypes.number.isRequired,
    })
  ).isRequired,
  className: PropTypes.string,
  postClassName: PropTypes.string,
  maxImagesToShow: PropTypes.number,
  documentHeight: PropTypes.number,
  imageHeight: PropTypes.number,
};

// Example usage:
// import { PostFeed } from './components/Post';
//
// function Home() {
//   return <PostFeed posts={postsData} />;
// }
