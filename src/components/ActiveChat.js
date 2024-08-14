import React, {useEffect, useRef, useState} from 'react';
import { observer } from 'mobx-react-lite';
import chatStore from '../chatStore';
import "../css/activeChat.css"
import ChatInput from "./ChatInput";
import {toast} from "react-toastify";
import AuthModal from "./AuthModal";
import ChangeChatNameModal from "./ChangeChatNameModal";


const ActiveChat = observer(() => {
    const { selectedChat, sendUserMessage } = chatStore;
    const [changeChatNameModal, setChangeChatNameModal] = useState(false)
    const [ newMessage, setNewMessage] = useState('')
    const messagesEndRef = useRef(null);

    const openChangeChatNameModal = () => {
        setChangeChatNameModal(true);
    };

    const closeChangeChatNameModal = () => {
        setChangeChatNameModal(false);
    };

    const changeMessage = (event) =>{
        setNewMessage(event.target.value)
    }

    const sendNewMessage = async (event) => {
        if (event.key === 'Enter') {
            if(newMessage.length === 0 ) {
                toast.info("Write something first")
                return
            }
            event.preventDefault();
            event.stopPropagation();
            setNewMessage('')
            await sendUserMessage(selectedChat._id, newMessage)
            messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
    }, [selectedChat?.messages]);

    if (!selectedChat) return (
        <div id="active-chat">
            <div id="chat-name">
            </div>
            <div id="message-container">
            </div>
            <div id="chat-input-container">
            </div>
        </div>
    );
        return (
        <div id="active-chat">
            <div id="chat-name">
                <img src="https://xsgames.co/randomusers/assets/avatars/male/38.jpg" alt={"chat-logo"}/>
                <h2>{selectedChat.name}</h2>
                <div id="change-chat-name" onClick={openChangeChatNameModal}></div>
                {changeChatNameModal && (
                <ChangeChatNameModal                onClose={closeChangeChatNameModal}
          />
        )}
            </div>
            <div id="message-container">
                {selectedChat.messages ? (
                    selectedChat.messages.map((message) => {
                        const date = new Date(message.timestamp);
                        const options = {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true
                        };
                        const formattedDate = date.toLocaleString('en-US', options);
                        return (
                            <div className={"message-item-container"}>
                                {(message.sender === "bot") ?
                                    <img src="https://xsgames.co/randomusers/assets/avatars/male/38.jpg"
                                         alt="person-logo"/> : ''}

                                <div key={message.id} className="message-item">
                                    <div
                                        className={message.sender === "user" ? "user-message" : "bot-message"}>
                                        {message.content}
                                    </div>
                                    <span
                                        className={message.sender === "user" ? "user-message-date message-date" : "message-date"}>{formattedDate}</span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <></>
                )}
                <div ref={messagesEndRef}/>
            </div>
            <div id="chat-input-container">
                <ChatInput
                    placeholder={"Type your message"}
                    value={newMessage}
                    onChange={changeMessage}
                    onKeyDown={sendNewMessage}
                    className="message-input"
                />
            </div>
        </div>
    );
});

export default ActiveChat;
