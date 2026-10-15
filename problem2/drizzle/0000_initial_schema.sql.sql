CREATE TABLE `games` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`provider` text NOT NULL,
	`genre` text DEFAULT 'slots' NOT NULL,
	`platform` text DEFAULT 'both' NOT NULL,
	`rtp` real,
	`volatility` text,
	`description` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_games_provider` ON `games` (`provider`);--> statement-breakpoint
CREATE INDEX `idx_games_genre` ON `games` (`genre`);--> statement-breakpoint
CREATE INDEX `idx_games_status` ON `games` (`status`);--> statement-breakpoint
CREATE TABLE `licenses` (
	`id` text PRIMARY KEY NOT NULL,
	`game_id` text NOT NULL,
	`operator_id` text NOT NULL,
	`type` text DEFAULT 'subscription' NOT NULL,
	`revenue_share_pct` real DEFAULT 0 NOT NULL,
	`start_date` text NOT NULL,
	`expiry_date` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`operator_id`) REFERENCES `operators`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `licenses_game_operator_unique` ON `licenses` (`game_id`,`operator_id`);--> statement-breakpoint
CREATE INDEX `idx_licenses_game_id` ON `licenses` (`game_id`);--> statement-breakpoint
CREATE INDEX `idx_licenses_operator_id` ON `licenses` (`operator_id`);--> statement-breakpoint
CREATE INDEX `idx_licenses_status` ON `licenses` (`status`);--> statement-breakpoint
CREATE TABLE `operators` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`jurisdiction` text NOT NULL,
	`tier` text DEFAULT 'standard' NOT NULL,
	`contact_email` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_operators_jurisdiction` ON `operators` (`jurisdiction`);--> statement-breakpoint
CREATE INDEX `idx_operators_status` ON `operators` (`status`);