import React, { useState } from 'react';
import { ArrowUp, ArrowDown, MessageSquare, Share, Bookmark } from 'lucide-react';
import CommentSection from './CommentSection';

// A utility to format time differences nicely (e.g., "5 hours ago")
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

const PostCard = ({ post, onVote, onToggleSave, onAddComment, theme }) => {
  const isDark = theme === 'dark';
  const [showComments, setShowComments] = useState(false);
  
  const voteColor = (voteType) => {
    if (post.userVote === voteType) {
      return voteType === 'up' ? 'text-orange-500' : 'text-blue-500';
    }
    return isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200';
  };

  return (
    <div className={`flex rounded-lg border transition-colors duration-200 ${
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
    }`}>
      {/* Vote Section */}
      <div className={`flex flex-col items-center p-2 space-y-1 rounded-l-lg ${
        isDark ? 'bg-gray-900' : 'bg-gray-100'
      }`}>
        <button onClick={() => onVote(post.id, 'up')} className={`p-1 rounded ${voteColor('up')}`}>
          <ArrowUp className="w-5 h-5" />
        </button>
        <span className="text-sm font-bold">{post.score.toLocaleString()}</span>
        <button onClick={() => onVote(post.id, 'down')} className={`p-1 rounded ${voteColor('down')}`}>
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>

      {/* Post Content */}
      <div className="flex-1 p-4">
        {/* Post Metadata */}
        <div className="flex items-center text-xs space-x-2 mb-2">
          <span className="font-bold">{`r/${post.community}`}</span>
          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>•</span>
          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            Posted by u/{post.author} {timeAgo(post.created)}
          </span>
        </div>
        
        {/* Title */}
        <h2 className="text-lg font-semibold mb-2">{post.title}</h2>

        {/* Content */}
        <div className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
          {post.content && (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          )}
        </div>

        {/* Image */}
        {post.imgUrl && (
          <div className="mt-3">
            <img 
              src={post.imgUrl} 
              alt={post.title}
              className="max-w-full h-auto rounded-lg"
              style={{ maxHeight: '500px' }}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-4 mt-4 text-sm">
          <button
            onClick={() => setShowComments((s) => !s)}
            className={`flex items-center space-x-1 p-2 rounded ${
            isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'
          }`}>
            <MessageSquare className="w-4 h-4" />
            <span>{post.comments.length} Comments</span>
          </button>
          <button className={`flex items-center space-x-1 p-2 rounded ${
            isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'
          }`}>
            <Share className="w-4 h-4" />
            <span>Share</span>
          </button>
          <button 
            onClick={() => onToggleSave(post.id)}
            className={`flex items-center space-x-1 p-2 rounded transition-colors ${
            post.isSaved 
              ? 'text-blue-500' 
              : isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'
          }`}>
            <Bookmark className={`w-4 h-4 ${post.isSaved ? 'fill-current' : ''}`} />
            <span>{post.isSaved ? 'Unsave' : 'Save'}</span>
          </button>
        </div>

        {showComments && (
          <div className="pt-2">
            <CommentSection
              comments={post.comments}
              onAddComment={(content, parentId) => onAddComment(post.id, content, parentId)}
              theme={theme}
              hideComposer={false}
              noBorder={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;