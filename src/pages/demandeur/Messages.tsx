// src/pages/demandeur/Messages.tsx
import { useState, useEffect, useRef } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DemandeurSidebar from "../../components/dashboard/DemandeurSidebar";
import api from "../../services/api";
import "../../styles/dashboard.css";

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  contenu: string;
  created_at: string;
  lu: boolean;
  sender?: {
    id: number;
    nom: string;
    prenom: string;
    role: string;
    photo?: string;
  };
  receiver?: {
    id: number;
    nom: string;
    prenom: string;
    role: string;
    photo?: string;
  };
}

interface Conversation {
  userId: number;
  nom: string;
  prenom: string;
  role: string;
  dernierMessage: string;
  dernierMessageDate: string;
  nonLu: number;
  photo?: string;
}

const Messages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    fetchUserInfo();
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.userId);
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchUserInfo = async () => {
    try {
      const response = await api.get("/auth/profile");
      setUserInfo(response.data.user);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await api.get("/messages/conversations");
      console.log("Conversations:", response.data);
      
      let conversationsData = [];
      if (response.data.data) {
        conversationsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        conversationsData = response.data;
      } else if (response.data.conversations) {
        conversationsData = response.data.conversations;
      }
      
      setConversations(conversationsData);
      
      // Sélectionner la première conversation par défaut
      if (conversationsData.length > 0 && !selectedUser) {
        setSelectedUser(conversationsData[0]);
      }
    } catch (err: any) {
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId: number) => {
    try {
      const response = await api.get(`/messages/user/${userId}`);
      console.log("Messages:", response.data);
      
      let messagesData = [];
      if (response.data.data) {
        messagesData = response.data.data;
      } else if (Array.isArray(response.data)) {
        messagesData = response.data;
      } else if (response.data.messages) {
        messagesData = response.data.messages;
      }
      
      setMessages(messagesData);
    } catch (err: any) {
      console.error("Erreur:", err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;
    
    try {
      setSending(true);
      const response = await api.post("/messages", {
        receiver_id: selectedUser.userId,
        contenu: newMessage
      });
      
      const newMsg = response.data.data || response.data;
      setMessages(prev => [...prev, newMsg]);
      setNewMessage("");
      
      // Mettre à jour la dernière conversation
      setConversations(prev =>
        prev.map(conv =>
          conv.userId === selectedUser.userId
            ? { ...conv, dernierMessage: newMessage, dernierMessageDate: new Date().toISOString() }
            : conv
        )
      );
      
      scrollToBottom();
    } catch (err: any) {
      console.error("Erreur:", err);
      alert(err.response?.data?.message || "Erreur lors de l'envoi du message");
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return "Hier";
    } else if (days < 7) {
      return `${days} jours`;
    } else {
      return date.toLocaleDateString('fr-FR');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    `${conv.prenom} ${conv.nom}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout sidebar={<DemandeurSidebar />}>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement des messages...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<DemandeurSidebar />}>
      <div className="dashboard-demandeur">
        <div className="page-header">
          <h1>
            <i className="bi bi-chat-dots"></i>
            Messages
          </h1>
          <p>Discutez avec vos prestataires</p>
        </div>

        <div className="messages-container">
          {/* Liste des conversations */}
          <div className="conversations-list">
            <div className="search-conversation">
              <i className="bi bi-search"></i>
              <input
                type="text"
                placeholder="Rechercher une conversation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {filteredConversations.length === 0 ? (
              <div className="empty-conversations">
                <i className="bi bi-chat"></i>
                <p>Aucune conversation</p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <div
                  key={conv.userId}
                  className={`conversation-item ${selectedUser?.userId === conv.userId ? "active" : ""}`}
                  onClick={() => setSelectedUser(conv)}
                >
                  <div className="conversation-avatar">
                    <i className="bi bi-person-circle"></i>
                    {conv.nonLu > 0 && <span className="badge-nonlu">{conv.nonLu}</span>}
                  </div>
                  <div className="conversation-info">
                    <div className="conversation-name">
                      {conv.prenom} {conv.nom}
                      <span className="conversation-role">{conv.role === "prestataire" ? "Prestataire" : conv.role}</span>
                    </div>
                    <div className="conversation-last-message">{conv.dernierMessage}</div>
                  </div>
                  <div className="conversation-date">{formatDate(conv.dernierMessageDate)}</div>
                </div>
              ))
            )}
          </div>

          {/* Zone de chat */}
          <div className="chat-area">
            {selectedUser ? (
              <>
                {/* En-tête du chat */}
                <div className="chat-header">
                  <div className="chat-user-info">
                    <i className="bi bi-person-circle"></i>
                    <div>
                      <h3>{selectedUser.prenom} {selectedUser.nom}</h3>
                      <span className="user-role-badge">
                        {selectedUser.role === "prestataire" ? "Prestataire" : selectedUser.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="chat-messages">
                  {messages.length === 0 ? (
                    <div className="no-messages">
                      <i className="bi bi-chat-dots"></i>
                      <p>Aucun message pour le moment</p>
                      <p className="small">Soyez le premier à envoyer un message</p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isOwnMessage = message.sender_id === userInfo?.id;
                      return (
                        <div
                          key={message.id}
                          className={`message-item ${isOwnMessage ? "own-message" : "other-message"}`}
                        >
                          <div className="message-bubble">
                            <div className="message-content">{message.contenu}</div>
                            <div className="message-time">{formatDate(message.created_at)}</div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Formulaire d'envoi */}
                <form onSubmit={handleSendMessage} className="chat-input-area">
                  <input
                    type="text"
                    placeholder="Écrivez votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button type="submit" disabled={sending || !newMessage.trim()}>
                    {sending ? <i className="bi bi-hourglass-split"></i> : <i className="bi bi-send"></i>}
                  </button>
                </form>
              </>
            ) : (
              <div className="no-conversation-selected">
                <i className="bi bi-chat-dots"></i>
                <h3>Sélectionnez une conversation</h3>
                <p>Choisissez un prestataire pour commencer à discuter</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .messages-container {
          display: flex;
          gap: 1.5rem;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          min-height: 600px;
        }

        /* Conversations List */
        .conversations-list {
          width: 350px;
          border-right: 1px solid #e2e8f0;
          background: white;
          display: flex;
          flex-direction: column;
        }

        .search-conversation {
          padding: 1rem;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .search-conversation i {
          color: #94a3b8;
        }

        .search-conversation input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 0.875rem;
        }

        .conversation-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border-bottom: 1px solid #f1f5f9;
        }

        .conversation-item:hover {
          background: #f8fafc;
        }

        .conversation-item.active {
          background: #eef2ff;
          border-left: 3px solid #354dd4;
        }

        .conversation-avatar {
          position: relative;
          width: 48px;
          height: 48px;
          background: #f1f5f9;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .conversation-avatar i {
          font-size: 1.5rem;
          color: #354dd4;
        }

        .badge-nonlu {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ef4444;
          color: white;
          font-size: 0.6rem;
          padding: 0.125rem 0.375rem;
          border-radius: 10px;
          min-width: 18px;
          text-align: center;
        }

        .conversation-info {
          flex: 1;
          min-width: 0;
        }

        .conversation-name {
          font-weight: 600;
          font-size: 0.875rem;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .conversation-role {
          font-size: 0.65rem;
          font-weight: 500;
          color: #354dd4;
          background: #eef2ff;
          padding: 0.125rem 0.375rem;
          border-radius: 10px;
        }

        .conversation-last-message {
          font-size: 0.75rem;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .conversation-date {
          font-size: 0.65rem;
          color: #94a3b8;
        }

        /* Chat Area */
        .chat-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #f8fafc;
        }

        .chat-header {
          padding: 1rem 1.5rem;
          background: white;
          border-bottom: 1px solid #e2e8f0;
        }

        .chat-user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .chat-user-info i {
          font-size: 2rem;
          color: #354dd4;
        }

        .chat-user-info h3 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0;
        }

        .user-role-badge {
          font-size: 0.7rem;
          color: #22c55e;
        }

        /* Messages */
        .chat-messages {
          flex: 1;
          padding: 1.5rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: calc(100vh - 300px);
          min-height: 400px;
        }

        .message-item {
          display: flex;
        }

        .message-item.own-message {
          justify-content: flex-end;
        }

        .message-item.other-message {
          justify-content: flex-start;
        }

        .message-bubble {
          max-width: 70%;
          padding: 0.75rem 1rem;
          border-radius: 18px;
          position: relative;
        }

        .own-message .message-bubble {
          background: #354dd4;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .other-message .message-bubble {
          background: white;
          color: #1e293b;
          border-bottom-left-radius: 4px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }

        .message-content {
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .message-time {
          font-size: 0.6rem;
          margin-top: 0.25rem;
          opacity: 0.7;
          text-align: right;
        }

        /* Input Area */
        .chat-input-area {
          padding: 1rem 1.5rem;
          background: white;
          border-top: 1px solid #e2e8f0;
          display: flex;
          gap: 0.75rem;
        }

        .chat-input-area input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 25px;
          outline: none;
          font-size: 0.875rem;
        }

        .chat-input-area input:focus {
          border-color: #354dd4;
        }

        .chat-input-area button {
          width: 42px;
          height: 42px;
          background: #354dd4;
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .chat-input-area button:hover:not(:disabled) {
          background: #2a3fb0;
          transform: scale(1.05);
        }

        .chat-input-area button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Empty States */
        .empty-conversations {
          text-align: center;
          padding: 2rem;
          color: #94a3b8;
        }

        .empty-conversations i {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .no-messages {
          text-align: center;
          padding: 2rem;
          color: #94a3b8;
        }

        .no-messages i {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .no-conversation-selected {
          text-align: center;
          padding: 3rem;
          color: #94a3b8;
        }

        .no-conversation-selected i {
          font-size: 4rem;
          margin-bottom: 1rem;
          color: #cbd5e1;
        }

        .no-conversation-selected h3 {
          font-size: 1.125rem;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .messages-container {
            flex-direction: column;
          }
          
          .conversations-list {
            width: 100%;
            max-height: 300px;
            overflow-y: auto;
          }
          
          .message-bubble {
            max-width: 85%;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default Messages;