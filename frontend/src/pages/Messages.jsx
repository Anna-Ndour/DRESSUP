import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getSocket } from "../services/socket";
import { messagesAPI } from "../services/api";
import "./Messages.css";

const Messages = () => {
  const { user } = useAuth();
  const socket = getSocket();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const contactUserId = searchParams.get("contact");

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (contactUserId && user) {
      fetchMessagesAndSelect(contactUserId);
    }
  }, [contactUserId, user]);

  const fetchMessagesAndSelect = async (otherUserId) => {
    try {
      setLoading(true);
      
      const response = await messagesAPI.getByUser(otherUserId);
      
      if (response.data.length > 0) {
        const msg = response.data[0];
        const otherUser = msg.senderId._id === user._id ? msg.receiverId : msg.senderId;
        setSelectedUser({
          _id: otherUser._id,
          username: otherUser.username || "User"
        });
        setMessages(response.data);
        
        setConversations(prev => {
          const exists = prev.some(c => c._id === otherUser._id);
          if (!exists) {
            return [...prev, { _id: otherUser._id, username: otherUser.username || "User" }];
          }
          return prev;
        });
      } else {
        const allConvResponse = await messagesAPI.getConversations();
        const targetConv = allConvResponse.data.find(c => c._id === otherUserId);
        if (targetConv) {
          setSelectedUser(targetConv);
          setConversations(allConvResponse.data);
        } else {
          setSelectedUser({
            _id: otherUserId,
            username: "Seller"
          });
          setConversations(prev => {
            const exists = prev.some(c => c._id === otherUserId);
            if (!exists) {
              return [...prev, { _id: otherUserId, username: "Seller" }];
            }
            return prev;
          });
        }
        setMessages([]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      
      setConversations(prev => {
        const exists = prev.some(c => c._id === otherUserId);
        if (!exists) {
          return [...prev, { _id: otherUserId, username: "Seller" }];
        }
        return prev;
      });
      
      setSelectedUser({
        _id: otherUserId,
        username: "Seller"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (message) => {
      console.log("Received message:", message);
      
      if (selectedUser && message.senderId._id === selectedUser._id) {
        setMessages((prev) => [...prev, message]);
      }

      setConversations((prev) => {
        const otherUserId = message.senderId._id;
        const exists = prev.some((c) => c._id === otherUserId);
        if (!exists) {
          return [...prev, { 
            _id: otherUserId, 
            username: message.senderId.username || "User" 
          }];
        }
        return prev;
      });
    };

    socket.on("receive-message", handleMessageReceived);

    return () => {
      socket.off("receive-message", handleMessageReceived);
    };
  }, [socket, selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await messagesAPI.getConversations();
      setConversations(response.data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setConversations([]);
    }
  };

  const fetchMessages = async (otherUserId) => {
    try {
      setLoading(true);
      const response = await messagesAPI.getByUser(otherUserId);
      setMessages(response.data);
      
      const foundUser = conversations.find((c) => c._id === otherUserId);
      if (foundUser) {
        setSelectedUser(foundUser);
      } else {
        if (response.data.length > 0) {
          const msg = response.data[0];
          const otherUser = msg.senderId._id === user._id ? msg.receiverId : msg.senderId;
          setSelectedUser({
            _id: otherUser._id,
            username: otherUser.username || "User"
          });
        }
      }
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
      const response = await messagesAPI.send(messageData);
      
      if (socket) {
        socket.emit("send-message", {
          senderId: user._id,
          receiverId: selectedUser._id,
          content: newMessage.trim()
        });
      }

      setMessages((prev) => [...prev, response.data]);
      setNewMessage("");
      
      setConversations(prev => {
        const exists = prev.some(c => c._id === selectedUser._id);
        if (!exists) {
          return [...prev, { _id: selectedUser._id, username: selectedUser.username }];
        }
        return prev;
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="messages-page">
      <div className="messages-container">
        <h1>Messages</h1>

        <div className="messages-layout">
      
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
                <p>Select a seller to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;