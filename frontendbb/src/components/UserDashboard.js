import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import PostCard from '../components/PostCard';
import CreatePostCard from '../components/CreatePostCard';
import { contractABI, contractAddress } from '../config/index';
import '../components/UserDashboard.css';

function UserDashboard({ currentAccount, setCurrentAccount }) {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [contract, setContract] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showPostDetails, setShowPostDetails] = useState(false);


  useEffect(() => {
    const initializeContract = async () => {
      if (!window.ethereum) {
        console.error('MetaMask is required.');
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(contractInstance);
      } catch (error) {
        console.error('Error initializing contract:', error);
      }
    };

    initializeContract();
  }, []);


  const fetchPosts = useCallback(async () => {
    if (!contract || !currentAccount) return;

    try {
      const userPosts = await contract.getUserPosts(currentAccount);
      const fetchedPosts = userPosts.map((post, index) => ({
        id: index,
        author: post.author,
        content: post.content,
        imageUrl: post.imageUrl,
        exists: post.exists,
      }));
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }, [contract, currentAccount]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);


  const connectWallet = async () => {
    if (isConnecting) return;

    setIsConnecting(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };


  const handleDisconnectAndReconnect = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      });

      setCurrentAccount(null);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }

    await connectWallet();
  };


  const handlePostClick = (post) => {
    setSelectedPost(post);
    setShowPostDetails(true);
  };


  const handleEditPost = async (id, newContent, newImageUrl) => {
    if (!contract) return;

    try {
      await contract.editPost(id, newContent, newImageUrl);
      fetchPosts();
      setShowPostDetails(false);
    } catch (error) {
      console.error('Error editing post:', error);
    }
  };


  const handleDeletePost = async (postId) => {

    try {

      const post = await contract.getPost(postId);
      if (!post || post.deleted) {
        alert("Post has already been deleted or does not exist.");
        return;
      }

      const tx = await contract.deletePost(postId);
      await tx.wait();

      setPosts(posts.filter(post => post.id !== postId));

      alert("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert(`Error deleting post: ${error.reason || error.message}`);

    }
  };



  
  const handleCreatePostClick = () => {
    setShowCreatePost(true);
  };

  return (
    <div className="user-dashboard">
      <div className="header">
        {currentAccount ? (
          <>
            <button className="disconnect-button" onClick={handleDisconnectAndReconnect}>
              Disconnect
            </button>
            <button className="create-post-button" onClick={handleCreatePostClick}>
              <i className="fas fa-pencil-alt"></i>
            </button>
          </>
        ) : (
          <button className="connect-wallet-button" onClick={connectWallet} disabled={isConnecting}>
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
      </div>
      {showCreatePost && (
        <CreatePostCard
          contract={contract}
          currentAccount={currentAccount}
          setPosts={setPosts}
          onClose={() => setShowCreatePost(false)}
        />
      )}
      <div className="posts-list">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onClick={() => handlePostClick(post)} 
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
            />
          ))
        ) : (
          <div>No posts available</div>
        )}
      </div>
      {showPostDetails && selectedPost && (
        <div className="post-overlay">
          <button className="close-overlay-button" onClick={() => setShowPostDetails(false)}>
            &times;
          </button>
          <div className="post-details">
            <div className="post-actions">
              <button
                className="post-action-button"
                onClick={() => handleEditPost(selectedPost.id, prompt('New content:', selectedPost.content), selectedPost.imageUrl)}
              >
                Edit
              </button>
              <button className="post-action-button" onClick={() => handleDeletePost(selectedPost.id)}>
                Delete
              </button>
            </div>
            <p>{selectedPost.content}</p>
            {selectedPost.imageUrl && <img src={selectedPost.imageUrl} alt="Post" />}
          </div>
        </div>
      )}
    </div>
  );
}


export default UserDashboard;
