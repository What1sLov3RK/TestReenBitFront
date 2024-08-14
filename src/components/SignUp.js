import React from "react";
import Modal from "./Modal";
import "../css/form.css"
import Input from "./Input";
import Button from "./Button";
import {useState} from "react";
import api from "../api";
import { toast } from 'react-toastify';
import chatStore from "../chatStore";

const SignUp = ({ onClose, switchToLogin }) => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const { setChats, setSelectedChat } = chatStore;

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = {
          email: email,
          firstname: firstName,
          lastname: lastName,
          password: password,
        }

      const response = await api.post('/users/registration', payload);
      localStorage.setItem("access-token", response.access_token)
      localStorage.setItem("refresh-token", response.refresh_token)
      toast.success("Signed Up!")
      localStorage.setItem("authorized", true)
      setSelectedChat(null)
      setChats([])
      onClose();
    } catch (error) {
      toast.error("Failed signing up")
    }
  };

  return (
      <Modal onClose={onClose} name={"Sign Up"}>
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
                  <label>First name:</label>
                  <Input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter your first name"
                  />
              </div>
              <div className="input-container">
                  <label>Last name:</label>
                  <Input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter your last name"
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
                  <Button type="submit" name="Sign Up" className="margin-right-10px"/>
                  <Button name="Log In" onClick={switchToLogin}></Button>
              </div>
          </form>
      </Modal>
  );
}

export default SignUp;