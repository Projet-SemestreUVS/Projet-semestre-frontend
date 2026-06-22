// src/pages/prestataire/Messages.tsx
import { useState, useEffect, useRef } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import PrestataireSidebar from "../../components/dashboard/PrestataireSidebar";
import "../../styles/dashboard.css";

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  contenu: string;
  created_at: string;
  lu: boolean;
  sender_nom?: string;
  sender_prenom?: string;
  receiver_nom?: string;
  receiver_prenom?: string;
}

interface Conversation {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  dernierMessage: string;
  dernierMessageDate: string;
  nonLu: number;
  avatar?: string;
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
  const [prestataireInfo, setPrestataireInfo] = useState({ id: 1, nom: "Prestataire", prenom: "John" });

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      loadMessages(selectedUser.id);
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = () => {
    setLoading(true);
    
    // Données mockées pour les conversations du prestataire
    const mockConversations: Conversation[] = [
      {
        id: 1,
        nom: "Dupont",
        prenom: "Jean",
        email: "jean.dupont@email.com",
        dernierMessage: "Bonjour, quand pouvez-vous intervenir ?",
        dernierMessageDate: "2024-06-15T10:30:00",
        nonLu: 2,
      },
      {
        id: 2,
        nom: "Lambert",
        prenom: "Marie",
        email: "marie.lambert@email.com",
        dernierMessage: "Merci pour votre intervention !",
        dernierMessageDate: "2024-06-14T14:20:00",
        nonLu: 0,
      },
      {
        id: 3,
        nom: "Diop",
        prenom: "Abdoulaye",
        email: "abdoulaye.diop@email.com",
        dernierMessage: "Je confirme ma réservation pour demain",
        dernierMessageDate: "2024-06-13T09:15:00",
        nonLu: 1,
      },
      {
        id: 4,
        nom: "Martin",
        prenom: "Sophie",
        email: "sophie.martin@email.com",
        dernierMessage: "Pouvez-vous me rappeler ?",
        dernierMessageDate: "2024-06-12T16:45:00",
        nonLu: 0,
      },
    ];

    setConversations(mockConversations);
    setLoading(false);
  };

  const loadMessages = (userId: number) => {
    // Données mockées pour les messages avec l'utilisateur sélectionné
    const mockMessages: Message[] = [
      {
        id: 1,
        sender_id: userId,
        receiver_id: prestataireInfo.id,
        contenu: "Bonjour, je suis intéressé par votre service de plomberie",
        created_at: "2024-06-15T09:00:00",
        lu: true,
        sender_nom: "Dupont",
        sender_prenom: "Jean",
      },
      {
        id: 2,
        sender_id: prestataireInfo.id,
        receiver_id: userId,
        contenu: "Bonjour, merci pour votre message. Quand souhaitez-vous intervenir ?",
        created_at: "2024-06-15T09:30:00",
        lu: true,
        receiver_nom: "Dupont",
        receiver_prenom: "Jean",
      },
      {
        id: 3,
        sender_id: userId,
        receiver_id: prestataireInfo.id,
        contenu: "Je suis disponible demain matin, est-ce possible ?",
        created_at: "2024-06-15T10:00:00",
        lu: false,
        sender_nom: "Dupont",
        sender_prenom: "Jean",
      },
      {
        id: 4,
        sender_id: prestataireInfo.id,
        receiver_id: userId,
        contenu: "Oui, je peux passer demain à 10h. L'adresse ?",
        created_at: "2024-06-15T10:15:00",
        lu: true,
        receiver_nom: "Dupont",
        receiver_prenom: "Jean",
      },
    ];

    setMessages(mockMessages);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;
    
    setSending(true);
    
    // Créer un nouveau message
    const newMsg: Message = {
      id: messages.length + 1,
      sender_id: prestataireInfo.id,
      receiver_id: selectedUser.id,
      contenu: newMessage,
      created_at: new Date().toISOString(),
      lu: false,
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage("");
    
    // Mettre à jour la conversation
    const updatedConversations = conversations.map(conv =>
      conv.id === selectedUser.id
        ? { ...conv, dernierMessage: newMessage, dernierMessageDate: new Date().toISOString() }
        : conv
    );
    setConversations(updatedConversations);
    
    setSending(false);
    scrollToBottom();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return "Hier";
    } else {
      return date.toLocaleDateString('fr-FR');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    `${conv.prenom} ${conv.nom}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout sidebar={<PrestataireSidebar />}>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement des messages...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<PrestataireSidebar />}>
      <div className="dashboard-prestataire">
        <div className="page-header">
          <h1>
            <i className="bi bi-chat-dots"></i>
            Messages
          </h1>
          <p>Discutez avec vos clients</p>
        </div>

        <div className="messages-container">
          {/* Liste des conversations */}
          <div className="conversations-list">
            <div className="search-conversation">
              <i className="bi bi-search"></i>
              <input
                type="text"
                placeholder="Rechercher un client..."
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
                  key={conv.id}
                  className={`conversation-item ${selectedUser?.id === conv.id ? "active" : ""}`}
                  onClick={() => setSelectedUser(conv)}
                >
                  <div className="conversation-avatar">
                    <i className="bi bi-person-circle"></i>
                    {conv.nonLu > 0 && <span className="badge-nonlu">{conv.nonLu}</span>}
                  </div>
                  <div className="conversation-info">
                    <div className="conversation-name">
                      {conv.prenom} {conv.nom}
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
                <div className="chat-header">
                  <div className="chat-user-info">
                    <i className="bi bi-person-circle"></i>
                    <div>
                      <h3>{selectedUser.prenom} {selectedUser.nom}</h3>
                      <span className="user-email">{selectedUser.email}</span>
                    </div>
                  </div>
                </div>

                <div className="chat-messages">
                  {messages.length === 0 ? (
                    <div className="no-messages">
                      <i className="bi bi-chat-dots"></i>
                      <p>Aucun message</p>
                      <p className="small">Soyez le premier à envoyer un message</p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isOwnMessage = message.sender_id === prestataireInfo.id;
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

                <form onSubmit={handleSendMessage} className="chat-input-area">
                  <input
                    type="text"
                    placeholder="Écrivez votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button type="submit" disabled={sending || !newMessage.trim()}>
                    <i className="bi bi-send"></i>
                  </button>
                </form>
              </>
            ) : (
              <div className="no-conversation-selected">
                <i className="bi bi-chat-dots"></i>
                <h3>Sélectionnez une conversation</h3>
                <p>Choisissez un client pour commencer à discuter</p>
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

        .conversations-list {
          width: 320px;
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
        }

        .conversation-info {
          flex: 1;
        }

        .conversation-name {
          font-weight: 600;
          font-size: 0.875rem;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .conversation-last-message {
          font-size: 0.7rem;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .conversation-date {
          font-size: 0.65rem;
          color: #94a3b8;
        }

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

        .user-email {
          font-size: 0.7rem;
          color: #64748b;
        }

        .chat-messages {
          flex: 1;
          padding: 1.5rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: 500px;
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

        .empty-conversations, .no-messages, .no-conversation-selected {
          text-align: center;
          padding: 2rem;
          color: #94a3b8;
        }

        .no-conversation-selected i {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        @media (max-width: 768px) {
          .messages-container {
            flex-direction: column;
          }
          
          .conversations-list {
            width: 100%;
            max-height: 300px;
            overflow-y: auto;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default Messages;