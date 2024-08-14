import './css/App.css';
import UserPanel from "./components/UserPanel";
import ChatsList from "./components/ChatsList";
import ActiveChat from "./components/ActiveChat";

function App() {
  return (
      <div id="main-container">
          <div id={"user-chats-container"} className={"border"}>
              <UserPanel className={"user-panel border"}/>
              <ChatsList/>
          </div>
          <ActiveChat/>
      </div>
  );
}

export default App;
