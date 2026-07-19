CREATE TABLE `admobConfig` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`bannerAdUnitId` varchar(255),
	`interstitialAdUnitId` varchar(255),
	`rewardedAdUnitId` varchar(255),
	`totalAdRevenue` decimal(10,2) DEFAULT '0.00',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `admobConfig_id` PRIMARY KEY(`id`),
	CONSTRAINT `admobConfig_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `dailyLoginBonuses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`bonusAmount` decimal(10,2) NOT NULL,
	`claimedAt` timestamp NOT NULL DEFAULT (now()),
	`streak` int NOT NULL DEFAULT 1,
	`lastClaimedAt` timestamp,
	CONSTRAINT `dailyLoginBonuses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notificationPreferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`bonusNotifications` int NOT NULL DEFAULT 1,
	`gameNotifications` int NOT NULL DEFAULT 1,
	`promotionNotifications` int NOT NULL DEFAULT 1,
	`achievementNotifications` int NOT NULL DEFAULT 1,
	`referralNotifications` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notificationPreferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `notificationPreferences_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `pushNotifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`body` text NOT NULL,
	`type` enum('bonus','game','promotion','achievement','referral') NOT NULL,
	`data` text,
	`sent` int NOT NULL DEFAULT 0,
	`sentAt` timestamp,
	`read` int NOT NULL DEFAULT 0,
	`readAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pushNotifications_id` PRIMARY KEY(`id`)
);
