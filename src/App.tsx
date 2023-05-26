import { useState, useEffect } from 'react';
import socketIOClient, { Socket } from 'socket.io-client';
import AppStyle from './App.module.css';

const socket: Socket = socketIOClient('http://localhost:4000', {
  autoConnect: false,
});

interface Message {
  name: string;
  message: string;
}

function App() {
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [name, setName] = useState('');
  const [value, setValue] = useState('');

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit('chat message', { name, message: value });
    setValue('');
  };

  useEffect(() => {
    socket.connect();

    const messageHandler = (msg: Message) => {
      setMessageList((prev) => [...prev, msg]);
    };

    socket.on('message', messageHandler);

    return () => {
      socket.off('message', messageHandler);
      socket.disconnect();
    };
  }, []);

  return (
    <div className={AppStyle.app}>
      <section className={AppStyle['chat-list']}>
        {messageList.map((item: Message, i: number) => (
          <div key={i} className={AppStyle.message}>
            <p className={AppStyle.username}>{item.name.toUpperCase()}</p>
            <p className={AppStyle['message-text']}>{item.message}</p>
          </div>
        ))}
      </section>
      <form
        className={AppStyle['chat-form']}
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => onSubmit(e)}
      >
        <div className={AppStyle['chat-inputs']}>
          <input
            type="text"
            autoComplete="off"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            value={name}
            placeholder="유저이름"
          />
          <input
            type="text"
            autoComplete="off"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue(e.target.value)
            }
            value={value}
            placeholder="메세지입력하기"
          />
        </div>
        <button>입력하기</button>
      </form>
    </div>
  );
}

export default App;
