import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { auth } from "../firebase";
import "../styles/chat.css";

const db = getFirestore();

export default function ChatPage() {
  const { vendorId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // Load chat messages in real time
  useEffect(() => {
    if (!auth.currentUser || !vendorId) return;

    const chatId = [auth.currentUser.uid, vendorId].sort().join("_");

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()));
    });

    return () => unsubscribe();
  }, [vendorId]);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send a message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !auth.currentUser) return;

    const chatId = [auth.currentUser.uid, vendorId].sort().join("_");

    await addDoc(collection(db, "chats", chatId, "messages"), {
      senderId: auth.currentUser.uid,
      receiverId: vendorId,
      message: input,
      timestamp: serverTimestamp(),
    });

    setInput("");
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>💬 Chat with Vendor</h2>
        <p style={{ color: "#555", fontSize: "0.9rem" }}>
          Vendor ID: <b>{vendorId}</b>
        </p>
      </div>

      <div className="chat-box">
        {messages.length === 0 && (
          <p className="no-messages">No messages yet. Start a conversation!</p>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${
              msg.senderId === auth.currentUser.uid ? "sent" : "received"
            }`}
          >
            {msg.message}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={sendMessage} className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
