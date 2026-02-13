import { Schema, model, models } from "mongoose";

export type SupportTicketStatus = "open" | "in_progress" | "closed";

// ✅ Match your UI exactly:
export type SupportTicketCategory =
  | "Account"
  | "Billing"
  | "Orders"
  | "Downloads"
  | "Security";

export interface ISupportTicket {
  category: SupportTicketCategory;
  subject: string;
  message: string;
  status: SupportTicketStatus;
  meta?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const SupportTicketSchema = new Schema<ISupportTicket>(
  {
    category: {
      type: String,
      required: true,
      enum: ["Account", "Billing", "Orders", "Downloads", "Security"],
      trim: true,
    },
    subject: { type: String, required: true, trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 4000 },
    status: {
      type: String,
      required: true,
      enum: ["open", "in_progress", "closed"],
      default: "open",
    },
    meta: { type: Schema.Types.Mixed, required: false },
  },
  { timestamps: true }
);

export const SupportTicket =
  models.SupportTicket || model<ISupportTicket>("SupportTicket", SupportTicketSchema);
