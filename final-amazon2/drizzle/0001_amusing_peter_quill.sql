CREATE TABLE `chipPackages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`chips` int NOT NULL,
	`priceInDollars` decimal(10,2) NOT NULL,
	`bonus` int NOT NULL DEFAULT 0,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chipPackages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gameStats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`gameType` varchar(64) NOT NULL,
	`totalBets` decimal(10,2) NOT NULL DEFAULT '0.00',
	`totalWinnings` decimal(10,2) NOT NULL DEFAULT '0.00',
	`totalLosses` decimal(10,2) NOT NULL DEFAULT '0.00',
	`gamesPlayed` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `gameStats_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `paypalTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`transactionId` varchar(255) NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`status` varchar(64) NOT NULL,
	`payerEmail` varchar(320),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `paypalTransactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `paypalTransactions_transactionId_unique` UNIQUE(`transactionId`)
);
--> statement-breakpoint
CREATE TABLE `referrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`referralCode` varchar(32) NOT NULL,
	`referredCount` int NOT NULL DEFAULT 0,
	`bonusEarned` decimal(10,2) NOT NULL DEFAULT '0.00',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `referrals_id` PRIMARY KEY(`id`),
	CONSTRAINT `referrals_referralCode_unique` UNIQUE(`referralCode`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('deposit','withdrawal','game_bet','game_win','referral_bonus') NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`description` text,
	`paymentMethod` varchar(64),
	`transactionId` varchar(255),
	`status` enum('pending','completed','failed','cancelled') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `transactions_transactionId_unique` UNIQUE(`transactionId`)
);
--> statement-breakpoint
CREATE TABLE `userVerification` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`ageVerified` int NOT NULL DEFAULT 0,
	`dateOfBirth` varchar(10),
	`verifiedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userVerification_id` PRIMARY KEY(`id`),
	CONSTRAINT `userVerification_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `wallets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`balance` decimal(10,2) NOT NULL DEFAULT '1000.00',
	`totalDeposited` decimal(10,2) NOT NULL DEFAULT '0.00',
	`totalWithdrawn` decimal(10,2) NOT NULL DEFAULT '0.00',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wallets_id` PRIMARY KEY(`id`),
	CONSTRAINT `wallets_userId_unique` UNIQUE(`userId`)
);
