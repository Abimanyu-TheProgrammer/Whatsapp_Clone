import { Avatar, IconButton } from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import React, { useState } from 'react'
import './Chat.css'
import axios from './axios'

function Chat(props) {
    const messages = props.messages
    const loading = props.loading
    const [input, setInput] = useState('')

    const sendMessage = e => {
        e.preventDefault()

        axios.post("api/message/new", {
            message: input,
            name : "Nate",
            timestamp:"Just now!",
            recieved : false
        })

        setInput('')
    }

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar/>

                <div className="chat__headerInfo">
                    <h3>Room name</h3>
                    <p>Last seen at...</p>
                </div>

                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlinedIcon/>
                    </IconButton>
                    <IconButton>
                        <AttachFileIcon/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon/>
                    </IconButton>
                </div>
            </div>

            <div className="chat__body">
                {
                    !loading ? messages.map(message => { 
                        return <p className={`chat__message ${!message.recieved && 'chat__reciever'}`}>
                        <span className="chat__name">{message.user}</span>
                        {message.message}
                        <span className="chat__timestamp">{messages[0].timestamp}</span>
                        </p>
                        }) : <p></p> 
                }
            </div>

            <div className="chat__footer">
                <InsertEmoticonIcon/>
                <form>
                    <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message" type="text"/>
                    <button onClick={sendMessage} type="submit">Send a message</button>
                </form>
                <MicIcon/>
            </div>
        </div>
    )
}

export default Chat
