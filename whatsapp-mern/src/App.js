import { useEffect, useState } from 'react';
import './App.css';
import Chat from './Chat';
import Sidebar from './Sidebar';
import Pusher from 'pusher-js'
import axios from './axios'

function App() {

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    axios.get("/api/messages/sync")
    .then(response => {
      setMessages(response.data.data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    const pusher = new Pusher('45fcd3b0059fac68adae', {
      cluster: 'ap1'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', function(newMessage) {
      setMessages([...messages, newMessage])
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    }
  }, [messages])

  return (
    <div className="app">
      <div className="app__body">
        <Sidebar/>
        <Chat messages={messages} loading={loading} />
      </div>
    </div>
  );
}

export default App;
