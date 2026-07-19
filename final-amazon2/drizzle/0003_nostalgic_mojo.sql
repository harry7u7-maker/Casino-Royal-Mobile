CREATE TABLE `achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`icon` varchar(255),
	`requirement` varchar(255) NOT NULL,
	`rewardChips` decimal(10,2) DEFAULT '0.00',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `achievements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `adImpressions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`adNetwork` varchar(64) NOT NULL,
	`adType` varchar(64) NOT NULL,
	`revenue` decimal(10,2) DEFAULT '0.00',
	`viewedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `adImpressions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `challenges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`type` enum('daily','weekly','monthly','special') NOT NULL,
	`targetAmount` decimal(10,2) NOT NULL,
	`prizePool` decimal(10,2) NOT NULL,
	`startsAt` timestamp NOT NULL,
	`endsAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `challenges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cosmetics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('theme','effect','avatar','animation') NOT NULL,
	`description` text,
	`price` decimal(10,2) NOT NULL,
	`image` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cosmetics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dailyBonuses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lastClaimedAt` timestamp,
	`currentStreak` int NOT NULL DEFAULT 0,
	`maxStreak` int NOT NULL DEFAULT 0,
	`bonusAmount` decimal(10,2) NOT NULL DEFAULT '50.00',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dailyBonuses_id` PRIMARY KEY(`id`),
	CONSTRAINT `dailyBonuses_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `leaderboard` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`rank` int NOT NULL,
	`totalWinnings` decimal(10,2) NOT NULL DEFAULT '0.00',
	`gamesPlayed` int NOT NULL DEFAULT 0,
	`winRate` decimal(5,2) NOT NULL DEFAULT '0.00',
	`period` enum('daily','weekly','monthly','alltime') NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leaderboard_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `luckySpins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`remainingSpins` int NOT NULL DEFAULT 0,
	`lastResetAt` timestamp DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `luckySpins_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `socialShares` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`platform` enum('facebook','instagram','tiktok','twitter','whatsapp') NOT NULL,
	`bonusAwarded` decimal(10,2) DEFAULT '0.00',
	`sharedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `socialShares_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userAchievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`achievementId` int NOT NULL,
	`unlockedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userAchievements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userChallenges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`challengeId` int NOT NULL,
	`progress` decimal(10,2) NOT NULL DEFAULT '0.00',
	`completed` int NOT NULL DEFAULT 0,
	`completedAt` timestamp,
	`prizeEarned` decimal(10,2) DEFAULT '0.00',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userChallenges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userCosmetics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`cosmeticId` int NOT NULL,
	`equipped` int DEFAULT 0,
	`purchasedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userCosmetics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vipSubscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`tier` enum('none','silver','gold','platinum') NOT NULL DEFAULT 'none',
	`monthlyFee` decimal(10,2) DEFAULT '0.00',
	`dailyBonus` decimal(10,2) DEFAULT '0.00',
	`betMultiplier` decimal(5,2) DEFAULT '1.00',
	`startDate` timestamp,
	`endDate` timestamp,
	`autoRenew` int DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vipSubscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `vipSubscriptions_userId_unique` UNIQUE(`userId`)
);
