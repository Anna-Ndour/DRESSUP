import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { getSocket } from "../services/socket";
import { messagesAPI } from "../services/api";
import "./Messages.css";

/**
 * Messages Page
 * Real-time messaging interface with conversation list and chat window
 */
const Messages = () => {
  const { user } = useAuth();
  const socket = getSocket();

  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  /**
   * Fetch conversations on mount
   */
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  /**
   * Listen for real-time messages
   */
  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (message) => {
      // Add received message to current conversation if from selected user
      if (selectedUser && message.senderId._id === selectedUser._id) {
        setMessages((prev) => [...prev, message]);
      }

      // Add to conversations if not already there
      setConversations((prev) => {
        const exists = prev.some((c) => c._id === message.senderId._id);
        if (!exists) {
          return [...prev, { _id: message.senderId._id, username: message.senderId.username }];
        }
        return prev;
      });
    };

    socket.on("receive-message", handleMessageReceived);

    return () => {
      socket.off("receive-message", handleMessageReceived);
    };
  }, [socket, selectedUser]);

  /**
   * Scroll to bottom when new messages arrive
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      // Get all users as conversations (simplified approach)
      // In production, you'd have a dedicated conversations endpoint
      const response = await messagesAPI.getByUser(user._id);
      // Extract unique users from messages
      const userMap = new Map();
      response.data.forEach((msg) => {
        const otherUserId = msg.senderId._id === user._id ? msg.receiverId._id : msg.senderId._id;
        const otherUserName = msg.senderId._id === user._id ? msg.receiverId.username : msg.senderId.username;
        if (!userMap.has(otherUserId)) {
          userMap.set(otherUserId, { _id: otherUserId, username: otherUserName });
        }
      });
      setConversations(Array.from(userMap.values()));
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const fetchMessages = async (otherUserId) => {
    try {
      setLoading(true);
      const response = await messagesAPI.getByUser(otherUserId);
      setMessages(response.data);
      setSelectedUser(conversations.find((c) => c._id === otherUserId));
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const messageData = {
      receiverId: selectedUser._id,
      content: newMessage.trim()
    };

    try {
      // Send via API (saves to DB)
      const response = await messagesAPI.send(messageData);
      
      // Emit via Socket.io for real-time delivery
      if (socket) {
        socket.emit("send-message", {
          senderId: user._id,
          receiverId: selectedUser._id,
          content: newMessage.trim()
        });
      }

      // Add to local messages
      setMessages((prev) => [...prev, response.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="messages-page">
      <div className="messages-container">
        <h1>Messages</h1>

        <div className="messages-layout">
          {/* Conversations List */}
          <div className="conversations-panel">
            <h2>Conversations</h2>
            {conversations.length === 0 ? (
              <p className="no-conversations">No conversations yet</p>
            ) : (
              <ul className="conversations-list">
                {conversations.map((conv) => (
                  <li
                    key={conv._id}
                    className={`conversation-item ${selectedUser?._id === conv._id ? "active" : ""}`}
                    onClick={() => fetchMessages(conv._id)}
                  >
                    <div className="conversation-avatar">
                      {conv.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="conversation-info">
                      <span className="conversation-name">
                        {conv.username || "User"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Chat Window */}
          <div className="chat-panel">
            {selectedUser ? (
              <>
                <div className="chat-header">
                  <div className="chat-avatar">
                    {selectedUser.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <h3>{selectedUser.username || "User"}</h3>
                </div>

                <div className="chat-messages">
                  {loading ? (
                    <div className="loading">Loading messages...</div>
                  ) : messages.length === 0 ? (
                    <p className="no-messages">No messages yet. Start the conversation!</p>
                  ) : (
                    messages.map((msg, index) => {
                      const isOwnMessage = msg.senderId._id === user._id;
                      return (
                        <div
                          key={index}
                          className={`message ${isOwnMessage ? "own" : ""}`}
                        >
                          <div className="message-content">
                            {msg.content}
                          </div>
                          <span className="message-time">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="chat-input-form">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="message-input"
                  />
                  <button type="submit" className="send-btn">
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="no-chat-selected">
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;