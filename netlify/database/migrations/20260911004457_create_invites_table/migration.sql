CREATE TABLE "invites" (
	"id" serial PRIMARY KEY,
	"full_name" text NOT NULL,
	"phone" text NOT NULL,
	"invite_code" text NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now()
);
