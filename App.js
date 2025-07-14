import { useState } from "react";
import Chat from "./Chat";
import "./App.css";   // make sure this file exists

// ──────────────────────────────────────────────
// App Component
// ──────────────────────────────────────────────
export default function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    // basic validation
    if (username.trim() && room.trim()) {
      setShowChat(true);
    }
  };

  return (
    <div className="app">
    
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join A Chat Room</h3>

          <input
            placeholder="Your name…"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            placeholder="Room ID…"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />

          <button onClick={joinRoom}>Join Room</button>
        </div>
      ) : (
        // After joining, render the Chat component
        <Chat username={username} room={room} />
      )}
    </div>
  );
}
