import { App, PluginSettingTab, Setting } from 'obsidian';
import ActionTrackerPlugin from './main';

export interface ActionTrackerSettings {
  personRegexpString: string;
  projectRegexpString: string;
  dateRegexpString: string;
  discussWithRegexpString: string;
  waitingForRegexpString: string;
  promisedToRegexpString: string;
  somedayMaybeRegexpString: string;
}

export const DEFAULT_SETTINGS: ActionTrackerSettings = {
  personRegexpString: '\\[{2}People\\/(.*?)\\]{2}',
  projectRegexpString: '\\[{2}Projects\\/(.*?)\\]{2}',
  dateRegexpString: '#(\\d{4})\\/(\\d{2})\\/(\\d{2})',
  discussWithRegexpString: '#(discussWith)',
  waitingForRegexpString: '#(waitingFor)',
  promisedToRegexpString: '#(promisedTo)',
  somedayMaybeRegexpString: '#(someday)',
};

export class ActionTrackerSettingTab extends PluginSettingTab {
  plugin: ActionTrackerPlugin;

  constructor(app: App, plugin: ActionTrackerPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    this.containerEl.empty();

    this.containerEl.createEl('h2', { text: 'Settings for the stakeholder action tracker plugin' });

    new Setting(containerEl)
      .setName('Person regexp pattern')
      .setDesc(
        'This is the regular expression to identify the action party in the action. Used for filtering todos by person.',
      )
      .addText((text) =>
        text
          .setPlaceholder('\\[{2}People\\/(.*?)\\]{2}')
          .setValue(this.plugin.settings.personRegexpString)
          .onChange(async (value) => {
            this.plugin.settings.personRegexpString = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Project regexp pattern')
      .setDesc(
        'This is the regular expression to identify the project in the action. Used for filtering todos by project name.',
      )
      .addText((text) =>
        text
          .setPlaceholder('\\[{2}Projects\\/(.*?)\\]{2}')
          .setValue(this.plugin.settings.projectRegexpString)
          .onChange(async (value) => {
            this.plugin.settings.projectRegexpString = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Date regexp pattern')
      .setDesc(
        'This is the regular expression to get the date for an action. The RegExp needs to capture 3 values. The first one should be the year (yyyy), the sceond the month (mm), the third the day (dd).',
      )
      .addText((text) =>
        text
          .setPlaceholder('#(\\d{4})\\/(\\d{2})\\/(\\d{2})')
          .setValue(this.plugin.settings.dateRegexpString)
          .onChange(async (value) => {
            this.plugin.settings.dateRegexpString = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Discuss With regexp pattern')
      .setDesc(
        'This is the regexp pattern you use to mark topics you want to discuss with someone. "Discuss with", "Promised to", and "Waiting for" actions show up under the Stakeholder Actions tab.',
      )
      .addText((text) =>
        text
          .setPlaceholder('#(discussWith)')
          .setValue(this.plugin.settings.discussWithRegexpString)
          .onChange(async (value) => {
            this.plugin.settings.discussWithRegexpString = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Waiting For regexp pattern')
      .setDesc(
        'This is the regexp pattern you use to mark topics someone has promised to deliver to me. "Discuss with", "Promised to", and "Waiting for" actions show up under the Stakeholder Actions tab.',
      )
      .addText((text) =>
        text
          .setPlaceholder('#(waitingFor)')
          .setValue(this.plugin.settings.waitingForRegexpString)
          .onChange(async (value) => {
            this.plugin.settings.waitingForRegexpString = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Promised To regexp pattern')
      .setDesc(
        'This is the regexp pattern you use to mark topics someone has promised to deliver to me. "Discuss with", "Promised to", and "Waiting for" actions show up under the Stakeholder Actions tab.',
      )
      .addText((text) =>
        text
          .setPlaceholder('#(promisedTo)')
          .setValue(this.plugin.settings.promisedToRegexpString)
          .onChange(async (value) => {
            this.plugin.settings.promisedToRegexpString = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Someday Maybe regexp pattern')
      .setDesc(
        'This is the regexp pattern you use to mark actions deliberately without a deadline - i.e. bucket list. Actions without a valid tag and without a deadline will show up in the Inbox.',
      )
      .addText((text) =>
        text
          .setPlaceholder('#(someday)')
          .setValue(this.plugin.settings.somedayMaybeRegexpString)
          .onChange(async (value) => {
            this.plugin.settings.somedayMaybeRegexpString = value;
            await this.plugin.saveSettings();
          }),
      );
  }
}
