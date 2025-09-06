import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/axios';

const ChapterReader = () => {
  const { storyId, chapterNumber } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [fontSize, setFontSize] = useState('medium');
  const [chapter, setChapter] = useState(null);
  const [story, setStory] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchChapterData();
  }, [storyId, chapterNumber]);

  async function fetchChapterData() {
    try {
      setLoading(true);
      const [storyRes, chapterRes] = await Promise.all([
        api.get(`/stories/${storyId}`),
        api.get(`/stories/${storyId}/chapter/${chapterNumber}`)
      ]);
      setStory(storyRes.data);
      setChapter(chapterRes.data);
      if (chapterRes.data) fetchComments(chapterRes.data.id);
    } catch (e) {
      console.error('Failed to fetch chapter:', e);
    } finally {
      setLoading(false);
    }
  }

  async function fetchComments(chapterId) {
    try {
      const res = await api.get(`/stories/${storyId}/chapters/${chapterId}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
      setComments([]);
    }
  }

  async function handleSubmitComment(e) {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    setSubmittingComment(true);
    try {
      await api.post(`/stories/${storyId}/chapters/${chapter.id}/comments`, { userId: user.id, content: newComment.trim() });
      setNewComment('');
      fetchComments(chapter.id);
    } catch (e) {
      console.error('Failed to submit comment:', e);
    } finally {
      setSubmittingComment(false);
    }
  }

  const handleSubmitReply = async (commentId, replyText) => {
    if (!replyText.trim() || !user) return;
    try {
      await api.post(`/stories/${storyId}/chapters/${chapter.id}/comments/${commentId}/reply`, {
        userId: user.id,
        content: replyText.trim(),
      });
      fetchComments(chapter.id);
    } catch (e) {
      console.error('Failed to submit reply:', e);
    }
  };


  async function handleLikeComment(commentId) {
    if (!user) return;
    try {
      await api.post(`/stories/${storyId}/chapters/${chapter.id}/comments/${commentId}/like?userId=${user.id}`);
      fetchComments(chapter.id);
    } catch (e) {
      console.error('Failed to like comment:', e);
    }
  }

  function formatTimeAgo(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = Date.now();
    const diff = now - date.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
    if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
    if (diff < 604800000) return Math.floor(diff / 86400000) + 'd ago';
    return date.toLocaleDateString();
  }

  const ReplyForm = ({ commentId, onCancel, onSubmit }) => {
    const [text, setText] = useState('');
    return (
      <div className="reply-form">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write a reply..."
          className="reply-input"
          rows="3"
        />
        <div className="reply-actions">
          <button onClick={onCancel} className="btn-secondary small">Cancel</button>
          <button onClick={() => { onSubmit(commentId, text); setText(''); }} className="btn-primary small" disabled={!text.trim()}>Reply</button>
        </div>
      </div>
    );
  };


  const Comment = ({ comment, isReply = false }) => (
    <div className={`comment ${isReply ? 'comment-reply' : ''}`}>
      <div className="comment-header">
        <div className="comment-author">
          <div className="author-avatar">{comment.user.username.charAt(0).toUpperCase()}</div>
          <div className="author-info">
            <span className="author-name">{comment.user.username}</span>
            <span className="comment-time">{formatTimeAgo(comment.createdAt)}</span>
          </div>
        </div>
        <div className="comment-actions">
          <button className="comment-action-btn" onClick={() => handleLikeComment(comment.id)} disabled={!user}>
            ❤️ {comment.likeCount || 0}
          </button>
          {!isReply && (
            <button className="comment-action-btn" onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)} disabled={!user}>
              💬 Reply
            </button>
          )}
        </div>
      </div>
      <div className="comment-content">{comment.content}</div>
      {replyingTo === comment.id && (
        <ReplyForm
          commentId={comment.id}
          onCancel={() => setReplyingTo(null)}
          onSubmit={(id, replyText) => {
            handleSubmitReply(id, replyText);
            setReplyingTo(null);
          }}
        />
      )}
      {comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map(reply => <Comment key={reply.id} comment={reply} isReply={true} />)}
        </div>
      )}
    </div>
  );

  if (loading) return <LoadingSpinner />;
  if (!chapter || !story) return <div className="error-message">Chapter not found</div>;

  const canPrev = parseInt(chapterNumber) > 1;
  const canNext = story.chapters && parseInt(chapterNumber) < story.chapters.length;

  return (
    <div className="chapter-reader">
      <div className="chapter-header">
        <div className="breadcrumb">
          <Link to="/dashboard">Home</Link> <span>/</span>
          <Link to={`/story/${storyId}`}>{story.title}</Link> <span>/</span>
          <span>Chapter {chapterNumber}</span>
        </div>
        <div className="reader-controls">
          <select value={fontSize} onChange={e => setFontSize(e.target.value)} className="font-size-selector">
            <option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option><option value="xlarge">Extra Large</option>
          </select>
        </div>
      </div>

      <div className="chapter-content">
        <h1 className="story-title">{story.title}</h1>
        <h2 className="chapter-title">Chapter {chapter.number}: {chapter.title}</h2>
        <div className={`chapter-text ${fontSize}`}>
          {chapter.content.split('\n').map((p, i) => <p key={i} className="chapter-paragraph">{p}</p>)}
        </div>
      </div>

      <div className="comments-section">
        <h3 className="comments-title">Comments ({comments.length})</h3>
        {user ? (
          <form onSubmit={handleSubmitComment} className="comment-form">
            <div className="comment-form-header">
              <div className="commenter-avatar">{user.username.charAt(0).toUpperCase()}</div>
              <span className="commenter-name">{user.username}</span>
            </div>
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this chapter..."
              className="comment-input"
              rows="4"
            />
            <div className="comment-form-actions">
              <button type="submit" disabled={!newComment.trim() || submittingComment} className="btn-primary">{submittingComment ? 'Posting...' : 'Post Comment'}</button>
            </div>
          </form>
        ) : (
          <div className="login-prompt">
            <p><Link to="/login">Login</Link> to leave a comment</p>
          </div>
        )}

        <div className="comments-list">
          {comments.length === 0 ? (
            <div className="no-comments"><p>No comments yet. Be the first to share your thoughts!</p></div>
          ) : (
            comments.filter(c => !c.parentComment).map(comment => <Comment key={comment.id} comment={comment} />)
          )}
        </div>

        <div className="chapter-navigation">
          <button className="nav-btn prev-btn" onClick={() => navigate(`/story/${storyId}/chapter/${parseInt(chapterNumber) - 1}`)} disabled={!canPrev}>← Previous Chapter</button>
          <span className="chapter-info">Chapter {chapterNumber} of {story.chapters.length}</span>
          <button className="nav-btn next-btn" onClick={() => navigate(`/story/${storyId}/chapter/${parseInt(chapterNumber) + 1}`)} disabled={!canNext}>Next Chapter →</button>
        </div>
      </div>
    </div>
  );
};

export default ChapterReader;
