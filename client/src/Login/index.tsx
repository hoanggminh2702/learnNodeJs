import React, { useState } from 'react';
import './Login.css';

type LoginProps = {
  [index: string]: any;
};

const Login = ({ setLogin, setUsername }: LoginProps) => {
  const [text, setText] = useState<string>('');
  return (
    <div className="login-container">
      <form className="login-form">
        <h1>Login</h1>
        <div className="input-form">
          <div className="username-input">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="username"
              name="username"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              type="button"
              onClick={() => {
                setLogin(true);
                setUsername(text);
              }}
            >
              Go
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
