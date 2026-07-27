"use client";

import { useMemo, useState } from "react";

import { dmSans, suisseIntl } from "@/lib/home/fonts";
import {
  PRODUCT_MOBILE_INBOX_AGENTS,
  PRODUCT_MOBILE_INBOX_CATEGORIES,
  PRODUCT_MOBILE_INBOX_PINNED_ID,
  PRODUCT_MOBILE_INBOX_THREADS,
  productMobileInboxAttachmentCount,
  productMobileInboxAvatarTone,
  productMobileInboxFilterThreads,
  productMobileInboxSenderInitials,
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
          <span className={`product-mobile-inbox__kind product-mobile-inbox__kind--${thread.kind.toLowerCase()} ${suisseIntl.className}`}>
            {thread.kind}
          </span>
        </span>
        <span className={`product-mobile-inbox__preview ${suisseIntl.className}`}>{thread.preview}</span>
      </span>
    </button>
  );
}

/** iPhone Inbox — desktop-style agents, filters, thread list, and reading pane. */
export function ProductMobileInboxPanel({
  selectedThreadId = null,
  onThreadChange,
}: {
  selectedThreadId?: string | null;
  onThreadChange?: (thread: ProductMobileInboxThread | null) => void;
} = {}) {
  const [filter, setFilter] = useState<ProductMobileInboxFilter>("all");
  const [category, setCategory] = useState<(typeof PRODUCT_MOBILE_INBOX_CATEGORIES)[number]>("Referrals");

  const filtered = useMemo(() => productMobileInboxFilterThreads(filter), [filter]);
  const pinned = filtered.find((thread) => thread.id === PRODUCT_MOBILE_INBOX_PINNED_ID);
  const rest = filtered.filter((thread) => thread.id !== PRODUCT_MOBILE_INBOX_PINNED_ID);
  const selected =
    filtered.find((thread) => thread.id === selectedThreadId) ??
    PRODUCT_MOBILE_INBOX_THREADS.find((thread) => thread.id === selectedThreadId) ??
    null;

  const openThread = (thread: ProductMobileInboxThread) => {
    onThreadChange?.(thread);
  };

  const closeThread = () => {
    onThreadChange?.(null);
  };

  if (selected) {
    const attachmentCount = productMobileInboxAttachmentCount(selected);
    return (
      <section className="product-mobile-panel product-mobile-inbox product-mobile-inbox--detail" aria-label="Inbox thread">
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
                      <li key={file.name} className="product-mobile-inbox__attachment">
                        <InboxPaperclipIcon />
                        <span className={`product-mobile-inbox__attachment-name ${dmSans.className}`}>{file.name}</span>
                        <span className={`product-mobile-inbox__attachment-size ${suisseIntl.className}`}>{file.size}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            );
          })}
        </div>

        <div className={`product-mobile-inbox__reply ${dmSans.className}`}>
          <label className="sr-only" htmlFor="product-mobile-inbox-reply">
            Reply
          </label>
          <textarea
            id="product-mobile-inbox-reply"
            className="product-mobile-inbox__reply-input"
            rows={2}
            placeholder="Reply to this thread…"
            readOnly
          />
          <div className="product-mobile-inbox__reply-footer">
            <button type="button" className="product-mobile-inbox__reply-action">
              Attach
            </button>
            <button type="button" className="product-mobile-inbox__reply-send">
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
        <div className="product-mobile-inbox__agents" aria-label="Inbox agents">
          {PRODUCT_MOBILE_INBOX_AGENTS.map((agent, index) => (
            <div
              key={agent.name}
              className={`product-mobile-inbox__agent${index === 0 ? " product-mobile-inbox__agent--active" : ""}`}
            >
              <span className={`product-mobile-inbox__agent-swatch bg-gradient-to-br ${agent.swatch}`} aria-hidden />
              <span className="product-mobile-inbox__agent-copy">
                <span className={`product-mobile-inbox__agent-name ${dmSans.className}`}>{agent.name}</span>
                <span className={`product-mobile-inbox__agent-team ${suisseIntl.className}`}>{agent.team}</span>
              </span>
            </div>
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
              onClick={() => setCategory(label)}
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
        <button type="button" className={`product-mobile-inbox__compose ${dmSans.className}`}>
          Compose
        </button>
      </div>

      <div className="product-mobile-inbox__list">
        {filtered.length === 0 ? (
          <div className="product-mobile-inbox__empty">
            <p className={`product-mobile-inbox__empty-title ${dmSans.className}`}>All caught up</p>
            <p className={`product-mobile-inbox__empty-copy ${suisseIntl.className}`}>Nothing matches this filter.</p>
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
