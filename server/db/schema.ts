import { index, integer, pgTable, timestamp, varchar, unique, foreignKey } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  userId: varchar({ length: 255 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const sessionsTable = pgTable(
  "sessions",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    date: timestamp({ withTimezone: true }).notNull(), 
    startTime: varchar({ length: 5 }).notNull(),     
    duration: integer().notNull(),
  },
  (t) => ({
    uniqPerDayTime: unique().on(t.date, t.startTime),
  })
);
export const bookingsTable = pgTable(
  "bookings",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: varchar({ length: 255 }).notNull(), 
    sessionId: integer().notNull(),
    bookedAt: timestamp({ withTimezone: true }).defaultNow(),
  },
  (t) => ({
    sessionFk: foreignKey({
      columns: [t.sessionId],
      foreignColumns: [sessionsTable.id],
      name: "bookings_session_fk",
    }).onDelete("cascade"),
    uniqSessionBooking: unique().on(t.sessionId),
    userIdx: index("bookings_user_idx").on(t.userId),
  })
);
