CREATE TABLE `analytics_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`occurred_at` text NOT NULL,
	`day` text NOT NULL,
	`visitor_id` text NOT NULL,
	`session_id` text NOT NULL,
	`path` text NOT NULL,
	`category` text NOT NULL,
	`action` text NOT NULL,
	`label` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `analytics_events_day_idx` ON `analytics_events` (`day`);--> statement-breakpoint
CREATE INDEX `analytics_events_action_idx` ON `analytics_events` (`action`);--> statement-breakpoint
ALTER TABLE `page_views` ADD `client_view_id` text;--> statement-breakpoint
ALTER TABLE `page_views` ADD `duration_seconds` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `page_views` ADD `engaged` integer DEFAULT false NOT NULL;
