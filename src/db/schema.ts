import {
  pgTable,
  serial,
  integer,
  text,
  varchar,
  timestamp,
  date,
  boolean,
  jsonb,
  real,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Users & Auth
// ---------------------------------------------------------------------------
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  emergencyContactName: varchar("emergency_contact_name", { length: 120 }),
  emergencyContactPhone: varchar("emergency_contact_phone", { length: 60 }),
  points: integer("points").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  lastActiveDate: date("last_active_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Personal Health Profile
// ---------------------------------------------------------------------------
export const profiles = pgTable("profiles", {
  userId: integer("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  age: integer("age"),
  heightCm: real("height_cm"),
  weightKg: real("weight_kg"),
  bloodGroup: varchar("blood_group", { length: 8 }),
  allergies: text("allergies"),
  medications: text("medications"),
  familyHistory: text("family_history"),
  chronicIllnesses: text("chronic_illnesses"),
  pregnancyHistory: text("pregnancy_history"),
  menopauseStatus: varchar("menopause_status", { length: 40 }),
  lifestyle: text("lifestyle"),
  lifeStage: varchar("life_stage", { length: 40 }),
  avgCycleLength: integer("avg_cycle_length").default(28),
  avgPeriodLength: integer("avg_period_length").default(5),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Menstrual cycles
// ---------------------------------------------------------------------------
export const cycles = pgTable("cycles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  flow: varchar("flow", { length: 20 }),
  crampLevel: integer("cramp_level"),
  pmsLevel: integer("pms_level"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Daily wellness logs (mood, water, sleep, exercise, weight, stress)
// ---------------------------------------------------------------------------
export const dailyLogs = pgTable("daily_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  logDate: date("log_date").notNull(),
  mood: integer("mood"),
  stress: integer("stress"),
  sleepHours: real("sleep_hours"),
  waterMl: integer("water_ml"),
  exerciseMin: integer("exercise_min"),
  weightKg: real("weight_kg"),
  symptoms: jsonb("symptoms").$type<string[]>(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Medications & reminders
// ---------------------------------------------------------------------------
export const medications = pgTable("medications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 160 }).notNull(),
  dosage: varchar("dosage", { length: 120 }),
  kind: varchar("kind", { length: 40 }).notNull().default("medication"),
  timeOfDay: varchar("time_of_day", { length: 20 }),
  frequency: varchar("frequency", { length: 60 }),
  active: boolean("active").notNull().default(true),
  refillDate: date("refill_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Appointments
// ---------------------------------------------------------------------------
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 200 }).notNull(),
  doctor: varchar("doctor", { length: 160 }),
  location: varchar("location", { length: 200 }),
  apptDate: timestamp("appt_date").notNull(),
  notes: text("notes"),
  status: varchar("status", { length: 30 }).notNull().default("upcoming"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Health records
// ---------------------------------------------------------------------------
export const healthRecords = pgTable("health_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 200 }).notNull(),
  category: varchar("category", { length: 60 }).notNull(),
  recordDate: date("record_date"),
  details: text("details"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// AI Health Assessments
// ---------------------------------------------------------------------------
export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  answers: jsonb("answers").$type<Record<string, string>>().notNull(),
  result: jsonb("result").$type<AssessmentResult>().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type AssessmentResult = {
  score: number;
  band: string;
  summary: string;
  flags: { title: string; level: string; detail: string }[];
  recommendations: string[];
  seeDoctor: boolean;
};

// ---------------------------------------------------------------------------
// Journal entries (mental wellness)
// ---------------------------------------------------------------------------
export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  entryDate: date("entry_date").notNull(),
  mood: integer("mood"),
  gratitude: text("gratitude"),
  content: text("content"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Community posts (moderated, anonymous option)
// ---------------------------------------------------------------------------
export const communityPosts = pgTable("community_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  space: varchar("space", { length: 60 }).notNull(),
  displayName: varchar("display_name", { length: 120 }).notNull(),
  anonymous: boolean("anonymous").notNull().default(false),
  content: text("content").notNull(),
  likes: integer("likes").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type Cycle = typeof cycles.$inferSelect;
export type DailyLog = typeof dailyLogs.$inferSelect;
export type Medication = typeof medications.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;
export type HealthRecord = typeof healthRecords.$inferSelect;
export type Assessment = typeof assessments.$inferSelect;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type CommunityPost = typeof communityPosts.$inferSelect;
