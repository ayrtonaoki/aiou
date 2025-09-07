import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { postsAPI } from '../services/api';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await postsAPI.getPosts();
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await postsAPI.createPost(newPost);
      setNewPost({ title: '', content: '' });
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await postsAPI.deletePost(id);
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Welcome, {user?.email}!</h1>
        <button onClick={logout} style={{ padding: '8px 16px' }}>
          Logout
        </button>
      </div>

      <div style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '20px' }}>
        <h3>Create New Post</h3>
        <form onSubmit={handleCreatePost}>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              placeholder="Post title"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <textarea
              placeholder="Post content"
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              required
              style={{ width: '100%', padding: '8px', minHeight: '100px' }}
            />
          </div>
          <button type="submit" style={{ padding: '10px 20px' }}>
            Create Post
          </button>
        </form>
      </div>

      <div>
        <h3>Your Posts</h3>
        {posts.length === 0 ? (
          <p>No posts yet. Create your first post above!</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px' }}>
              <h4>{post.title}</h4>
              <p>{post.content}</p>
              <button
                onClick={() => handleDeletePost(post.id)}
                style={{ padding: '5px 10px', backgroundColor: '#ff4444', color: 'white' }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
