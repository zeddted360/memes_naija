import React, { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";

interface Message {
  id: number;
  text: string;
  sender: string;
  seen?: boolean;
}

// interface ChatProps {
//   initialChats: IChat[];
//   initialUsers: IUser[];
// }

export const Chat = ({initialChats,initialUsers,}:any) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("chat message", (msg: Message) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });

      socket.on("message seen", (msgId: number) => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === msgId ? { ...msg, seen: true } : msg
          )
        );
      });
    }
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage && socket) {
      socket.emit("chat message", { text: inputMessage, sender: socket.id });
      setInputMessage("");
    }
  };

  const handleSeen = (msgId: number) => {
    if (socket) {
      socket.emit("message seen", msgId);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${
              msg.sender === socket?.id ? "sent" : "received"
            }`}
            style={{ color: msg.seen ? "green" : "black" }}
            onMouseEnter={() => handleSeen(msg.id)}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage}>
        <input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
      <style jsx>{`
        .chat-container {
          width: 300px;
          height: 400px;
          border: 1px solid #ccc;
          display: flex;
          flex-direction: column;
        }
        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 10px;
        }
        .message {
          margin-bottom: 10px;
          padding: 5px;
          border-radius: 5px;
        }
        .sent {
          background-color: #dcf8c6;
          align-self: flex-end;
        }
        .received {
          background-color: #f1f0f0;
          align-self: flex-start;
        }
        form {
          display: flex;
          padding: 10px;
        }
        input {
          flex: 1;
          padding: 5px;
        }
        button {
          margin-left: 5px;
        }
      `}</style>
    </div>
  );
};


