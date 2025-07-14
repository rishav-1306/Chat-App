import { useEffect, useState } from "react";
import Message from "./Message";

// Commented out for GitHub Pages frontend-only test
// import io from "socket.io-client";
// const socket = io("http://localhost:4500"); // use this ONLY when backend is live

let socket = null; // placeholder socket

export default function Chat({ username, room }) {
  const [currentMsg, setCurrentMsg] = useState("");
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    try {
      // Try connecting only if socket.io-client is imported
      const io = require("socket.io-client");
      socket = io("https://your-backend-url.onrender.com"); // <-- Replace with real deployed backend

      socket.emit("join_room", room);

      socket.on("receive_message", data =>
        setMessageList(list => [...list, data])
      );

      return () => socket.off(); // clean up
    } catch (error) {
      // If no backend, just show a welcome message
      const welcome = {
        author: "System",
        message: `Hi ${username}, welcome to "${room}"!`,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        }),
      };
      setMessageList([welcome]);
    }
  }, [room, username]);

  const sendMessage = async () => {
    if (!currentMsg.trim()) return;

    const data = {
      room,
      author: username,
      message: currentMsg,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }),
    };

    // Add message to list immediately
    setMessageList(list => [...list, data]);
    setCurrentMsg("");

    // Send through socket if available
    if (socket) {
      await socket.emit("send_message", data);
    }
  };

  return (
    <div className="chatWindow">
      <div className="chatBody">
        {messageList.map((msg, i) => (
          <Message key={i} data={msg} self={msg.author === username} />
        ))}
      </div>

      <div className="chatFooter">
        <input
          type="text"
          placeholder="Type a message…"
          value={currentMsg}
          onChange={e => setCurrentMsg(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
}

