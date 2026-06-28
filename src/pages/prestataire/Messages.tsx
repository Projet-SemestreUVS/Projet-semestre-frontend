// src/pages/prestataire/Messages.tsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import PrestataireSidebar from "../../components/dashboard/PrestataireSidebar";
import { useAuth } from "../../contexts/AuthContext";
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
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Informations du prestataire connecté
  const [prestataireInfo, setPrestataireInfo] = useState({ 
    id: 2, 
    nom: "Tech", 
    prenom: "Alpha" 
  });

  useEffect(() => {
    if (user) {
      setPrestataireInfo({
        id: user.id,
        nom: user.nom || "Tech",
        prenom: user.prenom || "Alpha"
      });
    } else {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setPrestataireInfo({
            id: userData.id || 2,
            nom: userData.nom || "Tech",
            prenom: userData.prenom || "Alpha"
          });
        } catch (e) {
          console.error("Erreur parsing user:", e);
        }
      }
    }
    loadConversations();
  }, [user]);

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
    
    const storedReservations = localStorage.getItem("reservations");
    let demandeurs: { id: number; nom: string; prenom: string; email: string; dernierMessage: string; date: string }[] = [];
    
    if (storedReservations) {
      const reservations = JSON.parse(storedReservations);
      const prestataireReservations = reservations.filter((r: any) => r.prestataire_id === prestataireInfo.id);
      
      const demandeursMap = new Map();
      prestataireReservations.forEach((r: any) => {
        if (!demandeursMap.has(r.demandeur_id)) {
          demandeursMap.set(r.demandeur_id, {
            id: r.demandeur_id,
            nom: r.demandeur_nom || "Diop",
            prenom: r.demandeur_prenom || "Aminata",
            email: r.demandeur_email || `client${r.demandeur_id}@email.com`,
            dernierMessage: "Bonjour, j'ai besoin de vos services",
            date: r.created_at || new Date().toISOString()
          });
        }
      });
      demandeurs = Array.from(demandeursMap.values());
    }
    
    if (demandeurs.length === 0) {
      demandeurs = [
        { 
          id: 1, 
          nom: "Diop", 
          prenom: "Aminata", 
          email: "aminata.diop@email.com",
          dernierMessage: "Bonjour, quand pouvez-vous intervenir ?",
          date: new Date(Date.now() - 3600000).toISOString()
        },
        { 
          id: 3, 
          nom: "Ndiaye", 
          prenom: "Mamadou", 
          email: "mamadou.ndiaye@email.com",
          dernierMessage: "Merci pour votre intervention !",
          date: new Date(Date.now() - 7200000).toISOString()
        },
        { 
          id: 4, 
          nom: "Sow", 
          prenom: "Fatou", 
          email: "fatou.sow@email.com",
          dernierMessage: "Je confirme ma réservation pour demain",
          date: new Date(Date.now() - 86400000).toISOString()
        },
        { 
          id: 5, 
          nom: "Fall", 
          prenom: "Ousmane", 
          email: "ousmane.fall@email.com",
          dernierMessage: "Pouvez-vous me rappeler ?",
          date: new Date(Date.now() - 172800000).toISOString()
        }
      ];
    }
    
    const storedMessages = localStorage.getItem("messages");
    let allMessages: Message[] = [];
    if (storedMessages) {
      allMessages = JSON.parse(storedMessages);
    }
    
    const conversationsData = demandeurs.map((d) => {
      const nonLu = allMessages.filter(
        (m) => m.sender_id === d.id && m.receiver_id === prestataireInfo.id && !m.lu
      ).length;
      
      return {
        id: d.id,
        nom: d.nom,
        prenom: d.prenom,
        email: d.email,
        dernierMessage: d.dernierMessage || "Aucun message",
        dernierMessageDate: d.date || new Date().toISOString(),
        nonLu: nonLu || 0,
      };
    });
    
    setConversations(conversationsData);
    setLoading(false);
  };

  const loadMessages = (userId: number) => {
    const storedMessages = localStorage.getItem("messages");
    let allMessages: Message[] = [];
    
    if (storedMessages) {
      allMessages = JSON.parse(storedMessages);
    }
    
    const filteredMessages = allMessages.filter(
      (m) => 
        (m.sender_id === userId && m.receiver_id === prestataireInfo.id) ||
        (m.sender_id === prestataireInfo.id && m.receiver_id === userId)
    );
    
    if (filteredMessages.length > 0) {
      setMessages(filteredMessages);
    } else {
      const userInfo = conversations.find(c => c.id === userId);
      const mockMessages: Message[] = [
        {
          id: 1,
          sender_id: userId,
          receiver_id: prestataireInfo.id,
          contenu: `Bonjour, je suis intéressé par vos services.`,
          created_at: new Date(Date.now() - 3600000).toISOString(),
          lu: true,
          sender_nom: userInfo?.nom,
          sender_prenom: userInfo?.prenom,
        },
        {
          id: 2,
          sender_id: prestataireInfo.id,
          receiver_id: userId,
          contenu: "Bonjour, merci pour votre message. En quoi puis-je vous aider ?",
          created_at: new Date(Date.now() - 1800000).toISOString(),
          lu: true,
        },
        {
          id: 3,
          sender_id: userId,
          receiver_id: prestataireInfo.id,
          contenu: "J'ai besoin de vos services. Quand êtes-vous disponible ?",
          created_at: new Date(Date.now() - 600000).toISOString(),
          lu: false,
          sender_nom: userInfo?.nom,
          sender_prenom: userInfo?.prenom,
        },
      ];
      setMessages(mockMessages);
    }
    
    const updatedMessages = allMessages.map((m) => {
      if (m.sender_id === userId && m.receiver_id === prestataireInfo.id && !m.lu) {
        return { ...m, lu: true };
      }
      return m;
    });
    localStorage.setItem("messages", JSON.stringify(updatedMessages));
    
    setConversations(prev => 
      prev.map(c => 
        c.id === userId ? { ...c, nonLu: 0 } : c
      )
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;
    
    setSending(true);
    
    const newMsg: Message = {
      id: Date.now(),
      sender_id: prestataireInfo.id,
      receiver_id: selectedUser.id,
      contenu: newMessage,
      created_at: new Date().toISOString(),
      lu: false,
      sender_nom: prestataireInfo.nom,
      sender_prenom: prestataireInfo.prenom,
      receiver_nom: selectedUser.nom,
      receiver_prenom: selectedUser.prenom
    };
    
    const storedMessages = localStorage.getItem("messages");
    let allMessages: Message[] = storedMessages ? JSON.parse(storedMessages) : [];
    allMessages.push(newMsg);
    localStorage.setItem("messages", JSON.stringify(allMessages));
    
    setMessages([...messages, newMsg]);
    setNewMessage("");
    
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

  const getInitials = (prenom: string, nom: string) => {
    return `${prenom.charAt(0)}${nom.charAt(0)}`;
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
      <div className="messages-page">
        <div className="page-header">
          <h1>
            <i className="bi bi-chat-dots"></i>
            Messages
          </h1>
          <p>Discutez avec vos clients</p>
        </div>

        <div className="messages-container">
          {/* Même structure que la version demandeur */}
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
                <span className="empty-sub">Commencez à discuter avec vos clients</span>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`conversation-item ${selectedUser?.id === conv.id ? "active" : ""}`}
                  onClick={() => setSelectedUser(conv)}
                >
                  <div className="conversation-avatar">
                    <span className="avatar-initials">
                      {getInitials(conv.prenom, conv.nom)}
                    </span>
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
                    <div className="chat-avatar">
                      <span className="avatar-initials large">
                        {getInitials(selectedUser.prenom, selectedUser.nom)}
                      </span>
                    </div>
                    <div>
                      <h3>{selectedUser.prenom} {selectedUser.nom}</h3>
                      <span className="user-email">
                        <i className="bi bi-envelope"></i> {selectedUser.email}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="chat-messages">
                  {messages.length === 0 ? (
                    <div className="no-messages">
                      <i className="bi bi-chat-dots"></i>
                      <p>Aucun message</p>
                      <span className="no-messages-sub">Soyez le premier à envoyer un message</span>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isOwnMessage = message.sender_id === prestataireInfo.id;
                      const senderName = !isOwnMessage 
                        ? `${message.sender_prenom || selectedUser.prenom} ${message.sender_nom || selectedUser.nom}`
                        : '';
                      
                      return (
                        <div
                          key={message.id}
                          className={`message-item ${isOwnMessage ? "own-message" : "other-message"}`}
                        >
                          <div className="message-bubble">
                            {!isOwnMessage && (
                              <div className="message-sender">{senderName}</div>
                            )}
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
                    {sending ? <i className="bi bi-hourglass-split"></i> : <i className="bi bi-send"></i>}
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
        /* Styles identiques à la version demandeur */
        .messages-page { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
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
          width: 350px;
          border-right: 1px solid #e2e8f0;
          background: white;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
        }

        .search-conversation {
          padding: 1rem;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .search-conversation i { color: #94a3b8; }
        .search-conversation input { flex: 1; border: none; outline: none; font-size: 0.875rem; background: transparent; }

        .conversation-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border-bottom: 1px solid #f1f5f9;
        }
        .conversation-item:hover { background: #f8fafc; }
        .conversation-item.active { background: #eef2ff; border-left: 3px solid #354dd4; }

        .conversation-avatar {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: linear-gradient(135deg, #354dd4, #4da3ff);
          color: white;
        }
        .avatar-initials { font-size: 0.875rem; font-weight: 600; text-transform: uppercase; }
        .avatar-initials.large { font-size: 1.25rem; }
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

        .conversation-info { flex: 1; min-width: 0; }
        .conversation-name { font-weight: 600; font-size: 0.875rem; color: #1e293b; margin-bottom: 0.25rem; }
        .conversation-last-message { font-size: 0.7rem; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .conversation-date { font-size: 0.65rem; color: #94a3b8; flex-shrink: 0; }

        .chat-area { flex: 1; display: flex; flex-direction: column; background: #f8fafc; }
        .chat-header { padding: 1rem 1.5rem; background: white; border-bottom: 1px solid #e2e8f0; }
        .chat-user-info { display: flex; align-items: center; gap: 1rem; }
        .chat-avatar { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #354dd4, #4da3ff); color: white; }
        .chat-user-info h3 { font-size: 1rem; font-weight: 600; margin: 0; }
        .user-email { font-size: 0.7rem; color: #64748b; display: flex; align-items: center; gap: 0.25rem; }

        .chat-messages { flex: 1; padding: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 0.75rem; max-height: 500px; min-height: 400px; }
        .message-item { display: flex; }
        .message-item.own-message { justify-content: flex-end; }
        .message-item.other-message { justify-content: flex-start; }
        .message-bubble { max-width: 75%; padding: 0.75rem 1rem; border-radius: 18px; position: relative; }
        .own-message .message-bubble { background: #354dd4; color: white; border-bottom-right-radius: 4px; }
        .other-message .message-bubble { background: white; color: #1e293b; border-bottom-left-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .message-sender { font-size: 0.7rem; font-weight: 600; color: #354dd4; margin-bottom: 0.25rem; }
        .message-content { font-size: 0.875rem; line-height: 1.4; word-wrap: break-word; }
        .message-time { font-size: 0.6rem; margin-top: 0.25rem; opacity: 0.7; text-align: right; }

        .chat-input-area { padding: 1rem 1.5rem; background: white; border-top: 1px solid #e2e8f0; display: flex; gap: 0.75rem; }
        .chat-input-area input { flex: 1; padding: 0.75rem 1rem; border: 1px solid #e2e8f0; border-radius: 25px; outline: none; font-size: 0.875rem; }
        .chat-input-area input:focus { border-color: #354dd4; }
        .chat-input-area button { width: 44px; height: 44px; background: #354dd4; color: white; border: none; border-radius: 50%; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; }
        .chat-input-area button:hover:not(:disabled) { background: #2a3fb0; transform: scale(1.05); }
        .chat-input-area button:disabled { opacity: 0.5; cursor: not-allowed; }

        .empty-conversations, .no-messages, .no-conversation-selected { text-align: center; padding: 2rem; color: #94a3b8; }
        .empty-conversations i, .no-messages i, .no-conversation-selected i { font-size: 3rem; color: #cbd5e1; margin-bottom: 1rem; display: block; }
        .empty-conversations h3, .no-conversation-selected h3 { font-size: 1rem; color: #1e293b; margin-bottom: 0.25rem; }
        .empty-sub, .no-messages-sub { font-size: 0.8rem; color: #94a3b8; }

        @media (max-width: 992px) { .conversations-list { width: 300px; } }
        @media (max-width: 768px) { 
          .messages-container { flex-direction: column; }
          .conversations-list { width: 100%; max-height: 280px; overflow-y: auto; border-right: none; border-bottom: 1px solid #e2e8f0; }
          .chat-messages { max-height: 350px; min-height: 250px; }
          .message-bubble { max-width: 85%; }
        }
        @media (max-width: 480px) {
          .chat-header { padding: 0.75rem 1rem; }
          .chat-messages { padding: 1rem; }
          .chat-input-area { padding: 0.75rem 1rem; }
          .chat-user-info h3 { font-size: 0.875rem; }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default Messages;