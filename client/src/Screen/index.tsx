import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import './Screen.css';

type ScreenProps = {
  [index: string]: any;
};

const Screen = ({ username }: ScreenProps) => {
  const [message, setMessage] = useState<string>('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chat, setChat] = useState<string[]>([]);
  const [curRoom, setCurRoom] = useState<string>('');
  const [listOnline, setListOnline] = useState<string[]>([]);
  const [clickTo, setClickTo] = useState<string>('');

  useEffect(() => {
    const newSocket = io('http://localhost:8080');
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit('Request-List-Online', username);

      socket.on('Response-List-Online', (list) => {
        setListOnline(list);
      });
    }
  }, [socket]);

  const updateChat = (data: { id: string; message: string }) => {
    setChat((prev) => {
      return [...prev, `${data.id}: ${data.message}`];
    });
  };

  useEffect(() => {
    console.log('call');
    socket?.on(`public-response-send-message`, updateChat);
    socket?.on(`private-response-send-message`, updateChat);

    return () => {
      socket?.removeAllListeners(`public-response-send-message`);
      socket?.removeAllListeners(`private-response-send-message`);
    };
  }, [socket, clickTo]);

  const handleSendMessage = () => {
    console.log(clickTo);
    if (socket) {
      socket.emit(`${calChanelName(clickTo)}-request-send-message`, message);
      setMessage('');
    }
  };

  const calRoomName = (room: string) => {
    const a =
      room === 'public'
        ? 'public'
        : [username, room]
            .sort((a, b) => {
              return a.localeCompare(b);
            })
            .join('');
    return a;
  };

  const calChanelName = (room: string) => {
    return room === 'public' ? 'public' : 'private';
  };

  const handleJoinRomm = (e: any) => {
    const roomName = calRoomName(e.target.innerHTML);
    socket?.emit('join-room', {
      curRoom: curRoom,
      joinRoom: roomName,
    });

    setChat([]);
    setClickTo(e.target.innerHTML);

    setCurRoom(roomName);
  };

  return (
    <div className="container">
      <div className="chat-container">
        <div className="list-panel">
          {listOnline.map(
            (data, index) =>
              data !== username && (
                <div
                  className={`online ${
                    curRoom === calRoomName(data) ? 'in-room' : ''
                  }`}
                  onClick={(e) => handleJoinRomm(e)}
                  key={index}
                >
                  {data}
                </div>
              )
          )}
        </div>
        {curRoom && (
          <div className="chat-panel">
            <div className="panel-chat-container">
              {chat.map((message, index) => {
                return <p key={index}>{message}</p>;
              })}
            </div>
            <div className="typing-container">
              <input
                className="message"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyUp={(e) => {
                  if (e.keyCode === 13) {
                    handleSendMessage();
                  }
                }}
              />
              <button onClick={() => handleSendMessage()}>Send Message</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Screen;
