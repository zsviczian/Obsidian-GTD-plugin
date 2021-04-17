import { ItemView, MarkdownRenderer, WorkspaceLeaf, Point, App, Menu } from 'obsidian';
import { VIEW_TYPE_TODO } from '../constants';
import { TodoItem, TodoItemStatus } from '../model/TodoItem';
import { RenderIcon, Icon } from '../ui/icons';

export enum TodoItemViewPane {
  Overdue,
  Today,
  Scheduled,
  Inbox,
  Someday,
  ContextAction,
}

export enum TodoSortStates {
  None,
  DateAsc,
  DateDesc,
  PersonAsc,
  PersonDesc,
  ProjectAsc,
  ProjectDesc,
  LocationAsc,
  LocationDesc,
  MiscAsc,
  MiscDesc,  
  FullTextAsc,
  FullTextDesc,
}

export interface TodoItemViewProps {
  todos:                  TodoItem[];
  openFile:               (filePath: string) => void;
  toggleTodo:             (todo: TodoItem, newStatus: TodoItemStatus) => void;
  isInboxVisible:         boolean;
  isOverdueVisible:       boolean;
  isTodayVisible:         boolean;
  isScheduledVisible:     boolean;
  isContextActionVisible: boolean;
  isSomedayVisible:       boolean;
  inboxTooltip:           string;
  overdueTooltip:         string;
  todayTooltip:           string;
  scheduledTooltip:       string;
  contextActionTooltip:   string;
  somedayTooltip:         string;
}

interface TodoItemViewState {
  activePane: TodoItemViewPane;
}

export interface TodoSortState {
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
    return 'Obsidian GTD';
  }

  getIcon(): string {
    return 'checkmark';
  }

  onClose(): Promise<void> {
    return Promise.resolve();
  }

  public setDisplayProps(props: TodoItemViewProps) {
    this.props.isInboxVisible = props.isInboxVisible;
    this.props.isOverdueVisible = props.isOverdueVisible;
    this.props.isTodayVisible = props.isTodayVisible;
    this.props.isScheduledVisible = props.isScheduledVisible;
    this.props.isContextActionVisible = props.isContextActionVisible;
    this.props.isSomedayVisible = props.isSomedayVisible;
    this.props.inboxTooltip = props.inboxTooltip;
    this.props.overdueTooltip = props.overdueTooltip;
    this.props.todayTooltip = props.todayTooltip;
    this.props.scheduledTooltip = props.scheduledTooltip;
    this.props.contextActionTooltip = props.contextActionTooltip;
    this.props.somedayTooltip = props.somedayTooltip;
    this.render();
  }
  
  public setProps(setter: (currentProps: TodoItemViewProps) => TodoItemViewProps): void {
    this.props = setter(this.props);
    this.render();
  }

  public setViewState(newState: TodoItemViewState) {
    this.state = newState;
    if(newState.activePane == TodoItemViewPane.Overdue || newState.activePane == TodoItemViewPane.Scheduled || newState.activePane == TodoItemViewPane.Today)
      this.sortState = {state: TodoSortStates.DateAsc};
    else if (newState.activePane == TodoItemViewPane.ContextAction)
      this.sortState = {state: TodoSortStates.PersonAsc};
    else 
      this.sortState = {state: TodoSortStates.FullTextAsc};
    this.render();
  }

  public setSortState(newState: TodoSortState) {
    this.sortState = newState;
    this.render();
  }

  public getSortState() {
    return this.sortState;
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
        case TodoSortStates.PersonDesc:
          return 'Sort by: Person Descending';
        case TodoSortStates.PersonAsc:
          return 'Sort by: Person Ascending';
        case TodoSortStates.ProjectDesc:
          return 'Sort by: Project Descending';
        case TodoSortStates.ProjectAsc:
          return 'Sort by: Project Ascending';
        case TodoSortStates.LocationDesc:
          return 'Sort by: Location Descending';
        case TodoSortStates.LocationAsc:
          return 'Sort by: Location Ascending';
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
      el.setAttribute('placeholder','context filter, RegExp case insensitive');
      el.onkeyup = (e) => {
        this.setFilter((<HTMLInputElement>e.target).value);
      };
    });

    container.createDiv(`todo-item-view-sort${activeClass()}`, (el) => {
      el.appendChild(RenderIcon(Icon.Sort, sortLabel(this.sortState.state)));
      el.onClickEvent((e) => {
        const menu = new SortContextMenu(this.app, this, {x: e.clientX, y: e.clientY});
//        const nextSortState = (this.sortState.state + 1) % this.sortStateCount;
//        this.setSortState({state: nextSortState});
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

    if (this.props.isOverdueVisible)
      container.createDiv(`todo-item-view-toolbar-item${activeClass(TodoItemViewPane.Overdue)}`, (el) => {
        el.appendChild(RenderIcon(Icon.Overdue, this.props.overdueTooltip));
        el.onClickEvent(() => setActivePane(TodoItemViewPane.Overdue));
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

    if (this.props.isContextActionVisible)
      container.createDiv(`todo-item-view-toolbar-item${activeClass(TodoItemViewPane.ContextAction)}`, (el) => {
        el.appendChild(RenderIcon(Icon.ContextAction, this.props.contextActionTooltip));
        el.onClickEvent(() => setActivePane(TodoItemViewPane.ContextAction));
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
      case TodoSortStates.PersonAsc:
        sortResult = a.person < b.person ? -1 : a.person > b.person ? 1 : 0;break;
      case TodoSortStates.PersonDesc:
        sortResult = a.person > b.person ? -1 : a.person < b.person ? 1 : 0;break;
      case TodoSortStates.ProjectAsc:
        sortResult = a.project < b.project ? -1 : a.project > b.project ? 1 : 0;break;
      case TodoSortStates.ProjectDesc:
        sortResult = a.project > b.project ? -1 : a.project < b.project ? 1 : 0;break;
      case TodoSortStates.LocationAsc:
        sortResult = a.location < b.location ? -1 : a.location > b.location ? 1 : 0;break;
      case TodoSortStates.LocationDesc:
        sortResult = a.location > b.location ? -1 : a.location < b.location ? 1 : 0;break;
      case TodoSortStates.MiscAsc:
        sortResult = a.misc < b.misc ? -1 : a.misc > b.misc ? 1 : 0;break;
      case TodoSortStates.MiscDesc:
        sortResult = a.misc > b.misc ? -1 : a.misc < b.misc ? 1 : 0;break;
      case TodoSortStates.FullTextAsc:
        sortResult = a.description.toLowerCase() < b.description.toLowerCase() ? -1 : a.description.toLowerCase() > b.description.toLowerCase() ? 1 : 0;break;
      case TodoSortStates.FullTextDesc:
        sortResult = a.description.toLowerCase() > b.description.toLowerCase() ? -1 : a.description.toLowerCase() < b.description.toLowerCase() ? 1 : 0;break;
    } 

    if (this.state.activePane == TodoItemViewPane.ContextAction) {
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
    const isLocationMatch = value.location.match(this.filterRegexp) != null; 
    const isMiscMatch = value.misc.match(this.filterRegexp) != null;  
    const isFilterSet = this.filter!="";
    const hasContext = value.person!='' || value.project!='' || value.location!='';
    const isPeopleActionNote = value.isDiscussWithNote || value.isWaitingForNote || value.isPromisedToNote;
    if (!isFilterSet || isPersonMatch || isProjectMatch || isMiscMatch || isLocationMatch) {
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

      const isOverdueNote = value.actionDate && isBeforeToday(value.actionDate);
      const isTodayNote = value.actionDate && isToday(value.actionDate);
      const isScheduledNote = !value.isSomedayMaybeNote && value.actionDate && !isTodayNote && !isOverdueNote;

      switch (this.state.activePane) {
        case TodoItemViewPane.Inbox:
          return !value.isSomedayMaybeNote && !isTodayNote && !isScheduledNote && !isOverdueNote && !(isPeopleActionNote && hasContext) ;
        case TodoItemViewPane.Scheduled:
          return isScheduledNote;
        case TodoItemViewPane.Someday:
          return value.isSomedayMaybeNote;
        case TodoItemViewPane.Today:
          return isTodayNote;
        case TodoItemViewPane.Overdue:
            return isOverdueNote;
        case TodoItemViewPane.ContextAction:
          return hasContext && isPeopleActionNote ;
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

class SortContextMenu extends Menu {
  private view: TodoItemView;

  constructor(app: App, view: TodoItemView, position: Point) {
    super(app);
    const sortState = view.getSortState().state;
    this.view = view;

    this.addItem((menuItem) =>
    menuItem
      .setIcon(sortState == TodoSortStates.None ? 'checkmark' : '')
      .setTitle("don't sort")
      .onClick(async () => this.menuClick(TodoSortStates.None))
    )

    this.addItem((menuItem) =>
      menuItem
        .setIcon(sortState == TodoSortStates.DateDesc ? 'checkmark' : '')
        .setTitle("by date (new to old)")
        .onClick(async () => this.menuClick(TodoSortStates.DateDesc))
    )
    
    this.addItem((menuItem) =>
    menuItem
      .setIcon(sortState == TodoSortStates.DateAsc ? 'checkmark' : '')
      .setTitle("by date (old to new)")
      .onClick(async () => this.menuClick(TodoSortStates.DateAsc))
    ) 

    this.addItem((menuItem) =>
    menuItem
      .setIcon(sortState == TodoSortStates.PersonAsc ? 'checkmark' : '')
      .setTitle("by Person (A to Z)")
      .onClick(async () => this.menuClick(TodoSortStates.PersonAsc))
    )

    this.addItem((menuItem) =>
      menuItem
        .setIcon(sortState == TodoSortStates.PersonDesc ? 'checkmark' : '')
        .setTitle("by Person (Z to A)")
        .onClick(async () => this.menuClick(TodoSortStates.PersonDesc))
    )

    this.addItem((menuItem) =>
    menuItem
      .setIcon(sortState == TodoSortStates.ProjectAsc ? 'checkmark' : '')
      .setTitle("by Project (A to Z)")
      .onClick(async () => this.menuClick(TodoSortStates.ProjectAsc))
    )

    this.addItem((menuItem) =>
      menuItem
        .setIcon(sortState == TodoSortStates.ProjectDesc ? 'checkmark' : '')
        .setTitle("by Project (Z to A)")
        .onClick(async () => this.menuClick(TodoSortStates.ProjectDesc))
    )

    this.addItem((menuItem) =>
    menuItem
      .setIcon(sortState == TodoSortStates.LocationAsc ? 'checkmark' : '')
      .setTitle("by Location (A to Z)")
      .onClick(async () => this.menuClick(TodoSortStates.LocationAsc))
    )

    this.addItem((menuItem) =>
      menuItem
        .setIcon(sortState == TodoSortStates.LocationDesc ? 'checkmark' : '')
        .setTitle("by Location (Z to A)")
        .onClick(async () => this.menuClick(TodoSortStates.LocationDesc))
    )

    this.addItem((menuItem) =>
    menuItem
      .setIcon(sortState == TodoSortStates.MiscAsc ? 'checkmark' : '')
      .setTitle("by Misc Context (A to Z)")
      .onClick(async () => this.menuClick(TodoSortStates.MiscAsc))
    )

    this.addItem((menuItem) =>
      menuItem
        .setIcon(sortState == TodoSortStates.MiscDesc ? 'checkmark' : '')
        .setTitle("by Misc Context (Z to A)")
        .onClick(async () => this.menuClick(TodoSortStates.MiscDesc))
    )

    this.addItem((menuItem) =>
    menuItem
      .setIcon(sortState == TodoSortStates.FullTextAsc ? 'checkmark' : '')
      .setTitle("by TODO fulltext (A to Z)")
      .onClick(async () => this.menuClick(TodoSortStates.FullTextAsc))
    )

    this.addItem((menuItem) =>
      menuItem
        .setIcon(sortState == TodoSortStates.FullTextDesc ? 'checkmark' : '')
        .setTitle("by TODO fulltext (Z to A)")
        .onClick(async () => this.menuClick(TodoSortStates.FullTextDesc))
    )
    
    this.showAtPosition(position);
  }

  private menuClick(sortState: TodoSortStates) {
    this.view.setSortState({state: sortState});
  }
}
