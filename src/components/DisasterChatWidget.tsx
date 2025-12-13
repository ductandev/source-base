// components/DisasterChatWidget.tsx
"use client";

import React, { useRef, useState } from "react";
import { ChatRequestDto, ChatResponseDto, chatService } from "@/api/chat/api";

type Role = "user" | "assistant";

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export default function DisasterChatWidget() {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const [lang, setLang] = useState<"en" | "vi">("en");

  const [input, setInput] = useState("");
  const [suggested, setSuggested] = useState<string[]>([
    "Disaster warnings & alerts",
    "Safety tips & preparation",
  ]);

  const [messages, setMessages] = useState<
    { id: string; role: Role; content: string; createdAt: number }[]
  >([
    {
      id: uid(),
      role: "assistant",
      content:
        "Hello! I'm your AI-powered Weather & Disaster Assistant.\n\nHow can I assist you today?",
      createdAt: Date.now(),
    },
  ]);

  const listRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      const el = listRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  };

  // ✅ call NestJS via axios service (src/api/chat/api.ts)
  const callApi = async (payload: ChatRequestDto): Promise<ChatResponseDto> => {
    return chatService.chat(payload);
  };

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setMessages((prev) => [
      ...prev,
      { id: uid(), role: "user", content: trimmed, createdAt: Date.now() },
    ]);
    setInput("");
    setSending(true);
    scrollToBottom();

    try {
      const payload: ChatRequestDto = {
        message: trimmed,
        lang,
      };

      const data = await callApi(payload);

      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          content: data.answer,
          createdAt: Date.now(),
        },
      ]);

      setSuggested(data.suggestedActions?.slice(0, 4) ?? []);
      scrollToBottom();
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          content:
            e?.message ||
            "Sorry — I couldn't reach the server. Please try again.",
          createdAt: Date.now(),
        },
      ]);
    } finally {
      setSending(false);
      scrollToBottom();
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg bg-emerald-500 text-white flex items-center justify-center"
        aria-label="Open chatbot"
      >
        🤖
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[92vw] rounded-2xl shadow-2xl overflow-hidden border bg-white">
          <div className="relative px-4 py-3 flex items-center justify-between overflow-hidden border-b border-white/40 shadow-sm">
            {/* gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#06CFF1] to-[#DEFA8E]" />

            {/* content */}
            <div className="relative flex items-center gap-3">
              {/* bot icon (small circle) */}
              <div className="h-10 w-10 rounded-full bg-white/70 flex items-center justify-center shadow-sm">
                🤖
              </div>

              <div className="leading-tight">
                <div className="font-semibold text-gray-900">
                  Disaster AI Assistant
                </div>
                <div className="text-xs text-gray-700/80">
                  Ask about weather & disasters
                </div>
              </div>
            </div>

            <div className="relative flex items-center gap-2">
              <select
                className="text-xs rounded-lg border px-2 py-1 bg-white/80"
                value={lang}
                onChange={(e) => setLang(e.target.value as any)}
                title="Language"
              >
                <option value="en">EN</option>
                <option value="vi">VI</option>
              </select>

              <button
                className="h-9 w-9 rounded-full hover:bg-white/50 transition"
                title="Close"
                onClick={() => setOpen(false)}
              >
                ✖️
              </button>
            </div>
          </div>

          <div
            ref={listRef}
            className="h-[330px] overflow-y-auto p-4 space-y-3 bg-gray-50"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={
                  m.role === "user" ? "flex justify-end" : "flex justify-start"
                }
              >
                <div
                  className={[
                    "max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap",
                    m.role === "user"
                      ? "bg-emerald-500 text-white"
                      : "bg-white border",
                  ].join(" ")}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="bg-white border rounded-2xl px-3 py-2 text-sm">
                  Typing…
                </div>
              </div>
            )}

            {suggested.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {suggested.map((s) => (
                  <button
                    key={s}
                    className="text-xs px-3 py-2 rounded-full bg-white border hover:bg-gray-100"
                    onClick={() => send(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            className="p-3 bg-white border-t flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about weather or disasters..."
              className="flex-1 rounded-full border px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="h-10 w-10 rounded-full bg-emerald-500 text-white disabled:opacity-50"
              aria-label="Send"
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}
