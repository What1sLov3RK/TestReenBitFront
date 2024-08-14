import React from "react";
import Modal from "./Modal";
import "../css/form.css"
import Input from "./Input";
import Button from "./Button";
import {useState} from "react";
import api from "../api";
import { toast } from 'react-toastify';
import chatStore from "../chatStore";

const LogIn = ({ onClose, switchToSignup })=> {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setChats, setSelectedChat } = chatStore;

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = {
          email: email,
          password: password,
        }

      const response = await api.post('/users/login', payload);
      localStorage.setItem("access-token", response.access_token)
      localStorage.setItem("refresh-token", response.refresh_token)
      toast.success("Logged in!")
      localStorage.setItem("authorized", true)
      setSelectedChat(null)
      setChats([])

      onClose();
    } catch (error) {
      toast.error( "Failed log in")
    }
  };



  return (
    <Modal onClose={onClose} name={"Log In"}>
      <form onSubmit={handleSubmit} id="form">
        <div className="input-container">
          <label>Email:</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div className="input-container">
          <label>Password:</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        <div className="change-modal-buttons-container">
          <Button type="submit" name="Log In" className="margin-right-10px"></Button>
          <Button type="submit" name="Sign Up" onClick={switchToSignup} />
        </div>
        </form>
    </Modal>
  );
}

export default LogIn;