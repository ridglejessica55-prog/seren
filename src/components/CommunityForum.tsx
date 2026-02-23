import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Heart, Send, User, X, Plus, MessageCircle } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  timestamp: string;
}

interface Post {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
}

export const CommunityForum = ({ onClose, userName }: { onClose: () => void, userName: string }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentContent, setNewCommentContent] = useState('');
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Connect to socket
    socketRef.current = io();

    // Fetch initial posts
    fetch('/api/posts')
      .then(res => res.json())
      .then(setPosts);

    // Socket listeners
    socketRef.current.on('post:created', (newPost: Post) => {
      setPosts(prev => [newPost, ...prev]);
    });

    socketRef.current.on('post:updated', (updatedPost: Post) => {
      setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
      if (selectedPost?.id === updatedPost.id) {
        setSelectedPost(updatedPost);
      }
    });

    socketRef.current.on('comment:created', ({ postId, comment }: { postId: string, comment: Comment }) => {
      if (selectedPost?.id === postId) {
        setComments(prev => [...prev, comment]);
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [selectedPost?.id]);

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    const postData = {
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      author: userName || 'Anonymous',
      content: newPostContent,
    };

    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });

    setNewPostContent('');
  };

  const handleLikePost = async (postId: string) => {
    await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
  };

  const handleSelectPost = async (post: Post) => {
    setSelectedPost(post);
    const res = await fetch(`/api/posts/${post.id}/comments`);
    const data = await res.json();
    setComments(data);
  };

  const handleCreateComment = async () => {
    if (!newCommentContent.trim() || !selectedPost) return;
    const commentData = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      author: userName || 'Anonymous',
      content: newCommentContent,
    };

    await fetch(`/api/posts/${selectedPost.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentData),
    });

    setNewCommentContent('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="w-full max-w-4xl h-[80vh] bg-black/60 backdrop-blur-3xl border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
        <div>
          <h2 className="text-xl font-light tracking-widest uppercase">Community Forum</h2>
          <p className="text-[10px] text-blue-400/60 uppercase tracking-widest font-bold">Shared Support & Experiences</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X className="w-6 h-6 text-white/40" />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Posts List */}
        <div className={`flex-1 overflow-y-auto p-6 space-y-4 ${selectedPost ? 'hidden md:block' : 'block'}`}>
          <div className="mb-8">
            <div className="relative">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share your thoughts or progress..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-white/20 resize-none h-32"
              />
              <button
                onClick={handleCreatePost}
                disabled={!newPostContent.trim()}
                className="absolute bottom-4 right-4 p-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl transition-all shadow-lg shadow-blue-600/20"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                layoutId={post.id}
                onClick={() => handleSelectPost(post)}
                className={`p-6 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all ${selectedPost?.id === post.id ? 'border-blue-500/50 bg-white/10' : ''}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/90">{post.author}</p>
                      <p className="text-[10px] text-white/30">{new Date(post.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-white/70 mb-6 line-clamp-3">{post.content}</p>
                <div className="flex gap-6">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleLikePost(post.id); }}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-white/40 hover:text-pink-400 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${post.likes > 0 ? 'fill-pink-400 text-pink-400' : ''}`} />
                    {post.likes} Likes
                  </button>
                  <button className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-white/40 hover:text-blue-400 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    Discuss
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Selected Post & Comments */}
        <AnimatePresence>
          {selectedPost && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="w-full md:w-[400px] border-l border-white/5 bg-black/40 backdrop-blur-3xl flex flex-col"
            >
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">Discussion</span>
                <button onClick={() => setSelectedPost(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-4 h-4 text-white/40" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="pb-6 border-b border-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/90">{selectedPost.author}</p>
                      <p className="text-[10px] text-white/30">{new Date(selectedPost.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-sm text-white/80">{selectedPost.content}</p>
                </div>

                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{comment.author}</p>
                        <p className="text-[8px] text-white/20">{new Date(comment.timestamp).toLocaleTimeString()}</p>
                      </div>
                      <p className="text-xs text-white/60">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-white/5 border-t border-white/5">
                <div className="relative flex items-center gap-2">
                  <input
                    type="text"
                    value={newCommentContent}
                    onChange={(e) => setNewCommentContent(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateComment()}
                    placeholder="Add a comment..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-white/20"
                  />
                  <button
                    onClick={handleCreateComment}
                    disabled={!newCommentContent.trim()}
                    className="p-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
