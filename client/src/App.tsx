import { useEffect, useRef, useState } from 'react';
import './App.css';

import { io, Socket } from 'socket.io-client';
import Screen from './Screen';
import Login from './Login';

function App() {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  return isLogin ? (
    <Screen username={username} />
  ) : (
    <Login setUsername={setUsername} setLogin={setIsLogin} />
  );
}

export default App;
