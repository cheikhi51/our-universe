import { useEffect, useState, useRef } from "react";
import { getMyUniverse } from "../../../services/universeService";
import {
  getMyMessages,
  updateConversationMessages,
  markConversationAsRead,
} from "../../../services/messagesService";

function MessagesWorld({ onBack }) {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] =
  useState(null);
  const messagesContainerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retrying, setRetrying] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [savingMessage, setSavingMessage] = useState(false);
  const [deletingMessageId, setDeletingMessageId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
  if (!selectedConversation) return;

  const container = messagesContainerRef.current;

  if (!container) return;

  requestAnimationFrame(() => {
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  });
}, [selectedConversation]);

  const openConversation = async (conversation) => {
  // Immediately update the UI
  const readConversation = {
    ...conversation,
    unread: 0,
  };

  setSelectedConversation(readConversation);

  setConversations((currentConversations) =>
    currentConversations.map((item) =>
      item.id === conversation.id
        ? readConversation
        : item
    )
  );

  // Persist the read state in Supabase
  if (conversation.unread > 0) {
    try {
      await markConversationAsRead(conversation.id);
    } catch (err) {
      console.error(
        "Failed to mark conversation as read:",
        err
      );
    }
  }
};

  const closeConversation = () => {
  setSelectedConversation(null);

  setEditingMessageId(null);
  setEditingText("");

  setDeleteTarget(null);
  setNewMessage("");
};

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeConversation();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const loadMessages = async () => {
  try {
    setError("");

    const universeMembership = await getMyUniverse();

    const universeId =
      universeMembership?.universes?.id;

    if (!universeId) {
      throw new Error(
        "We couldn't find your universe."
      );
    }

    const data = await getMyMessages(universeId);

    const formattedConversations = data.map(
      (conversation) => ({
        id: conversation.id,
        person: conversation.person,
        avatar: conversation.avatar,
        lastMessage: conversation.last_message,
        date: conversation.message_date,
        unread: conversation.unread ?? 0,
        messages: Array.isArray(conversation.messages)
          ? conversation.messages
          : [],
      })
    );

    setConversations(formattedConversations);
  } catch (err) {
    console.error(
      "Failed to load messages:",
      err
    );

    setError(
      "Something went wrong while opening our conversations."
    );
  } finally {
    setLoading(false);
    setRetrying(false);
  }
};

useEffect(() => {
  loadMessages();
}, []);

const handleRetryMessages = async () => {
  setRetrying(true);
  await loadMessages();
};

    
    const startEditingMessage = (message) => {
        setEditingMessageId(message.id);
        setEditingText(message.text);
      };

    const cancelEditingMessage = () => {
      setEditingMessageId(null);
      setEditingText("");
    };


    const handleEditMessage = async () => {
  const text = editingText.trim();

  if (
    !text ||
    !selectedConversation ||
    editingMessageId === null ||
    savingMessage
  ) {
    return;
  }

  const updatedMessages =
    selectedConversation.messages.map((message) =>
      message.id === editingMessageId
        ? {
            ...message,
            text,
            edited: true,
          }
        : message
    );

  try {
    setSavingMessage(true);

    await updateConversationMessages(
      selectedConversation.id,
      updatedMessages
    );

    const updatedConversation = {
      ...selectedConversation,
      messages: updatedMessages,
      lastMessage:
        updatedMessages[updatedMessages.length - 1]?.text ||
        "",
    };

    setSelectedConversation(updatedConversation);

    setConversations((currentConversations) =>
      currentConversations.map((conversation) =>
        conversation.id === selectedConversation.id
          ? updatedConversation
          : conversation
      )
    );

    cancelEditingMessage();
  } catch (err) {
    console.error("Failed to edit message:", err);

    alert(
      err.message || "Unable to edit this message."
    );
  } finally {
    setSavingMessage(false);
  }
};

  const handleSendMessage = async () => {
  const text = newMessage.trim();

  if (!text || !selectedConversation || sendingMessage) {
    return;
  }

  const nextId =
    selectedConversation.messages.length > 0
      ? Math.max(
          ...selectedConversation.messages.map(
            (message) => Number(message.id) || 0
          )
        ) + 1
      : 1;

  const now = new Date();

  const newMessageObject = {
    id: nextId,
    sender: "me",
    text,
    time: now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    favorite: false,
  };

  const updatedMessages = [
    ...selectedConversation.messages,
    newMessageObject,
  ];

  try {
    setSendingMessage(true);

    await updateConversationMessages(
      selectedConversation.id,
      updatedMessages
    );

    const updatedConversation = {
      ...selectedConversation,
      messages: updatedMessages,
      lastMessage: text,
      date: "Just now",
    };

    setSelectedConversation(updatedConversation);

    setConversations((currentConversations) =>
      currentConversations.map((conversation) =>
        conversation.id === selectedConversation.id
          ? updatedConversation
          : conversation
      )
    );

    setNewMessage("");
  } catch (err) {
    console.error("Failed to send message:", err);

    alert(
      err.message || "Unable to send this message."
    );
  } finally {
    setSendingMessage(false);
  }
};

const toggleFavorite = async (messageId) => {
  if (!selectedConversation) return;

  const updatedMessages =
    selectedConversation.messages.map((message) =>
      message.id === messageId
        ? {
            ...message,
            favorite: !message.favorite,
          }
        : message
    );

  try {
    await updateConversationMessages(
      selectedConversation.id,
      updatedMessages
    );

    const updatedConversation = {
      ...selectedConversation,
      messages: updatedMessages,
    };

    setSelectedConversation(updatedConversation);

    setConversations((currentConversations) =>
      currentConversations.map((conversation) =>
        conversation.id === selectedConversation.id
          ? updatedConversation
          : conversation
      )
    );
  } catch (err) {
    console.error("Failed to update favorite:", err);
    alert("Unable to update this favorite.");
  }
};

const requestDeleteMessage = (message) => {
  setDeleteTarget(message);
};

const confirmDeleteMessage = async () => {
  if (!selectedConversation || !deleteTarget) {
    return;
  }

  const messageId = deleteTarget.id;

  const updatedMessages =
    selectedConversation.messages.filter(
      (message) => message.id !== messageId
    );

  try {
    setDeletingMessageId(messageId);

    await updateConversationMessages(
      selectedConversation.id,
      updatedMessages
    );

    const updatedConversation = {
      ...selectedConversation,
      messages: updatedMessages,
      lastMessage:
        updatedMessages.length > 0
          ? updatedMessages[updatedMessages.length - 1].text
          : "",
    };

    setSelectedConversation(updatedConversation);

    setConversations((currentConversations) =>
      currentConversations.map((conversation) =>
        conversation.id === selectedConversation.id
          ? updatedConversation
          : conversation
      )
    );

    setDeleteTarget(null);
  } catch (err) {
    console.error("Failed to delete message:", err);
    alert(err.message || "Unable to delete this message.");
  } finally {
    setDeletingMessageId(null);
  }
};

{loading && (
  <div className="messages-state messages-loading">
    <div className="messages-loading-heart">
      ♥
    </div>

    <p>Opening our little conversations...</p>

    <span>Just a moment</span>
  </div>
)}

{!loading && error && (
  <div className="messages-state messages-error">
    <div className="messages-state-icon">
      ♡
    </div>

    <h3>Our messages are hiding</h3>

    <p>{error}</p>

    <button
      type="button"
      onClick={handleRetryMessages}
      disabled={retrying}
    >
      {retrying
        ? "Trying again..."
        : "Try again"}
    </button>
  </div>
)}

{!loading &&
  !error &&
  conversations.length === 0 && (
    <div className="messages-state messages-empty">
      <div className="messages-empty-stars">
        ✦ ♥ ✦
      </div>

      <h3>Nothing here yet</h3>

      <p>
        Our first little conversation is waiting
        to be written.
      </p>
    </div>
)}

   return (
    <main className="messages-world">
      {/* Atmosphere */}
      <div className="messages-stars messages-stars-one" />
      <div className="messages-stars messages-stars-two" />
      <div className="messages-stars messages-stars-three" />

      <div className="messages-nebula messages-nebula-one" />
      <div className="messages-nebula messages-nebula-two" />

      {/* Header */}
      <header className="messages-header">
        <button
          className="messages-back-button"
          onClick={onBack}
          aria-label="Back to universe"
        >
          <span>←</span>
          <span>Back to Universe</span>
        </button>

        <div className="messages-title">
          <span className="messages-icon">💌</span>

          <div>
            <p className="messages-eyebrow">OUR UNIVERSE</p>
            <h1>Messages</h1>
            <p className="messages-subtitle">Words that belong only to us.</p>
          </div>
        </div>

        <div className="messages-counter">
          <span>
            {conversations.reduce(
              (total, conversation) => total + conversation.messages.length,
              0
            )}
          </span>
          <small>messages</small>
        </div>
      </header>

      {/* Main content */}
      <section className="messages-content">
        <div className="messages-intro">
          <span className="messages-line" />
          <p>
            Some words disappear from a screen,
            <br />
            but never disappear from our hearts.
          </p>
          <span className="messages-line" />
        </div>

        {conversations.length === 0 ? (
          <div className="messages-state messages-empty">
            <div className="messages-empty-stars">✦ ♥ ✦</div>
            <h3>Nothing here yet</h3>
            <p>Our first little conversation is waiting to be written.</p>
          </div>
        ) : (
          <div className="conversations-list">
            {conversations.map((conversation, index) => (
              <button
                key={conversation.id}
                className={`conversation-card conversation-card-${index + 1}`}
                onClick={() => openConversation(conversation)}
              >
                <div className="conversation-avatar">{conversation.avatar}</div>

                <div className="conversation-info">
                  <div className="conversation-top">
                    <h2>{conversation.person}</h2>
                    <span className="conversation-date">{conversation.date}</span>
                  </div>

                  <p>{conversation.lastMessage}</p>
                </div>

                {conversation.unread > 0 && (
                  <div className="conversation-unread">{conversation.unread}</div>
                )}

                <span className="conversation-arrow">→</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="messages-footer">
        <span>✦</span>
        <span>Every message is a little piece of us</span>
        <span>✦</span>
      </footer>

      {/* Conversation viewer — single instance, guarded by selectedConversation */}
      {selectedConversation && (
        <div
          className="conversation-viewer"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedConversation.person} conversation`}
          onClick={closeConversation}
        >
          <button
            className="conversation-viewer-close"
            onClick={closeConversation}
            aria-label="Close conversation"
            type="button"
          >
            ×
          </button>

          <article
            className="conversation-viewer-content"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Conversation header */}
            <header className="conversation-viewer-header">
              <div className="conversation-viewer-avatar">
                {selectedConversation.avatar}
              </div>

              <div className="conversation-viewer-person">
                <p>OUR CONVERSATION</p>
                <h2>{selectedConversation.person}</h2>
                <span>{selectedConversation.messages.length} messages</span>
              </div>

              <div className="conversation-viewer-heart">♥</div>
            </header>

            {/* Messages */}
            {selectedConversation.messages.length === 0 ? (
              <div className="conversation-empty">
                <div className="conversation-empty-icon">💌</div>
                <h3>A blank page in our story</h3>
                <p>Maybe this is where we write something beautiful next.</p>
              </div>
            ) : (
              <div className="conversation-messages" ref={messagesContainerRef}>
                <div className="conversation-start">
                  <span>✦</span>
                  <p>A little piece of our story</p>
                  <span>✦</span>
                </div>

                {selectedConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message-row ${
                      message.sender === "me"
                        ? "message-row-me"
                        : "message-row-naya"
                    }`}
                  >
                    <div className="message-bubble">
                      {editingMessageId === message.id ? (
                        /* =================================
                          EDIT MODE
                        ================================= */
                        <div className="message-edit-mode">
                          <textarea
                            value={editingText}
                            onChange={(event) => setEditingText(event.target.value)}
                            maxLength={500}
                            autoFocus
                          />

                          <div className="message-edit-actions">
                            <button
                              type="button"
                              onClick={cancelEditingMessage}
                              disabled={savingMessage}
                            >
                              Cancel
                            </button>

                            <button
                              type="button"
                              onClick={handleEditMessage}
                              disabled={!editingText.trim() || savingMessage}
                            >
                              {savingMessage ? "Saving..." : "Save"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* =================================
                          NORMAL MODE
                        ================================= */
                        <>
                          <button
                            type="button"
                            className={`message-favorite ${
                              message.favorite ? "message-favorite-active" : ""
                            }`}
                            onClick={() => toggleFavorite(message.id)}
                            aria-label={
                              message.favorite
                                ? "Remove from favorites"
                                : "Add to favorites"
                            }
                          >
                            ♥
                          </button>

                          <p>{message.text}</p>

                          <div className="message-meta">
                            <span className="message-time">{message.time}</span>

                            {message.edited && (
                              <span className="message-edited">edited</span>
                            )}
                          </div>

                          {/* ================================
                              MESSAGE ACTIONS
                          ================================= */}
                          {message.sender === "me" && (
                            <div className="message-actions">
                              <button
                                type="button"
                                onClick={() => startEditingMessage(message)}
                                aria-label="Edit message"
                              >
                                ✏️
                              </button>

                              <button
                                type="button"
                                onClick={() => requestDeleteMessage(message)}
                                disabled={deletingMessageId === message.id}
                                aria-label="Delete message"
                              >
                                🗑️
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}

                <div className="conversation-end">
                  <span>♥</span>
                  <p>End of this little story</p>
                  <span>♥</span>
                </div>
              </div>
            )}

            <div className="conversation-composer">
              <input
                type="text"
                placeholder="Write something from the heart..."
                value={newMessage}
                onChange={(event) => setNewMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSendMessage();
                  }
                }}
                maxLength={500}
                aria-label="New message"
              />

              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sendingMessage}
                aria-label="Send message"
              >
                {sendingMessage ? "…" : "➤"}
              </button>
            </div>

            {/* Footer */}
            <div className="conversation-viewer-footer">
              <span>♥</span>
              <p>Some words are worth keeping forever.</p>
              <span>♥</span>
            </div>
          </article>

          {/* Delete confirmation modal */}
          {deleteTarget && (
            <div
              className="message-delete-overlay"
              onClick={() => setDeleteTarget(null)}
            >
              <div
                className="message-delete-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-message-title"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="message-delete-icon">🗑️</div>

                <p className="message-delete-eyebrow">A little goodbye</p>

                <h3 id="delete-message-title">Delete this message?</h3>

                <p className="message-delete-preview">"{deleteTarget.text}"</p>

                <p className="message-delete-warning">
                  This message will be removed from our little conversation
                  forever.
                </p>

                <div className="message-delete-actions">
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(null)}
                    disabled={deletingMessageId !== null}
                  >
                    Keep it
                  </button>

                  <button
                    type="button"
                    className="message-delete-confirm"
                    onClick={confirmDeleteMessage}
                    disabled={deletingMessageId !== null}
                  >
                    {deletingMessageId !== null ? "Deleting..." : "Delete message"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default MessagesWorld;