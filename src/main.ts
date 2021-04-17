import { App, Plugin, PluginManifest, TFile, WorkspaceLeaf, } from 'obsidian';
import { VIEW_TYPE_TODO } from './constants';
import { TodoItemView, TodoItemViewProps, TodoItemViewPane } from './ui/TodoItemView';
import { TodoItem, TodoItemStatus } from './model/TodoItem';
import { TodoIndex,TodoItemIndexProps } from './model/TodoIndex';
import {DEFAULT_SETTINGS, ActionTrackerSettings, ActionTrackerSettingTab} from './settings';
import { stringify } from 'querystring';


export default class ActionTrackerPlugin extends Plugin {
  private todoIndex: TodoIndex;
  private view: TodoItemView;
  settings: ActionTrackerSettings;

  constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
  }

  private getTodoItemIndexProps() : TodoItemIndexProps {
    return {
      personRegexp:            new RegExp (this.getSettingValue('personRegexpString')),
      projectRegexp:           new RegExp (this.getSettingValue('projectRegexpString')),
      locationRegexp:          new RegExp (this.getSettingValue('locationRegexpString')),
      miscRegexp:              new RegExp (this.getSettingValue('miscRegexpString')),
      dateRegexp:              new RegExp (this.getSettingValue('dateRegexpString')),
      actionTagOneRegexp:      new RegExp (this.getSettingValue('actionTagOneRegexpString')),
      actionTagTwoRegexp:      new RegExp (this.getSettingValue('actionTagTwoRegexpString')),
      actionTagThreeRegexp:    new RegExp (this.getSettingValue('actionTagThreeRegexpString')),
      somedayMaybeRegexp:      new RegExp (this.getSettingValue('somedayMaybeRegexpString')),
      excludeTagRegexp:        new RegExp (this.getSettingValue('excludeTagRegexpString')),
      excludePath:             this.getSettingValue('excludePath'),
      excludeFilenameFragment: this.getSettingValue('excludeFilenameFragment').toLowerCase(),
    };
  }

  async onload(): Promise<void> {
    console.log('loading plugin');
    
    await this.loadSettings();
    
    this.todoIndex = new TodoIndex(this.app.vault, this.tick.bind(this),this.getTodoItemIndexProps());

    this.registerView(VIEW_TYPE_TODO, (leaf: WorkspaceLeaf) => {
      const todos: TodoItem[] = [];
      const props = {
        todos: todos,
        openFile: (filePath: string) => {
          const file = this.app.vault.getAbstractFileByPath(filePath) as TFile;
          this.app.workspace.splitActiveLeaf().openFile(file);
        },
        toggleTodo: (todo: TodoItem, newStatus: TodoItemStatus) => {
          this.todoIndex.setStatus(todo, newStatus);
        },
        isInboxVisible:       this.getSettingValue('isInboxVisible'),
        isOverdueVisible:       this.getSettingValue('isOverdueVisible'),
        isTodayVisible:       this.getSettingValue('isTodayVisible'),
        isScheduledVisible:   this.getSettingValue('isScheduledVisible'),
        isStakeholderVisible: this.getSettingValue('isStakeholderVisible'),
        isSomedayVisible:     this.getSettingValue('isSomedayVisible'),
        inboxTooltip:         this.getSettingValue('inboxTooltip'),
        overdueTooltip:         this.getSettingValue('overdueTooltip'),
        todayTooltip:         this.getSettingValue('todayTooltip'),
        scheduledTooltip:     this.getSettingValue('scheduledTooltip'),
        stakeholderTooltip:   this.getSettingValue('stakeholderTooltip'),
        somedayTooltip:       this.getSettingValue('somedayTooltip'),
      };
      this.view = new TodoItemView(leaf, props);
      return this.view;
    });

    this.addSettingTab(new ActionTrackerSettingTab(this.app, this));

    this.addCommand({
      id: "show-inbox-view",
      name: "Inbox View",
      callback: () => this.view.setViewState({activePane: TodoItemViewPane.Inbox}),
    });

    this.addCommand({
      id: "show-overdue-view",
      name: "Overdue View",
      callback: () => this.view.setViewState({activePane: TodoItemViewPane.Overdue}),
    });

    this.addCommand({
      id: "show-today-view",
      name: "Today View",
      callback: () => this.view.setViewState({activePane: TodoItemViewPane.Today}),
    });

    this.addCommand({
      id: "show-scheduled-view",
      name: "Scheduled View",
      callback: () => this.view.setViewState({activePane: TodoItemViewPane.Scheduled}),
    });

    this.addCommand({
      id: "show-context-actions-view",
      name: "Context Actions View",
      callback: () => this.view.setViewState({activePane: TodoItemViewPane.Stakeholder}),
    });

    this.addCommand({
      id: "show-someday-view",
      name: "Someday/Maybe View",
      callback: () => this.view.setViewState({activePane: TodoItemViewPane.Someday}),
    });

    if (this.app.workspace.layoutReady) {
      this.initLeaf();
      await this.prepareIndex();
    } else {
      this.registerEvent(this.app.workspace.on('layout-ready', this.initLeaf.bind(this)));
      this.registerEvent(this.app.workspace.on('layout-ready', async () => await this.prepareIndex()));
    }
  }

  onunload(): void {
    this.app.workspace.getLeavesOfType(VIEW_TYPE_TODO).forEach((leaf) => leaf.detach());
  }

  initLeaf(): void {
    if (this.app.workspace.getLeavesOfType(VIEW_TYPE_TODO).length) {
      return;
    }
    this.app.workspace.getRightLeaf(false).setViewState({
      type: VIEW_TYPE_TODO,
    });
  }

  async prepareIndex(): Promise<void> {
    await this.todoIndex.initialize();
  }

  tick(todos: TodoItem[]): void {
    this.view.setProps((currentProps: TodoItemViewProps) => {
      return {
        ...currentProps,
        todos: todos,
      };
    });
  }

  async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveFilterSettings() {
		await this.saveData(this.settings);
    await this.todoIndex.reloadIndex(this.getTodoItemIndexProps());
	}

  async saveViewDisplaySettings() {
		await this.saveData(this.settings);
    this.view.setDisplayProps({
      todos: null,
      openFile: null,
      toggleTodo: null,
      isInboxVisible:       this.getSettingValue('isInboxVisible'),
      isOverdueVisible:     this.getSettingValue('isOverdueVisible'),
      isTodayVisible:       this.getSettingValue('isTodayVisible'),
      isScheduledVisible:   this.getSettingValue('isScheduledVisible'),
      isStakeholderVisible: this.getSettingValue('isStakeholderVisible'),
      isSomedayVisible:     this.getSettingValue('isSomedayVisible'),
      inboxTooltip:         this.getSettingValue('inboxTooltip'),
      overdueTooltip:       this.getSettingValue('overdueTooltip'),
      todayTooltip:         this.getSettingValue('todayTooltip'),
      scheduledTooltip:     this.getSettingValue('scheduledTooltip'),
      stakeholderTooltip:   this.getSettingValue('stakeholderTooltip'),
      somedayTooltip:       this.getSettingValue('somedayTooltip'),
    });
  }

  getSettingValue<K extends keyof ActionTrackerSettings>(setting: K): ActionTrackerSettings[K] {
    return this.settings[setting]
  }
}


