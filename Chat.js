import { useEffect, useState } from "react";
import { io } from "socket.io-client"; // ✅ fixed import
import Message from "./Message";

let socket = null; // initialized here for optional usage

export default function Chat({ username, room }) {
  const [currentMsg, setCurrentMsg] = useState("");
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    try {
      socket = io("https://your-backend-url.onrender.com"); // 🔁 change to your actual deployed backend
      socket.emit("join_room", room);

      socket.on("receive_message", data =>
        setMessageList(list => [...list, data])
      );

      return () => socket.disconnect(); // good cleanup
    } catch (err) {
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

    setMessageList(list => [...list, data]);
    setCurrentMsg("");

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
