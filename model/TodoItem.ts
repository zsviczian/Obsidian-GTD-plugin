export enum TodoItemStatus {
  Todo,
  Done,
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TodoItemStatus {
  export function toggleStatus(status: TodoItemStatus): TodoItemStatus {
    switch (status) {
      case TodoItemStatus.Todo:
        return TodoItemStatus.Done;
      case TodoItemStatus.Done:
        return TodoItemStatus.Todo;
    }
  }
}

export class TodoItem {
  public sourceFilePath: string;
  public startIndex: number;
  public length: number;
  public status: TodoItemStatus;
  public description: string;
  public person: string;
  public project: string;
  public misc: string;
  public actionDate?: Date;
  public isSomedayMaybeNote: boolean;
  public isDiscussWithNote: boolean;
  public isWaitingForNote: boolean;
  public isPromisedToNote: boolean;

  constructor(
    status: TodoItemStatus,
    description: string,
    person: string,
    project: string,
    misc: string,
    isSomedayMaybeNote: boolean,
    isDiscussWithNote: boolean,
    isWaitingForNote: boolean,
    isPromisedToNote: boolean,
    sourceFilePath: string,
    startIndex: number,
    length: number,
    actionDate?: Date,
  ) {
    this.status = status;
    this.description = description;
    this.person = person;
    this.project = project;
    this.misc = misc;
    this.actionDate = actionDate;
    this.isSomedayMaybeNote = isSomedayMaybeNote;
    this.isDiscussWithNote = isDiscussWithNote;
    this.isWaitingForNote = isWaitingForNote;
    this.isPromisedToNote = isPromisedToNote;
    this.sourceFilePath = sourceFilePath;
    this.startIndex = startIndex;
    this.length = length;
  }
}
