import { ItemView, MarkdownRenderer, WorkspaceLeaf } from 'obsidian';
import { VIEW_TYPE_TODO } from '../constants';
import { TodoItem, TodoItemStatus } from '../model/TodoItem';
import { RenderIcon, Icon } from '../ui/icons';

enum TodoItemViewPane {
  Aging,
  Today,
  Scheduled,
  Inbox,
  Someday,
  Stakeholder,
}

export interface TodoItemViewProps {
  todos: TodoItem[];
  openFile: (filePath: string) => void;
  toggleTodo: (todo: TodoItem, newStatus: TodoItemStatus) => void;
}

interface TodoItemViewState {
  activePane: TodoItemViewPane;
}

export class TodoItemView extends ItemView {
  private props: TodoItemViewProps;
  private state: TodoItemViewState;
  private filter: string;
  private filterRegexp: RegExp;

  constructor(leaf: WorkspaceLeaf, props: TodoItemViewProps) {
    //debugger;
    super(leaf);
    this.props = props;
    this.state = {
      activePane: TodoItemViewPane.Today,
    };
    this.filter = '';
  }
  
  getViewType(): string {
    return VIEW_TYPE_TODO;
  }

  getDisplayText(): string {
    return 'Todo';
  }

  getIcon(): string {
    return 'checkmark';
  }

  onClose(): Promise<void> {
    return Promise.resolve();
  }

  public setProps(setter: (currentProps: TodoItemViewProps) => TodoItemViewProps): void {
    this.props = setter(this.props);
    this.render();
  }

  private setViewState(newState: TodoItemViewState) {
    this.state = newState;
    this.render();
  }

  private setFilter(filter: string) {
    this.filter = filter;
    this.filterRegexp = new RegExp(filter,'i');
    this.render();
  }

  private render(): void {
    const container = this.containerEl.children[1];
    container.empty();
    container.createDiv('todo-item-view-container', (el) => {
      el.createDiv('todo-item-view-search', (el) => {
        this.renderSearch(el);
      });
      el.createDiv('todo-item-view-toolbar', (el) => {
        this.renderToolBar(el);
      });
      el.createDiv('todo-item-view-items', (el) => {
        this.renderItems(el);
      });
    });
  }

  private renderSearch(container: HTMLDivElement) {
    container.createEl('table',{},(el) => {
      el.addClass('todo-filter-wrapper');
      el.createEl('tr', {}, (el) => {
        el.addClass('todo-filter-row');
        el.createEl('td', {}, (el) => {
          el.addClass('todo-filter-col-input');
          el.createEl("input", {value: this.filter}, (el) => {
            el.addClass('todo-filter-input');
            el.setAttribute('placeholder','proj/person RexExp filter, case insensitive');
            el.onchange = (e) => {
              this.setFilter((<HTMLInputElement>e.target).value);
            };
          });
        });
        el.createEl('td',{}, (el) => {
          el.addClass('todo-filter-col-button');
          el.createEl("button", {text: "Filter"}, (el) => {
            el.addClass('todo-filter-button');
          });
        });
      });
    });
  }

  private renderToolBar(container: HTMLDivElement) {
    const activeClass = (pane: TodoItemViewPane) => {
      return pane === this.state.activePane ? ' active' : '';
    };

    const setActivePane = (pane: TodoItemViewPane) => {
      const newState = {
        ...this.state,
        activePane: pane,
      };
      this.setViewState(newState);
    };

    container.createDiv(`todo-item-view-toolbar-item${activeClass(TodoItemViewPane.Inbox)}`, (el) => {
      el.appendChild(RenderIcon(Icon.Inbox, 'Inbox: No date set, no stakeholder action set, not a someday / maybe item.'));
      el.onClickEvent(() => setActivePane(TodoItemViewPane.Inbox));
    });

    container.createDiv(`todo-item-view-toolbar-item${activeClass(TodoItemViewPane.Aging)}`, (el) => {
      el.appendChild(RenderIcon(Icon.Aging, 'Aging'));
      el.onClickEvent(() => setActivePane(TodoItemViewPane.Aging));
    });

    container.createDiv(`todo-item-view-toolbar-item${activeClass(TodoItemViewPane.Today)}`, (el) => {
      el.appendChild(RenderIcon(Icon.Today, 'Scheduled for Today'));
      el.onClickEvent(() => setActivePane(TodoItemViewPane.Today));
    });

    container.createDiv(`todo-item-view-toolbar-item${activeClass(TodoItemViewPane.Scheduled)}`, (el) => {
      el.appendChild(RenderIcon(Icon.Scheduled, 'Scheduled for a future date'));
      el.onClickEvent(() => setActivePane(TodoItemViewPane.Scheduled));
    });

    container.createDiv(`todo-item-view-toolbar-item${activeClass(TodoItemViewPane.Stakeholder)}`, (el) => {
      el.appendChild(RenderIcon(Icon.Stakeholder, 'Stakeholder actions: discussWith, promisedTo, waitingFor. Only items that have a valid project or person will show up here. Stakeholder actions without project or person are in the Inbox.'));
      el.onClickEvent(() => setActivePane(TodoItemViewPane.Stakeholder));
    });

    container.createDiv(`todo-item-view-toolbar-item${activeClass(TodoItemViewPane.Someday)}`, (el) => {
      el.appendChild(RenderIcon(Icon.Someday, 'Tagged as Someday / Maybe'));
      el.onClickEvent(() => setActivePane(TodoItemViewPane.Someday));
    });
  }

  private renderItems(container: HTMLDivElement) {
    const todosToRender = this.props.todos
                            .filter(this.filterForState, this)
                            .sort(this.sortByActionDate);
    todosToRender
      .forEach((todo,index) => {
        if(index>0) {
          if( (todo.isWaitingForNote && todosToRender[index-1].isDiscussWithNote) || 
              (todo.isPromisedToNote && 
                (todosToRender[index-1].isWaitingForNote || todosToRender[index-1].isDiscussWithNote)) ||
              (!todo.isPromisedToNote && !todo.isWaitingForNote && !todo.isDiscussWithNote && 
                (todosToRender[index-1].isWaitingForNote || todosToRender[index-1].isDiscussWithNote || todosToRender[index-1].isPromisedToNote)) ) {
            container.createEl('hr', {} ,(el) => {
              el.addClass('todo-item-view-divider');
            });
          }
        } 
        container.createDiv('todo-item-view-item', (el) => {
          el.createDiv('todo-item-view-item-checkbox', (el) => {
            el.createEl('input', { type: 'checkbox' }, (el) => {
              el.checked = todo.status === TodoItemStatus.Done;
              el.onClickEvent(() => {
                this.toggleTodo(todo);
              });
            });
          });
          el.createDiv('todo-item-view-item-description', (el) => {
            MarkdownRenderer.renderMarkdown(todo.description, el, todo.sourceFilePath, this);
          });
          el.createDiv('todo-item-view-item-link', (el) => {
            el.appendChild(RenderIcon(Icon.Reveal, 'Open file'));
            el.onClickEvent(() => {
              this.openFile(todo);
            });
          });
        });
      });
  }

  private filterForState(value: TodoItem, _index: number, _array: TodoItem[]): boolean {
    const isPersonMatch = value.person.match(this.filterRegexp) != null; 
    const isProjectMatch = value.project.match(this.filterRegexp) != null;   
    const isFilterSet = this.filter!="";
    const hasPersonOrProject = value.person!='' || value.project!='';
    const isPeopleActionNote = value.isDiscussWithNote || value.isWaitingForNote || value.isPromisedToNote;
    if (!isFilterSet || isPersonMatch || isProjectMatch) {
      const isToday = (date: Date) => {
        let today = new Date();
        return (
          date.getDate() == today.getDate() &&
          date.getMonth() == today.getMonth() &&
          date.getFullYear() == today.getFullYear()
        );
      };

      const isBeforeToday = (date: Date) => {
        let today = (new Date())
        today.setHours(0, 0, 0, 0);
        return date < today;
      };

      const isAgingNote = value.actionDate && isBeforeToday(value.actionDate);
      const isTodayNote = value.actionDate && isToday(value.actionDate);
      const isScheduledNote = !value.isSomedayMaybeNote && value.actionDate && !isTodayNote && !isAgingNote;

      switch (this.state.activePane) {
        case TodoItemViewPane.Inbox:
          return !value.isSomedayMaybeNote && !isTodayNote && !isScheduledNote && !isAgingNote && !(isPeopleActionNote && hasPersonOrProject);
        case TodoItemViewPane.Scheduled:
          return isScheduledNote;
        case TodoItemViewPane.Someday:
          return value.isSomedayMaybeNote;
        case TodoItemViewPane.Today:
          return isTodayNote;
        case TodoItemViewPane.Aging:
            return isAgingNote;
        case TodoItemViewPane.Stakeholder:
          return hasPersonOrProject && isPeopleActionNote;
      }
    } else return false;
  }

  private sortByActionDate(a: TodoItem, b: TodoItem): number {
    if (!a.actionDate && !b.actionDate) {
      if (a.isDiscussWithNote && !b.isDiscussWithNote) {
        return -1;
      }
      if (a.isWaitingForNote && !b.isDiscussWithNote && !b.isWaitingForNote) {
        return -1;
      }
      if (a.isPromisedToNote && !b.isDiscussWithNote && !b.isWaitingForNote) {
        return -1;
      }
      if (b.isDiscussWithNote && !a.isDiscussWithNote) {
        return 1;
      }
      if (b.isWaitingForNote && !a.isDiscussWithNote && !a.isWaitingForNote) {
        return 1;
      }
      if (b.isPromisedToNote && !a.isDiscussWithNote && !a.isWaitingForNote) {
        return 1;
      }     

      if (a.isSomedayMaybeNote && !b.isSomedayMaybeNote) {
        return -1;
      }
      if (!a.isSomedayMaybeNote && b.isSomedayMaybeNote) {
        return 1;
      }
      return 0;
    }
    return a.actionDate < b.actionDate ? -1 : a.actionDate > b.actionDate ? 1 : 0;
  }

  private toggleTodo(todo: TodoItem): void {
    this.props.toggleTodo(todo, TodoItemStatus.toggleStatus(todo.status));
  }

  private openFile(todo: TodoItem): void {
    this.props.openFile(todo.sourceFilePath);
  }
}
