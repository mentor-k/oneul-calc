CREATE TABLE `page_views` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`viewed_at` text NOT NULL,
	`day` text NOT NULL,
	`visitor_id` text NOT NULL,
	`session_id` text NOT NULL,
	`path` text NOT NULL,
	`referrer_host` text DEFAULT '직접 방문' NOT NULL,
	`device` text NOT NULL,
	`browser` text NOT NULL,
	`country` text
);
--> statement-breakpoint
CREATE INDEX `page_views_day_idx` ON `page_views` (`day`);--> statement-breakpoint
CREATE INDEX `page_views_path_idx` ON `page_views` (`path`);--> statement-breakpoint
CREATE INDEX `page_views_visitor_idx` ON `page_views` (`visitor_id`);
