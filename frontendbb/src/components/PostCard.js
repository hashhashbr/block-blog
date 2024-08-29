import React from 'react';
import '../components/PostCard.css';

function PostCard({ post, onClick, onEdit, onDelete }) {
  return (
    <div className="post-card" onClick={() => onClick(post)}>
      {post.imageUrl && <img src={post.imageUrl} alt="Post" className="post-image" />}
      <div className="post-content">{post.content}</div>
      <div className="post-actions">
        <button className="edit-button" onClick={(e) => {
          e.stopPropagation();
          onEdit(post.id);
        }}>
          Edit
        </button>
        <button className="delete-button" onClick={(e) => {
          e.stopPropagation(); 
          onDelete(post.id);
        }}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default PostCard;
