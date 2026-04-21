-- Rich context for in-app notifications (task assigner, due date, etc.)
ALTER TABLE "notifications" ADD COLUMN IF NOT EXISTS "entityDetails" JSONB;
