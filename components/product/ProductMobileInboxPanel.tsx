"use client";

import { useEffect, useMemo, useState } from "react";

import { dmSans, suisseIntl } from "@/lib/home/fonts";
import {
  PRODUCT_MOBILE_INBOX_AGENTS,
  PRODUCT_MOBILE_INBOX_CATEGORIES,
  PRODUCT_MOBILE_INBOX_PINNED_ID,
  productMobileInboxAttachmentCount,
  productMobileInboxAvatarTone,
  productMobileInboxCategoryForKind,
  productMobileInboxCloneThreads,
  productMobileInboxFilterThreads,
  productMobileInboxKindForCategory,
  productMobileInboxNowLabel,
  productMobileInboxSenderInitials,
  type ProductMobileInboxCategory,
  type ProductMobileInboxFilter,
  type ProductMobileInboxThread,
} from "@/lib/product/product-mobile-inbox";

function InboxPinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="12" x2="12" y1="17" y2="22" />
      <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.12-.56A2 2 0 0 1 15 10.76V7a2 2 0 0 0-2-2H11a2 2 0 0 0-2 2v3.76a2 2 0 0 1-1.11 1.79l-1.12.56A2 2 0 0 0 5 15.24Z" />
    </svg>
  );
}

function InboxBackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InboxPaperclipIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path
        d="M6.4 9.2 9.7 5.9a1.8 1.8 0 0 1 2.55 2.55L7.5 13.2a2.9 2.9 0 0 1-4.1-4.1l5.05-5.05"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ThreadRow({
  thread,
  pinned,
  onSelect,
}: {
  thread: ProductMobileInboxThread;
  pinned?: boolean;
  onSelect: () => void;
}) {
  const tone = productMobileInboxAvatarTone(thread.from);
  return (
    <button
      type="button"
      className={`product-mobile-inbox__row${thread.unread ? " product-mobile-inbox__row--unread" : ""}${
        pinned ? " product-mobile-inbox__row--pinned" : ""
      }`}
      onClick={onSelect}
    >
      <span
        className={`product-mobile-inbox__avatar product-mobile-inbox__avatar--${tone} ${suisseIntl.className}`}
        aria-hidden
      >
        {productMobileInboxSenderInitials(thread.from)}
      </span>
      <span className="product-mobile-inbox__row-body">
        <span className="product-mobile-inbox__row-top">
          <span className={`product-mobile-inbox__subject ${dmSans.className}`}>{thread.subject}</span>
          <span className={`product-mobile-inbox__time ${suisseIntl.className}`}>
            {pinned ? <InboxPinIcon className="product-mobile-inbox__pin" /> : null}
            {thread.time}
          </span>
        </span>
        <span className="product-mobile-inbox__row-meta">
          <span className={`product-mobile-inbox__from ${dmSans.className}`}>{thread.from}</span>
          <span
            className={`product-mobile-inbox__kind product-mobile-inbox__kind--${thread.kind.toLowerCase()} ${suisseIntl.className}`}
          >
            {thread.kind}
          </span>
        </span>
        <span className={`product-mobile-inbox__preview ${suisseIntl.className}`}>{thread.preview}</span>
      </span>
    </button>
  );
}

/** iPhone Inbox — functional agents, categories, threads, compose, and reply. */
export function ProductMobileInboxPanel({
  selectedThreadId = null,
  onThreadChange,
  category,
  onCategoryChange,
  composing,
  onComposingChange,
}: {
  selectedThreadId?: string | null;
  onThreadChange?: (thread: ProductMobileInboxThread | null) => void;
  category: ProductMobileInboxCategory;
  onCategoryChange: (category: ProductMobileInboxCategory) => void;
  composing: boolean;
  onComposingChange: (composing: boolean) => void;
}) {
  const [threads, setThreads] = useState(productMobileInboxCloneThreads);
  const [filter, setFilter] = useState<ProductMobileInboxFilter>("all");
  const [agentName, setAgentName] = useState<(typeof PRODUCT_MOBILE_INBOX_AGENTS)[number]["name"]>(
    PRODUCT_MOBILE_INBOX_AGENTS[0].name,
  );
  const [replyDraft, setReplyDraft] = useState("");
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [attachNotice, setAttachNotice] = useState<string | null>(null);

  const activeAgent =
    PRODUCT_MOBILE_INBOX_AGENTS.find((agent) => agent.name === agentName) ?? PRODUCT_MOBILE_INBOX_AGENTS[0];

  const filtered = useMemo(
    () =>
      productMobileInboxFilterThreads(threads, {
        filter,
        category,
        agent: agentName,
      }),
    [threads, filter, category, agentName],
  );

  const pinned = filtered.find((thread) => thread.id === PRODUCT_MOBILE_INBOX_PINNED_ID);
  const rest = filtered.filter((thread) => thread.id !== PRODUCT_MOBILE_INBOX_PINNED_ID);
  const selected = selectedThreadId
    ? (threads.find((thread) => thread.id === selectedThreadId) ?? null)
    : null;

  useEffect(() => {
    if (!selectedThreadId) return;
    const stillVisible = productMobileInboxFilterThreads(threads, {
      filter,
      category,
      agent: agentName,
    }).some((thread) => thread.id === selectedThreadId);
    if (!stillVisible) onThreadChange?.(null);
  }, [agentName, category, filter, onThreadChange, selectedThreadId, threads]);

  useEffect(() => {
    if (!composing) {
      setComposeTo("");
      setComposeSubject("");
      setComposeBody("");
      setAttachNotice(null);
    }
  }, [composing]);

  const updateThread = (
    threadId: string,
    updater: (thread: ProductMobileInboxThread) => ProductMobileInboxThread,
  ) => {
    setThreads((prev) => prev.map((thread) => (thread.id === threadId ? updater(thread) : thread)));
  };

  const openThread = (thread: ProductMobileInboxThread) => {
    onComposingChange(false);
    setReplyDraft("");
    setAttachNotice(null);
    const opened = thread.unread ? { ...thread, unread: false } : thread;
    if (thread.unread) {
      updateThread(thread.id, (current) => ({ ...current, unread: false }));
    }
    onThreadChange?.(opened);
  };

  const closeThread = () => {
    setReplyDraft("");
    setAttachNotice(null);
    onThreadChange?.(null);
  };

  const selectCategory = (next: ProductMobileInboxCategory) => {
    onCategoryChange(next);
    onComposingChange(false);
    if (selected && productMobileInboxCategoryForKind(selected.kind) !== next) {
      onThreadChange?.(null);
    }
  };

  const selectAgent = (name: (typeof PRODUCT_MOBILE_INBOX_AGENTS)[number]["name"]) => {
    setAgentName(name);
    onComposingChange(false);
    if (selected && selected.agent !== name) {
      onThreadChange?.(null);
    }
  };

  const openCompose = () => {
    onThreadChange?.(null);
    setComposeTo("");
    setComposeSubject("");
    setComposeBody("");
    setAttachNotice(null);
    onComposingChange(true);
  };

  const closeCompose = () => {
    onComposingChange(false);
  };

  const sendReply = () => {
    if (!selected || !replyDraft.trim()) return;
    const body = replyDraft.trim();
    const message = {
      id: `${selected.id}-m${selected.messages.length + 1}`,
      from: `${activeAgent.name}, ${activeAgent.team}`,
      time: productMobileInboxNowLabel(),
      email: `${activeAgent.name.toLowerCase().replace(/[^a-z]/g, ".")}@clinic.health`,
      body,
    };
    const next: ProductMobileInboxThread = {
      ...selected,
      unread: false,
      preview: body,
      time: productMobileInboxNowLabel(),
      messages: [...selected.messages, message],
    };
    updateThread(selected.id, () => next);
    onThreadChange?.(next);
    setReplyDraft("");
    setAttachNotice(null);
  };

  const sendCompose = () => {
    if (!composeTo.trim() || !composeSubject.trim() || !composeBody.trim()) return;
    const id = `t-${Date.now()}`;
    const kind = productMobileInboxKindForCategory(category);
    const body = composeBody.trim();
    const thread: ProductMobileInboxThread = {
      id,
      from: composeTo.trim(),
      kind,
      agent: agentName,
      subject: composeSubject.trim(),
      preview: body,
      time: productMobileInboxNowLabel(),
      unread: false,
      messages: [
        {
          id: `${id}-m1`,
          from: `${activeAgent.name}, ${activeAgent.team}`,
          time: productMobileInboxNowLabel(),
          email: `${activeAgent.name.toLowerCase().replace(/[^a-z]/g, ".")}@clinic.health`,
          body,
        },
      ],
    };
    setThreads((prev) => [thread, ...prev]);
    onComposingChange(false);
    onThreadChange?.(thread);
  };

  if (composing) {
    return (
      <section
        className="product-mobile-panel product-mobile-inbox product-mobile-inbox--compose"
        aria-label="Compose message"
      >
        <header className="product-mobile-inbox__detail-header">
          <button
            type="button"
            className="product-mobile-inbox__back"
            aria-label="Cancel compose"
            onClick={closeCompose}
          >
            <InboxBackIcon />
          </button>
          <div className="product-mobile-inbox__detail-heading">
            <h2 className={`product-mobile-inbox__detail-subject ${dmSans.className}`}>New message</h2>
            <p className={`product-mobile-inbox__detail-meta ${suisseIntl.className}`}>
              {category} · {activeAgent.name}
            </p>
          </div>
        </header>

        <div className={`product-mobile-inbox__compose-form ${dmSans.className}`}>
          <label className="product-mobile-inbox__compose-field">
            <span className={`product-mobile-inbox__compose-label ${suisseIntl.className}`}>To</span>
            <input
              className="product-mobile-inbox__compose-input"
              value={composeTo}
              onChange={(event) => setComposeTo(event.target.value)}
              placeholder="Recipient"
              autoComplete="off"
            />
          </label>
          <label className="product-mobile-inbox__compose-field">
            <span className={`product-mobile-inbox__compose-label ${suisseIntl.className}`}>Subject</span>
            <input
              className="product-mobile-inbox__compose-input"
              value={composeSubject}
              onChange={(event) => setComposeSubject(event.target.value)}
              placeholder="Subject"
              autoComplete="off"
            />
          </label>
          <label className="product-mobile-inbox__compose-field product-mobile-inbox__compose-field--body">
            <span className={`product-mobile-inbox__compose-label ${suisseIntl.className}`}>Message</span>
            <textarea
              className="product-mobile-inbox__compose-textarea"
              rows={8}
              value={composeBody}
              onChange={(event) => setComposeBody(event.target.value)}
              placeholder="Write your message…"
            />
          </label>
          {attachNotice ? (
            <p className={`product-mobile-inbox__notice ${suisseIntl.className}`}>{attachNotice}</p>
          ) : null}
          <div className="product-mobile-inbox__reply-footer">
            <button
              type="button"
              className="product-mobile-inbox__reply-action"
              onClick={() => setAttachNotice("Attachment picker is mocked in this demo.")}
            >
              Attach
            </button>
            <button
              type="button"
              className="product-mobile-inbox__reply-send"
              disabled={!composeTo.trim() || !composeSubject.trim() || !composeBody.trim()}
              onClick={sendCompose}
            >
              Send
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (selected) {
    const attachmentCount = productMobileInboxAttachmentCount(selected);
    return (
      <section
        className="product-mobile-panel product-mobile-inbox product-mobile-inbox--detail"
        aria-label="Inbox thread"
      >
        <header className="product-mobile-inbox__detail-header">
          <button
            type="button"
            className="product-mobile-inbox__back"
            aria-label="Back to inbox"
            onClick={closeThread}
          >
            <InboxBackIcon />
          </button>
          <div className="product-mobile-inbox__detail-heading">
            <h2 className={`product-mobile-inbox__detail-subject ${dmSans.className}`}>{selected.subject}</h2>
            <p className={`product-mobile-inbox__detail-meta ${suisseIntl.className}`}>
              {selected.messages.length} messages · {attachmentCount} attachments · {selected.time}
            </p>
          </div>
        </header>

        <div className="product-mobile-inbox__messages">
          {selected.messages.map((message) => {
            const tone = productMobileInboxAvatarTone(message.from);
            return (
              <article key={message.id} className="product-mobile-inbox__message">
                <div className="product-mobile-inbox__message-top">
                  <span
                    className={`product-mobile-inbox__avatar product-mobile-inbox__avatar--${tone} ${suisseIntl.className}`}
                    aria-hidden
                  >
                    {productMobileInboxSenderInitials(message.from)}
                  </span>
                  <div className="product-mobile-inbox__message-identity">
                    <p className={`product-mobile-inbox__message-from ${dmSans.className}`}>{message.from}</p>
                    {message.email ? (
                      <p className={`product-mobile-inbox__message-email ${suisseIntl.className}`}>{message.email}</p>
                    ) : null}
                  </div>
                  <time className={`product-mobile-inbox__message-time ${suisseIntl.className}`}>{message.time}</time>
                </div>
                <p className={`product-mobile-inbox__message-body ${dmSans.className}`}>{message.body}</p>
                {message.attachments?.length ? (
                  <ul className="product-mobile-inbox__attachments">
                    {message.attachments.map((file) => (
                      <li key={file.name}>
                        <button
                          type="button"
                          className="product-mobile-inbox__attachment"
                          onClick={() => setAttachNotice(`Opened ${file.name} (demo).`)}
                        >
                          <InboxPaperclipIcon />
                          <span className={`product-mobile-inbox__attachment-name ${dmSans.className}`}>
                            {file.name}
                          </span>
                          <span className={`product-mobile-inbox__attachment-size ${suisseIntl.className}`}>
                            {file.size}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            );
          })}
        </div>

        <div className={`product-mobile-inbox__reply ${dmSans.className}`}>
          {attachNotice ? (
            <p className={`product-mobile-inbox__notice ${suisseIntl.className}`}>{attachNotice}</p>
          ) : null}
          <label className="sr-only" htmlFor="product-mobile-inbox-reply">
            Reply
          </label>
          <textarea
            id="product-mobile-inbox-reply"
            className="product-mobile-inbox__reply-input"
            rows={2}
            placeholder="Reply to this thread…"
            value={replyDraft}
            onChange={(event) => setReplyDraft(event.target.value)}
          />
          <div className="product-mobile-inbox__reply-footer">
            <button
              type="button"
              className="product-mobile-inbox__reply-action"
              onClick={() => setAttachNotice("Attachment picker is mocked in this demo.")}
            >
              Attach
            </button>
            <button
              type="button"
              className="product-mobile-inbox__reply-send"
              disabled={!replyDraft.trim()}
              onClick={sendReply}
            >
              Send
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="product-mobile-panel product-mobile-inbox" aria-label="Inbox">
      <div className="product-mobile-inbox__chrome">
        <div className="product-mobile-inbox__agents" role="tablist" aria-label="Inbox agents">
          {PRODUCT_MOBILE_INBOX_AGENTS.map((agent) => (
            <button
              key={agent.name}
              type="button"
              role="tab"
              aria-selected={agentName === agent.name}
              className={`product-mobile-inbox__agent${
                agentName === agent.name ? " product-mobile-inbox__agent--active" : ""
              }`}
              onClick={() => selectAgent(agent.name)}
            >
              <span className={`product-mobile-inbox__agent-swatch bg-gradient-to-br ${agent.swatch}`} aria-hidden />
              <span className="product-mobile-inbox__agent-copy">
                <span className={`product-mobile-inbox__agent-name ${dmSans.className}`}>{agent.name}</span>
                <span className={`product-mobile-inbox__agent-team ${suisseIntl.className}`}>{agent.team}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="product-mobile-inbox__categories" role="tablist" aria-label="Inbox categories">
          {PRODUCT_MOBILE_INBOX_CATEGORIES.map((label) => (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={category === label}
              className={`product-mobile-inbox__category${
                category === label ? " product-mobile-inbox__category--active" : ""
              } ${suisseIntl.className}`}
              onClick={() => selectCategory(label)}
            >
              <span className="product-mobile-inbox__category-bar" aria-hidden />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="product-mobile-inbox__toolbar">
        <div className="product-mobile-inbox__filters" role="group" aria-label="Inbox filters">
          {(["all", "unread", "pinned"] as const).map((key) => (
            <button
              key={key}
              type="button"
              className={`product-mobile-inbox__filter${
                filter === key ? " product-mobile-inbox__filter--active" : ""
              } ${suisseIntl.className}`}
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
            >
              {key === "pinned" ? <InboxPinIcon className="product-mobile-inbox__filter-pin" /> : null}
              {key === "all" ? "All" : key === "unread" ? "Unread" : "Pinned"}
            </button>
          ))}
        </div>
        <button type="button" className={`product-mobile-inbox__compose ${dmSans.className}`} onClick={openCompose}>
          Compose
        </button>
      </div>

      <div className="product-mobile-inbox__list">
        {filtered.length === 0 ? (
          <div className="product-mobile-inbox__empty">
            <p className={`product-mobile-inbox__empty-title ${dmSans.className}`}>All caught up</p>
            <p className={`product-mobile-inbox__empty-copy ${suisseIntl.className}`}>
              Nothing in {category} for {activeAgent.name}
              {filter === "all" ? "" : ` · ${filter}`}.
            </p>
          </div>
        ) : (
          <>
            {pinned ? <ThreadRow thread={pinned} pinned onSelect={() => openThread(pinned)} /> : null}
            {rest.map((thread) => (
              <ThreadRow key={thread.id} thread={thread} onSelect={() => openThread(thread)} />
            ))}
          </>
        )}
      </div>
    </section>
  );
}
