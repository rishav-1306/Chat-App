import { useEffect, useState } from "react";
import io from "socket.io-client";
import Message from "./Message";

const socket = io("http://localhost:4500"); // backend URL

export default function Chat({ username, room }) {
  const [currentMsg, setCurrentMsg] = useState("");
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    socket.emit("join_room", room);

    socket.on("receive_message", data =>
      setMessageList(list => [...list, data])
    );

    return () => socket.off(); // clean up
  }, [room]);

  const sendMessage = async () => {
    if (!currentMsg.trim()) return;

    const data = {
      room,
      author: username,
      message: currentMsg,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    await socket.emit("send_message", data);
    setMessageList(list => [...list, data]); // show own msg
    setCurrentMsg("");
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
