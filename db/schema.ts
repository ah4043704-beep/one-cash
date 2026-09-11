import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const invites = pgTable("invites", {
  id: serial().primaryKey(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  inviteCode: text("invite_code").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});
