import { App, Plugin, PluginManifest, TFile, WorkspaceLeaf } from 'obsidian';

import { VIEW_TYPE_TODO } from './constants';
import { TodoIndex, TodoItemIndexProps } from './model/TodoIndex';
import { TodoItem, TodoItemStatus } from './model/TodoItem';
import { ActionTrackerSettings, ActionTrackerSettingTab, DEFAULT_SETTINGS } from './settings';
import { TodoItemView, TodoItemViewProps } from './ui/TodoItemView';

export default class ActionTrackerPlugin extends Plugin {
  private todoIndex: TodoIndex;
  private view: TodoItemView;
  settings: ActionTrackerSettings;

  constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
  }

  private getTodoItemIndexProps(): TodoItemIndexProps {
    return {
      personRegexp: new RegExp(this.getSettingValue('personRegexpString')),
      projectRegexp: new RegExp(this.getSettingValue('projectRegexpString')),
      dateRegexp: new RegExp(this.getSettingValue('dateRegexpString')),
      discussWithRegexp: new RegExp(this.getSettingValue('discussWithRegexpString')),
      waitingForRegexp: new RegExp(this.getSettingValue('waitingForRegexpString')),
      promisedToRegexp: new RegExp(this.getSettingValue('promisedToRegexpString')),
      somedayMaybeRegexp: new RegExp(this.getSettingValue('somedayMaybeRegexpString')),
    };
  }

  async onload(): Promise<void> {
    console.log('loading plugin');

    await this.loadSettings();

    this.todoIndex = new TodoIndex(this.app.vault, this.tick.bind(this), this.getTodoItemIndexProps());

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
      };
      this.view = new TodoItemView(leaf, props);
      return this.view;
    });

    this.addSettingTab(new ActionTrackerSettingTab(this.app, this));

    if (this.app.workspace.layoutReady) {
      this.initLeaf();
      await this.prepareIndex();
    } else {
      this.registerEvent(this.app.workspace.on('layout-ready', this.initLeaf.bind(this)));
      this.registerEvent(this.app.workspace.on('layout-ready', async () => await this.prepareIndex()));
    }
  }

  onunload(): void {
    this.app.workspace.getLeavesOfType(VIEW_TYPE_TODO).forEach(leaf => leaf.detach());
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

  async loadSettings(): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
    await this.todoIndex.reloadIndex(this.getTodoItemIndexProps());
  }

  getSettingValue<K extends keyof ActionTrackerSettings>(setting: K): ActionTrackerSettings[K] {
    return this.settings[setting];
  }
}
