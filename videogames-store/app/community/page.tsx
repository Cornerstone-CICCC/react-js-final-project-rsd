"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  MessageCircle,
  Ticket,
  CreditCard,
  User,
  Shield,
  Package,
  ChevronDown,
  X,
} from "lucide-react";
import { useToast } from "../store/toast";

type FAQ = {
  q: string;
  a: string;
  tag: "Account" | "Billing" | "Orders" | "Downloads" | "Security";
};

const FAQS: FAQ[] = [
  {
    q: "I can’t sign in. What should I do?",
    a: "First, reset your password. If that doesn’t work, try clearing cookies or using an incognito window. If the issue continues, submit a ticket and include a screenshot of the error.",
    tag: "Account",
  },
  {
    q: "My payment failed but I was charged.",
    a: "If your bank shows a pending charge, it usually disappears within 24–48 hours. If it posts, submit a ticket with the last 4 digits of the card and the charge time.",
    tag: "Billing",
  },
  {
    q: "Where can I see my order history?",
    a: "Go to your Profile (top right) and open Orders. You’ll see all purchases, refunds, and receipts.",
    tag: "Orders",
  },
  {
    q: "My download is stuck or slow.",
    a: "Pause/resume the download, check your storage space, then restart the app. If you’re on Wi-Fi, try a different network or Ethernet.",
    tag: "Downloads",
  },
  {
    q: "How do I request a refund?",
    a: "Refund eligibility depends on playtime and purchase date. Submit a ticket with the order ID and reason, and our team will review it.",
    tag: "Orders",
  },
  {
    q: "How do I secure my account?",
    a: "Use a unique password, enable 2FA (when available), and avoid signing in on shared computers. If you suspect suspicious activity, submit a ticket immediately.",
    tag: "Security",
  },
];

const CATEGORY_CARDS = [
  {
    title: "Account & Login",
    desc: "Sign in issues, password resets, profile problems.",
    icon: User,
    tag: "Account",
  },
  {
    title: "Billing & Payments",
    desc: "Charges, payment failures, invoices and receipts.",
    icon: CreditCard,
    tag: "Billing",
  },
  {
    title: "Orders & Refunds",
    desc: "Order history, refunds, missing purchases.",
    icon: Package,
    tag: "Orders",
  },
  {
    title: "Downloads & Tech",
    desc: "Performance, installs, downloads and errors.",
    icon: Ticket,
    tag: "Downloads",
  },
  {
    title: "Security",
    desc: "Account protection, suspicious activity, safety.",
    icon: Shield,
    tag: "Security",
  },
] as const;

type UiTicketCategory =
  | "Account"
  | "Billing"
  | "Orders"
  | "Downloads"
  | "Security";

// ✅ Backend categories from our SupportTicket model/route
type ApiTicketCategory =
  | "Account"
  | "Billing"
  | "Refunds"
  | "Technical"
  | "Other";

function mapUiCategoryToApi(cat: UiTicketCategory): ApiTicketCategory {
  switch (cat) {
    case "Orders":
      return "Refunds";
    case "Downloads":
      return "Technical";
    case "Security":
      return "Other";
    default:
      return cat;
  }
}

export default function SupportPage() {
  const showToast = useToast((s) => s.show);

  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<
    "All" | "Account" | "Billing" | "Orders" | "Downloads" | "Security"
  >("All");

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Ticket modal
  const [ticketOpen, setTicketOpen] = useState(false);
  const [ticketCategory, setTicketCategory] =
    useState<UiTicketCategory>("Account");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredFaqs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return FAQS.filter((f) => {
      const matchTag = activeTag === "All" ? true : f.tag === activeTag;
      const matchText = !q
        ? true
        : f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q);
      return matchTag && matchText;
    });
  }, [search, activeTag]);

  function openTicketFromTag(tag: UiTicketCategory) {
    setTicketCategory(tag);
    setTicketSubject("");
    setTicketMessage("");
    setTicketOpen(true);
  }

  async function submitTicket(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;

    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      // your toast store currently uses showToast("string")
      showToast("Please fill subject and message.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/support-tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: mapUiCategoryToApi(ticketCategory),
          subject: ticketSubject.trim(),
          message: ticketMessage.trim(),
          meta: {
            uiCategory: ticketCategory, // keep original for analytics
            page: "/support",
          },
        }),
      });

      const data = (await res.json()) as
        | { ok: true; data: { id: string } }
        | { ok: false; error?: { message?: string } };

      if (!res.ok || !data.ok) {
        const errorMessage =
          data && "error" in data
            ? data.error?.message
            : "Ticket failed. Please try again.";

        showToast(errorMessage || "Ticket failed. Please try again.");
        return;
      }

      showToast("Ticket submitted ✅");
      setTicketOpen(false);
      setTicketSubject("");
      setTicketMessage("");
    } catch {
      showToast("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    // ✅ sticky header safe spacing only on this page
    <div className="min-h-screen bg-[#050505] text-white px-6 pb-12 pt-24 md:pt-28">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HERO */}
        <section className="rounded-[2.5rem] border border-white/10 bg-[#0b0b0b]/60 backdrop-blur-xl overflow-hidden">
          <div className="p-6 md:p-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1.5">
                <span className="w-2 h-2 rounded-full bg-[#3DFF6B]" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                  Support Center
                </p>
              </div>

              <h1 className="mt-4 text-3xl md:text-4xl font-black uppercase tracking-tight">
                How can we help?
              </h1>

              <p className="mt-3 text-white/40 text-sm font-medium leading-relaxed">
                Find answers, troubleshoot issues, or contact support.
                <br />
                Tickets are stored in the database.
              </p>
            </div>

            {/* Search */}
            <div className="w-full md:w-[420px]">
              <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl px-4 py-3 focus-within:border-[#3DFF6B]/50 transition">
                <Search className="w-4 h-4 text-white/30 mr-2" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search support articles..."
                  className="bg-transparent outline-none text-sm w-full"
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {(
                  [
                    "All",
                    "Account",
                    "Billing",
                    "Orders",
                    "Downloads",
                    "Security",
                  ] as const
                ).map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTag(t)}
                    className={`px-3 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition ${
                      activeTag === t
                        ? "bg-[#3DFF6B] text-black border-[#3DFF6B]"
                        : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 p-6 md:px-10 md:py-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-white/30 text-xs font-bold uppercase tracking-widest">
              Tip: Include order ID or screenshots for faster help.
            </p>

            <button
              onClick={() => setTicketOpen(true)}
              className="h-11 px-5 rounded-2xl bg-[#3DFF6B] text-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-green-400 transition"
            >
              <MessageCircle className="w-4 h-4" />
              Submit a Ticket
            </button>
          </div>
        </section>

        {/* CATEGORY GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {CATEGORY_CARDS.map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.title}
                onClick={() => openTicketFromTag(c.tag)}
                className="text-left rounded-3xl bg-white/5 border border-white/10 hover:border-[#3DFF6B]/30 hover:bg-white/7 transition p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                      Category
                    </p>
                    <h3 className="mt-2 text-lg font-black uppercase tracking-tight">
                      {c.title}
                    </h3>
                    <p className="mt-2 text-white/40 text-sm font-medium leading-relaxed">
                      {c.desc}
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#3DFF6B]" />
                  </div>
                </div>

                <div className="mt-5 inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-black/30 border border-white/10">
                  <Ticket className="w-4 h-4 text-white/40" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                    Open ticket
                  </span>
                </div>
              </button>
            );
          })}
        </section>

        {/* FAQ */}
        <section className="rounded-[2.5rem] bg-[#0b0b0b]/60 border border-white/10 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="mt-2 text-white/40 text-sm font-medium">
                Showing{" "}
                <span className="text-white">{filteredFaqs.length}</span>{" "}
                results
              </p>
            </div>

            <button
              onClick={() => {
                setSearch("");
                setActiveTag("All");
                showToast("Filters cleared ✅");
              }}
              className="h-11 px-5 rounded-2xl bg-white/5 border border-white/10 text-white/60 font-black uppercase tracking-widest text-xs hover:bg-white/10 transition"
            >
              Clear filters
            </button>
          </div>

          <div className="divide-y divide-white/10">
            {filteredFaqs.length === 0 ? (
              <div className="p-8 text-white/40">
                No results. Try a different keyword.
              </div>
            ) : (
              filteredFaqs.map((f, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={f.q} className="p-6 md:p-7">
                    <button
                      className="w-full flex items-start justify-between gap-4 text-left"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60">
                            {f.tag}
                          </span>
                        </div>
                        <h3 className="text-base md:text-lg font-black">
                          {f.q}
                        </h3>
                      </div>

                      <div
                        className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition ${
                          isOpen
                            ? "bg-[#3DFF6B] border-[#3DFF6B]"
                            : "bg-white/5 border-white/10"
                        }`}
                      >
                        <ChevronDown
                          className={`w-5 h-5 transition ${
                            isOpen ? "text-black rotate-180" : "text-white/50"
                          }`}
                        />
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="mt-4 text-white/40 text-sm leading-relaxed">
                            {f.a}
                          </p>

                          <div className="mt-5">
                            <button
                              onClick={() => openTicketFromTag(f.tag)}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-white/70 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition"
                            >
                              <MessageCircle className="w-4 h-4" />
                              Still need help? Open ticket
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      {/* TICKET MODAL */}
      <AnimatePresence>
        {ticketOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-lg"
              onClick={() => (isSubmitting ? null : setTicketOpen(false))}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 10 }}
              className="relative z-10 w-full max-w-2xl bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 md:p-7 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#3DFF6B]/10 to-transparent">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">
                    Submit a Ticket
                  </h3>
                  <p className="mt-1 text-white/30 text-[10px] font-black uppercase tracking-widest">
                    Connected to backend
                  </p>
                </div>

                <button
                  onClick={() => (isSubmitting ? null : setTicketOpen(false))}
                  className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition disabled:opacity-50"
                  disabled={isSubmitting}
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={submitTicket} className="p-6 md:p-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">
                      Category
                    </label>

                    {/* ✅ avoid dropdown overlay issues: use segmented buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          "Account",
                          "Billing",
                          "Orders",
                          "Downloads",
                          "Security",
                        ] as const
                      ).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTicketCategory(t)}
                          disabled={isSubmitting}
                          className={`px-4 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition disabled:opacity-60 disabled:cursor-not-allowed ${
                            ticketCategory === t
                              ? "bg-[#3DFF6B] text-black border-[#3DFF6B]"
                              : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">
                      Subject
                    </label>
                    <input
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder="Ex: I can't sign in"
                      disabled={isSubmitting}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-[#3DFF6B]/50 text-sm disabled:opacity-60"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">
                      Message
                    </label>
                    <textarea
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      rows={5}
                      placeholder="Describe the issue and include details like order ID, screenshots, device, etc."
                      disabled={isSubmitting}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#3DFF6B]/50 text-sm resize-none disabled:opacity-60"
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setTicketOpen(false)}
                    disabled={isSubmitting}
                    className="h-11 px-6 rounded-2xl bg-white/5 border border-white/10 text-white/70 font-black uppercase tracking-widest text-xs hover:bg-white/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 px-6 rounded-2xl bg-[#3DFF6B] text-black font-black uppercase tracking-widest text-xs hover:bg-green-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Sending..." : "Submit Ticket"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
