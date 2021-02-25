import chalk from "chalk";
import { randomMessages } from "../assets/messages";
import { random } from "../utils/random";
import { Controller, HandleCommandOptions } from "./Controller";

export class RandomMessageController implements Controller {
	handleCommand({ command }: HandleCommandOptions) {
		try {
			const [, commandType, commandValue] = command.split(" ");

			if (commandType !== "random") return "";
			if (commandValue !== "message") return "";

			const index = random(1, randomMessages.length);
			return randomMessages[index];
		} catch (err) {
			throw new Error(chalk.redBright.bold(err.message));
		}
	}
}
