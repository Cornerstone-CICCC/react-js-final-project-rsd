import { NextResponse } from "next/server";
import { SupportTicket } from "@/app/api/models/SupportTicket";
import { connectDB } from "@/app/api/lib/mongodb";

type TicketPayload = {
  category?: string;
  subject?: string;
  message?: string;
  meta?: Record<string, unknown>;
};

function badRequest(message: string, details?: unknown) {
  return NextResponse.json(
    { ok: false, error: { message, details } },
    { status: 400 }
  );
}

// ✅ GET /api/support-tickets
// Returns latest tickets (for debug/admin usage)
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    // Optional query params:
    // ?limit=50
    // ?status=open
    // ?category=Billing
    const limitRaw = Number(searchParams.get("limit") ?? "50");
    const limit = Number.isFinite(limitRaw)
      ? Math.min(Math.max(limitRaw, 1), 200)
      : 50;

    const status = searchParams.get("status")?.trim();
    const category = searchParams.get("category")?.trim();

    const query: Record<string, unknown> = {};
    if (status) query.status = status;
    if (category) query.category = category;

    const tickets = await SupportTicket.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      ok: true,
      data: tickets,
      meta: { count: tickets.length, limit },
    });
  } catch (err) {
    console.error("GET /api/support-tickets error:", err);
    return NextResponse.json(
      { ok: false, error: { message: "Failed to fetch tickets." } },
      { status: 500 }
    );
  }
}

// ✅ POST /api/support-tickets
export async function POST(req: Request) {
  try {
    await connectDB();

    let body: TicketPayload;
    try {
      body = (await req.json()) as TicketPayload;
    } catch {
      return badRequest("Invalid JSON body.");
    }

    const category = (body.category ?? "").trim();
    const subject = (body.subject ?? "").trim();
    const message = (body.message ?? "").trim();

    if (!category) return badRequest("Category is required.");
    if (!subject) return badRequest("Subject is required.");
    if (!message) return badRequest("Message is required.");

    // Light validation so UI feels responsive and backend is safe.
    if (subject.length > 120) return badRequest("Subject is too long (max 120).");
    if (message.length > 4000) return badRequest("Message is too long (max 4000).");

    // ✅ Must match your SupportTicket model enum
    const allowedCategories = ["Billing", "Account", "Technical", "Refunds", "Other"];
    if (!allowedCategories.includes(category)) {
      return badRequest("Invalid category.", { allowed: allowedCategories });
    }

    const ticket = await SupportTicket.create({
      category,
      subject,
      message,
      status: "open",
      meta: {
        ...(body.meta ?? {}),
        userAgent: req.headers.get("user-agent") ?? undefined,
        createdFrom: "support-page",
      },
    });

    return NextResponse.json(
      {
        ok: true,
        data: {
          id: ticket._id.toString(),
          category: ticket.category,
          subject: ticket.subject,
          status: ticket.status,
          createdAt: ticket.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    // Keep errors clean, no secrets.
    console.error("POST /api/support-tickets error:", err);

    return NextResponse.json(
      { ok: false, error: { message: "Failed to create support ticket." } },
      { status: 500 }
    );
  }
}
