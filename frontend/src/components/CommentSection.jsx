import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { commentsAPI } from "../services/api";
import "./CommentSection.css";

/**
 * CommentSection Component
 * Displays and allows adding comments on a product
 */
const CommentSection = ({ productId }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Fetch comments for the product
   */
  useEffect(() => {
    fetchComments();
  }, [productId]);

  const fetchComments = async () => {
    try {
      const response = await commentsAPI.getByProduct(productId);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  /**
   * Handle adding a new comment
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!isAuthenticated()) {
      alert("Please login to add a comment");
      return;
    }

    setLoading(true);

    try {
      await commentsAPI.add({
        productId,
        content: newComment.trim()
      });

      // Refresh comments
      fetchComments();
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comment-section">
      <h2>Comments ({comments.length})</h2>

      {/* Comment List */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              <div className="comment-avatar">
                {comment.user?.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="comment-content">
                <div className="comment-header">
                  <span className="comment-author">
                    {comment.user?.username || "Unknown"}
                  </span>
                  <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="comment-text">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows="3"
          disabled={loading}
        />
        <button type="submit" className="comment-btn" disabled={loading || !newComment.trim()}>
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </form>
    </div>
  );
};

export default CommentSection;