CREATE TABLE IF NOT EXISTS "user" (
	"id" text,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
