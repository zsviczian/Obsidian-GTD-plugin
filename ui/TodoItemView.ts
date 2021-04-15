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

enum TodoSortStates {
  None = 0,
  DateAsc = 1,
  DateDesc = 2,
  StakeholderAsc = 3,
  StakeholderDesc = 4,
  ProjectAsc = 5,
  ProjectDesc = 6,
  MiscAsc = 7,
  MiscDesc = 8,  
  FullTextAsc = 9,
  FullTextDesc = 10,
}

export interface TodoItemViewProps {
  todos: TodoItem[];
  openFile: (filePath: string) => void;
  toggleTodo: (todo: TodoItem, newStatus: TodoItemStatus) => void;
  isInboxVisible:       boolean;
  isAgingVisible:       boolean;
  isTodayVisible:       boolean;
  isScheduledVisible:   boolean;
  isStakeholderVisible: boolean;
  isSomedayVisible:     boolean;
  inboxTooltip:         string;
  agingTooltip:         string;
  todayTooltip:         string;
  scheduledTooltip:     string;
  stakeholderTooltip:   string;
  somedayTooltip:       string;
}

interface TodoItemViewState {
  activePane: TodoItemViewPane;
}

interface TodoSortState {
  state: TodoSortStates,
}

export class TodoItemView extends ItemView {
  private props: TodoItemViewProps;
  private state: TodoItemViewState;
  private sortState: TodoSortState;
  private filter: string;
  private filterRegexp: RegExp;
  private sortStateCount;

  constructor(leaf: WorkspaceLeaf, props: TodoItemViewProps) {
    //debugger;
    super(leaf);
    this.props = props;
    this.state = {
      activePane: TodoItemViewPane.Today,
    };
    this.sortState = {
      state: TodoSortStates.None,
    };
    this.sortStateCount = Object.values(TodoSortStates).length/2;
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

  public setDisplayProps(props: TodoItemViewProps) {
    this.props.isInboxVisible = props.isInboxVisible;
    this.props.isAgingVisible = props.isAgingVisible;
    this.props.isTodayVisible = props.isTodayVisible;
    this.props.isScheduledVisible = props.isScheduledVisible;
    this.props.isStakeholderVisible = props.isStakeholderVisible;
    this.props.isSomedayVisible = props.isSomedayVisible;
    this.props.inboxTooltip = props.inboxTooltip;
    this.props.agingTooltip = props.agingTooltip;
    this.props.todayTooltip = props.todayTooltip;
    this.props.scheduledTooltip = props.scheduledTooltip;
    this.props.stakeholderTooltip = props.stakeholderTooltip;
    this.props.somedayTooltip = props.somedayTooltip;
    this.render();
  }
  
  public setProps(setter: (currentProps: TodoItemViewProps) => TodoItemViewProps): void {
    this.props = setter(this.props);
    this.render();
  }

  private setViewState(newState: TodoItemViewState) {
    this.state = newState;
    if(newState.activePane == TodoItemViewPane.Aging || newState.activePane == TodoItemViewPane.Scheduled || newState.activePane == TodoItemViewPane.Today)
      this.sortState = {state: TodoSortStates.DateAsc};
    else if (newState.activePane == TodoItemViewPane.Stakeholder)
      this.sortState = {state: TodoSortStates.StakeholderAsc};
    else 
      this.sortState = {state: TodoSortStates.FullTextAsc};
    this.render();
  }

  private setSortState(newState: TodoSortState) {
    this.sortState = newState;
    this.render();
  }

  private setFilter(filter: string) {
    this.filter = filter;
    this.filterRegexp = new RegExp(filter,'i');
    this.renderViewItemsOnly();
  }

  private renderViewItemsOnly():void {
    const container = this.containerEl.children[1].children[0];
    container.children[2].remove();
    container.createDiv('todo-item-view-items', (el) => {
      this.renderItems(el);
    });
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
    const activeClass = () => {
      if (this.sortState.state == TodoSortStates.None) 
        return ' none';
      else 
        return ' active';
    };

    const sortLabel = (sortState:TodoSortStates) => {
      switch (sortState) {
        case TodoSortStates.None:
          return 'Sort by: none';
        case TodoSortStates.DateDesc:
          return 'Sort by: Action Date Descending';
        case TodoSortStates.DateAsc:
          return 'Sort by: Action Date Ascending';
        case TodoSortStates.StakeholderDesc:
          return 'Sort by: Person Descending';
        case TodoSortStates.StakeholderAsc:
          return 'Sort by: Person Ascending';
        case TodoSortStates.ProjectDesc:
          return 'Sort by: Project Descending';
        case TodoSortStates.ProjectAsc:
          return 'Sort by: Project Ascending';
        case TodoSortStates.MiscDesc:
          return 'Sort by: Misc-snippet Descending';
        case TodoSortStates.MiscAsc:
          return 'Sort by: Misc-snippet Ascending';
        case TodoSortStates.FullTextDesc:
          return 'Sort by: Full Text Descending';
        case TodoSortStates.FullTextAsc:
          return 'Sort by: Full Text Ascending';
      }
    }

    container.createEl('input', {value: this.filter}, (el) => {
      el.addClass('todo-filter-input');
      el.setAttribute('placeholder','proj/person RexExp filter, case insensitive');
      el.onkeyup = (e) => {
        this.setFilter((<HTMLInputElement>e.target).value);
      };
    });

    container.createDiv(`todo-item-view-sort${activeClass()}`, (el) => {
      el.appendChild(RenderIcon(Icon.Sort, sortLabel(this.sortState.state)));
      el.onClickEvent((e) => {
        const nextSortState = (this.sortState.state + 1) % this.sortStateCount;
        this.setSortState({state: nextSortState});
        //(<HTMLElement>e.target).setAttribute('aria-label',sortLabel(nextSortState));
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

    if (this.props.isInboxVisible)
      container.createDiv(`todo-item-view-toolbar-item${activeClass(TodoItemViewPane.Inbox)}`, (el) => {
        el.appendChild(RenderIcon(Icon.Inbox, this.props.inboxTooltip));
        el.onClickEvent(() => setActivePane(TodoItemViewPane.Inbox));
      });

    if (this.props.isAgingVisible)
      container.createDiv(`todo-item-view-toolbar-item${activeClass(TodoItemViewPane.Aging)}`, (el) => {
        el.appendChild(RenderIcon(Icon.Aging, this.props.agingTooltip));
        el.onClickEvent(() => setActivePane(TodoItemViewPane.Aging));
      });

    if (this.props.isTodayVisible)
      container.createDiv(`todo-item-view-toolbar-item${activeClass(TodoItemViewPane.Today)}`, (el) => {
        el.appendChild(RenderIcon(Icon.Today, this.props.todayTooltip));
        el.onClickEvent(() => setActivePane(TodoItemViewPane.Today));
      });

    if (this.props.isScheduledVisible)
      container.createDiv(`todo-item-view-toolbar-item${activeClass(TodoItemViewPane.Scheduled)}`, (el) => {
        el.appendChild(RenderIcon(Icon.Scheduled, this.props.scheduledTooltip));
        el.onClickEvent(() => setActivePane(TodoItemViewPane.Scheduled));
      });

    if (this.props.isStakeholderVisible)
      container.createDiv(`todo-item-view-toolbar-item${activeClass(TodoItemViewPane.Stakeholder)}`, (el) => {
        el.appendChild(RenderIcon(Icon.Stakeholder, this.props.stakeholderTooltip));
        el.onClickEvent(() => setActivePane(TodoItemViewPane.Stakeholder));
      });

    if (this.props.isSomedayVisible)  
      container.createDiv(`todo-item-view-toolbar-item${activeClass(TodoItemViewPane.Someday)}`, (el) => {
        el.appendChild(RenderIcon(Icon.Someday, this.props.somedayTooltip));
        el.onClickEvent(() => setActivePane(TodoItemViewPane.Someday));
      });
  }

  private renderItems(container: HTMLDivElement) {
    const sortView = (a: TodoItem, b: TodoItem) => {
      return this.sortView(a,b);
    };
    const todosToRender = this.props.todos
                            .filter(this.filterForState, this);
    const sortedTodos = todosToRender.sort(sortView);
    sortedTodos
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

  private sortView(a: TodoItem, b: TodoItem) {
    let sortResult = 0;
    switch (this.sortState.state) {
      case TodoSortStates.None:
        sortResult = 0;break;
      case TodoSortStates.DateAsc:
        sortResult = a.actionDate < b.actionDate ? -1 : a.actionDate > b.actionDate ? 1 : 0;break;
      case TodoSortStates.DateDesc:
        sortResult = a.actionDate > b.actionDate ? -1 : a.actionDate < b.actionDate ? 1 : 0;break;
      case TodoSortStates.StakeholderAsc:
        sortResult = a.person < b.person ? -1 : a.person > b.person ? 1 : 0;break;
      case TodoSortStates.StakeholderDesc:
        sortResult = a.person > b.person ? -1 : a.person < b.person ? 1 : 0;break;
      case TodoSortStates.ProjectAsc:
        sortResult = a.project < b.project ? -1 : a.project > b.project ? 1 : 0;break;
      case TodoSortStates.ProjectDesc:
        sortResult = a.project > b.project ? -1 : a.project < b.project ? 1 : 0;break;
      case TodoSortStates.MiscAsc:
        sortResult = a.misc < b.misc ? -1 : a.misc > b.misc ? 1 : 0;break;
      case TodoSortStates.MiscDesc:
        sortResult = a.misc > b.misc ? -1 : a.misc < b.misc ? 1 : 0;break;
      case TodoSortStates.FullTextAsc:
        sortResult = a.description.toLowerCase() < b.description.toLowerCase() ? -1 : a.description.toLowerCase() > b.description.toLowerCase() ? 1 : 0;break;
      case TodoSortStates.FullTextDesc:
        sortResult = a.description.toLowerCase() > b.description.toLowerCase() ? -1 : a.description.toLowerCase() < b.description.toLowerCase() ? 1 : 0;break;
    } 

    if (this.state.activePane == TodoItemViewPane.Stakeholder) {
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
      return sortResult;
    }
    return sortResult;
  }

  private filterForState(value: TodoItem, _index: number, _array: TodoItem[]): boolean {
    const isPersonMatch = value.person.match(this.filterRegexp) != null; 
    const isProjectMatch = value.project.match(this.filterRegexp) != null; 
    const isMiscMatch = value.misc.match(this.filterRegexp) != null;  
    const isFilterSet = this.filter!="";
    const hasPersonOrProject = value.person!='' || value.project!='';
    const isPeopleActionNote = value.isDiscussWithNote || value.isWaitingForNote || value.isPromisedToNote;
    if (!isFilterSet || isPersonMatch || isProjectMatch || isMiscMatch) {
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

  private toggleTodo(todo: TodoItem): void {
    this.props.toggleTodo(todo, TodoItemStatus.toggleStatus(todo.status));
  }

  private openFile(todo: TodoItem): void {
    this.props.openFile(todo.sourceFilePath);
  }
}
