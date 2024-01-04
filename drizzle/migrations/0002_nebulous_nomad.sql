CREATE TABLE IF NOT EXISTS "sharedNotes" (
	"noteId" text,
	"userId" text,
	CONSTRAINT "sharedNotes_noteId_userId_pk" PRIMARY KEY("noteId","userId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sharedNotes" ADD CONSTRAINT "sharedNotes_noteId_note_id_fk" FOREIGN KEY ("noteId") REFERENCES "note"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sharedNotes" ADD CONSTRAINT "sharedNotes_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
