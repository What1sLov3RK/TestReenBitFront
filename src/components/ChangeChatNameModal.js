import React, {useState} from 'react';
import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";
import {toast} from "react-toastify";
import chatStore from "../chatStore";

const ChangeChatNameModal = ({ onClose }) => {
    const { changeChatName, selectedChat, deleteChat, setSelectedChat } = chatStore;
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleDeleteChat = async (event)=> {
        event.preventDefault();
        await deleteChat(selectedChat._id)
        setSelectedChat(null)
        onClose()
    }

  const handleSubmit = async (event) => {
      event.preventDefault();
      if (firstName.length > 0) {
          const newName = firstName + " " + lastName
          await changeChatName(selectedChat._id, newName)
          onClose()
      } else {
        toast.error('No first name');
      }
  };
  return (
        <Modal onClose={onClose} name={"Rename chat"}>
            <form onSubmit={handleSubmit} id="form">
                <div className="input-container">
                    <label>First name:</label>
                    <Input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter first name"
                    />
                </div>
                <div className="input-container">
                    <label>Last name:</label>
                    <Input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter last name"
                    />
                </div>
                <div className="change-modal-buttons-container">
                    <Button type="submit" name="Rename Chat" className="margin-right-10px"/>
                    <Button onClick={handleDeleteChat} name="Delete chat" className="margin-right-10px"/>
                </div>
            </form>
        </Modal>
  );
}

export default ChangeChatNameModal;