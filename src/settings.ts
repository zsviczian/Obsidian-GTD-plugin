import {App, PluginSettingTab, Setting} from 'obsidian';
import type ActionTrackerPlugin from "./main";

export interface ActionTrackerSettings {
	personRegexpString:        string,
  projectRegexpString:       string,
  miscRegexpString:          string,
  dateRegexpString:          string,
  discussWithRegexpString:   string,
  waitingForRegexpString:    string,
  promisedToRegexpString:    string,
  somedayMaybeRegexpString:  string,
  excludePath:               string,
  excludeFilenameFragment:   string,
  isInboxVisible:            boolean,
  isAgingVisible:            boolean,
  isTodayVisible:            boolean,
  isScheduledVisible:        boolean,
  isStakeholderVisible:      boolean,
  isSomedayVisible:          boolean,
  inboxTooltip:              string,
  agingTooltip:              string,
  todayTooltip:              string,
  scheduledTooltip:          string,
  stakeholderTooltip:        string,
  somedayTooltip:            string,
}

export const DEFAULT_SETTINGS: ActionTrackerSettings = {
	personRegexpString:        '\\[{2}People\\/(.*?)\\]{2}',
  projectRegexpString:       '\\[{2}Projects\\/(.*?)\\]{2}',
  miscRegexpString:          '',
  dateRegexpString:          '#(\\d{4})\\/(\\d{2})\\/(\\d{2})',
  discussWithRegexpString:   '#(discussWith)',
  waitingForRegexpString:    '#(waitingFor)',
  promisedToRegexpString:    '#(promisedTo)',
  somedayMaybeRegexpString:  '#(someday)',
  excludePath:                '',
  excludeFilenameFragment:    '',
  isInboxVisible:            true,
  isAgingVisible:            true,
  isTodayVisible:            true,
  isScheduledVisible:        true,
  isStakeholderVisible:      true,
  isSomedayVisible:          true,
  inboxTooltip:              'Inbox: No date set, no stakeholder action set, not a someday / maybe item.',
  agingTooltip:              'Aging',
  todayTooltip:              'Scheduled for Today',
  scheduledTooltip:          'Scheduled for a future date',
  stakeholderTooltip:        'Stakeholder and Project actions: discussWith, promisedTo, waitingFor. Only items that have a valid project or person will show up here. Stakeholder actions without project or person are in the Inbox.',
  somedayTooltip:            'Tagged as Someday / Maybe',
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

		this.containerEl.createEl('h1', {text: 'Selectors'});
    this.containerEl.createEl('p', {text: 'Selectors are regular expressions that capture specific part of an action. ' +
                                          'These values control which actions to list in each view, and to filter those lists using the search at the top of the O-GTD pane.'});

    this.containerEl.createEl('h3', {text: 'Snipets'});
    this.containerEl.createEl('p', {text: 'Use these selectors to capture specific information from your action item. ' + 
                                          'You can filter view results with these using the search box at the top. ' +
                                          'The "Stakeholder and projects actions" view only shows actions ' + 
                                          'that have either a Project or an Action Party. '});
    this.containerEl.createEl('p', {text: 'The patterns will only capture the first match. If you mention multiple ' +
                                          'people and projects in a TODO, you must place the action party first. For example:'});
    this.containerEl.createEl('p', {text: '[ ] #discussWith [[People/Catherine]] what present to buy for [[People/Kate]] as a recognition ' +
                                          'for achievements on [[Project/Secret campaign]].'});
    this.containerEl.createEl('p', {text: 'Catherine will be identified as the Action Party and "Secret campaign" as the Project.'});
		new Setting(containerEl)
			.setName('Action Party') 
			.setDesc('This is the regular expression to identify the action party in the action. Used for filtering todos by person.')
			.addText(text => text
				.setPlaceholder('\\[{2}People\\/(.*?)\\]{2}')
        .setValue(this.plugin.settings.personRegexpString)
				.onChange(async (value) => {
					this.plugin.settings.personRegexpString = value;
					await this.plugin.saveFilterSettings();
				}));

    new Setting(containerEl)
      .setName('Project')
      .setDesc('This is the regular expression to identify the project in the action. Used for filtering todos by project name.')
      .addText(text => text
        .setPlaceholder('\\[{2}Projects\\/(.*?)\\]{2}')
        .setValue(this.plugin.settings.projectRegexpString)
        .onChange(async (value) => {
          this.plugin.settings.projectRegexpString = value;
          await this.plugin.saveFilterSettings();
        }));

      new Setting(containerEl)
      .setName('Miscellaneous')
      .setDesc('This is the regular expression to capture whatever other part of the action you prefer to capture. ' +
               'This snipet will only effect filtering when using the search box at the top of the O-GTD panel. The default setting is to capture nothing. ' +
               'Should you, for example, want to capture the whole action line, change the pattern to: (.*)')
      .addText(text => text
        .setPlaceholder('(.*)')
        .setValue(this.plugin.settings.miscRegexpString)
        .onChange(async (value) => {
          this.plugin.settings.miscRegexpString = value;
          await this.plugin.saveFilterSettings();
        }));
  
    this.containerEl.createEl('h3', {text: 'Date'});
    this.containerEl.createEl('p', {text: 'This is the actions\'s due date. If set, your action will show up in one of the date filtered views: ' + 
                                          'Aging (date is overdue), Today (date is today), Scheduled (future date).'});
    new Setting(containerEl)
        .setName('Date')
        .setDesc('This is the regular expression to get the date for an action. You have two options. 1) If your RegExp captures 3 values, then '+
                 'the first must be the year (yyyy), the sceond the month (mm), the third the day (dd). ' +
                 '2) If your RegExp captures a single value, then it must be a valid date based on your regional settings. For example: ' +
                 '#(\\d{4}\\-\\d{2}\\-\\d{2}) is captures the following date yyyy-mm-dd')
        .addText(text => text
          .setPlaceholder('#(\\d{4})\\/(\\d{2})\\/(\\d{2})')
          .setValue(this.plugin.settings.dateRegexpString)
          .onChange(async (value) => {
            this.plugin.settings.dateRegexpString = value;
            await this.plugin.saveFilterSettings();
        }));
    
    this.containerEl.createEl('h3', {text: 'Stakeholder-action tags'});
    this.containerEl.createEl('p', {text: 'These three tags allow you to qualify the type of stakeholder action you intend to take. ' +
                                          'In the "Stakeholder and project actions" view items will be pre-sorted ' +
                                          'with #discussWith first, #waitingFor second, and #promisedTo third. I can imagine situations ' + 
                                          'when you repurpose these to list actions based on priority: #high, #medium, #low by changing the regular expressions.'});
    new Setting(containerEl)
			.setName('Discuss With tag')
			.setDesc('This is the regular expression to identify topics you want to discuss with someone.')
			.addText(text => text
				.setPlaceholder('#(discussWith)')
        .setValue(this.plugin.settings.discussWithRegexpString)
				.onChange(async (value) => {
					this.plugin.settings.discussWithRegexpString = value;
					await this.plugin.saveFilterSettings();
				}));

    new Setting(containerEl)
      .setName('Waiting For')
      .setDesc('This is the regular expression to identify actions which you are waiting for some to complete.')
      .addText(text => text
        .setPlaceholder('#(waitingFor)')
        .setValue(this.plugin.settings.waitingForRegexpString)
        .onChange(async (value) => {
          this.plugin.settings.waitingForRegexpString = value;
          await this.plugin.saveFilterSettings();
        }));        
    
    new Setting(containerEl)
      .setName('Promised To')
      .setDesc('This is the regular expression to identify promises you have made to someone.')
      .addText(text => text
        .setPlaceholder('#(promisedTo)')
        .setValue(this.plugin.settings.promisedToRegexpString)
        .onChange(async (value) => {
          this.plugin.settings.promisedToRegexpString = value;
          await this.plugin.saveFilterSettings();
        }));        

    this.containerEl.createEl('h3', {text: 'Someday/Maybe tag'});
    this.containerEl.createEl('p', {text: 'Use this tag to mark actions that are deliberately without a deadline, such as ' +
                                          'items on your bucket list. These actions will show up in the "Someday/Maybe view. ' + 
                                          'Note, that actions without a valid tag and without a deadline will show up in the Inbox.'});
    new Setting(containerEl)
      .setName('Someday Maybe regexp pattern')
      .setDesc('This is the regular expression to identify the Someday/Maybe tag.')
      .addText(text => text
        .setPlaceholder('#(someday)')
        .setValue(this.plugin.settings.somedayMaybeRegexpString)
        .onChange(async (value) => {
          this.plugin.settings.somedayMaybeRegexpString = value;
          await this.plugin.saveFilterSettings();
        }));  
    



    this.containerEl.createEl('h1', {text: 'Exclusions'});   
    this.containerEl.createEl('p', {text: 'Settings to define which actions to exclude from the view.'});
    new Setting(containerEl)
      .setName('Exclude path')
      .setDesc('Intended for excluding your Templates folder. The files in this folder and all sub-folders will be excluded by Obsidian-GTD. The value given in this setting '+
               'is matched to the beginning of the filepath using .startsWith(). If you set this value to Temp, then '+
               'all files on the filepath startring with the string given will be excluded. To stick with our example Temp will exclude all of the following folders: ' +
               'Templates/, Template/, Temp/, etc. but will not exclude templates/ or temp/... Exclude folder names are case sensitive.')
      .addText(text => text
        .setPlaceholder('Templates/')
        .setValue(this.plugin.settings.excludePath)
        .onChange(async (value) => {
          this.plugin.settings.excludePath = value;
          await this.plugin.saveFilterSettings();
        }));   

    new Setting(containerEl)
      .setName('Exclude filename fragment')
      .setDesc('Intended for filtering out a special type of file that can be identified based on filename, such as checklists. If you name all your checklists '+
               'with the word checklist in the file (e.g. "Holiday checklist.md", "Blog post checklist.md", "Checklist for Christmas.md", etc.), ' +
               'those files will all be excluded. Uses .toLowerCase().includes() to filter elements, i.e. the filename fragment is '+
               'case insensitive')
      .addText(text => text
        .setPlaceholder('checklist')
        .setValue(this.plugin.settings.excludeFilenameFragment)
        .onChange(async (value) => {
          this.plugin.settings.excludeFilenameFragment = value;
          await this.plugin.saveFilterSettings();
        }));   



    this.containerEl.createEl('h1', {text: 'Configure Views'});   
    this.containerEl.createEl('p', {text: 'You can show/hide specific views based on your needs. ' +
                                          'As you customize some of the selectors, views may slightly change their meaning. You can update '+
                                          'the tooltip text to help you remember your intent with each view.'});
    
    this.containerEl.createEl('h3', {text: 'Inbox'});
    new Setting(containerEl)
      .setName('Show/hide Inbox')
      .addToggle(value => value
        .setValue(this.plugin.settings.isInboxVisible)
        .onChange(async (value) => {
          this.plugin.settings.isInboxVisible = value;
          await this.plugin.saveViewDisplaySettings();
        }));  
    new Setting(containerEl)
      .setName('Inbox tooltip')
      .addTextArea(text => {
        let t = text.setPlaceholder(DEFAULT_SETTINGS.inboxTooltip)
        .setValue(this.plugin.settings.inboxTooltip)
        .onChange(async (value) => {
          this.plugin.settings.inboxTooltip = value;
          await this.plugin.saveViewDisplaySettings();
        });
        t.inputEl.setAttr("rows", 4);
      });  


      this.containerEl.createEl('h3', {text: 'Aging'});
      new Setting(containerEl)
        .setName('Show/hide Aging')
        .addToggle(value => value
          .setValue(this.plugin.settings.isAgingVisible)
          .onChange(async (value) => {
            this.plugin.settings.isAgingVisible = value;
            await this.plugin.saveViewDisplaySettings();
          }));  
      new Setting(containerEl)
        .setName('Aging tooltip')
        .addTextArea(text => {
          let t = text.setPlaceholder(DEFAULT_SETTINGS.agingTooltip)
          .setValue(this.plugin.settings.agingTooltip)
          .onChange(async (value) => {
            this.plugin.settings.agingTooltip = value;
            await this.plugin.saveViewDisplaySettings();
          });
          t.inputEl.setAttr("rows", 4);
        });
        

        this.containerEl.createEl('h3', {text: 'Today'});
        new Setting(containerEl)
          .setName('Show/hide Today')
          .addToggle(value => value
            .setValue(this.plugin.settings.isTodayVisible)
            .onChange(async (value) => {
              this.plugin.settings.isTodayVisible = value;
              await this.plugin.saveViewDisplaySettings();
            }));  
        new Setting(containerEl)
          .setName('Today tooltip')
          .addTextArea(text => {
            let t = text.setPlaceholder(DEFAULT_SETTINGS.todayTooltip)
            .setValue(this.plugin.settings.todayTooltip)
            .onChange(async (value) => {
              this.plugin.settings.todayTooltip = value;
              await this.plugin.saveViewDisplaySettings();
            });
            t.inputEl.setAttr("rows", 4);
          });
          
        
        this.containerEl.createEl('h3', {text: 'Scheduled'});
          new Setting(containerEl)
            .setName('Show/hide Scheduled')
            .addToggle(value => value
              .setValue(this.plugin.settings.isScheduledVisible)
              .onChange(async (value) => {
                this.plugin.settings.isScheduledVisible = value;
                await this.plugin.saveViewDisplaySettings();
              }));  
          new Setting(containerEl)
            .setName('Scheduled tooltip')
            .addTextArea(text => {
              let t = text.setPlaceholder(DEFAULT_SETTINGS.scheduledTooltip)
              .setValue(this.plugin.settings.scheduledTooltip)
              .onChange(async (value) => {
                this.plugin.settings.scheduledTooltip = value;
                await this.plugin.saveViewDisplaySettings();
              });
              t.inputEl.setAttr("rows", 4);
            });       
            
  
        this.containerEl.createEl('h3', {text: 'Stakeholder Actions'});
          new Setting(containerEl)
            .setName('Show/hide Stakeholder Actions')
            .addToggle(value => value
              .setValue(this.plugin.settings.isStakeholderVisible)
              .onChange(async (value) => {
                this.plugin.settings.isStakeholderVisible = value;
                await this.plugin.saveViewDisplaySettings();
              }));  
          new Setting(containerEl)
            .setName('Stakeholder Actions tooltip')
            .addTextArea(text => {
              let t = text.setPlaceholder(DEFAULT_SETTINGS.stakeholderTooltip)
              .setValue(this.plugin.settings.stakeholderTooltip)
              .onChange(async (value) => {
                this.plugin.settings.stakeholderTooltip = value;
                await this.plugin.saveViewDisplaySettings();
              });
              t.inputEl.setAttr("rows", 4);
            });  


          this.containerEl.createEl('h3', {text: 'Someday/Maybe'});
            new Setting(containerEl)
              .setName('Show/hide Someday/Maybe')
              .addToggle(value => value
                .setValue(this.plugin.settings.isSomedayVisible)
                .onChange(async (value) => {
                  this.plugin.settings.isSomedayVisible = value;
                  await this.plugin.saveViewDisplaySettings();
                }));  
            new Setting(containerEl)
              .setName('Someday/Maybe tooltip')
              .addTextArea(text => {
                let t = text.setPlaceholder(DEFAULT_SETTINGS.somedayTooltip)
                .setValue(this.plugin.settings.somedayTooltip)
                .onChange(async (value) => {
                  this.plugin.settings.somedayTooltip = value;
                  await this.plugin.saveViewDisplaySettings();
                });
                t.inputEl.setAttr("rows", 4);
              });  
	}
}