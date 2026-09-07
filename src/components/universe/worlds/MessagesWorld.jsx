import { useEffect, useState } from "react";
import { conversations } from "../../../data/messages";

function MessagesWorld({ onBack }) {
  const [selectedConversation, setSelectedConversation] = useState(null);

  const openConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const closeConversation = () => {
    setSelectedConversation(null);
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
            <p className="messages-eyebrow">
              OUR UNIVERSE
            </p>

            <h1>Messages</h1>

            <p className="messages-subtitle">
              Words that belong only to us.
            </p>
          </div>
        </div>

        <div className="messages-counter">
          <span>
            {conversations.reduce(
              (total, conversation) =>
                total + conversation.messages.length,
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

        {/* Conversations */}
        <div className="conversations-list">

          {conversations.map((conversation, index) => (
            <button
              key={conversation.id}
              className={`conversation-card conversation-card-${index + 1}`}
              onClick={() => openConversation(conversation)}
            >

              <div className="conversation-avatar">
                {conversation.avatar}
              </div>

              <div className="conversation-info">

                <div className="conversation-top">

                  <h2>
                    {conversation.person}
                  </h2>

                  <span className="conversation-date">
                    {conversation.date}
                  </span>

                </div>

                <p>
                  {conversation.lastMessage}
                </p>

              </div>

              {conversation.unread > 0 && (
                <div className="conversation-unread">
                  {conversation.unread}
                </div>
              )}

              <span className="conversation-arrow">
                →
              </span>

            </button>
          ))}

        </div>

      </section>

      {/* Footer */}
      <footer className="messages-footer">

        <span>✦</span>

        <span>
          Every message is a little piece of us
        </span>

        <span>✦</span>

      </footer>

      {/* Conversation viewer */}
      {selectedConversation && (
        <div
          className="conversation-viewer"
          role="dialog"
          aria-modal="true"
          onClick={closeConversation}
        >

          <button
            className="conversation-viewer-close"
            onClick={closeConversation}
            aria-label="Close conversation"
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

              <div>
                <p>OUR CONVERSATION</p>
                <h2>{selectedConversation.person}</h2>
              </div>

            </header>

            {/* Messages */}
            <div className="conversation-messages">

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

                    {message.favorite && (
                      <span className="message-favorite">
                        ♥
                      </span>
                    )}

                    <p>{message.text}</p>

                    <span className="message-time">
                      {message.time}
                    </span>

                  </div>

                </div>
              ))}

            </div>

            <div className="conversation-viewer-footer">
              <span>♥</span>
              <p>Some words are worth keeping forever.</p>
              <span>♥</span>
            </div>

          </article>

        </div>
      )}

    </main>
  );
}

export default MessagesWorld;