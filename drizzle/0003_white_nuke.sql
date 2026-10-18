CREATE TABLE `development_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`release_key` text NOT NULL,
	`occurred_at` text NOT NULL,
	`category` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`source` text DEFAULT 'automatic' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `development_history_release_key_unique` ON `development_history` (`release_key`);--> statement-breakpoint
CREATE INDEX `development_history_occurred_idx` ON `development_history` (`occurred_at`);--> statement-breakpoint
CREATE INDEX `development_history_category_idx` ON `development_history` (`category`);
