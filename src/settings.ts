import { App, PluginSettingTab, Setting } from 'obsidian';
import type ActionTrackerPlugin from './main';

export interface ActionTrackerSettings {
  personRegexpString: string;
  projectRegexpString: string;
  locationRegexpString: string;
  miscRegexpString: string;
  dateRegexpString: string;
  actionTagOneRegexpString: string;
  actionTagTwoRegexpString: string;
  actionTagThreeRegexpString: string;
  somedayMaybeRegexpString: string;
  excludePath: string;
  excludeFilenameFragment: string;
  excludeTagRegexpString: string;
  isInboxVisible: boolean;
  isOverdueVisible: boolean;
  isTodayVisible: boolean;
  isScheduledVisible: boolean;
  isContextActionVisible: boolean;
  isSomedayVisible: boolean;
  inboxTooltip: string;
  overdueTooltip: string;
  todayTooltip: string;
  scheduledTooltip: string;
  contextActionTooltip: string;
  somedayTooltip: string;
  openFilesInNewLeaf: boolean;
}

export const DEFAULT_SETTINGS: ActionTrackerSettings = {
  personRegexpString: '\\[{2}People\\/(.*?)\\]{2}',
  projectRegexpString: '\\[{2}Projects\\/(.*?)\\]{2}',
  locationRegexpString: '\\[{2}Locations\\/(.*?)\\]{2}',
  miscRegexpString: '',
  dateRegexpString: '#(\\d{4})\\/(\\d{2})\\/(\\d{2})',
  actionTagOneRegexpString: '#(discussWith)',
  actionTagTwoRegexpString: '#(waitingFor)',
  actionTagThreeRegexpString: '#(promisedTo)',
  somedayMaybeRegexpString: '#(someday)',
  excludeTagRegexpString: '',
  excludePath: '',
  excludeFilenameFragment: '',
  isInboxVisible: true,
  isOverdueVisible: true,
  isTodayVisible: true,
  isScheduledVisible: true,
  isContextActionVisible: true,
  isSomedayVisible: true,
  inboxTooltip:
    'Inbox: Unclassified TODOs, i.e. without a date; without an Action Tag and a Context; without someday/maybe tag.',
  overdueTooltip: "Overdue: Past the TODO's due date.",
  todayTooltip: 'Today: Scheduled for Today',
  scheduledTooltip: 'Scheduled: Scheduled for a future date',
  contextActionTooltip:
    'Context Actions: Only TODOs that have a valid Context (Person, Project, Location) and a valid Action Tag appear here.',
  somedayTooltip: 'Someday / Maybe',
  openFilesInNewLeaf: true,
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

    this.containerEl.createEl('h1', { text: 'Selectors' });
    this.containerEl.createEl('p', {
      text:
        'Selectors are regular expressions that capture specific part of a TODO. ' +
        'These values control which TODOs will appear in each O-GTD view.',
    });

    this.containerEl.createEl('h3', { text: 'Contexts' });
    this.containerEl.createEl('p', {
      text:
        'Capture specific context information from your TODO item. ' +
        'You can filter view results based on these contexts using the search field at the top.' +
        'The "Context Actions" view only shows actions ' +
        'with a valid context. ',
    });
    this.containerEl.createEl('p', {
      text:
        'The patterns will only capture the first match. If you mention multiple ' +
        'people, projects and locations in a TODO, you must place the action party first. For example:',
    });
    this.containerEl.createEl('p', {
      text:
        '- [ ] #discussWith [[People/Catherine]] what present to buy for [[People/Kate]] as a recognition ' +
        'for her achievements on [[Project/Secret campaign]].',
    });
    this.containerEl.createEl('p', {
      text: 'Catherine will be identified as the Action Party and "Secret campaign" as the Project.',
    });
    new Setting(containerEl)
      .setName('Person')
      .setDesc('This is the regular expression to identify the action party in the TODO.')
      .addText((text) =>
        text
          .setPlaceholder('\\[{2}People\\/(.*?)\\]{2}')
          .setValue(this.plugin.settings.personRegexpString)
          .onChange(async (value) => {
            this.plugin.settings.personRegexpString = value;
            await this.plugin.saveFilterSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Project')
      .setDesc('This is the regular expression to identify the project in the action.')
      .addText((text) =>
        text
          .setPlaceholder('\\[{2}Projects\\/(.*?)\\]{2}')
          .setValue(this.plugin.settings.projectRegexpString)
          .onChange(async (value) => {
            this.plugin.settings.projectRegexpString = value;
            await this.plugin.saveFilterSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Location')
      .setDesc('This is the regular expression to identify the location in the action.')
      .addText((text) =>
        text
          .setPlaceholder('\\[{2}Projects\\/(.*?)\\]{2}')
          .setValue(this.plugin.settings.locationRegexpString)
          .onChange(async (value) => {
            this.plugin.settings.locationRegexpString = value;
            await this.plugin.saveFilterSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Miscellaneous')
      .setDesc(
        'This is the regular expression to capture whatever other part of the TODO you prefer to capture. ' +
          'This is not a context, and will only effect filtering when using the search box at the top of the O-GTD panel. The default setting is to capture nothing. ' +
          'Should you, for example, want to capture the whole TODO line so you can do full text filtering (and not just filter on contexts), change the pattern to: (.*)',
      )
      .addText((text) =>
        text
          .setPlaceholder('(.*)')
          .setValue(this.plugin.settings.miscRegexpString)
          .onChange(async (value) => {
            this.plugin.settings.miscRegexpString = value;
            await this.plugin.saveFilterSettings();
          }),
      );

    this.containerEl.createEl('h3', { text: 'Date' });
    this.containerEl.createEl('p', {
      text:
        "This is the TODO's due date. If set, your TODO will show up in one of the date filtered views: " +
        'Overdue, Today, Scheduled (for a future date).',
    });
    new Setting(containerEl)
      .setName('Date')
      .setDesc(
        'This is the regular expression to capture the date for your TODO. You have two options: 1) If the RegExp captures 3 values, then ' +
          'the first value must be the year (yyyy), the second the month (mm), and the third the day (dd). ' +
          '2) If your RegExp captures a single value, then it must be a valid date based on your regional settings. For example: ' +
          '#(\\d{4}\\-\\d{2}\\-\\d{2}) captures the following date yyyy-mm-dd',
      )
      .addText((text) =>
        text
          .setPlaceholder('#(\\d{4})\\/(\\d{2})\\/(\\d{2})')
          .setValue(this.plugin.settings.dateRegexpString)
          .onChange(async (value) => {
            this.plugin.settings.dateRegexpString = value;
            await this.plugin.saveFilterSettings();
          }),
      );

    this.containerEl.createEl('h3', { text: 'Action Tags' });
    this.containerEl.createEl('p', {
      text:
        'These three tags allow you to qualify the type of action you intend to take. ' +
        'Items in the "Context Actions" view are pre-sorted ' +
        'with #ActionTag1 first, #ActionTag2 second, and #ActionTag3 third. ',
    });
    new Setting(containerEl)
      .setName('Action Tag 1')
      .setDesc(
        'This is the regular expression to capture the action tag. The default is #discussWith, to mark an action to discuss something with someone.',
      )
      .addText((text) =>
        text
          .setPlaceholder('#(discussWith)')
          .setValue(this.plugin.settings.actionTagOneRegexpString)
          .onChange(async (value) => {
            this.plugin.settings.actionTagOneRegexpString = value;
            await this.plugin.saveFilterSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Action Tag 2')
      .setDesc(
        'This is the regular expression to capture the action tag. The default is #waitingFor, to mark an action to follow up with someone at a later time.',
      )
      .addText((text) =>
        text
          .setPlaceholder('#(waitingFor)')
          .setValue(this.plugin.settings.actionTagTwoRegexpString)
          .onChange(async (value) => {
            this.plugin.settings.actionTagTwoRegexpString = value;
            await this.plugin.saveFilterSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Action Tag 3')
      .setDesc(
        'This is the regular expression to capture the action tag. The default is set to capture #promisedTo, to mark an action to remind you that you have promised something to someone.',
      )
      .addText((text) =>
        text
          .setPlaceholder('#(promisedTo)')
          .setValue(this.plugin.settings.actionTagThreeRegexpString)
          .onChange(async (value) => {
            this.plugin.settings.actionTagThreeRegexpString = value;
            await this.plugin.saveFilterSettings();
          }),
      );

    this.containerEl.createEl('h3', { text: 'Someday/Maybe Tag' });
    this.containerEl.createEl('p', {
      text:
        'Use this tag to mark TODOs that are deliberately without a deadline, a context and/or and action, such as ' +
        'items on your bucket list. These TODOs will show up in the "Someday/Maybe" view. ' +
        'Note, that TODOs without a valid tag and without a deadline will show up in the Inbox.',
    });
    new Setting(containerEl)
      .setName('Someday/Maybe regexp pattern')
      .setDesc('This is the regular expression to identify the Someday/Maybe tag.')
      .addText((text) =>
        text
          .setPlaceholder('#(someday)')
          .setValue(this.plugin.settings.somedayMaybeRegexpString)
          .onChange(async (value) => {
            this.plugin.settings.somedayMaybeRegexpString = value;
            await this.plugin.saveFilterSettings();
          }),
      );

    this.containerEl.createEl('h1', { text: 'Exclusions' });
    this.containerEl.createEl('p', { text: 'Settings to define which TODOs to exclude from the view.' });
    new Setting(containerEl)
      .setName('Exclude path')
      .setDesc(
        'Intended for excluding your templates folder. The files in this folder and all sub-folders will be excluded by O-GTD. The value given in this setting ' +
          'is matched to the beginning of the filepath using .startsWith() and is case-sensitive. If you set this value to Temp, then ' +
          'all files on the filepath startring with the string given will be excluded. To stick with our example Temp will exclude all of the following folders: ' +
          'Templates/, Template/, Temp/, etc. but will not exclude templates/ or temp/... Exclude folder names are case sensitive.',
      )
      .addText((text) =>
        text
          .setPlaceholder('Templates/')
          .setValue(this.plugin.settings.excludePath)
          .onChange(async (value) => {
            this.plugin.settings.excludePath = value;
            await this.plugin.saveFilterSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Exclude filename fragment')
      .setDesc(
        'Intended for filtering out a special type of file that can be identified based on filename, such as checklists. If you name all your checklists ' +
          'with the word checklist in the file (e.g. "Holiday checklist.md", "Blog post checklist.md", "Checklist for Christmas.md", etc.), ' +
          'those files will all be excluded. Uses .toLowerCase().includes() to filter elements, i.e. the filename fragment is ' +
          'not case-sensitive',
      )
      .addText((text) =>
        text
          .setPlaceholder('checklist')
          .setValue(this.plugin.settings.excludeFilenameFragment)
          .onChange(async (value) => {
            this.plugin.settings.excludeFilenameFragment = value;
            await this.plugin.saveFilterSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Exclude TODO')
      .setDesc(
        'Regular expression to capture a tag that marks a TODO that should be excluded by the plugin. Intended for filtering out TODOs based on the content of the TODO. ',
      )
      .addText((text) =>
        text
          .setPlaceholder('#(exclude)')
          .setValue(this.plugin.settings.excludeTagRegexpString)
          .onChange(async (value) => {
            this.plugin.settings.excludeTagRegexpString = value;
            await this.plugin.saveFilterSettings();
          }),
      );

    this.containerEl.createEl('h1', { text: 'Configure Views' });
    this.containerEl.createEl('p', {
      text:
        'You can show/hide specific views based on your needs. ' +
        'As you customize some of the selectors, views may slightly change their meaning. You can update ' +
        'the tooltip text to help you remember your intent with each view.',
    });

    this.containerEl.createEl('h3', { text: 'Opening Files' });
    new Setting(containerEl)
      .setName('Open files in a new leaf')
      .setDesc(
        'If enabled, when opening the file containing a TODO that file will open in a new leaf. If disabled, it will replace the file that you currently have open.',
      )
    .addToggle((value) =>
      value.setValue(this.plugin.settings.openFilesInNewLeaf).onChange(async (value) => {
        this.plugin.settings.openFilesInNewLeaf = value;
        await this.plugin.saveViewDisplaySettings();
      }),
    );

    this.containerEl.createEl('h3', { text: 'Inbox' });
    new Setting(containerEl).setName('Show/hide Inbox').addToggle((value) =>
      value.setValue(this.plugin.settings.isInboxVisible).onChange(async (value) => {
        this.plugin.settings.isInboxVisible = value;
        await this.plugin.saveViewDisplaySettings();
      }),
    );
    new Setting(containerEl).setName('Inbox tooltip').addTextArea((text) => {
      const t = text
        .setPlaceholder(DEFAULT_SETTINGS.inboxTooltip)
        .setValue(this.plugin.settings.inboxTooltip)
        .onChange(async (value) => {
          this.plugin.settings.inboxTooltip = value == '' ? DEFAULT_SETTINGS.inboxTooltip : value;
          await this.plugin.saveViewDisplaySettings();
        });
      t.inputEl.setAttr('rows', 4);
    });

    this.containerEl.createEl('h3', { text: 'Overdue' });
    new Setting(containerEl).setName('Show/hide Overdue').addToggle((value) =>
      value.setValue(this.plugin.settings.isOverdueVisible).onChange(async (value) => {
        this.plugin.settings.isOverdueVisible = value;
        await this.plugin.saveViewDisplaySettings();
      }),
    );
    new Setting(containerEl).setName('Overdue tooltip').addTextArea((text) => {
      const t = text
        .setPlaceholder(DEFAULT_SETTINGS.overdueTooltip)
        .setValue(this.plugin.settings.overdueTooltip)
        .onChange(async (value) => {
          this.plugin.settings.overdueTooltip = value == '' ? DEFAULT_SETTINGS.overdueTooltip : value;
          await this.plugin.saveViewDisplaySettings();
        });
      t.inputEl.setAttr('rows', 4);
    });

    this.containerEl.createEl('h3', { text: 'Today' });
    new Setting(containerEl).setName('Show/hide Today').addToggle((value) =>
      value.setValue(this.plugin.settings.isTodayVisible).onChange(async (value) => {
        this.plugin.settings.isTodayVisible = value;
        await this.plugin.saveViewDisplaySettings();
      }),
    );
    new Setting(containerEl).setName('Today tooltip').addTextArea((text) => {
      const t = text
        .setPlaceholder(DEFAULT_SETTINGS.todayTooltip)
        .setValue(this.plugin.settings.todayTooltip)
        .onChange(async (value) => {
          this.plugin.settings.todayTooltip = value == '' ? DEFAULT_SETTINGS.todayTooltip : value;
          await this.plugin.saveViewDisplaySettings();
        });
      t.inputEl.setAttr('rows', 4);
    });

    this.containerEl.createEl('h3', { text: 'Scheduled' });
    new Setting(containerEl).setName('Show/hide Scheduled').addToggle((value) =>
      value.setValue(this.plugin.settings.isScheduledVisible).onChange(async (value) => {
        this.plugin.settings.isScheduledVisible = value;
        await this.plugin.saveViewDisplaySettings();
      }),
    );
    new Setting(containerEl).setName('Scheduled tooltip').addTextArea((text) => {
      const t = text
        .setPlaceholder(DEFAULT_SETTINGS.scheduledTooltip)
        .setValue(this.plugin.settings.scheduledTooltip)
        .onChange(async (value) => {
          this.plugin.settings.scheduledTooltip = value == '' ? DEFAULT_SETTINGS.scheduledTooltip : value;
          await this.plugin.saveViewDisplaySettings();
        });
      t.inputEl.setAttr('rows', 4);
    });

    this.containerEl.createEl('h3', { text: 'Context Actions' });
    new Setting(containerEl).setName('Show/hide Context Actions').addToggle((value) =>
      value.setValue(this.plugin.settings.isContextActionVisible).onChange(async (value) => {
        this.plugin.settings.isContextActionVisible = value;
        await this.plugin.saveViewDisplaySettings();
      }),
    );
    new Setting(containerEl).setName('Context Actions tooltip').addTextArea((text) => {
      const t = text
        .setPlaceholder(DEFAULT_SETTINGS.contextActionTooltip)
        .setValue(this.plugin.settings.contextActionTooltip)
        .onChange(async (value) => {
          this.plugin.settings.contextActionTooltip = value == '' ? DEFAULT_SETTINGS.contextActionTooltip : value;
          await this.plugin.saveViewDisplaySettings();
        });
      t.inputEl.setAttr('rows', 4);
    });

    this.containerEl.createEl('h3', { text: 'Someday/Maybe' });
    new Setting(containerEl).setName('Show/hide Someday/Maybe').addToggle((value) =>
      value.setValue(this.plugin.settings.isSomedayVisible).onChange(async (value) => {
        this.plugin.settings.isSomedayVisible = value;
        await this.plugin.saveViewDisplaySettings();
      }),
    );
    new Setting(containerEl).setName('Someday/Maybe tooltip').addTextArea((text) => {
      const t = text
        .setPlaceholder(DEFAULT_SETTINGS.somedayTooltip)
        .setValue(this.plugin.settings.somedayTooltip)
        .onChange(async (value) => {
          this.plugin.settings.somedayTooltip = value == '' ? DEFAULT_SETTINGS.somedayTooltip : value;
          await this.plugin.saveViewDisplaySettings();
        });
      t.inputEl.setAttr('rows', 4);
    });
  }
}
