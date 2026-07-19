CREATE TABLE `linkedPaymentMethods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`provider` enum('paypal','santander','openbank','mercadopago') NOT NULL,
	`accountNumber` varchar(20),
	`accountEmail` varchar(320),
	`isDefault` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `linkedPaymentMethods_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mercadoPagoTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`transactionId` varchar(255) NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`status` varchar(64) NOT NULL,
	`payerEmail` varchar(320),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `mercadoPagoTransactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `mercadoPagoTransactions_transactionId_unique` UNIQUE(`transactionId`)
);
--> statement-breakpoint
CREATE TABLE `openBankTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`transactionId` varchar(255) NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`status` varchar(64) NOT NULL,
	`accountNumber` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `openBankTransactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `openBankTransactions_transactionId_unique` UNIQUE(`transactionId`)
);
--> statement-breakpoint
CREATE TABLE `santanderTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`transactionId` varchar(255) NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`status` varchar(64) NOT NULL,
	`accountNumber` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `santanderTransactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `santanderTransactions_transactionId_unique` UNIQUE(`transactionId`)
);
