import React, { useState, useEffect } from 'react';
import '../components/CreatePostCard.css';

const CreatePostCard = ({ currentAccount, contract, setPosts, onClose }) => {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (imageUrl) {
      setImagePreview(imageUrl);
    } else {
      setImagePreview('');
    }
  }, [imageUrl]);


  const createPost = async () => {
    if (!contract || !currentAccount) {
      console.error('Contract or currentAccount not available');
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.createPost(content, imageUrl);
      await tx.wait();

      alert('Post created successfully!');


      await fetchPosts();


      setContent('');
      setImageUrl('');
      setImagePreview('');


      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };


  const fetchPosts = async () => {
    if (!contract) return;

    try {
      const posts = await contract.getUserPosts(currentAccount);
      const formattedPosts = posts.map((post, index) => ({
        id: index,
        author: post.author,
        content: post.content,
        imageUrl: post.imageUrl,
        exists: post.exists
      }));
      setPosts(formattedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  return (
    <div className="create-post-card">
      <div className="create-post-card-header">
        <h2>Create Post</h2>
        <button className="close-button" onClick={onClose}>X</button>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your post content here..."
        maxLength={500}
      />
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Enter IPFS image URL"
      />
      {imagePreview && (
        <div className="image-preview">
          <img src={imagePreview} alt="Preview" onError={() => setImagePreview('')} />
        </div>
      )}
      <button onClick={createPost} disabled={loading}>
        {loading ? 'Posting...' : 'Post'}
      </button>
    </div>
  );
};

export default CreatePostCard;
