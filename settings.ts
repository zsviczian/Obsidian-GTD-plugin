import {App, PluginSettingTab, Setting} from 'obsidian';
import type ActionTrackerPlugin from "./main";

export interface ActionTrackerSettings {
	personRegexpString:        string,
  projectRegexpString:       string,
  dateRegexpString:          string,
  discussWithRegexpString:   string,
  waitingForRegexpString:    string,
  promisedToRegexpString:    string,
  somedayMaybeRegexpString:  string
}

export const DEFAULT_SETTINGS: ActionTrackerSettings = {
	personRegexpString:        '\\[{2}People\\/(.*)\\]{2}',
  projectRegexpString:       '\\[{2}Projects\\/(.*)\\]{2}',
  dateRegexpString:          '#(\\d{4}\\/\\d{2}\\/\\d{2})',
  discussWithRegexpString:   '#(discussWith)',
  waitingForRegexpString:    '#(waitingFor)',
  promisedToRegexpString:    '#(promisedTo)',
  somedayMaybeRegexpString:  '#(someday)'
}

export class ActionTrackerSettingTab extends PluginSettingTab {
	plugin: ActionTrackerPlugin;

	constructor(app: App, plugin: ActionTrackerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let {containerEl} = this;

		this.containerEl.empty();

		this.containerEl.createEl('h2', {text: 'Settings for the stakeholder action tracker plugin'});

		new Setting(containerEl)
			.setName('Person regexp pattern')
			.setDesc('This is the regular expression to identify the action party in the action.')
			.addText(text => text
				.setPlaceholder('\\[{2}(People\\/.*)\\]{2}')
				.setValue('\\[{2}(People\\/.*)\\]{2}')
				.onChange(async (value) => {
					this.plugin.settings.personRegexpString = value;
					await this.plugin.saveSettings();
				}));

    new Setting(containerEl)
      .setName('Project regexp pattern')
      .setDesc('This is the regular expression to identify the project in the action.')
      .addText(text => text
        .setPlaceholder('\\[{2}(Projects\\/.*)\\]{2}')
        .setValue('\\[{2}(Projects\\/.*)\\]{2}')
        .onChange(async (value) => {
          this.plugin.settings.projectRegexpString = value;
          await this.plugin.saveSettings();
        }));
  
    new Setting(containerEl)
        .setName('Date regexp pattern')
        .setDesc('This is the regular expression to get the date for an action.')
        .addText(text => text
          .setPlaceholder('#(\\d{4}\\/\\d{2}\\/\\d{2})')
          .setValue('#(\\d{4}\\/\\d{2}\\/\\d{2})')
          .onChange(async (value) => {
            this.plugin.settings.dateRegexpString = value;
            await this.plugin.saveSettings();
        }));
  
    new Setting(containerEl)
			.setName('Discuss With regexp pattern')
			.setDesc('This is the regexp pattern you use to mark topics you want to discuss with someone.')
			.addText(text => text
				.setPlaceholder('#(discussWith)')
				.setValue('#(discussWith)')
				.onChange(async (value) => {
					this.plugin.settings.discussWithRegexpString = value;
					await this.plugin.saveSettings();
				}));

    new Setting(containerEl)
      .setName('Waiting For regexp pattern')
      .setDesc('This is the regexp pattern you use to mark topics someone has promised to deliver to me.')
      .addText(text => text
        .setPlaceholder('#(waitingFor)')
        .setValue('#(waitingFor)')
        .onChange(async (value) => {
          this.plugin.settings.waitingForRegexpString = value;
          await this.plugin.saveSettings();
        }));        
    
    new Setting(containerEl)
      .setName('Promised To regexp pattern')
      .setDesc('This is the regexp pattern you use to mark topics someone has promised to deliver to me.')
      .addText(text => text
        .setPlaceholder('#(promisedTo)')
        .setValue('#(promisedTo)')
        .onChange(async (value) => {
          this.plugin.settings.promisedToRegexpString = value;
          await this.plugin.saveSettings();
        }));        

    new Setting(containerEl)
      .setName('Someday Maybe regexp pattern')
      .setDesc('This is the regexp pattern you use to mark actions without a deadline.')
      .addText(text => text
        .setPlaceholder('#(someday)')
        .setValue('#(someday)')
        .onChange(async (value) => {
          this.plugin.settings.somedayMaybeRegexpString = value;
          await this.plugin.saveSettings();
        }));        
  
	}
}