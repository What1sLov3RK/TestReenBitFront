import '../css/userPanel.css';
import Button from "./Button";
import { useState } from "react";
import AuthModal from "./AuthModal";
import Input from "./Input";
import chatStore from "../chatStore";

const UserPanel = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const openLoginModal = () => {
    setIsSignup(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const searchChange = (event) => {
    chatStore.setSearchQuery(event.target.value);
  };

  return (
    <div id="user-panel-container">
      <div id={"user-profile"}>
        <img id="profile-picture" src="https://randomuser.me/api/portraits/lego/5.jpg" alt="profile-picture"/>
        <Button onClick={openLoginModal} name={"Log In"}/>
        {isModalOpen && (
          <AuthModal
            onClose={closeModal}
            isSignup={isSignup}
            switchToSignup={() => setIsSignup(true)}
            switchToLogin={() => setIsSignup(false)}
          />
        )}
      </div>
      <div id={"input-search-chat-container"}>
        <Input placeholder={"Search chat"} onChange={searchChange} />
      </div>
    </div>
  );
}

export default UserPanel;
