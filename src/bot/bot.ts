import chalk from "chalk";
import { Client as DiscordClient } from "discord.js";
import { Controller } from "./controllers/Controller";
import { SpamController } from "./controllers/SpamController";
import { loop } from "./utils/loop";

export class Bot {
	client: DiscordClient;
	controllers: Controller[];

	constructor(controllers: Controller[]) {
		this.client = new DiscordClient();
		this.controllers = controllers;

		this.client.login(process.env.BOT_TOKEN);
		this.client.once("ready", () => console.log(chalk.cyan("Astra Bot is Running!")));

		this.commandHandler();
	}

	async commandHandler() {
		try {
			const { client, controllers } = this;
	
			client.on("message", (message) => {
				const [prefix] = message.content.toLowerCase().split(" ");
				if (prefix !== "astra") return;
	
				controllers.forEach(async (controller) => {
					const output = await controller.handleCommand({
						command: message.content.toLowerCase(),
						messageContent: message.content,
						message,
					});
	
					if (controller instanceof SpamController) {
						return output !== "" && loop(() => message.channel.send(output), 5);
					}
	
					output !== "" && message.channel.send(output);
				});
			});
		} catch (err) {
			throw new Error(chalk.redBright.bold(err.message));
		}
	}
}