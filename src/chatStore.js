import { makeAutoObservable, runInAction } from 'mobx';
import api from "./api";
import { toast } from "react-toastify";

class ChatStore {
  chats = [];
  selectedChat = null;
  error = null;
  searchQuery = '';

  constructor() {
    makeAutoObservable(this);
  }

  setChats = async (newChats) => {
    this.chats = newChats;
    await this.fetchChats()
  }


  setSearchQuery = (query) => {
    this.searchQuery = query.toLowerCase();

  }

  get filteredChats() {
    if (!this.searchQuery) {
      return this.chats;
    }
    return this.chats.filter(chat =>
      chat.name.toLowerCase().includes(this.searchQuery)
    );
  }

  addChat = (newChat) => {
    if(newChat ) {
      this.chats.push(newChat);
    }
  }

  setSelectedChat = (chat) => {
    this.selectedChat = chat;
    console.log(this.selectedChat)
  }


  fetchChats = async () => {
    const authCheck = localStorage.getItem('authorized');
    if (!authCheck) {
       return
    }
    this.error = null;
    try {
      const response = await api.get('/chat/all-chats');
      const fetchedChats = response.chats;

        fetchedChats.forEach((fetchedChat) => {
          const existingChat = this.chats.find(chat => chat._id === fetchedChat._id);
          if (!existingChat) {
            this.chats.push(fetchedChat);
          }
        });
    } catch (error) {
      console.error('Failed to fetch chats', error);
      runInAction(() => {
        this.error = 'Failed to fetch chats';
      });
    }
  }

  createChat = async (firstname, lastname) => {
    try {
      const payload = { firstname: firstname, lastname:lastname }
      const response = await api.post('/chat/create', payload);
      const newChat = response.chat;
      this.addChat(newChat);
      toast.success("Chat created successfully!");
    } catch (error) {
      console.error('Failed to create chat', error);
      toast.error("Failed to create chat.");
    }
  }

sendUserMessage = async (chatId, messageContent) => {
    try {
      const payload = { chatId, content: messageContent };
      const response = await api.post('/chat/send-message', payload);
      const message = response.message;
      const existingChat = this.chats.find(chat => chat._id === chatId);
      if (existingChat) {
        existingChat.messages.push(message);
      }
    } catch (error) {
      console.error('Failed to send message', error);
      toast.error("Failed to send message.");
    } finally {
      await this.getAutoReply(chatId);
    }
  }

  getAutoReply = async (chatId) => {
    try {
      const payload = { chatId };
      const response = await api.post('/chat/get-reply', payload);
      const message = response.message;
      const existingChat = this.chats.find(chat => chat._id === chatId);
      if (existingChat) {
        existingChat.messages.push(message);
      }
      toast.dark(message.content);
    } catch (error) {
      console.error('Failed to get reply', error);
    }
  }

  changeChatName = async (chatId, newName) => {
      try {
        const payload = { chatId: chatId, newChatName: newName }
        await api.patch('/chat/', payload);
        const chat = this.chats.find(chat => chat._id === chatId);
        if (chat) {
        chat.name = newName;
      }
        toast.success("Chat renamed!");
      } catch (error) {
        console.error('Failed to create chat', error);
        toast.error("Failed to create chat.");
      }
  }

    deleteChat = async (chatId) => {
      try {
         await api.delete(`/chat/${chatId}`);
         this.chats = this.chats.filter(chat => chat._id !== chatId);
        toast.success("Chat deleted!");
      } catch (error) {
        toast.error("Failed to delete chat.");
      }
  }

}

const chatStore = new ChatStore();
export default chatStore;
