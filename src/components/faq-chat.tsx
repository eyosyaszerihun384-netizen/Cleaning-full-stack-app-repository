"use client";

import { useEffect, useRef, useState } from "react";
import type { PublicFaqNode } from "@/lib/faq";

type FaqOption = {
  label: string;
  answer: string;
  next?: string;
  action?: "quote" | "contact" | "end";
};

type FaqNode = {
  prompt: string;
  options: FaqOption[];
};

type ChatMessage = {
  id: number;
  text: string;
  from: "bot" | "user" | "thinking";
};

const demoFaqTree: Record<string, FaqNode> = {
  main: {
    prompt: "What would you like to know about?",
    options: [
      { label: "Cleaning services", answer: "I can help you explore the cleaning options shown in this demo.", next: "services" },
      { label: "Pricing & estimates", answer: "Happy to help with estimates. Exact prices have not been set for this demo.", next: "pricing" },
      { label: "Scheduling & booking", answer: "I can explain how an estimate request works and what happens next.", next: "booking" },
      { label: "Service area", answer: "The business location has not been confirmed yet. I can explain how to check availability.", next: "area" },
      { label: "Preparing for a clean", answer: "Let’s go over a few common preparation questions.", next: "preparation" },
      { label: "Request an estimate", answer: "Share a few details using the estimate request form. The team will follow up; a request is not an appointment.", action: "quote" },
    ],
  },
  services: {
    prompt: "Which service would you like to learn about?",
    options: [
      { label: "Residential cleaning", answer: "Residential cleaning is for regular home upkeep. The exact checklist and visit options need to be confirmed with the business.", next: "home" },
      { label: "Commercial cleaning", answer: "Commercial cleaning can be tailored to a workplace. Business types, scope, and availability will be confirmed by the team.", next: "commercial" },
      { label: "Deep cleaning", answer: "Deep cleaning is intended as a more detailed refresh. Ask the team to confirm the checklist and estimate.", next: "deep" },
      { label: "Move-in cleaning", answer: "Move-in cleaning helps prepare a home for its next chapter. Share the property condition and timing with the team.", next: "move" },
    ],
  },
  home: {
    prompt: "What else about residential cleaning can I help with?",
    options: [
      { label: "What is included?", answer: "The final checklist is not confirmed yet. Ask which rooms, tasks, and optional extras are included in your estimate.", next: "home" },
      { label: "Can I request recurring visits?", answer: "You can share your preferred frequency with the team. Availability and schedules need to be confirmed.", next: "booking" },
      { label: "Request an estimate", answer: "Use the estimate request form to share a few details. This development project is for synthetic test data only.", action: "quote" },
    ],
  },
  commercial: {
    prompt: "What would you like to know about commercial cleaning?",
    options: [
      { label: "What businesses do you serve?", answer: "The commercial customer types have not been confirmed. The team can discuss your workplace and needs.", next: "commercial" },
      { label: "Can service be scheduled after hours?", answer: "Business hours and scheduling options are not set in this demo. Ask the team to confirm what they can accommodate.", next: "booking" },
      { label: "How do I discuss a workplace?", answer: "Use the estimate request form to tell the team about your workplace. A request is not an appointment.", action: "quote" },
    ],
  },
  deep: {
    prompt: "What would you like to know about a deep clean?",
    options: [
      { label: "What areas are covered?", answer: "The deep-clean checklist has not been finalized. Confirm the included rooms, tasks, and any add-ons before booking.", next: "deep" },
      { label: "How long does it take?", answer: "Timing depends on property size, condition, and requested tasks. The team can estimate this after learning more.", next: "pricing" },
      { label: "Can I request a quote?", answer: "You can use the estimate request form. This development project is for synthetic test data only.", action: "quote" },
    ],
  },
  move: {
    prompt: "What would help with your move-in clean?",
    options: [
      { label: "What details should I share?", answer: "The property size, condition, target date, and any requested tasks help the team prepare an estimate.", next: "booking" },
      { label: "Are move-out cleans available?", answer: "Move-out service is not confirmed yet. The business should approve this option before it is advertised.", next: "services" },
      { label: "Request an estimate", answer: "Use the estimate request form to share your needs. A request is not a confirmed appointment.", action: "quote" },
    ],
  },
  pricing: {
    prompt: "What would you like to know about pricing?",
    options: [
      { label: "Is pricing per room?", answer: "No room-by-room prices are confirmed. Share your service and property details with the business for an accurate estimate.", next: "booking" },
      { label: "What affects an estimate?", answer: "Service type, property size and condition, location, and requested tasks may affect a quote. The business must confirm its pricing method.", next: "pricing" },
      { label: "Are estimates free?", answer: "The demo describes a free estimate, but the actual business estimate policy still needs confirmation.", next: "booking" },
      { label: "Request an estimate", answer: "Use the estimate request form to share a few details. This development project is for synthetic test data only.", action: "quote" },
    ],
  },
  booking: {
    prompt: "What would you like to know about requesting a clean?",
    options: [
      { label: "Does a request confirm a booking?", answer: "No. A request is not a confirmed appointment. The team must confirm service details and availability.", next: "booking" },
      { label: "Can I request a certain date?", answer: "You can share a preferred date with the team, but availability must be confirmed directly.", next: "booking" },
      { label: "What happens after I submit?", answer: "Staff can review your request and follow up to discuss details and availability. This is not a confirmed appointment.", next: "area" },
    ],
  },
  area: {
    prompt: "How can I check whether service is available where I live?",
    options: [
      { label: "Which cities do you serve?", answer: "The business city and service-area list have not been provided. No U.S. coverage is claimed in this demo.", next: "area" },
      { label: "Can I check by ZIP code?", answer: "Yes. The planned estimate form will ask for a city or ZIP code so the business can confirm whether it is in range.", next: "booking" },
      { label: "Is the map available?", answer: "The map will be added after the service area is confirmed.", next: "area" },
    ],
  },
  preparation: {
    prompt: "What would you like to know before a cleaning?",
    options: [
      { label: "Should I tidy up first?", answer: "A quick pickup may help make surfaces easier to reach. Confirm preparation recommendations with the business.", next: "preparation" },
      { label: "Are supplies provided?", answer: "Supply and equipment arrangements are not confirmed yet. Ask the team what they provide.", next: "care" },
      { label: "What about pets?", answer: "Tell the business about pets and any instructions before a visit. Its safety and access procedures need confirmation.", next: "care" },
      { label: "Share special instructions", answer: "Use the message field to share relevant cleaning details. Do not include access codes or sensitive information.", next: "booking" },
    ],
  },
  care: {
    prompt: "What would you like to confirm about the team or your home?",
    options: [
      { label: "Are products provided?", answer: "Products and equipment arrangements need confirmation. Mention any sensitivities before scheduling.", next: "preparation" },
      { label: "Can I request fragrance-free products?", answer: "Share product preferences or sensitivities with the team and confirm what can be accommodated.", next: "preparation" },
      { label: "How are belongings protected?", answer: "Ask the business about its home-care procedures and how to flag fragile items before a visit.", next: "care" },
    ],
  },
};

const THINKING_DELAY_MS = 3000;

export default function FaqChat({
  publishedNodes,
}: {
  publishedNodes: PublicFaqNode[] | null;
}) {
  const faqTree: Record<string, FaqNode> = publishedNodes
    ? Object.fromEntries(
        publishedNodes.map((node) => [
          node.id,
          {
            prompt: node.prompt,
            options: node.options.map((option) => ({
              label: option.label,
              answer: option.answer,
              ...(option.next_node_id ? { next: option.next_node_id } : {}),
              ...(option.action ? { action: option.action } : {}),
            })),
          },
        ]),
      )
    : demoFaqTree;
  const rootNode =
    publishedNodes?.find((node) => node.is_root)?.id ?? "main";
  const [isOpen, setIsOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeNode, setActiveNode] = useState(rootNode);
  const nextMessageId = useRef(0);
  const thinkingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstOption = useRef<HTMLButtonElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const chatLog = useRef<HTMLDivElement>(null);

  const node = faqTree[activeNode] ?? faqTree[rootNode];

  function appendMessage(text: string, from: ChatMessage["from"]) {
    const id = nextMessageId.current++;
    setMessages((current) => [...current, { id, text, from }]);
  }

  function openChat() {
    setIsOpen(true);
    if (messages.length === 0) {
      appendMessage(
        "Hi there! I can help with cleaning services, estimates, scheduling, and more. What would you like to know about?",
        "bot",
      );
    }
  }

  function closeChat() {
    setIsOpen(false);
    launcher.current?.focus();
  }

  function selectOption(option: FaqOption) {
    if (isThinking) return;

    appendMessage(option.label, "user");
    setIsThinking(true);
    appendMessage("Thinking", "thinking");

    thinkingTimer.current = setTimeout(() => {
      setMessages((current) => current.filter((message) => message.from !== "thinking"));
      appendMessage(option.answer, "bot");

      if (option.action === "quote") {
        setActiveNode("main");
        document.querySelector("#quote")?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (option.action === "contact") {
        setActiveNode(rootNode);
        window.location.assign("/contact");
      } else if (
        option.next &&
        faqTree[option.next]
      ) {
        setActiveNode(option.next);
        appendMessage(faqTree[option.next].prompt, "bot");
      } else {
        setActiveNode(rootNode);
      }

      setIsThinking(false);
    }, THINKING_DELAY_MS);
  }

  useEffect(() => {
    if (isOpen && !isThinking) firstOption.current?.focus();
  }, [isOpen, isThinking, activeNode]);

  useEffect(() => {
    if (chatLog.current) chatLog.current.scrollTop = chatLog.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) closeChat();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(
    () => () => {
      if (thinkingTimer.current) clearTimeout(thinkingTimer.current);
    },
    [],
  );

  return (
    <>
      <button
        className="chat-launcher"
        ref={launcher}
        type="button"
        aria-label="Open frequently asked questions"
        aria-expanded={isOpen}
        aria-controls="faq-chat"
        onClick={() => (isOpen ? closeChat() : openChat())}
      >
        <svg className="chat-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5 8 8 0 0 1-3.4-.8L4 20l1.8-4.1A7.5 7.5 0 1 1 20 11.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M8.5 11.5h.01m3.49 0h.01m3.49 0h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
        <span>Questions?</span>
      </button>

      <section className={`faq-chat${isOpen ? " is-open" : ""}`} id="faq-chat" aria-label="Frequently asked questions" aria-hidden={!isOpen} inert={!isOpen}>
        <div className="chat-header">
          <div className="chat-avatar" aria-hidden="true">✳</div>
          <div><strong>BrightNest assistant</strong><small>Choose a question to get started</small></div>
          <button className="chat-close" type="button" aria-label="Close FAQ" onClick={closeChat}>×</button>
        </div>
        <div className="chat-messages" ref={chatLog} aria-live="polite" aria-relevant="additions">
          {messages.map((message) => (
            <div
              className={`${message.from === "user" ? "user-message" : "bot-message"}${message.from === "thinking" ? " thinking-message" : ""}`}
              key={message.id}
              role={message.from === "thinking" ? "status" : undefined}
            >
              {message.from === "thinking" ? (
                <><span className="thinking-label">Thinking</span><span className="thinking-dots" aria-hidden="true"><i /><i /><i /></span></>
              ) : message.text}
            </div>
          ))}
        </div>
        <div className="chat-options">
          {node.options.map((option, index) => (
            <button
              className="chat-option"
              disabled={isThinking}
              key={option.label}
              ref={index === 0 ? firstOption : undefined}
              type="button"
              onClick={() => selectOption(option)}
            >
              {option.label}
            </button>
          ))}
          {activeNode !== "main" && (
            <button
              className="chat-option chat-option-back"
              disabled={isThinking}
              type="button"
              onClick={() => {
                appendMessage("Main questions", "user");
                appendMessage(faqTree[rootNode].prompt, "bot");
                setActiveNode(rootNode);
              }}
            >
              ← Main questions
            </button>
          )}
        </div>
        <div className="chat-footer">Guided FAQ demo · Responses are predefined, not AI-generated</div>
      </section>
    </>
  );
}
