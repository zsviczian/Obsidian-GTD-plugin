'use strict';

var obsidian = require('obsidian');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const VIEW_TYPE_TODO = 'online.zsviczian.obsidian-stakeholder_action-plugin';

var TodoItemStatus;
(function (TodoItemStatus) {
    TodoItemStatus[TodoItemStatus["Todo"] = 0] = "Todo";
    TodoItemStatus[TodoItemStatus["Done"] = 1] = "Done";
})(TodoItemStatus || (TodoItemStatus = {}));
// eslint-disable-next-line @typescript-eslint/no-namespace
(function (TodoItemStatus) {
    function toggleStatus(status) {
        switch (status) {
            case TodoItemStatus.Todo:
                return TodoItemStatus.Done;
            case TodoItemStatus.Done:
                return TodoItemStatus.Todo;
        }
    }
    TodoItemStatus.toggleStatus = toggleStatus;
})(TodoItemStatus || (TodoItemStatus = {}));
class TodoItem {
    constructor(status, description, person, project, isSomedayMaybeNote, isDiscussWithNote, isWaitingForNote, isPromisedToNote, sourceFilePath, startIndex, length, actionDate) {
        this.status = status;
        this.description = description;
        this.person = person;
        this.project = project;
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

var Icon;
(function (Icon) {
    Icon[Icon["Inbox"] = 0] = "Inbox";
    Icon[Icon["Reveal"] = 1] = "Reveal";
    Icon[Icon["Scheduled"] = 2] = "Scheduled";
    Icon[Icon["Someday"] = 3] = "Someday";
    Icon[Icon["Today"] = 4] = "Today";
    Icon[Icon["Stakeholder"] = 5] = "Stakeholder";
    Icon[Icon["Aging"] = 6] = "Aging";
})(Icon || (Icon = {}));
const RenderIcon = (icon, title = '', description = '') => {
    const svg = svgForIcon(icon)(title, description);
    return parser.parseFromString(svg, 'text/xml').documentElement;
};
const parser = new DOMParser();
const svgForIcon = (icon) => {
    switch (icon) {
        case Icon.Inbox:
            return inboxIcon;
        case Icon.Reveal:
            return revealIcon;
        case Icon.Scheduled:
            return scheduledIcon;
        case Icon.Someday:
            return somedayIcon;
        case Icon.Today:
            return todayIcon;
        case Icon.Stakeholder:
            return stakeholderIcon;
        case Icon.Aging:
            return agingIcon;
    }
};
const inboxIcon = (title, description) => `
<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" aria-label="${title + description}">
  <title>${title}</title>
  <description>${description}</description>
  <path d="M0 0h24v24H0V0z" fill="none"/>
  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5v-3h3.56c.69 1.19 1.97 2 3.45 2s2.75-.81 3.45-2H19v3zm0-5h-4.99c0 1.1-.9 2-2 2s-2-.9-2-2H5V5h14v9z"/>
</svg>
`;
const revealIcon = (title, description) => `
<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" role="img" aria-label="${title + description}">
  <title>${title}</title>
  <description>${description}</description>
  <rect fill="none" height="24" width="24"/><path d="M9,5v2h6.59L4,18.59L5.41,20L17,8.41V15h2V5H9z"/>
</svg>
`;
const scheduledIcon = (title, description) => `
<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" aria-label="${title + description}">
  <title>${title}</title>
  <description>${description}</description>
  <path d="M0 0h24v24H0V0z" fill="none"/>
  <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V10h16v11zm0-13H4V5h16v3z"/>
</svg>
`;
const somedayIcon = (title, description) => `
<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" aria-label="${title + description}">
  <title>${title}</title>
  <description>${description}</description>
  <g><rect fill="none" height="24" width="24"/></g>
  <g><g><path d="M20,2H4C3,2,2,2.9,2,4v3.01C2,7.73,2.43,8.35,3,8.7V20c0,1.1,1.1,2,2,2h14c0.9,0,2-0.9,2-2V8.7c0.57-0.35,1-0.97,1-1.69V4 C22,2.9,21,2,20,2z M19,20H5V9h14V20z M20,7H4V4h16V7z"/><rect height="2" width="6" x="9" y="12"/></g></g>
</svg>
`;
const todayIcon = (title, description) => `
<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" aria-label="${title + description}">
  <title>${title}</title>
  <description>${description}</description>
  <path d="M0 0h24v24H0V0z" fill="none"/>
  <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/>
</svg>
`;
const stakeholderIcon = (title, description) => `
<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 16 24" width="16" height="24" viewBox="0 0 16 24" aria-label="${title + description}">
  <title>${title}</title>
  <description>${description}</description>
  <path d="M0 0h24v16H0V0z" fill="none"/>
  <path  d="M 12.041617 0.379395 C 14.783072 -0.385254 17.844596 0.648438 20.335563 2.021973 C 22.826529 3.395508 25.707145 5.746094 26.973502 8.606445 C 28.23986 11.480957 28.921744 16.182129 27.933707 19.226562 C 26.94567 22.270996 23.744986 25.471191 21.059195 26.901367 C 18.359488 28.345703 14.68566 28.628906 11.777213 27.864258 C 8.868766 27.099609 5.584586 24.635742 3.566764 22.299316 C 1.562858 19.962891 -0.246224 16.960938 -0.301889 13.874023 C -0.357553 10.787109 0.811393 6.128418 3.204947 3.806152 C 5.598502 1.483887 11.888541 0.379395 14.087272 -0.0737305 C 16.299918 -0.526855 16.480826 0.761719 16.439078 1.059082 M 18.902213 -0.201172 C 21.629752 0.308594 25.484488 3.62207 26.94567 6.397461 C 28.420768 9.172852 28.532096 13.52002 27.697135 16.422852 C 26.87609 19.325684 24.245963 22.101074 21.963736 23.814453 C 19.68151 25.513672 17.134879 26.349121 14.031608 26.660645 C 10.942252 26.958008 5.821158 27.524414 3.385856 25.655273 C 0.950553 23.800293 -0.580209 18.476074 -0.594125 15.488281 C -0.608041 12.500488 1.72985 10.022461 3.30236 7.728516 C 4.874869 5.43457 6.113395 2.970703 8.840934 1.724609 C 11.568473 0.478516 18.053336 0.237793 19.639762 0.237793 C 21.226188 0.223633 18.526481 1.512207 18.38732 1.696289 " transform="matrix(0.280702,0,0,0.275862,3.237084,2.758621)"/>
  <path  d="M -0.260884 -17.497731 C -0.664449 -21.207692 -3.405904 -34.730641 -2.779683 -39.941578 C -2.153463 -45.152516 0.114848 -46.894215 3.482524 -48.749196 C 6.8502 -50.590016 13.098491 -51.467946 17.440287 -51.028981 C 21.782084 -50.590016 27.042338 -51.694508 29.519389 -46.129567 C 31.99644 -40.564625 37.242778 -22.595387 32.27476 -17.639332 C 27.320659 -12.683278 5.124614 -16.50652 -0.246968 -16.393238 M -1.513326 -18.729664 C -1.555074 -22.708668 -1.193257 -36.727223 -0.469625 -41.499196 C 0.254008 -46.257008 -0.107808 -45.888844 2.814555 -47.290699 C 5.736918 -48.692555 12.305278 -50.09441 17.092387 -49.938649 C 21.86558 -49.768727 29.268901 -51.538746 31.523295 -46.313649 C 33.77769 -41.088551 35.753764 -23.430836 30.590922 -18.602223 C 25.441996 -13.77361 5.820414 -17.582692 0.601909 -17.356129 " transform="matrix(0.280702,0,0,0.275862,3.612293,25.350398)"/>
</svg>
`;
const agingIcon = (title, description) => `
<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" aria-label="${title + description}">
  <title>${title}</title>
  <description>${description}</description>
  <g id="surface1">
  <path style="fill-rule:evenodd;fill-opacity:1;stroke-width:16;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(0%,0%,0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 254.333333 461.166667 C 125 283.833333 172.833333 22.333333 518.5 18.333333 C 864.666667 17.666667 924.666667 295.833333 792.833333 449.666667 C 801.333333 531.5 801.5 600.333333 738.5 618.333333 C 712.833333 726.333333 722.5 794.5 707.166667 829.666667 C 635.333333 956.666667 410.833333 962.5 340 831.166667 C 323.666667 790 337.5 722.5 305.666667 612.166667 C 261.833333 595.166667 248.833333 542.666667 254.333333 461.166667 Z M 254.333333 238.333333 C 236.666667 279 245.166667 305 261.666667 348.5 C 272 375.333333 259.5 429.166667 254.333333 461.166667 M 797.166667 238.333333 C 809.5 264 807.166667 289.833333 790.166667 342.333333 C 778.5 372.833333 790.166667 419.166667 792.833333 449.666667 M 394.5 693.833333 C 384 658.666667 342 623.5 305.666667 612.166667 M 655.333333 692 C 672 650 694.5 620 738.5 618.333333 " transform="matrix(0.0234375,0,0,0.0234375,0,0)"/>
  <path style="fill:none;stroke-width:8;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(0%,0%,0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 340 626 C 361 674 372.333333 725.833333 380 779 C 428.166667 840 594.166667 858 665 776 C 669.833333 725.166667 687.666667 675.666667 704 626 L 655.333333 692 C 649.666667 733.166667 402 730.5 394.5 693.833333 Z M 403.5 798 L 403.5 706 M 432 815 L 433 714 M 462.5 822 L 463 719 M 492.5 827.5 C 492.5 825.5 493 721.5 493 721.5 M 523.5 831 L 523 722.5 M 554.5 827 L 554 722 M 583 822.5 L 582 719 M 615.5 810.5 L 614 715 M 644 794 L 643 705.5 M 642 750.5 C 560.5 786 487.833333 788.5 404 750.5 " transform="matrix(0.0234375,0,0,0.0234375,0,0)"/>
  <path style=" stroke:none;fill-rule:evenodd;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 7.25 9.789062 C 7.113281 10.28125 7.207031 10.910156 7.382812 11.460938 C 7.605469 12.152344 8.105469 12.566406 8.953125 12.632812 C 9.929688 12.65625 10.554688 12.089844 10.96875 11.179688 C 11.082031 10.90625 11.15625 10.445312 11.039062 9.9375 C 10.96875 9.679688 10.644531 9.296875 10.328125 9.101562 C 9.753906 8.753906 7.472656 8.949219 7.25 9.789062 Z M 17.339844 9.726562 C 17.472656 10.21875 17.378906 10.847656 17.203125 11.398438 C 16.984375 12.089844 16.480469 12.503906 15.632812 12.570312 C 14.65625 12.59375 14.035156 12.027344 13.617188 11.117188 C 13.503906 10.84375 13.429688 10.382812 13.546875 9.875 C 13.617188 9.617188 13.941406 9.234375 14.257812 9.035156 C 14.835938 8.691406 17.113281 8.886719 17.339844 9.726562 Z M 12.035156 12 L 12.035156 14.765625 C 11.625 15.386719 11.484375 15.433594 11.25 15.421875 C 10.941406 15.421875 10.734375 14.964844 10.792969 14.4375 C 10.945312 12.769531 11.449219 12.425781 12.035156 12 Z M 12.453125 12.011719 L 12.453125 14.777344 C 12.863281 15.398438 13.003906 15.445312 13.238281 15.433594 C 13.542969 15.433594 13.75 14.976562 13.695312 14.449219 C 13.542969 12.78125 13.039062 12.4375 12.453125 12.011719 Z M 12.453125 12.011719 "/>
  </g>
</svg>
`;

var TodoItemViewPane;
(function (TodoItemViewPane) {
    TodoItemViewPane[TodoItemViewPane["Aging"] = 0] = "Aging";
    TodoItemViewPane[TodoItemViewPane["Today"] = 1] = "Today";
    TodoItemViewPane[TodoItemViewPane["Scheduled"] = 2] = "Scheduled";
    TodoItemViewPane[TodoItemViewPane["Inbox"] = 3] = "Inbox";
    TodoItemViewPane[TodoItemViewPane["Someday"] = 4] = "Someday";
    TodoItemViewPane[TodoItemViewPane["Stakeholder"] = 5] = "Stakeholder";
})(TodoItemViewPane || (TodoItemViewPane = {}));
class TodoItemView extends obsidian.ItemView {
    constructor(leaf, props) {
        //debugger;
        super(leaf);
        this.props = props;
        this.state = {
            activePane: TodoItemViewPane.Today,
        };
        this.filter = '';
    }
    getViewType() {
        return VIEW_TYPE_TODO;
    }
    getDisplayText() {
        return 'Todo';
    }
    getIcon() {
        return 'checkmark';
    }
    onClose() {
        return Promise.resolve();
    }
    setProps(setter) {
        this.props = setter(this.props);
        this.render();
    }
    setViewState(newState) {
        this.state = newState;
        this.render();
    }
    setFilter(filter) {
        this.filter = filter;
        this.filterRegexp = new RegExp(filter, 'i');
        this.render();
    }
    render() {
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
    renderSearch(container) {
        container.createEl('table', {}, (el) => {
            el.addClass('todo-filter-wrapper');
            el.createEl('tr', {}, (el) => {
                el.addClass('todo-filter-row');
                el.createEl('td', {}, (el) => {
                    el.addClass('todo-filter-col-input');
                    el.createEl("input", { value: this.filter }, (el) => {
                        el.addClass('todo-filter-input');
                        el.setAttribute('placeholder', 'proj/person RexExp filter, case insensitive');
                        el.onchange = (e) => {
                            this.setFilter(e.target.value);
                        };
                    });
                });
                el.createEl('td', {}, (el) => {
                    el.addClass('todo-filter-col-button');
                    el.createEl("button", { text: "Filter" }, (el) => {
                        el.addClass('todo-filter-button');
                    });
                });
            });
        });
    }
    renderToolBar(container) {
        const activeClass = (pane) => {
            return pane === this.state.activePane ? ' active' : '';
        };
        const setActivePane = (pane) => {
            const newState = Object.assign(Object.assign({}, this.state), { activePane: pane });
            this.setViewState(newState);
        };
        container.createDiv(`todo-item-view-toolbar-item${activeClass(TodoItemViewPane.Aging)}`, (el) => {
            el.appendChild(RenderIcon(Icon.Aging, 'Aging'));
            el.onClickEvent(() => setActivePane(TodoItemViewPane.Aging));
        });
        container.createDiv(`todo-item-view-toolbar-item${activeClass(TodoItemViewPane.Today)}`, (el) => {
            el.appendChild(RenderIcon(Icon.Today, 'Today'));
            el.onClickEvent(() => setActivePane(TodoItemViewPane.Today));
        });
        container.createDiv(`todo-item-view-toolbar-item${activeClass(TodoItemViewPane.Scheduled)}`, (el) => {
            el.appendChild(RenderIcon(Icon.Scheduled, 'Scheduled'));
            el.onClickEvent(() => setActivePane(TodoItemViewPane.Scheduled));
        });
        container.createDiv(`todo-item-view-toolbar-item${activeClass(TodoItemViewPane.Inbox)}`, (el) => {
            el.appendChild(RenderIcon(Icon.Inbox, 'Inbox'));
            el.onClickEvent(() => setActivePane(TodoItemViewPane.Inbox));
        });
        container.createDiv(`todo-item-view-toolbar-item${activeClass(TodoItemViewPane.Someday)}`, (el) => {
            el.appendChild(RenderIcon(Icon.Someday, 'Someday / Maybe'));
            el.onClickEvent(() => setActivePane(TodoItemViewPane.Someday));
        });
        container.createDiv(`todo-item-view-toolbar-item${activeClass(TodoItemViewPane.Stakeholder)}`, (el) => {
            el.appendChild(RenderIcon(Icon.Stakeholder, 'Stakeholder actions'));
            el.onClickEvent(() => setActivePane(TodoItemViewPane.Stakeholder));
        });
    }
    renderItems(container) {
        const todosToRender = this.props.todos
            .filter(this.filterForState, this)
            .sort(this.sortByActionDate);
        todosToRender
            .forEach((todo, index) => {
            if (index > 0) {
                if ((todo.isWaitingForNote && todosToRender[index - 1].isDiscussWithNote) ||
                    (todo.isPromisedToNote && (todosToRender[index - 1].isWaitingForNote || todosToRender[index - 1].isDiscussWithNote))) {
                    container.createEl('hr', {}, (el) => {
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
                    obsidian.MarkdownRenderer.renderMarkdown(todo.description, el, todo.sourceFilePath, this);
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
    filterForState(value, _index, _array) {
        const isPersonMatch = value.person.match(this.filterRegexp) != null;
        const isProjectMatch = value.project.match(this.filterRegexp) != null;
        const isFilterSet = this.filter != "";
        if (!isFilterSet || isPersonMatch || isProjectMatch) {
            const isToday = (date) => {
                let today = new Date();
                return (date.getDate() == today.getDate() &&
                    date.getMonth() == today.getMonth() &&
                    date.getFullYear() == today.getFullYear());
            };
            const isBeforeToday = (date) => {
                let today = (new Date());
                today.setHours(0, 0, 0, 0);
                return date < today;
            };
            const isAgingNote = value.actionDate && isBeforeToday(value.actionDate);
            const isTodayNote = value.actionDate && isToday(value.actionDate);
            const isScheduledNote = !value.isSomedayMaybeNote && value.actionDate && !isTodayNote && !isAgingNote;
            switch (this.state.activePane) {
                case TodoItemViewPane.Inbox:
                    return !value.isSomedayMaybeNote && !isTodayNote && !isScheduledNote && !isAgingNote;
                case TodoItemViewPane.Scheduled:
                    return isScheduledNote;
                case TodoItemViewPane.Someday:
                    return value.isSomedayMaybeNote;
                case TodoItemViewPane.Today:
                    return isTodayNote;
                case TodoItemViewPane.Aging:
                    return isAgingNote;
                case TodoItemViewPane.Stakeholder:
                    return isFilterSet;
            }
        }
        else
            return false;
    }
    sortByActionDate(a, b) {
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
    toggleTodo(todo) {
        this.props.toggleTodo(todo, TodoItemStatus.toggleStatus(todo.status));
    }
    openFile(todo) {
        this.props.openFile(todo.sourceFilePath);
    }
}

class TodoParser {
    constructor(props) {
        this.props = props;
    }
    parseTasks(filePath, fileContents) {
        return __awaiter(this, void 0, void 0, function* () {
            const pattern = /(-|\*) \[(\s|x)?\]\s(.*)/g;
            return [...fileContents.matchAll(pattern)].map((task) => this.parseTask(filePath, task));
        });
    }
    parseTask(filePath, entry) {
        var _a;
        //debugger;
        const todoItemOffset = 2; // Strip off `-|* `
        const status = entry[2] === 'x' ? TodoItemStatus.Done : TodoItemStatus.Todo;
        const description = entry[3];
        const dateMatches = description.match(this.props.dateRegexp);
        const actionDate = dateMatches != null ? new Date(dateMatches[1]) : undefined;
        const personMatches = description.match(this.props.personRegexp);
        const person = personMatches != null ? personMatches[1] : "";
        const projectMatches = description.match(this.props.projectRegexp);
        const project = projectMatches != null ? projectMatches[1] : "";
        return new TodoItem(status, description, person, project, description.match(this.props.somedayMaybeRegexp) != null, description.match(this.props.discussWithRegexp) != null, description.match(this.props.waitingForRegexp) != null, description.match(this.props.promisedToRegexp) != null, filePath, ((_a = entry.index) !== null && _a !== void 0 ? _a : 0) + todoItemOffset, entry[0].length - todoItemOffset, actionDate);
    }
}

class TodoIndex {
    constructor(vault, listener, props) {
        this.props = props;
        this.vault = vault;
        this.todos = new Map();
        this.listeners = [listener];
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: persist index & last sync timestamp; only parse files that changed since then.
            const todoMap = new Map();
            let numberOfTodos = 0;
            const timeStart = new Date().getTime();
            const markdownFiles = this.vault.getMarkdownFiles();
            for (const file of markdownFiles) {
                const todos = yield this.parseTodosInFile(file);
                numberOfTodos += todos.length;
                if (todos.length > 0) {
                    todoMap.set(file.path, todos);
                }
            }
            const totalTimeMs = new Date().getTime() - timeStart;
            console.log(`[obsidian-stakeholder_action-plugin] Parsed ${numberOfTodos} TODOs from ${markdownFiles.length} markdown files in (${totalTimeMs / 1000.0}s)`);
            this.todos = todoMap;
            this.registerEventHandlers();
            this.invokeListeners();
        });
    }
    setStatus(todo, newStatus) {
        const file = this.vault.getAbstractFileByPath(todo.sourceFilePath);
        const fileContents = this.vault.read(file);
        fileContents.then((c) => {
            const newTodo = `[${newStatus === TodoItemStatus.Done ? 'x' : ' '}] ${todo.description}`;
            const newContents = c.substring(0, todo.startIndex) + newTodo + c.substring(todo.startIndex + todo.length);
            this.vault.modify(file, newContents);
        });
    }
    indexAbstractFile(file) {
        if (!(file instanceof obsidian.TFile)) {
            return;
        }
        this.indexFile(file);
    }
    indexFile(file) {
        this.parseTodosInFile(file).then((todos) => {
            this.todos.set(file.path, todos);
            this.invokeListeners();
        });
    }
    clearIndex(path, silent = false) {
        this.todos.delete(path);
        if (!silent) {
            this.invokeListeners();
        }
    }
    setProps(setter) {
        this.props = setter(this.props);
        //do I need to do anything else??
    }
    parseTodosInFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Does it make sense to index completed TODOs at all?
            const todoParser = new TodoParser(this.props);
            const fileContents = yield this.vault.cachedRead(file);
            return todoParser
                .parseTasks(file.path, fileContents)
                .then((todos) => todos.filter((todo) => todo.status === TodoItemStatus.Todo));
        });
    }
    registerEventHandlers() {
        this.vault.on('create', (file) => {
            this.indexAbstractFile(file);
        });
        this.vault.on('modify', (file) => {
            this.indexAbstractFile(file);
        });
        this.vault.on('delete', (file) => {
            this.clearIndex(file.path);
        });
        // We could simply change the references to the old path, but parsing again does the trick as well
        this.vault.on('rename', (file, oldPath) => {
            this.clearIndex(oldPath);
            this.indexAbstractFile(file);
        });
    }
    invokeListeners() {
        const todos = [].concat(...Array.from(this.todos.values()));
        this.listeners.forEach((listener) => listener(todos));
    }
}

const DEFAULT_SETTINGS = {
    personRegexpString: '\\[{2}People\\/(.*?)\\]{2}',
    projectRegexpString: '\\[{2}Projects\\/(.*?)\\]{2}',
    dateRegexpString: '#(\\d{4}\\/\\d{2}\\/\\d{2})',
    discussWithRegexpString: '#(discussWith)',
    waitingForRegexpString: '#(waitingFor)',
    promisedToRegexpString: '#(promisedTo)',
    somedayMaybeRegexpString: '#(someday)'
};
class ActionTrackerSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        let { containerEl } = this;
        this.containerEl.empty();
        this.containerEl.createEl('h2', { text: 'Settings for the stakeholder action tracker plugin' });
        new obsidian.Setting(containerEl)
            .setName('Person regexp pattern')
            .setDesc('This is the regular expression to identify the action party in the action.')
            .addText(text => text
            .setPlaceholder('\\[{2}People\\/(.*?)\\]{2}')
            .setValue(this.plugin.settings.personRegexpString)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.personRegexpString = value;
            yield this.plugin.saveSettings();
        })));
        new obsidian.Setting(containerEl)
            .setName('Project regexp pattern')
            .setDesc('This is the regular expression to identify the project in the action.')
            .addText(text => text
            .setPlaceholder('\\[{2}Projects\\/(.*?)\\]{2}')
            .setValue(this.plugin.settings.projectRegexpString)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.projectRegexpString = value;
            yield this.plugin.saveSettings();
        })));
        new obsidian.Setting(containerEl)
            .setName('Date regexp pattern')
            .setDesc('This is the regular expression to get the date for an action.')
            .addText(text => text
            .setPlaceholder('#(\\d{4}\\/\\d{2}\\/\\d{2})')
            .setValue(this.plugin.settings.dateRegexpString)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.dateRegexpString = value;
            yield this.plugin.saveSettings();
        })));
        new obsidian.Setting(containerEl)
            .setName('Discuss With regexp pattern')
            .setDesc('This is the regexp pattern you use to mark topics you want to discuss with someone.')
            .addText(text => text
            .setPlaceholder('#(discussWith)')
            .setValue(this.plugin.settings.discussWithRegexpString)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.discussWithRegexpString = value;
            yield this.plugin.saveSettings();
        })));
        new obsidian.Setting(containerEl)
            .setName('Waiting For regexp pattern')
            .setDesc('This is the regexp pattern you use to mark topics someone has promised to deliver to me.')
            .addText(text => text
            .setPlaceholder('#(waitingFor)')
            .setValue(this.plugin.settings.waitingForRegexpString)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.waitingForRegexpString = value;
            yield this.plugin.saveSettings();
        })));
        new obsidian.Setting(containerEl)
            .setName('Promised To regexp pattern')
            .setDesc('This is the regexp pattern you use to mark topics someone has promised to deliver to me.')
            .addText(text => text
            .setPlaceholder('#(promisedTo)')
            .setValue(this.plugin.settings.promisedToRegexpString)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.promisedToRegexpString = value;
            yield this.plugin.saveSettings();
        })));
        new obsidian.Setting(containerEl)
            .setName('Someday Maybe regexp pattern')
            .setDesc('This is the regexp pattern you use to mark actions without a deadline.')
            .addText(text => text
            .setPlaceholder('#(someday)')
            .setValue(this.plugin.settings.somedayMaybeRegexpString)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.somedayMaybeRegexpString = value;
            yield this.plugin.saveSettings();
        })));
    }
}

class ActionTrackerPlugin extends obsidian.Plugin {
    constructor(app, manifest) {
        super(app, manifest);
    }
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('loading plugin');
            yield this.loadSettings();
            const props = {
                personRegexp: new RegExp(this.getSettingValue('personRegexpString')),
                projectRegexp: new RegExp(this.getSettingValue('projectRegexpString')),
                dateRegexp: new RegExp(this.getSettingValue('dateRegexpString')),
                discussWithRegexp: new RegExp(this.getSettingValue('discussWithRegexpString')),
                waitingForRegexp: new RegExp(this.getSettingValue('waitingForRegexpString')),
                promisedToRegexp: new RegExp(this.getSettingValue('promisedToRegexpString')),
                somedayMaybeRegexp: new RegExp(this.getSettingValue('somedayMaybeRegexpString')),
            };
            this.todoIndex = new TodoIndex(this.app.vault, this.tick.bind(this), props);
            this.registerView(VIEW_TYPE_TODO, (leaf) => {
                const todos = [];
                const props = {
                    todos: todos,
                    openFile: (filePath) => {
                        const file = this.app.vault.getAbstractFileByPath(filePath);
                        this.app.workspace.splitActiveLeaf().openFile(file);
                    },
                    toggleTodo: (todo, newStatus) => {
                        this.todoIndex.setStatus(todo, newStatus);
                    },
                };
                this.view = new TodoItemView(leaf, props);
                return this.view;
            });
            this.addSettingTab(new ActionTrackerSettingTab(this.app, this));
            if (this.app.workspace.layoutReady) {
                this.initLeaf();
                yield this.prepareIndex();
            }
            else {
                this.registerEvent(this.app.workspace.on('layout-ready', this.initLeaf.bind(this)));
                this.registerEvent(this.app.workspace.on('layout-ready', () => __awaiter(this, void 0, void 0, function* () { return yield this.prepareIndex(); })));
            }
        });
    }
    onunload() {
        this.app.workspace.getLeavesOfType(VIEW_TYPE_TODO).forEach((leaf) => leaf.detach());
    }
    initLeaf() {
        if (this.app.workspace.getLeavesOfType(VIEW_TYPE_TODO).length) {
            return;
        }
        this.app.workspace.getRightLeaf(false).setViewState({
            type: VIEW_TYPE_TODO,
        });
    }
    prepareIndex() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.todoIndex.initialize();
        });
    }
    tick(todos) {
        this.view.setProps((currentProps) => {
            return Object.assign(Object.assign({}, currentProps), { todos: todos });
        });
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
    getSettingValue(setting) {
        return this.settings[setting];
    }
}

module.exports = ActionTrackerPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsImNvbnN0YW50cy50cyIsIm1vZGVsL1RvZG9JdGVtLnRzIiwidWkvaWNvbnMudHMiLCJ1aS9Ub2RvSXRlbVZpZXcudHMiLCJtb2RlbC9Ub2RvUGFyc2VyLnRzIiwibW9kZWwvVG9kb0luZGV4LnRzIiwic2V0dGluZ3MudHMiLCJtYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxyXG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXHJcblxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxyXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXHJcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxyXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXHJcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fY3JlYXRlQmluZGluZyA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgbykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBwKSkgX19jcmVhdGVCaW5kaW5nKG8sIG0sIHApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXlzKCkge1xyXG4gICAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciByID0gQXJyYXkocyksIGsgPSAwLCBpID0gMDsgaSA8IGlsOyBpKyspXHJcbiAgICAgICAgZm9yICh2YXIgYSA9IGFyZ3VtZW50c1tpXSwgaiA9IDAsIGpsID0gYS5sZW5ndGg7IGogPCBqbDsgaisrLCBrKyspXHJcbiAgICAgICAgICAgIHJba10gPSBhW2pdO1xyXG4gICAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5KHRvLCBmcm9tKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBmcm9tLmxlbmd0aCwgaiA9IHRvLmxlbmd0aDsgaSA8IGlsOyBpKyssIGorKylcclxuICAgICAgICB0b1tqXSA9IGZyb21baV07XHJcbiAgICByZXR1cm4gdG87XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcclxufSkgOiBmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcclxuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRHZXQocmVjZWl2ZXIsIHByaXZhdGVNYXApIHtcclxuICAgIGlmICghcHJpdmF0ZU1hcC5oYXMocmVjZWl2ZXIpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImF0dGVtcHRlZCB0byBnZXQgcHJpdmF0ZSBmaWVsZCBvbiBub24taW5zdGFuY2VcIik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcHJpdmF0ZU1hcC5nZXQocmVjZWl2ZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgcHJpdmF0ZU1hcCwgdmFsdWUpIHtcclxuICAgIGlmICghcHJpdmF0ZU1hcC5oYXMocmVjZWl2ZXIpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImF0dGVtcHRlZCB0byBzZXQgcHJpdmF0ZSBmaWVsZCBvbiBub24taW5zdGFuY2VcIik7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlTWFwLnNldChyZWNlaXZlciwgdmFsdWUpO1xyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG59XHJcbiIsImV4cG9ydCBjb25zdCBWSUVXX1RZUEVfVE9ETyA9ICdvbmxpbmUuenN2aWN6aWFuLm9ic2lkaWFuLXN0YWtlaG9sZGVyX2FjdGlvbi1wbHVnaW4nO1xyXG4iLCJleHBvcnQgZW51bSBUb2RvSXRlbVN0YXR1cyB7XHJcbiAgVG9kbyxcclxuICBEb25lLFxyXG59XHJcblxyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLW5hbWVzcGFjZVxyXG5leHBvcnQgbmFtZXNwYWNlIFRvZG9JdGVtU3RhdHVzIHtcclxuICBleHBvcnQgZnVuY3Rpb24gdG9nZ2xlU3RhdHVzKHN0YXR1czogVG9kb0l0ZW1TdGF0dXMpOiBUb2RvSXRlbVN0YXR1cyB7XHJcbiAgICBzd2l0Y2ggKHN0YXR1cykge1xyXG4gICAgICBjYXNlIFRvZG9JdGVtU3RhdHVzLlRvZG86XHJcbiAgICAgICAgcmV0dXJuIFRvZG9JdGVtU3RhdHVzLkRvbmU7XHJcbiAgICAgIGNhc2UgVG9kb0l0ZW1TdGF0dXMuRG9uZTpcclxuICAgICAgICByZXR1cm4gVG9kb0l0ZW1TdGF0dXMuVG9kbztcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUb2RvSXRlbSB7XHJcbiAgcHVibGljIHNvdXJjZUZpbGVQYXRoOiBzdHJpbmc7XHJcbiAgcHVibGljIHN0YXJ0SW5kZXg6IG51bWJlcjtcclxuICBwdWJsaWMgbGVuZ3RoOiBudW1iZXI7XHJcbiAgcHVibGljIHN0YXR1czogVG9kb0l0ZW1TdGF0dXM7XHJcbiAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgcHVibGljIHBlcnNvbjogc3RyaW5nO1xyXG4gIHB1YmxpYyBwcm9qZWN0OiBzdHJpbmc7XHJcbiAgcHVibGljIGFjdGlvbkRhdGU/OiBEYXRlO1xyXG4gIHB1YmxpYyBpc1NvbWVkYXlNYXliZU5vdGU6IGJvb2xlYW47XHJcbiAgcHVibGljIGlzRGlzY3Vzc1dpdGhOb3RlOiBib29sZWFuO1xyXG4gIHB1YmxpYyBpc1dhaXRpbmdGb3JOb3RlOiBib29sZWFuO1xyXG4gIHB1YmxpYyBpc1Byb21pc2VkVG9Ob3RlOiBib29sZWFuO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHN0YXR1czogVG9kb0l0ZW1TdGF0dXMsXHJcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nLFxyXG4gICAgcGVyc29uOiBzdHJpbmcsXHJcbiAgICBwcm9qZWN0OiBzdHJpbmcsXHJcbiAgICBpc1NvbWVkYXlNYXliZU5vdGU6IGJvb2xlYW4sXHJcbiAgICBpc0Rpc2N1c3NXaXRoTm90ZTogYm9vbGVhbixcclxuICAgIGlzV2FpdGluZ0Zvck5vdGU6IGJvb2xlYW4sXHJcbiAgICBpc1Byb21pc2VkVG9Ob3RlOiBib29sZWFuLFxyXG4gICAgc291cmNlRmlsZVBhdGg6IHN0cmluZyxcclxuICAgIHN0YXJ0SW5kZXg6IG51bWJlcixcclxuICAgIGxlbmd0aDogbnVtYmVyLFxyXG4gICAgYWN0aW9uRGF0ZT86IERhdGUsXHJcbiAgKSB7XHJcbiAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcclxuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcclxuICAgIHRoaXMucGVyc29uID0gcGVyc29uO1xyXG4gICAgdGhpcy5wcm9qZWN0ID0gcHJvamVjdDtcclxuICAgIHRoaXMuYWN0aW9uRGF0ZSA9IGFjdGlvbkRhdGU7XHJcbiAgICB0aGlzLmlzU29tZWRheU1heWJlTm90ZSA9IGlzU29tZWRheU1heWJlTm90ZTtcclxuICAgIHRoaXMuaXNEaXNjdXNzV2l0aE5vdGUgPSBpc0Rpc2N1c3NXaXRoTm90ZTtcclxuICAgIHRoaXMuaXNXYWl0aW5nRm9yTm90ZSA9IGlzV2FpdGluZ0Zvck5vdGU7XHJcbiAgICB0aGlzLmlzUHJvbWlzZWRUb05vdGUgPSBpc1Byb21pc2VkVG9Ob3RlO1xyXG4gICAgdGhpcy5zb3VyY2VGaWxlUGF0aCA9IHNvdXJjZUZpbGVQYXRoO1xyXG4gICAgdGhpcy5zdGFydEluZGV4ID0gc3RhcnRJbmRleDtcclxuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgZW51bSBJY29uIHtcclxuICBJbmJveCxcclxuICBSZXZlYWwsXHJcbiAgU2NoZWR1bGVkLFxyXG4gIFNvbWVkYXksXHJcbiAgVG9kYXksXHJcbiAgU3Rha2Vob2xkZXIsXHJcbiAgQWdpbmcsXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBSZW5kZXJJY29uID0gKGljb246IEljb24sIHRpdGxlID0gJycsIGRlc2NyaXB0aW9uID0gJycpOiBIVE1MRWxlbWVudCA9PiB7XHJcbiAgY29uc3Qgc3ZnID0gc3ZnRm9ySWNvbihpY29uKSh0aXRsZSwgZGVzY3JpcHRpb24pO1xyXG4gIHJldHVybiBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHN2ZywgJ3RleHQveG1sJykuZG9jdW1lbnRFbGVtZW50O1xyXG59O1xyXG5cclxuY29uc3QgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xyXG5cclxuY29uc3Qgc3ZnRm9ySWNvbiA9IChpY29uOiBJY29uKTogKChhcmcwOiBzdHJpbmcsIGFyZzE6IHN0cmluZykgPT4gc3RyaW5nKSA9PiB7XHJcbiAgc3dpdGNoIChpY29uKSB7XHJcbiAgICBjYXNlIEljb24uSW5ib3g6XHJcbiAgICAgIHJldHVybiBpbmJveEljb247XHJcbiAgICBjYXNlIEljb24uUmV2ZWFsOlxyXG4gICAgICByZXR1cm4gcmV2ZWFsSWNvbjtcclxuICAgIGNhc2UgSWNvbi5TY2hlZHVsZWQ6XHJcbiAgICAgIHJldHVybiBzY2hlZHVsZWRJY29uO1xyXG4gICAgY2FzZSBJY29uLlNvbWVkYXk6XHJcbiAgICAgIHJldHVybiBzb21lZGF5SWNvbjtcclxuICAgIGNhc2UgSWNvbi5Ub2RheTpcclxuICAgICAgcmV0dXJuIHRvZGF5SWNvbjtcclxuICAgIGNhc2UgSWNvbi5TdGFrZWhvbGRlcjpcclxuICAgICAgcmV0dXJuIHN0YWtlaG9sZGVySWNvbjtcclxuICAgIGNhc2UgSWNvbi5BZ2luZzpcclxuICAgICAgcmV0dXJuIGFnaW5nSWNvbjtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBpbmJveEljb24gPSAodGl0bGU6IHN0cmluZywgZGVzY3JpcHRpb246IHN0cmluZyk6IHN0cmluZyA9PiBgXHJcbjxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIHdpZHRoPVwiMjRcIiBhcmlhLWxhYmVsPVwiJHt0aXRsZSArIGRlc2NyaXB0aW9ufVwiPlxyXG4gIDx0aXRsZT4ke3RpdGxlfTwvdGl0bGU+XHJcbiAgPGRlc2NyaXB0aW9uPiR7ZGVzY3JpcHRpb259PC9kZXNjcmlwdGlvbj5cclxuICA8cGF0aCBkPVwiTTAgMGgyNHYyNEgwVjB6XCIgZmlsbD1cIm5vbmVcIi8+XHJcbiAgPHBhdGggZD1cIk0xOSAzSDVjLTEuMSAwLTIgLjktMiAydjE0YzAgMS4xLjg5IDIgMiAyaDE0YzEuMSAwIDItLjkgMi0yVjVjMC0xLjEtLjktMi0yLTJ6bTAgMTZINXYtM2gzLjU2Yy42OSAxLjE5IDEuOTcgMiAzLjQ1IDJzMi43NS0uODEgMy40NS0ySDE5djN6bTAtNWgtNC45OWMwIDEuMS0uOSAyLTIgMnMtMi0uOS0yLTJINVY1aDE0djl6XCIvPlxyXG48L3N2Zz5cclxuYDtcclxuXHJcbmNvbnN0IHJldmVhbEljb24gPSAodGl0bGU6IHN0cmluZywgZGVzY3JpcHRpb246IHN0cmluZyk6IHN0cmluZyA9PiBgXHJcbjxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGVuYWJsZS1iYWNrZ3JvdW5kPVwibmV3IDAgMCAyNCAyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIHdpZHRoPVwiMjRcIiByb2xlPVwiaW1nXCIgYXJpYS1sYWJlbD1cIiR7XHJcbiAgdGl0bGUgKyBkZXNjcmlwdGlvblxyXG59XCI+XHJcbiAgPHRpdGxlPiR7dGl0bGV9PC90aXRsZT5cclxuICA8ZGVzY3JpcHRpb24+JHtkZXNjcmlwdGlvbn08L2Rlc2NyaXB0aW9uPlxyXG4gIDxyZWN0IGZpbGw9XCJub25lXCIgaGVpZ2h0PVwiMjRcIiB3aWR0aD1cIjI0XCIvPjxwYXRoIGQ9XCJNOSw1djJoNi41OUw0LDE4LjU5TDUuNDEsMjBMMTcsOC40MVYxNWgyVjVIOXpcIi8+XHJcbjwvc3ZnPlxyXG5gO1xyXG5cclxuY29uc3Qgc2NoZWR1bGVkSWNvbiA9ICh0aXRsZTogc3RyaW5nLCBkZXNjcmlwdGlvbjogc3RyaW5nKTogc3RyaW5nID0+IGBcclxuPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgd2lkdGg9XCIyNFwiIGFyaWEtbGFiZWw9XCIke3RpdGxlICsgZGVzY3JpcHRpb259XCI+XHJcbiAgPHRpdGxlPiR7dGl0bGV9PC90aXRsZT5cclxuICA8ZGVzY3JpcHRpb24+JHtkZXNjcmlwdGlvbn08L2Rlc2NyaXB0aW9uPlxyXG4gIDxwYXRoIGQ9XCJNMCAwaDI0djI0SDBWMHpcIiBmaWxsPVwibm9uZVwiLz5cclxuICA8cGF0aCBkPVwiTTIwIDNoLTFWMWgtMnYySDdWMUg1djJINGMtMS4xIDAtMiAuOS0yIDJ2MTZjMCAxLjEuOSAyIDIgMmgxNmMxLjEgMCAyLS45IDItMlY1YzAtMS4xLS45LTItMi0yem0wIDE4SDRWMTBoMTZ2MTF6bTAtMTNINFY1aDE2djN6XCIvPlxyXG48L3N2Zz5cclxuYDtcclxuXHJcbmNvbnN0IHNvbWVkYXlJY29uID0gKHRpdGxlOiBzdHJpbmcsIGRlc2NyaXB0aW9uOiBzdHJpbmcpOiBzdHJpbmcgPT4gYFxyXG48c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBlbmFibGUtYmFja2dyb3VuZD1cIm5ldyAwIDAgMjQgMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB3aWR0aD1cIjI0XCIgYXJpYS1sYWJlbD1cIiR7XHJcbiAgdGl0bGUgKyBkZXNjcmlwdGlvblxyXG59XCI+XHJcbiAgPHRpdGxlPiR7dGl0bGV9PC90aXRsZT5cclxuICA8ZGVzY3JpcHRpb24+JHtkZXNjcmlwdGlvbn08L2Rlc2NyaXB0aW9uPlxyXG4gIDxnPjxyZWN0IGZpbGw9XCJub25lXCIgaGVpZ2h0PVwiMjRcIiB3aWR0aD1cIjI0XCIvPjwvZz5cclxuICA8Zz48Zz48cGF0aCBkPVwiTTIwLDJINEMzLDIsMiwyLjksMiw0djMuMDFDMiw3LjczLDIuNDMsOC4zNSwzLDguN1YyMGMwLDEuMSwxLjEsMiwyLDJoMTRjMC45LDAsMi0wLjksMi0yVjguN2MwLjU3LTAuMzUsMS0wLjk3LDEtMS42OVY0IEMyMiwyLjksMjEsMiwyMCwyeiBNMTksMjBINVY5aDE0VjIweiBNMjAsN0g0VjRoMTZWN3pcIi8+PHJlY3QgaGVpZ2h0PVwiMlwiIHdpZHRoPVwiNlwiIHg9XCI5XCIgeT1cIjEyXCIvPjwvZz48L2c+XHJcbjwvc3ZnPlxyXG5gO1xyXG5cclxuY29uc3QgdG9kYXlJY29uID0gKHRpdGxlOiBzdHJpbmcsIGRlc2NyaXB0aW9uOiBzdHJpbmcpOiBzdHJpbmcgPT4gYFxyXG48c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB3aWR0aD1cIjI0XCIgYXJpYS1sYWJlbD1cIiR7dGl0bGUgKyBkZXNjcmlwdGlvbn1cIj5cclxuICA8dGl0bGU+JHt0aXRsZX08L3RpdGxlPlxyXG4gIDxkZXNjcmlwdGlvbj4ke2Rlc2NyaXB0aW9ufTwvZGVzY3JpcHRpb24+XHJcbiAgPHBhdGggZD1cIk0wIDBoMjR2MjRIMFYwelwiIGZpbGw9XCJub25lXCIvPlxyXG4gIDxwYXRoIGQ9XCJNMjIgOS4yNGwtNy4xOS0uNjJMMTIgMiA5LjE5IDguNjMgMiA5LjI0bDUuNDYgNC43M0w1LjgyIDIxIDEyIDE3LjI3IDE4LjE4IDIxbC0xLjYzLTcuMDNMMjIgOS4yNHpNMTIgMTUuNGwtMy43NiAyLjI3IDEtNC4yOC0zLjMyLTIuODggNC4zOC0uMzhMMTIgNi4xbDEuNzEgNC4wNCA0LjM4LjM4LTMuMzIgMi44OCAxIDQuMjhMMTIgMTUuNHpcIi8+XHJcbjwvc3ZnPlxyXG5gO1xyXG5cclxuY29uc3Qgc3Rha2Vob2xkZXJJY29uID0gKHRpdGxlOiBzdHJpbmcsIGRlc2NyaXB0aW9uOiBzdHJpbmcpOiBzdHJpbmcgPT4gYFxyXG48c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBlbmFibGUtYmFja2dyb3VuZD1cIm5ldyAwIDAgMTYgMjRcIiB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDE2IDI0XCIgYXJpYS1sYWJlbD1cIiR7dGl0bGUgKyBkZXNjcmlwdGlvbn1cIj5cclxuICA8dGl0bGU+JHt0aXRsZX08L3RpdGxlPlxyXG4gIDxkZXNjcmlwdGlvbj4ke2Rlc2NyaXB0aW9ufTwvZGVzY3JpcHRpb24+XHJcbiAgPHBhdGggZD1cIk0wIDBoMjR2MTZIMFYwelwiIGZpbGw9XCJub25lXCIvPlxyXG4gIDxwYXRoICBkPVwiTSAxMi4wNDE2MTcgMC4zNzkzOTUgQyAxNC43ODMwNzIgLTAuMzg1MjU0IDE3Ljg0NDU5NiAwLjY0ODQzOCAyMC4zMzU1NjMgMi4wMjE5NzMgQyAyMi44MjY1MjkgMy4zOTU1MDggMjUuNzA3MTQ1IDUuNzQ2MDk0IDI2Ljk3MzUwMiA4LjYwNjQ0NSBDIDI4LjIzOTg2IDExLjQ4MDk1NyAyOC45MjE3NDQgMTYuMTgyMTI5IDI3LjkzMzcwNyAxOS4yMjY1NjIgQyAyNi45NDU2NyAyMi4yNzA5OTYgMjMuNzQ0OTg2IDI1LjQ3MTE5MSAyMS4wNTkxOTUgMjYuOTAxMzY3IEMgMTguMzU5NDg4IDI4LjM0NTcwMyAxNC42ODU2NiAyOC42Mjg5MDYgMTEuNzc3MjEzIDI3Ljg2NDI1OCBDIDguODY4NzY2IDI3LjA5OTYwOSA1LjU4NDU4NiAyNC42MzU3NDIgMy41NjY3NjQgMjIuMjk5MzE2IEMgMS41NjI4NTggMTkuOTYyODkxIC0wLjI0NjIyNCAxNi45NjA5MzggLTAuMzAxODg5IDEzLjg3NDAyMyBDIC0wLjM1NzU1MyAxMC43ODcxMDkgMC44MTEzOTMgNi4xMjg0MTggMy4yMDQ5NDcgMy44MDYxNTIgQyA1LjU5ODUwMiAxLjQ4Mzg4NyAxMS44ODg1NDEgMC4zNzkzOTUgMTQuMDg3MjcyIC0wLjA3MzczMDUgQyAxNi4yOTk5MTggLTAuNTI2ODU1IDE2LjQ4MDgyNiAwLjc2MTcxOSAxNi40MzkwNzggMS4wNTkwODIgTSAxOC45MDIyMTMgLTAuMjAxMTcyIEMgMjEuNjI5NzUyIDAuMzA4NTk0IDI1LjQ4NDQ4OCAzLjYyMjA3IDI2Ljk0NTY3IDYuMzk3NDYxIEMgMjguNDIwNzY4IDkuMTcyODUyIDI4LjUzMjA5NiAxMy41MjAwMiAyNy42OTcxMzUgMTYuNDIyODUyIEMgMjYuODc2MDkgMTkuMzI1Njg0IDI0LjI0NTk2MyAyMi4xMDEwNzQgMjEuOTYzNzM2IDIzLjgxNDQ1MyBDIDE5LjY4MTUxIDI1LjUxMzY3MiAxNy4xMzQ4NzkgMjYuMzQ5MTIxIDE0LjAzMTYwOCAyNi42NjA2NDUgQyAxMC45NDIyNTIgMjYuOTU4MDA4IDUuODIxMTU4IDI3LjUyNDQxNCAzLjM4NTg1NiAyNS42NTUyNzMgQyAwLjk1MDU1MyAyMy44MDAyOTMgLTAuNTgwMjA5IDE4LjQ3NjA3NCAtMC41OTQxMjUgMTUuNDg4MjgxIEMgLTAuNjA4MDQxIDEyLjUwMDQ4OCAxLjcyOTg1IDEwLjAyMjQ2MSAzLjMwMjM2IDcuNzI4NTE2IEMgNC44NzQ4NjkgNS40MzQ1NyA2LjExMzM5NSAyLjk3MDcwMyA4Ljg0MDkzNCAxLjcyNDYwOSBDIDExLjU2ODQ3MyAwLjQ3ODUxNiAxOC4wNTMzMzYgMC4yMzc3OTMgMTkuNjM5NzYyIDAuMjM3NzkzIEMgMjEuMjI2MTg4IDAuMjIzNjMzIDE4LjUyNjQ4MSAxLjUxMjIwNyAxOC4zODczMiAxLjY5NjI4OSBcIiB0cmFuc2Zvcm09XCJtYXRyaXgoMC4yODA3MDIsMCwwLDAuMjc1ODYyLDMuMjM3MDg0LDIuNzU4NjIxKVwiLz5cclxuICA8cGF0aCAgZD1cIk0gLTAuMjYwODg0IC0xNy40OTc3MzEgQyAtMC42NjQ0NDkgLTIxLjIwNzY5MiAtMy40MDU5MDQgLTM0LjczMDY0MSAtMi43Nzk2ODMgLTM5Ljk0MTU3OCBDIC0yLjE1MzQ2MyAtNDUuMTUyNTE2IDAuMTE0ODQ4IC00Ni44OTQyMTUgMy40ODI1MjQgLTQ4Ljc0OTE5NiBDIDYuODUwMiAtNTAuNTkwMDE2IDEzLjA5ODQ5MSAtNTEuNDY3OTQ2IDE3LjQ0MDI4NyAtNTEuMDI4OTgxIEMgMjEuNzgyMDg0IC01MC41OTAwMTYgMjcuMDQyMzM4IC01MS42OTQ1MDggMjkuNTE5Mzg5IC00Ni4xMjk1NjcgQyAzMS45OTY0NCAtNDAuNTY0NjI1IDM3LjI0Mjc3OCAtMjIuNTk1Mzg3IDMyLjI3NDc2IC0xNy42MzkzMzIgQyAyNy4zMjA2NTkgLTEyLjY4MzI3OCA1LjEyNDYxNCAtMTYuNTA2NTIgLTAuMjQ2OTY4IC0xNi4zOTMyMzggTSAtMS41MTMzMjYgLTE4LjcyOTY2NCBDIC0xLjU1NTA3NCAtMjIuNzA4NjY4IC0xLjE5MzI1NyAtMzYuNzI3MjIzIC0wLjQ2OTYyNSAtNDEuNDk5MTk2IEMgMC4yNTQwMDggLTQ2LjI1NzAwOCAtMC4xMDc4MDggLTQ1Ljg4ODg0NCAyLjgxNDU1NSAtNDcuMjkwNjk5IEMgNS43MzY5MTggLTQ4LjY5MjU1NSAxMi4zMDUyNzggLTUwLjA5NDQxIDE3LjA5MjM4NyAtNDkuOTM4NjQ5IEMgMjEuODY1NTggLTQ5Ljc2ODcyNyAyOS4yNjg5MDEgLTUxLjUzODc0NiAzMS41MjMyOTUgLTQ2LjMxMzY0OSBDIDMzLjc3NzY5IC00MS4wODg1NTEgMzUuNzUzNzY0IC0yMy40MzA4MzYgMzAuNTkwOTIyIC0xOC42MDIyMjMgQyAyNS40NDE5OTYgLTEzLjc3MzYxIDUuODIwNDE0IC0xNy41ODI2OTIgMC42MDE5MDkgLTE3LjM1NjEyOSBcIiB0cmFuc2Zvcm09XCJtYXRyaXgoMC4yODA3MDIsMCwwLDAuMjc1ODYyLDMuNjEyMjkzLDI1LjM1MDM5OClcIi8+XHJcbjwvc3ZnPlxyXG5gO1xyXG5cclxuY29uc3QgYWdpbmdJY29uID0gKHRpdGxlOiBzdHJpbmcsIGRlc2NyaXB0aW9uOiBzdHJpbmcpOiBzdHJpbmcgPT4gYFxyXG48c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB3aWR0aD1cIjI0XCIgYXJpYS1sYWJlbD1cIiR7dGl0bGUgKyBkZXNjcmlwdGlvbn1cIj5cclxuICA8dGl0bGU+JHt0aXRsZX08L3RpdGxlPlxyXG4gIDxkZXNjcmlwdGlvbj4ke2Rlc2NyaXB0aW9ufTwvZGVzY3JpcHRpb24+XHJcbiAgPGcgaWQ9XCJzdXJmYWNlMVwiPlxyXG4gIDxwYXRoIHN0eWxlPVwiZmlsbC1ydWxlOmV2ZW5vZGQ7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlLXdpZHRoOjE2O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2U6cmdiKDAlLDAlLDAlKTtzdHJva2Utb3BhY2l0eToxO3N0cm9rZS1taXRlcmxpbWl0OjQ7XCIgZD1cIk0gMjU0LjMzMzMzMyA0NjEuMTY2NjY3IEMgMTI1IDI4My44MzMzMzMgMTcyLjgzMzMzMyAyMi4zMzMzMzMgNTE4LjUgMTguMzMzMzMzIEMgODY0LjY2NjY2NyAxNy42NjY2NjcgOTI0LjY2NjY2NyAyOTUuODMzMzMzIDc5Mi44MzMzMzMgNDQ5LjY2NjY2NyBDIDgwMS4zMzMzMzMgNTMxLjUgODAxLjUgNjAwLjMzMzMzMyA3MzguNSA2MTguMzMzMzMzIEMgNzEyLjgzMzMzMyA3MjYuMzMzMzMzIDcyMi41IDc5NC41IDcwNy4xNjY2NjcgODI5LjY2NjY2NyBDIDYzNS4zMzMzMzMgOTU2LjY2NjY2NyA0MTAuODMzMzMzIDk2Mi41IDM0MCA4MzEuMTY2NjY3IEMgMzIzLjY2NjY2NyA3OTAgMzM3LjUgNzIyLjUgMzA1LjY2NjY2NyA2MTIuMTY2NjY3IEMgMjYxLjgzMzMzMyA1OTUuMTY2NjY3IDI0OC44MzMzMzMgNTQyLjY2NjY2NyAyNTQuMzMzMzMzIDQ2MS4xNjY2NjcgWiBNIDI1NC4zMzMzMzMgMjM4LjMzMzMzMyBDIDIzNi42NjY2NjcgMjc5IDI0NS4xNjY2NjcgMzA1IDI2MS42NjY2NjcgMzQ4LjUgQyAyNzIgMzc1LjMzMzMzMyAyNTkuNSA0MjkuMTY2NjY3IDI1NC4zMzMzMzMgNDYxLjE2NjY2NyBNIDc5Ny4xNjY2NjcgMjM4LjMzMzMzMyBDIDgwOS41IDI2NCA4MDcuMTY2NjY3IDI4OS44MzMzMzMgNzkwLjE2NjY2NyAzNDIuMzMzMzMzIEMgNzc4LjUgMzcyLjgzMzMzMyA3OTAuMTY2NjY3IDQxOS4xNjY2NjcgNzkyLjgzMzMzMyA0NDkuNjY2NjY3IE0gMzk0LjUgNjkzLjgzMzMzMyBDIDM4NCA2NTguNjY2NjY3IDM0MiA2MjMuNSAzMDUuNjY2NjY3IDYxMi4xNjY2NjcgTSA2NTUuMzMzMzMzIDY5MiBDIDY3MiA2NTAgNjk0LjUgNjIwIDczOC41IDYxOC4zMzMzMzMgXCIgdHJhbnNmb3JtPVwibWF0cml4KDAuMDIzNDM3NSwwLDAsMC4wMjM0Mzc1LDAsMClcIi8+XHJcbiAgPHBhdGggc3R5bGU9XCJmaWxsOm5vbmU7c3Ryb2tlLXdpZHRoOjg7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZTpyZ2IoMCUsMCUsMCUpO3N0cm9rZS1vcGFjaXR5OjE7c3Ryb2tlLW1pdGVybGltaXQ6NDtcIiBkPVwiTSAzNDAgNjI2IEMgMzYxIDY3NCAzNzIuMzMzMzMzIDcyNS44MzMzMzMgMzgwIDc3OSBDIDQyOC4xNjY2NjcgODQwIDU5NC4xNjY2NjcgODU4IDY2NSA3NzYgQyA2NjkuODMzMzMzIDcyNS4xNjY2NjcgNjg3LjY2NjY2NyA2NzUuNjY2NjY3IDcwNCA2MjYgTCA2NTUuMzMzMzMzIDY5MiBDIDY0OS42NjY2NjcgNzMzLjE2NjY2NyA0MDIgNzMwLjUgMzk0LjUgNjkzLjgzMzMzMyBaIE0gNDAzLjUgNzk4IEwgNDAzLjUgNzA2IE0gNDMyIDgxNSBMIDQzMyA3MTQgTSA0NjIuNSA4MjIgTCA0NjMgNzE5IE0gNDkyLjUgODI3LjUgQyA0OTIuNSA4MjUuNSA0OTMgNzIxLjUgNDkzIDcyMS41IE0gNTIzLjUgODMxIEwgNTIzIDcyMi41IE0gNTU0LjUgODI3IEwgNTU0IDcyMiBNIDU4MyA4MjIuNSBMIDU4MiA3MTkgTSA2MTUuNSA4MTAuNSBMIDYxNCA3MTUgTSA2NDQgNzk0IEwgNjQzIDcwNS41IE0gNjQyIDc1MC41IEMgNTYwLjUgNzg2IDQ4Ny44MzMzMzMgNzg4LjUgNDA0IDc1MC41IFwiIHRyYW5zZm9ybT1cIm1hdHJpeCgwLjAyMzQzNzUsMCwwLDAuMDIzNDM3NSwwLDApXCIvPlxyXG4gIDxwYXRoIHN0eWxlPVwiIHN0cm9rZTpub25lO2ZpbGwtcnVsZTpldmVub2RkO2ZpbGw6cmdiKDAlLDAlLDAlKTtmaWxsLW9wYWNpdHk6MTtcIiBkPVwiTSA3LjI1IDkuNzg5MDYyIEMgNy4xMTMyODEgMTAuMjgxMjUgNy4yMDcwMzEgMTAuOTEwMTU2IDcuMzgyODEyIDExLjQ2MDkzOCBDIDcuNjA1NDY5IDEyLjE1MjM0NCA4LjEwNTQ2OSAxMi41NjY0MDYgOC45NTMxMjUgMTIuNjMyODEyIEMgOS45Mjk2ODggMTIuNjU2MjUgMTAuNTU0Njg4IDEyLjA4OTg0NCAxMC45Njg3NSAxMS4xNzk2ODggQyAxMS4wODIwMzEgMTAuOTA2MjUgMTEuMTU2MjUgMTAuNDQ1MzEyIDExLjAzOTA2MiA5LjkzNzUgQyAxMC45Njg3NSA5LjY3OTY4OCAxMC42NDQ1MzEgOS4yOTY4NzUgMTAuMzI4MTI1IDkuMTAxNTYyIEMgOS43NTM5MDYgOC43NTM5MDYgNy40NzI2NTYgOC45NDkyMTkgNy4yNSA5Ljc4OTA2MiBaIE0gMTcuMzM5ODQ0IDkuNzI2NTYyIEMgMTcuNDcyNjU2IDEwLjIxODc1IDE3LjM3ODkwNiAxMC44NDc2NTYgMTcuMjAzMTI1IDExLjM5ODQzOCBDIDE2Ljk4NDM3NSAxMi4wODk4NDQgMTYuNDgwNDY5IDEyLjUwMzkwNiAxNS42MzI4MTIgMTIuNTcwMzEyIEMgMTQuNjU2MjUgMTIuNTkzNzUgMTQuMDM1MTU2IDEyLjAyNzM0NCAxMy42MTcxODggMTEuMTE3MTg4IEMgMTMuNTAzOTA2IDEwLjg0Mzc1IDEzLjQyOTY4OCAxMC4zODI4MTIgMTMuNTQ2ODc1IDkuODc1IEMgMTMuNjE3MTg4IDkuNjE3MTg4IDEzLjk0MTQwNiA5LjIzNDM3NSAxNC4yNTc4MTIgOS4wMzUxNTYgQyAxNC44MzU5MzggOC42OTE0MDYgMTcuMTEzMjgxIDguODg2NzE5IDE3LjMzOTg0NCA5LjcyNjU2MiBaIE0gMTIuMDM1MTU2IDEyIEwgMTIuMDM1MTU2IDE0Ljc2NTYyNSBDIDExLjYyNSAxNS4zODY3MTkgMTEuNDg0Mzc1IDE1LjQzMzU5NCAxMS4yNSAxNS40MjE4NzUgQyAxMC45NDE0MDYgMTUuNDIxODc1IDEwLjczNDM3NSAxNC45NjQ4NDQgMTAuNzkyOTY5IDE0LjQzNzUgQyAxMC45NDUzMTIgMTIuNzY5NTMxIDExLjQ0OTIxOSAxMi40MjU3ODEgMTIuMDM1MTU2IDEyIFogTSAxMi40NTMxMjUgMTIuMDExNzE5IEwgMTIuNDUzMTI1IDE0Ljc3NzM0NCBDIDEyLjg2MzI4MSAxNS4zOTg0MzggMTMuMDAzOTA2IDE1LjQ0NTMxMiAxMy4yMzgyODEgMTUuNDMzNTk0IEMgMTMuNTQyOTY5IDE1LjQzMzU5NCAxMy43NSAxNC45NzY1NjIgMTMuNjk1MzEyIDE0LjQ0OTIxOSBDIDEzLjU0Mjk2OSAxMi43ODEyNSAxMy4wMzkwNjIgMTIuNDM3NSAxMi40NTMxMjUgMTIuMDExNzE5IFogTSAxMi40NTMxMjUgMTIuMDExNzE5IFwiLz5cclxuICA8L2c+XHJcbjwvc3ZnPlxyXG5gOyIsImltcG9ydCB7IEl0ZW1WaWV3LCBNYXJrZG93blJlbmRlcmVyLCBXb3Jrc3BhY2VMZWFmIH0gZnJvbSAnb2JzaWRpYW4nO1xyXG5pbXBvcnQgeyBWSUVXX1RZUEVfVE9ETyB9IGZyb20gJy4uL2NvbnN0YW50cyc7XHJcbmltcG9ydCB7IFRvZG9JdGVtLCBUb2RvSXRlbVN0YXR1cyB9IGZyb20gJy4uL21vZGVsL1RvZG9JdGVtJztcclxuaW1wb3J0IHsgUmVuZGVySWNvbiwgSWNvbiB9IGZyb20gJy4uL3VpL2ljb25zJztcclxuXHJcbmVudW0gVG9kb0l0ZW1WaWV3UGFuZSB7XHJcbiAgQWdpbmcsXHJcbiAgVG9kYXksXHJcbiAgU2NoZWR1bGVkLFxyXG4gIEluYm94LFxyXG4gIFNvbWVkYXksXHJcbiAgU3Rha2Vob2xkZXIsXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVG9kb0l0ZW1WaWV3UHJvcHMge1xyXG4gIHRvZG9zOiBUb2RvSXRlbVtdO1xyXG4gIG9wZW5GaWxlOiAoZmlsZVBhdGg6IHN0cmluZykgPT4gdm9pZDtcclxuICB0b2dnbGVUb2RvOiAodG9kbzogVG9kb0l0ZW0sIG5ld1N0YXR1czogVG9kb0l0ZW1TdGF0dXMpID0+IHZvaWQ7XHJcbn1cclxuXHJcbmludGVyZmFjZSBUb2RvSXRlbVZpZXdTdGF0ZSB7XHJcbiAgYWN0aXZlUGFuZTogVG9kb0l0ZW1WaWV3UGFuZTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRvZG9JdGVtVmlldyBleHRlbmRzIEl0ZW1WaWV3IHtcclxuICBwcml2YXRlIHByb3BzOiBUb2RvSXRlbVZpZXdQcm9wcztcclxuICBwcml2YXRlIHN0YXRlOiBUb2RvSXRlbVZpZXdTdGF0ZTtcclxuICBwcml2YXRlIGZpbHRlcjogc3RyaW5nO1xyXG4gIHByaXZhdGUgZmlsdGVyUmVnZXhwOiBSZWdFeHA7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGxlYWY6IFdvcmtzcGFjZUxlYWYsIHByb3BzOiBUb2RvSXRlbVZpZXdQcm9wcykge1xyXG4gICAgLy9kZWJ1Z2dlcjtcclxuICAgIHN1cGVyKGxlYWYpO1xyXG4gICAgdGhpcy5wcm9wcyA9IHByb3BzO1xyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgYWN0aXZlUGFuZTogVG9kb0l0ZW1WaWV3UGFuZS5Ub2RheSxcclxuICAgIH07XHJcbiAgICB0aGlzLmZpbHRlciA9ICcnO1xyXG4gIH1cclxuXHJcbiAgZ2V0Vmlld1R5cGUoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBWSUVXX1RZUEVfVE9ETztcclxuICB9XHJcblxyXG4gIGdldERpc3BsYXlUZXh0KCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gJ1RvZG8nO1xyXG4gIH1cclxuXHJcbiAgZ2V0SWNvbigpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuICdjaGVja21hcmsnO1xyXG4gIH1cclxuXHJcbiAgb25DbG9zZSgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzZXRQcm9wcyhzZXR0ZXI6IChjdXJyZW50UHJvcHM6IFRvZG9JdGVtVmlld1Byb3BzKSA9PiBUb2RvSXRlbVZpZXdQcm9wcyk6IHZvaWQge1xyXG4gICAgdGhpcy5wcm9wcyA9IHNldHRlcih0aGlzLnByb3BzKTtcclxuICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldFZpZXdTdGF0ZShuZXdTdGF0ZTogVG9kb0l0ZW1WaWV3U3RhdGUpIHtcclxuICAgIHRoaXMuc3RhdGUgPSBuZXdTdGF0ZTtcclxuICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldEZpbHRlcihmaWx0ZXI6IHN0cmluZykge1xyXG4gICAgdGhpcy5maWx0ZXIgPSBmaWx0ZXI7XHJcbiAgICB0aGlzLmZpbHRlclJlZ2V4cCA9IG5ldyBSZWdFeHAoZmlsdGVyLCdpJyk7XHJcbiAgICB0aGlzLnJlbmRlcigpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZW5kZXIoKTogdm9pZCB7XHJcbiAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLmNvbnRhaW5lckVsLmNoaWxkcmVuWzFdO1xyXG4gICAgY29udGFpbmVyLmVtcHR5KCk7XHJcbiAgICBjb250YWluZXIuY3JlYXRlRGl2KCd0b2RvLWl0ZW0tdmlldy1jb250YWluZXInLCAoZWwpID0+IHtcclxuICAgICAgZWwuY3JlYXRlRGl2KCd0b2RvLWl0ZW0tdmlldy1zZWFyY2gnLCAoZWwpID0+IHtcclxuICAgICAgICB0aGlzLnJlbmRlclNlYXJjaChlbCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBlbC5jcmVhdGVEaXYoJ3RvZG8taXRlbS12aWV3LXRvb2xiYXInLCAoZWwpID0+IHtcclxuICAgICAgICB0aGlzLnJlbmRlclRvb2xCYXIoZWwpO1xyXG4gICAgICB9KTtcclxuICAgICAgZWwuY3JlYXRlRGl2KCd0b2RvLWl0ZW0tdmlldy1pdGVtcycsIChlbCkgPT4ge1xyXG4gICAgICAgIHRoaXMucmVuZGVySXRlbXMoZWwpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZW5kZXJTZWFyY2goY29udGFpbmVyOiBIVE1MRGl2RWxlbWVudCkge1xyXG4gICAgY29udGFpbmVyLmNyZWF0ZUVsKCd0YWJsZScse30sKGVsKSA9PiB7XHJcbiAgICAgIGVsLmFkZENsYXNzKCd0b2RvLWZpbHRlci13cmFwcGVyJyk7XHJcbiAgICAgIGVsLmNyZWF0ZUVsKCd0cicsIHt9LCAoZWwpID0+IHtcclxuICAgICAgICBlbC5hZGRDbGFzcygndG9kby1maWx0ZXItcm93Jyk7XHJcbiAgICAgICAgZWwuY3JlYXRlRWwoJ3RkJywge30sIChlbCkgPT4ge1xyXG4gICAgICAgICAgZWwuYWRkQ2xhc3MoJ3RvZG8tZmlsdGVyLWNvbC1pbnB1dCcpO1xyXG4gICAgICAgICAgZWwuY3JlYXRlRWwoXCJpbnB1dFwiLCB7dmFsdWU6IHRoaXMuZmlsdGVyfSwgKGVsKSA9PiB7XHJcbiAgICAgICAgICAgIGVsLmFkZENsYXNzKCd0b2RvLWZpbHRlci1pbnB1dCcpO1xyXG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJywncHJvai9wZXJzb24gUmV4RXhwIGZpbHRlciwgY2FzZSBpbnNlbnNpdGl2ZScpO1xyXG4gICAgICAgICAgICBlbC5vbmNoYW5nZSA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5zZXRGaWx0ZXIoKDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0KS52YWx1ZSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBlbC5jcmVhdGVFbCgndGQnLHt9LCAoZWwpID0+IHtcclxuICAgICAgICAgIGVsLmFkZENsYXNzKCd0b2RvLWZpbHRlci1jb2wtYnV0dG9uJyk7XHJcbiAgICAgICAgICBlbC5jcmVhdGVFbChcImJ1dHRvblwiLCB7dGV4dDogXCJGaWx0ZXJcIn0sIChlbCkgPT4ge1xyXG4gICAgICAgICAgICBlbC5hZGRDbGFzcygndG9kby1maWx0ZXItYnV0dG9uJyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVuZGVyVG9vbEJhcihjb250YWluZXI6IEhUTUxEaXZFbGVtZW50KSB7XHJcbiAgICBjb25zdCBhY3RpdmVDbGFzcyA9IChwYW5lOiBUb2RvSXRlbVZpZXdQYW5lKSA9PiB7XHJcbiAgICAgIHJldHVybiBwYW5lID09PSB0aGlzLnN0YXRlLmFjdGl2ZVBhbmUgPyAnIGFjdGl2ZScgOiAnJztcclxuICAgIH07XHJcblxyXG4gICAgY29uc3Qgc2V0QWN0aXZlUGFuZSA9IChwYW5lOiBUb2RvSXRlbVZpZXdQYW5lKSA9PiB7XHJcbiAgICAgIGNvbnN0IG5ld1N0YXRlID0ge1xyXG4gICAgICAgIC4uLnRoaXMuc3RhdGUsXHJcbiAgICAgICAgYWN0aXZlUGFuZTogcGFuZSxcclxuICAgICAgfTtcclxuICAgICAgdGhpcy5zZXRWaWV3U3RhdGUobmV3U3RhdGUpO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb250YWluZXIuY3JlYXRlRGl2KGB0b2RvLWl0ZW0tdmlldy10b29sYmFyLWl0ZW0ke2FjdGl2ZUNsYXNzKFRvZG9JdGVtVmlld1BhbmUuQWdpbmcpfWAsIChlbCkgPT4ge1xyXG4gICAgICBlbC5hcHBlbmRDaGlsZChSZW5kZXJJY29uKEljb24uQWdpbmcsICdBZ2luZycpKTtcclxuICAgICAgZWwub25DbGlja0V2ZW50KCgpID0+IHNldEFjdGl2ZVBhbmUoVG9kb0l0ZW1WaWV3UGFuZS5BZ2luZykpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29udGFpbmVyLmNyZWF0ZURpdihgdG9kby1pdGVtLXZpZXctdG9vbGJhci1pdGVtJHthY3RpdmVDbGFzcyhUb2RvSXRlbVZpZXdQYW5lLlRvZGF5KX1gLCAoZWwpID0+IHtcclxuICAgICAgZWwuYXBwZW5kQ2hpbGQoUmVuZGVySWNvbihJY29uLlRvZGF5LCAnVG9kYXknKSk7XHJcbiAgICAgIGVsLm9uQ2xpY2tFdmVudCgoKSA9PiBzZXRBY3RpdmVQYW5lKFRvZG9JdGVtVmlld1BhbmUuVG9kYXkpKTtcclxuICAgIH0pO1xyXG4gICAgY29udGFpbmVyLmNyZWF0ZURpdihgdG9kby1pdGVtLXZpZXctdG9vbGJhci1pdGVtJHthY3RpdmVDbGFzcyhUb2RvSXRlbVZpZXdQYW5lLlNjaGVkdWxlZCl9YCwgKGVsKSA9PiB7XHJcbiAgICAgIGVsLmFwcGVuZENoaWxkKFJlbmRlckljb24oSWNvbi5TY2hlZHVsZWQsICdTY2hlZHVsZWQnKSk7XHJcbiAgICAgIGVsLm9uQ2xpY2tFdmVudCgoKSA9PiBzZXRBY3RpdmVQYW5lKFRvZG9JdGVtVmlld1BhbmUuU2NoZWR1bGVkKSk7XHJcbiAgICB9KTtcclxuICAgIGNvbnRhaW5lci5jcmVhdGVEaXYoYHRvZG8taXRlbS12aWV3LXRvb2xiYXItaXRlbSR7YWN0aXZlQ2xhc3MoVG9kb0l0ZW1WaWV3UGFuZS5JbmJveCl9YCwgKGVsKSA9PiB7XHJcbiAgICAgIGVsLmFwcGVuZENoaWxkKFJlbmRlckljb24oSWNvbi5JbmJveCwgJ0luYm94JykpO1xyXG4gICAgICBlbC5vbkNsaWNrRXZlbnQoKCkgPT4gc2V0QWN0aXZlUGFuZShUb2RvSXRlbVZpZXdQYW5lLkluYm94KSk7XHJcbiAgICB9KTtcclxuICAgIGNvbnRhaW5lci5jcmVhdGVEaXYoYHRvZG8taXRlbS12aWV3LXRvb2xiYXItaXRlbSR7YWN0aXZlQ2xhc3MoVG9kb0l0ZW1WaWV3UGFuZS5Tb21lZGF5KX1gLCAoZWwpID0+IHtcclxuICAgICAgZWwuYXBwZW5kQ2hpbGQoUmVuZGVySWNvbihJY29uLlNvbWVkYXksICdTb21lZGF5IC8gTWF5YmUnKSk7XHJcbiAgICAgIGVsLm9uQ2xpY2tFdmVudCgoKSA9PiBzZXRBY3RpdmVQYW5lKFRvZG9JdGVtVmlld1BhbmUuU29tZWRheSkpO1xyXG4gICAgfSk7XHJcbiAgICBjb250YWluZXIuY3JlYXRlRGl2KGB0b2RvLWl0ZW0tdmlldy10b29sYmFyLWl0ZW0ke2FjdGl2ZUNsYXNzKFRvZG9JdGVtVmlld1BhbmUuU3Rha2Vob2xkZXIpfWAsIChlbCkgPT4ge1xyXG4gICAgICBlbC5hcHBlbmRDaGlsZChSZW5kZXJJY29uKEljb24uU3Rha2Vob2xkZXIsICdTdGFrZWhvbGRlciBhY3Rpb25zJykpO1xyXG4gICAgICBlbC5vbkNsaWNrRXZlbnQoKCkgPT4gc2V0QWN0aXZlUGFuZShUb2RvSXRlbVZpZXdQYW5lLlN0YWtlaG9sZGVyKSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVuZGVySXRlbXMoY29udGFpbmVyOiBIVE1MRGl2RWxlbWVudCkge1xyXG4gICAgY29uc3QgdG9kb3NUb1JlbmRlciA9IHRoaXMucHJvcHMudG9kb3NcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIodGhpcy5maWx0ZXJGb3JTdGF0ZSwgdGhpcylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zb3J0KHRoaXMuc29ydEJ5QWN0aW9uRGF0ZSk7XHJcbiAgICB0b2Rvc1RvUmVuZGVyXHJcbiAgICAgIC5mb3JFYWNoKCh0b2RvLGluZGV4KSA9PiB7XHJcbiAgICAgICAgaWYoaW5kZXg+MCkge1xyXG4gICAgICAgICAgaWYoKHRvZG8uaXNXYWl0aW5nRm9yTm90ZSAmJiB0b2Rvc1RvUmVuZGVyW2luZGV4LTFdLmlzRGlzY3Vzc1dpdGhOb3RlKSB8fCBcclxuICAgICAgICAgICAgICh0b2RvLmlzUHJvbWlzZWRUb05vdGUgJiYgKHRvZG9zVG9SZW5kZXJbaW5kZXgtMV0uaXNXYWl0aW5nRm9yTm90ZSB8fCB0b2Rvc1RvUmVuZGVyW2luZGV4LTFdLmlzRGlzY3Vzc1dpdGhOb3RlKSkpIHtcclxuICAgICAgICAgICAgY29udGFpbmVyLmNyZWF0ZUVsKCdocicsIHt9ICwoZWwpID0+IHtcclxuICAgICAgICAgICAgICBlbC5hZGRDbGFzcygndG9kby1pdGVtLXZpZXctZGl2aWRlcicpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IFxyXG4gICAgICAgIGNvbnRhaW5lci5jcmVhdGVEaXYoJ3RvZG8taXRlbS12aWV3LWl0ZW0nLCAoZWwpID0+IHtcclxuICAgICAgICAgIGVsLmNyZWF0ZURpdigndG9kby1pdGVtLXZpZXctaXRlbS1jaGVja2JveCcsIChlbCkgPT4ge1xyXG4gICAgICAgICAgICBlbC5jcmVhdGVFbCgnaW5wdXQnLCB7IHR5cGU6ICdjaGVja2JveCcgfSwgKGVsKSA9PiB7XHJcbiAgICAgICAgICAgICAgZWwuY2hlY2tlZCA9IHRvZG8uc3RhdHVzID09PSBUb2RvSXRlbVN0YXR1cy5Eb25lO1xyXG4gICAgICAgICAgICAgIGVsLm9uQ2xpY2tFdmVudCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZVRvZG8odG9kbyk7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBlbC5jcmVhdGVEaXYoJ3RvZG8taXRlbS12aWV3LWl0ZW0tZGVzY3JpcHRpb24nLCAoZWwpID0+IHtcclxuICAgICAgICAgICAgTWFya2Rvd25SZW5kZXJlci5yZW5kZXJNYXJrZG93bih0b2RvLmRlc2NyaXB0aW9uLCBlbCwgdG9kby5zb3VyY2VGaWxlUGF0aCwgdGhpcyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGVsLmNyZWF0ZURpdigndG9kby1pdGVtLXZpZXctaXRlbS1saW5rJywgKGVsKSA9PiB7XHJcbiAgICAgICAgICAgIGVsLmFwcGVuZENoaWxkKFJlbmRlckljb24oSWNvbi5SZXZlYWwsICdPcGVuIGZpbGUnKSk7XHJcbiAgICAgICAgICAgIGVsLm9uQ2xpY2tFdmVudCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5vcGVuRmlsZSh0b2RvKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGZpbHRlckZvclN0YXRlKHZhbHVlOiBUb2RvSXRlbSwgX2luZGV4OiBudW1iZXIsIF9hcnJheTogVG9kb0l0ZW1bXSk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgaXNQZXJzb25NYXRjaCA9IHZhbHVlLnBlcnNvbi5tYXRjaCh0aGlzLmZpbHRlclJlZ2V4cCkgIT0gbnVsbDsgXHJcbiAgICBjb25zdCBpc1Byb2plY3RNYXRjaCA9IHZhbHVlLnByb2plY3QubWF0Y2godGhpcy5maWx0ZXJSZWdleHApICE9IG51bGw7XHJcbiAgICBjb25zdCBpc0ZpbHRlclNldCA9IHRoaXMuZmlsdGVyIT1cIlwiO1xyXG4gICAgaWYgKCFpc0ZpbHRlclNldCB8fCBpc1BlcnNvbk1hdGNoIHx8IGlzUHJvamVjdE1hdGNoKSB7XHJcbiAgICAgIGNvbnN0IGlzVG9kYXkgPSAoZGF0ZTogRGF0ZSkgPT4ge1xyXG4gICAgICAgIGxldCB0b2RheSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgIGRhdGUuZ2V0RGF0ZSgpID09IHRvZGF5LmdldERhdGUoKSAmJlxyXG4gICAgICAgICAgZGF0ZS5nZXRNb250aCgpID09IHRvZGF5LmdldE1vbnRoKCkgJiZcclxuICAgICAgICAgIGRhdGUuZ2V0RnVsbFllYXIoKSA9PSB0b2RheS5nZXRGdWxsWWVhcigpXHJcbiAgICAgICAgKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGNvbnN0IGlzQmVmb3JlVG9kYXkgPSAoZGF0ZTogRGF0ZSkgPT4ge1xyXG4gICAgICAgIGxldCB0b2RheSA9IChuZXcgRGF0ZSgpKVxyXG4gICAgICAgIHRvZGF5LnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgICAgIHJldHVybiBkYXRlIDwgdG9kYXk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjb25zdCBpc0FnaW5nTm90ZSA9IHZhbHVlLmFjdGlvbkRhdGUgJiYgaXNCZWZvcmVUb2RheSh2YWx1ZS5hY3Rpb25EYXRlKTtcclxuICAgICAgY29uc3QgaXNUb2RheU5vdGUgPSB2YWx1ZS5hY3Rpb25EYXRlICYmIGlzVG9kYXkodmFsdWUuYWN0aW9uRGF0ZSk7XHJcbiAgICAgIGNvbnN0IGlzU2NoZWR1bGVkTm90ZSA9ICF2YWx1ZS5pc1NvbWVkYXlNYXliZU5vdGUgJiYgdmFsdWUuYWN0aW9uRGF0ZSAmJiAhaXNUb2RheU5vdGUgJiYgIWlzQWdpbmdOb3RlO1xyXG5cclxuICAgICAgc3dpdGNoICh0aGlzLnN0YXRlLmFjdGl2ZVBhbmUpIHtcclxuICAgICAgICBjYXNlIFRvZG9JdGVtVmlld1BhbmUuSW5ib3g6XHJcbiAgICAgICAgICByZXR1cm4gIXZhbHVlLmlzU29tZWRheU1heWJlTm90ZSAmJiAhaXNUb2RheU5vdGUgJiYgIWlzU2NoZWR1bGVkTm90ZSAmJiAhaXNBZ2luZ05vdGU7XHJcbiAgICAgICAgY2FzZSBUb2RvSXRlbVZpZXdQYW5lLlNjaGVkdWxlZDpcclxuICAgICAgICAgIHJldHVybiBpc1NjaGVkdWxlZE5vdGU7XHJcbiAgICAgICAgY2FzZSBUb2RvSXRlbVZpZXdQYW5lLlNvbWVkYXk6XHJcbiAgICAgICAgICByZXR1cm4gdmFsdWUuaXNTb21lZGF5TWF5YmVOb3RlO1xyXG4gICAgICAgIGNhc2UgVG9kb0l0ZW1WaWV3UGFuZS5Ub2RheTpcclxuICAgICAgICAgIHJldHVybiBpc1RvZGF5Tm90ZTtcclxuICAgICAgICBjYXNlIFRvZG9JdGVtVmlld1BhbmUuQWdpbmc6XHJcbiAgICAgICAgICAgIHJldHVybiBpc0FnaW5nTm90ZTtcclxuICAgICAgICBjYXNlIFRvZG9JdGVtVmlld1BhbmUuU3Rha2Vob2xkZXI6XHJcbiAgICAgICAgICByZXR1cm4gaXNGaWx0ZXJTZXQ7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNvcnRCeUFjdGlvbkRhdGUoYTogVG9kb0l0ZW0sIGI6IFRvZG9JdGVtKTogbnVtYmVyIHtcclxuICAgIGlmICghYS5hY3Rpb25EYXRlICYmICFiLmFjdGlvbkRhdGUpIHtcclxuICAgICAgaWYgKGEuaXNEaXNjdXNzV2l0aE5vdGUgJiYgIWIuaXNEaXNjdXNzV2l0aE5vdGUpIHtcclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGEuaXNXYWl0aW5nRm9yTm90ZSAmJiAhYi5pc0Rpc2N1c3NXaXRoTm90ZSAmJiAhYi5pc1dhaXRpbmdGb3JOb3RlKSB7XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChhLmlzUHJvbWlzZWRUb05vdGUgJiYgIWIuaXNEaXNjdXNzV2l0aE5vdGUgJiYgIWIuaXNXYWl0aW5nRm9yTm90ZSkge1xyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoYi5pc0Rpc2N1c3NXaXRoTm90ZSAmJiAhYS5pc0Rpc2N1c3NXaXRoTm90ZSkge1xyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChiLmlzV2FpdGluZ0Zvck5vdGUgJiYgIWEuaXNEaXNjdXNzV2l0aE5vdGUgJiYgIWEuaXNXYWl0aW5nRm9yTm90ZSkge1xyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChiLmlzUHJvbWlzZWRUb05vdGUgJiYgIWEuaXNEaXNjdXNzV2l0aE5vdGUgJiYgIWEuaXNXYWl0aW5nRm9yTm90ZSkge1xyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgICB9ICAgICBcclxuXHJcbiAgICAgIGlmIChhLmlzU29tZWRheU1heWJlTm90ZSAmJiAhYi5pc1NvbWVkYXlNYXliZU5vdGUpIHtcclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFhLmlzU29tZWRheU1heWJlTm90ZSAmJiBiLmlzU29tZWRheU1heWJlTm90ZSkge1xyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGEuYWN0aW9uRGF0ZSA8IGIuYWN0aW9uRGF0ZSA/IC0xIDogYS5hY3Rpb25EYXRlID4gYi5hY3Rpb25EYXRlID8gMSA6IDA7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHRvZ2dsZVRvZG8odG9kbzogVG9kb0l0ZW0pOiB2b2lkIHtcclxuICAgIHRoaXMucHJvcHMudG9nZ2xlVG9kbyh0b2RvLCBUb2RvSXRlbVN0YXR1cy50b2dnbGVTdGF0dXModG9kby5zdGF0dXMpKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgb3BlbkZpbGUodG9kbzogVG9kb0l0ZW0pOiB2b2lkIHtcclxuICAgIHRoaXMucHJvcHMub3BlbkZpbGUodG9kby5zb3VyY2VGaWxlUGF0aCk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IFRvZG9JdGVtLCBUb2RvSXRlbVN0YXR1cyB9IGZyb20gJy4uL21vZGVsL1RvZG9JdGVtJztcclxuaW1wb3J0IHsgVG9kb0l0ZW1JbmRleFByb3BzfSBmcm9tICcuLi9tb2RlbC9Ub2RvSW5kZXgnXHJcblxyXG5leHBvcnQgY2xhc3MgVG9kb1BhcnNlciB7XHJcbiAgcHJvcHM6IFRvZG9JdGVtSW5kZXhQcm9wcztcclxuXHJcbiAgY29uc3RydWN0b3IocHJvcHM6IFRvZG9JdGVtSW5kZXhQcm9wcykge1xyXG4gICAgdGhpcy5wcm9wcyA9IHByb3BzO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgcGFyc2VUYXNrcyhmaWxlUGF0aDogc3RyaW5nLCBmaWxlQ29udGVudHM6IHN0cmluZyk6IFByb21pc2U8VG9kb0l0ZW1bXT4ge1xyXG4gICAgY29uc3QgcGF0dGVybiA9IC8oLXxcXCopIFxcWyhcXHN8eCk/XFxdXFxzKC4qKS9nO1xyXG4gICAgcmV0dXJuIFsuLi5maWxlQ29udGVudHMubWF0Y2hBbGwocGF0dGVybildLm1hcCgodGFzaykgPT4gdGhpcy5wYXJzZVRhc2soZmlsZVBhdGgsIHRhc2spKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcGFyc2VUYXNrKGZpbGVQYXRoOiBzdHJpbmcsIGVudHJ5OiBSZWdFeHBNYXRjaEFycmF5KTogVG9kb0l0ZW0ge1xyXG4gICAgLy9kZWJ1Z2dlcjtcclxuICAgIGNvbnN0IHRvZG9JdGVtT2Zmc2V0ID0gMjsgLy8gU3RyaXAgb2ZmIGAtfCogYFxyXG4gICAgY29uc3Qgc3RhdHVzID0gZW50cnlbMl0gPT09ICd4JyA/IFRvZG9JdGVtU3RhdHVzLkRvbmUgOiBUb2RvSXRlbVN0YXR1cy5Ub2RvO1xyXG4gICAgY29uc3QgZGVzY3JpcHRpb24gPSBlbnRyeVszXTtcclxuXHJcbiAgICBjb25zdCBkYXRlTWF0Y2hlcyA9IGRlc2NyaXB0aW9uLm1hdGNoKHRoaXMucHJvcHMuZGF0ZVJlZ2V4cCk7XHJcbiAgICBjb25zdCBhY3Rpb25EYXRlID0gZGF0ZU1hdGNoZXMgIT0gbnVsbCA/IG5ldyBEYXRlKGRhdGVNYXRjaGVzWzFdKSA6IHVuZGVmaW5lZDtcclxuXHJcbiAgICBjb25zdCBwZXJzb25NYXRjaGVzID0gZGVzY3JpcHRpb24ubWF0Y2godGhpcy5wcm9wcy5wZXJzb25SZWdleHApO1xyXG4gICAgY29uc3QgcGVyc29uID0gcGVyc29uTWF0Y2hlcyAhPSBudWxsID8gcGVyc29uTWF0Y2hlc1sxXSA6IFwiXCI7XHJcblxyXG4gICAgY29uc3QgcHJvamVjdE1hdGNoZXMgPSBkZXNjcmlwdGlvbi5tYXRjaCh0aGlzLnByb3BzLnByb2plY3RSZWdleHApO1xyXG4gICAgY29uc3QgcHJvamVjdCA9IHByb2plY3RNYXRjaGVzICE9IG51bGwgPyBwcm9qZWN0TWF0Y2hlc1sxXSA6IFwiXCI7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBUb2RvSXRlbShcclxuICAgICAgc3RhdHVzLFxyXG4gICAgICBkZXNjcmlwdGlvbixcclxuICAgICAgcGVyc29uLFxyXG4gICAgICBwcm9qZWN0LFxyXG4gICAgICBkZXNjcmlwdGlvbi5tYXRjaCh0aGlzLnByb3BzLnNvbWVkYXlNYXliZVJlZ2V4cCkgIT0gbnVsbCxcclxuICAgICAgZGVzY3JpcHRpb24ubWF0Y2godGhpcy5wcm9wcy5kaXNjdXNzV2l0aFJlZ2V4cCkgIT0gbnVsbCxcclxuICAgICAgZGVzY3JpcHRpb24ubWF0Y2godGhpcy5wcm9wcy53YWl0aW5nRm9yUmVnZXhwKSAhPSBudWxsLFxyXG4gICAgICBkZXNjcmlwdGlvbi5tYXRjaCh0aGlzLnByb3BzLnByb21pc2VkVG9SZWdleHApICE9IG51bGwsXHJcbiAgICAgIGZpbGVQYXRoLFxyXG4gICAgICAoZW50cnkuaW5kZXggPz8gMCkgKyB0b2RvSXRlbU9mZnNldCxcclxuICAgICAgZW50cnlbMF0ubGVuZ3RoIC0gdG9kb0l0ZW1PZmZzZXQsXHJcbiAgICAgIGFjdGlvbkRhdGUsXHJcbiAgICApO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBUQWJzdHJhY3RGaWxlLCBURmlsZSwgVmF1bHQgfSBmcm9tICdvYnNpZGlhbic7XHJcbmltcG9ydCB7IFRvZG9JdGVtLCBUb2RvSXRlbVN0YXR1cyB9IGZyb20gJy4uL21vZGVsL1RvZG9JdGVtJztcclxuaW1wb3J0IHsgVG9kb1BhcnNlciB9IGZyb20gJy4uL21vZGVsL1RvZG9QYXJzZXInO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBUb2RvSXRlbUluZGV4UHJvcHMge1xyXG4gIHBlcnNvblJlZ2V4cDogICAgICAgUmVnRXhwO1xyXG4gIHByb2plY3RSZWdleHA6ICAgICAgUmVnRXhwO1xyXG4gIGRhdGVSZWdleHA6ICAgICAgICAgUmVnRXhwO1xyXG4gIGRpc2N1c3NXaXRoUmVnZXhwOiAgUmVnRXhwO1xyXG4gIHdhaXRpbmdGb3JSZWdleHA6ICAgUmVnRXhwO1xyXG4gIHByb21pc2VkVG9SZWdleHA6ICAgUmVnRXhwO1xyXG4gIHNvbWVkYXlNYXliZVJlZ2V4cDogUmVnRXhwO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVG9kb0luZGV4IHtcclxuICBwcml2YXRlIHZhdWx0OiBWYXVsdDtcclxuICBwcml2YXRlIHRvZG9zOiBNYXA8c3RyaW5nLCBUb2RvSXRlbVtdPjtcclxuICBwcml2YXRlIGxpc3RlbmVyczogKCh0b2RvczogVG9kb0l0ZW1bXSkgPT4gdm9pZClbXTtcclxuICBwcml2YXRlIHByb3BzOiBUb2RvSXRlbUluZGV4UHJvcHM7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHZhdWx0OiBWYXVsdCwgbGlzdGVuZXI6ICh0b2RvczogVG9kb0l0ZW1bXSkgPT4gdm9pZCwgcHJvcHM6IFRvZG9JdGVtSW5kZXhQcm9wcykge1xyXG4gICAgdGhpcy5wcm9wcyA9IHByb3BzO1xyXG4gICAgdGhpcy52YXVsdCA9IHZhdWx0O1xyXG4gICAgdGhpcy50b2RvcyA9IG5ldyBNYXA8c3RyaW5nLCBUb2RvSXRlbVtdPigpO1xyXG4gICAgdGhpcy5saXN0ZW5lcnMgPSBbbGlzdGVuZXJdO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgaW5pdGlhbGl6ZSgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIC8vIFRPRE86IHBlcnNpc3QgaW5kZXggJiBsYXN0IHN5bmMgdGltZXN0YW1wOyBvbmx5IHBhcnNlIGZpbGVzIHRoYXQgY2hhbmdlZCBzaW5jZSB0aGVuLlxyXG4gICAgY29uc3QgdG9kb01hcCA9IG5ldyBNYXA8c3RyaW5nLCBUb2RvSXRlbVtdPigpO1xyXG4gICAgbGV0IG51bWJlck9mVG9kb3MgPSAwO1xyXG4gICAgY29uc3QgdGltZVN0YXJ0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcblxyXG4gICAgY29uc3QgbWFya2Rvd25GaWxlcyA9IHRoaXMudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpO1xyXG4gICAgZm9yIChjb25zdCBmaWxlIG9mIG1hcmtkb3duRmlsZXMpIHtcclxuICAgICAgY29uc3QgdG9kb3MgPSBhd2FpdCB0aGlzLnBhcnNlVG9kb3NJbkZpbGUoZmlsZSk7XHJcbiAgICAgIG51bWJlck9mVG9kb3MgKz0gdG9kb3MubGVuZ3RoO1xyXG4gICAgICBpZiAodG9kb3MubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHRvZG9NYXAuc2V0KGZpbGUucGF0aCwgdG9kb3MpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdG90YWxUaW1lTXMgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHRpbWVTdGFydDtcclxuICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICBgW29ic2lkaWFuLXN0YWtlaG9sZGVyX2FjdGlvbi1wbHVnaW5dIFBhcnNlZCAke251bWJlck9mVG9kb3N9IFRPRE9zIGZyb20gJHttYXJrZG93bkZpbGVzLmxlbmd0aH0gbWFya2Rvd24gZmlsZXMgaW4gKCR7XHJcbiAgICAgICAgdG90YWxUaW1lTXMgLyAxMDAwLjBcclxuICAgICAgfXMpYCxcclxuICAgICk7XHJcbiAgICB0aGlzLnRvZG9zID0gdG9kb01hcDtcclxuICAgIHRoaXMucmVnaXN0ZXJFdmVudEhhbmRsZXJzKCk7XHJcbiAgICB0aGlzLmludm9rZUxpc3RlbmVycygpO1xyXG4gIH1cclxuXHJcbiAgc2V0U3RhdHVzKHRvZG86IFRvZG9JdGVtLCBuZXdTdGF0dXM6IFRvZG9JdGVtU3RhdHVzKTogdm9pZCB7XHJcbiAgICBjb25zdCBmaWxlID0gdGhpcy52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgodG9kby5zb3VyY2VGaWxlUGF0aCkgYXMgVEZpbGU7XHJcbiAgICBjb25zdCBmaWxlQ29udGVudHMgPSB0aGlzLnZhdWx0LnJlYWQoZmlsZSk7XHJcbiAgICBmaWxlQ29udGVudHMudGhlbigoYzogc3RyaW5nKSA9PiB7XHJcbiAgICAgIGNvbnN0IG5ld1RvZG8gPSBgWyR7bmV3U3RhdHVzID09PSBUb2RvSXRlbVN0YXR1cy5Eb25lID8gJ3gnIDogJyAnfV0gJHt0b2RvLmRlc2NyaXB0aW9ufWA7XHJcbiAgICAgIGNvbnN0IG5ld0NvbnRlbnRzID0gYy5zdWJzdHJpbmcoMCwgdG9kby5zdGFydEluZGV4KSArIG5ld1RvZG8gKyBjLnN1YnN0cmluZyh0b2RvLnN0YXJ0SW5kZXggKyB0b2RvLmxlbmd0aCk7XHJcbiAgICAgIHRoaXMudmF1bHQubW9kaWZ5KGZpbGUsIG5ld0NvbnRlbnRzKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpbmRleEFic3RyYWN0RmlsZShmaWxlOiBUQWJzdHJhY3RGaWxlKSB7XHJcbiAgICBpZiAoIShmaWxlIGluc3RhbmNlb2YgVEZpbGUpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuaW5kZXhGaWxlKGZpbGUgYXMgVEZpbGUpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpbmRleEZpbGUoZmlsZTogVEZpbGUpIHtcclxuICAgIHRoaXMucGFyc2VUb2Rvc0luRmlsZShmaWxlKS50aGVuKCh0b2RvcykgPT4ge1xyXG4gICAgICB0aGlzLnRvZG9zLnNldChmaWxlLnBhdGgsIHRvZG9zKTtcclxuICAgICAgdGhpcy5pbnZva2VMaXN0ZW5lcnMoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjbGVhckluZGV4KHBhdGg6IHN0cmluZywgc2lsZW50ID0gZmFsc2UpIHtcclxuICAgIHRoaXMudG9kb3MuZGVsZXRlKHBhdGgpO1xyXG4gICAgaWYgKCFzaWxlbnQpIHtcclxuICAgICAgdGhpcy5pbnZva2VMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBzZXRQcm9wcyhzZXR0ZXI6IChjdXJyZW50UHJvcHM6IFRvZG9JdGVtSW5kZXhQcm9wcykgPT4gVG9kb0l0ZW1JbmRleFByb3BzKTogdm9pZCB7XHJcbiAgICB0aGlzLnByb3BzID0gc2V0dGVyKHRoaXMucHJvcHMpO1xyXG4gICAgLy9kbyBJIG5lZWQgdG8gZG8gYW55dGhpbmcgZWxzZT8/XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIHBhcnNlVG9kb3NJbkZpbGUoZmlsZTogVEZpbGUpOiBQcm9taXNlPFRvZG9JdGVtW10+IHtcclxuICAgIC8vIFRPRE86IERvZXMgaXQgbWFrZSBzZW5zZSB0byBpbmRleCBjb21wbGV0ZWQgVE9ET3MgYXQgYWxsP1xyXG4gICAgY29uc3QgdG9kb1BhcnNlciA9IG5ldyBUb2RvUGFyc2VyKHRoaXMucHJvcHMpO1xyXG4gICAgY29uc3QgZmlsZUNvbnRlbnRzID0gYXdhaXQgdGhpcy52YXVsdC5jYWNoZWRSZWFkKGZpbGUpO1xyXG4gICAgcmV0dXJuIHRvZG9QYXJzZXJcclxuICAgICAgLnBhcnNlVGFza3MoZmlsZS5wYXRoLCBmaWxlQ29udGVudHMpXHJcbiAgICAgIC50aGVuKCh0b2RvcykgPT4gdG9kb3MuZmlsdGVyKCh0b2RvKSA9PiB0b2RvLnN0YXR1cyA9PT0gVG9kb0l0ZW1TdGF0dXMuVG9kbykpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWdpc3RlckV2ZW50SGFuZGxlcnMoKSB7XHJcbiAgICB0aGlzLnZhdWx0Lm9uKCdjcmVhdGUnLCAoZmlsZTogVEFic3RyYWN0RmlsZSkgPT4ge1xyXG4gICAgICB0aGlzLmluZGV4QWJzdHJhY3RGaWxlKGZpbGUpO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLnZhdWx0Lm9uKCdtb2RpZnknLCAoZmlsZTogVEFic3RyYWN0RmlsZSkgPT4ge1xyXG4gICAgICB0aGlzLmluZGV4QWJzdHJhY3RGaWxlKGZpbGUpO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLnZhdWx0Lm9uKCdkZWxldGUnLCAoZmlsZTogVEFic3RyYWN0RmlsZSkgPT4ge1xyXG4gICAgICB0aGlzLmNsZWFySW5kZXgoZmlsZS5wYXRoKTtcclxuICAgIH0pO1xyXG4gICAgLy8gV2UgY291bGQgc2ltcGx5IGNoYW5nZSB0aGUgcmVmZXJlbmNlcyB0byB0aGUgb2xkIHBhdGgsIGJ1dCBwYXJzaW5nIGFnYWluIGRvZXMgdGhlIHRyaWNrIGFzIHdlbGxcclxuICAgIHRoaXMudmF1bHQub24oJ3JlbmFtZScsIChmaWxlOiBUQWJzdHJhY3RGaWxlLCBvbGRQYXRoOiBzdHJpbmcpID0+IHtcclxuICAgICAgdGhpcy5jbGVhckluZGV4KG9sZFBhdGgpO1xyXG4gICAgICB0aGlzLmluZGV4QWJzdHJhY3RGaWxlKGZpbGUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGludm9rZUxpc3RlbmVycygpIHtcclxuICAgIGNvbnN0IHRvZG9zID0gKFtdIGFzIFRvZG9JdGVtW10pLmNvbmNhdCguLi5BcnJheS5mcm9tKHRoaXMudG9kb3MudmFsdWVzKCkpKTtcclxuICAgIHRoaXMubGlzdGVuZXJzLmZvckVhY2goKGxpc3RlbmVyKSA9PiBsaXN0ZW5lcih0b2RvcykpO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge0FwcCwgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZ30gZnJvbSAnb2JzaWRpYW4nO1xyXG5pbXBvcnQgdHlwZSBBY3Rpb25UcmFja2VyUGx1Z2luIGZyb20gXCIuL21haW5cIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQWN0aW9uVHJhY2tlclNldHRpbmdzIHtcclxuXHRwZXJzb25SZWdleHBTdHJpbmc6ICAgICAgICBzdHJpbmcsXHJcbiAgcHJvamVjdFJlZ2V4cFN0cmluZzogICAgICAgc3RyaW5nLFxyXG4gIGRhdGVSZWdleHBTdHJpbmc6ICAgICAgICAgIHN0cmluZyxcclxuICBkaXNjdXNzV2l0aFJlZ2V4cFN0cmluZzogICBzdHJpbmcsXHJcbiAgd2FpdGluZ0ZvclJlZ2V4cFN0cmluZzogICAgc3RyaW5nLFxyXG4gIHByb21pc2VkVG9SZWdleHBTdHJpbmc6ICAgIHN0cmluZyxcclxuICBzb21lZGF5TWF5YmVSZWdleHBTdHJpbmc6ICBzdHJpbmdcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IERFRkFVTFRfU0VUVElOR1M6IEFjdGlvblRyYWNrZXJTZXR0aW5ncyA9IHtcclxuXHRwZXJzb25SZWdleHBTdHJpbmc6ICAgICAgICAnXFxcXFt7Mn1QZW9wbGVcXFxcLyguKj8pXFxcXF17Mn0nLFxyXG4gIHByb2plY3RSZWdleHBTdHJpbmc6ICAgICAgICdcXFxcW3syfVByb2plY3RzXFxcXC8oLio/KVxcXFxdezJ9JyxcclxuICBkYXRlUmVnZXhwU3RyaW5nOiAgICAgICAgICAnIyhcXFxcZHs0fVxcXFwvXFxcXGR7Mn1cXFxcL1xcXFxkezJ9KScsXHJcbiAgZGlzY3Vzc1dpdGhSZWdleHBTdHJpbmc6ICAgJyMoZGlzY3Vzc1dpdGgpJyxcclxuICB3YWl0aW5nRm9yUmVnZXhwU3RyaW5nOiAgICAnIyh3YWl0aW5nRm9yKScsXHJcbiAgcHJvbWlzZWRUb1JlZ2V4cFN0cmluZzogICAgJyMocHJvbWlzZWRUbyknLFxyXG4gIHNvbWVkYXlNYXliZVJlZ2V4cFN0cmluZzogICcjKHNvbWVkYXkpJ1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQWN0aW9uVHJhY2tlclNldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcclxuXHRwbHVnaW46IEFjdGlvblRyYWNrZXJQbHVnaW47XHJcblxyXG5cdGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwbHVnaW46IEFjdGlvblRyYWNrZXJQbHVnaW4pIHtcclxuXHRcdHN1cGVyKGFwcCwgcGx1Z2luKTtcclxuXHRcdHRoaXMucGx1Z2luID0gcGx1Z2luO1xyXG5cdH1cclxuXHJcblx0ZGlzcGxheSgpOiB2b2lkIHtcclxuXHRcdGxldCB7Y29udGFpbmVyRWx9ID0gdGhpcztcclxuXHJcblx0XHR0aGlzLmNvbnRhaW5lckVsLmVtcHR5KCk7XHJcblxyXG5cdFx0dGhpcy5jb250YWluZXJFbC5jcmVhdGVFbCgnaDInLCB7dGV4dDogJ1NldHRpbmdzIGZvciB0aGUgc3Rha2Vob2xkZXIgYWN0aW9uIHRyYWNrZXIgcGx1Z2luJ30pO1xyXG5cclxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG5cdFx0XHQuc2V0TmFtZSgnUGVyc29uIHJlZ2V4cCBwYXR0ZXJuJylcclxuXHRcdFx0LnNldERlc2MoJ1RoaXMgaXMgdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBpZGVudGlmeSB0aGUgYWN0aW9uIHBhcnR5IGluIHRoZSBhY3Rpb24uJylcclxuXHRcdFx0LmFkZFRleHQodGV4dCA9PiB0ZXh0XHJcblx0XHRcdFx0LnNldFBsYWNlaG9sZGVyKCdcXFxcW3syfVBlb3BsZVxcXFwvKC4qPylcXFxcXXsyfScpXHJcbiAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnBlcnNvblJlZ2V4cFN0cmluZylcclxuXHRcdFx0XHQub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XHJcblx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5wZXJzb25SZWdleHBTdHJpbmcgPSB2YWx1ZTtcclxuXHRcdFx0XHRcdGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xyXG5cdFx0XHRcdH0pKTtcclxuXHJcbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgLnNldE5hbWUoJ1Byb2plY3QgcmVnZXhwIHBhdHRlcm4nKVxyXG4gICAgICAuc2V0RGVzYygnVGhpcyBpcyB0aGUgcmVndWxhciBleHByZXNzaW9uIHRvIGlkZW50aWZ5IHRoZSBwcm9qZWN0IGluIHRoZSBhY3Rpb24uJylcclxuICAgICAgLmFkZFRleHQodGV4dCA9PiB0ZXh0XHJcbiAgICAgICAgLnNldFBsYWNlaG9sZGVyKCdcXFxcW3syfVByb2plY3RzXFxcXC8oLio/KVxcXFxdezJ9JylcclxuICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucHJvamVjdFJlZ2V4cFN0cmluZylcclxuICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5wcm9qZWN0UmVnZXhwU3RyaW5nID0gdmFsdWU7XHJcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuICAgICAgICB9KSk7XHJcbiAgXHJcbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgICAuc2V0TmFtZSgnRGF0ZSByZWdleHAgcGF0dGVybicpXHJcbiAgICAgICAgLnNldERlc2MoJ1RoaXMgaXMgdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBnZXQgdGhlIGRhdGUgZm9yIGFuIGFjdGlvbi4nKVxyXG4gICAgICAgIC5hZGRUZXh0KHRleHQgPT4gdGV4dFxyXG4gICAgICAgICAgLnNldFBsYWNlaG9sZGVyKCcjKFxcXFxkezR9XFxcXC9cXFxcZHsyfVxcXFwvXFxcXGR7Mn0pJylcclxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5kYXRlUmVnZXhwU3RyaW5nKVxyXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5kYXRlUmVnZXhwU3RyaW5nID0gdmFsdWU7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xyXG4gICAgICAgIH0pKTtcclxuICBcclxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG5cdFx0XHQuc2V0TmFtZSgnRGlzY3VzcyBXaXRoIHJlZ2V4cCBwYXR0ZXJuJylcclxuXHRcdFx0LnNldERlc2MoJ1RoaXMgaXMgdGhlIHJlZ2V4cCBwYXR0ZXJuIHlvdSB1c2UgdG8gbWFyayB0b3BpY3MgeW91IHdhbnQgdG8gZGlzY3VzcyB3aXRoIHNvbWVvbmUuJylcclxuXHRcdFx0LmFkZFRleHQodGV4dCA9PiB0ZXh0XHJcblx0XHRcdFx0LnNldFBsYWNlaG9sZGVyKCcjKGRpc2N1c3NXaXRoKScpXHJcbiAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmRpc2N1c3NXaXRoUmVnZXhwU3RyaW5nKVxyXG5cdFx0XHRcdC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcclxuXHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLmRpc2N1c3NXaXRoUmVnZXhwU3RyaW5nID0gdmFsdWU7XHJcblx0XHRcdFx0XHRhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuXHRcdFx0XHR9KSk7XHJcblxyXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgIC5zZXROYW1lKCdXYWl0aW5nIEZvciByZWdleHAgcGF0dGVybicpXHJcbiAgICAgIC5zZXREZXNjKCdUaGlzIGlzIHRoZSByZWdleHAgcGF0dGVybiB5b3UgdXNlIHRvIG1hcmsgdG9waWNzIHNvbWVvbmUgaGFzIHByb21pc2VkIHRvIGRlbGl2ZXIgdG8gbWUuJylcclxuICAgICAgLmFkZFRleHQodGV4dCA9PiB0ZXh0XHJcbiAgICAgICAgLnNldFBsYWNlaG9sZGVyKCcjKHdhaXRpbmdGb3IpJylcclxuICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Mud2FpdGluZ0ZvclJlZ2V4cFN0cmluZylcclxuICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy53YWl0aW5nRm9yUmVnZXhwU3RyaW5nID0gdmFsdWU7XHJcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuICAgICAgICB9KSk7ICAgICAgICBcclxuICAgIFxyXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgIC5zZXROYW1lKCdQcm9taXNlZCBUbyByZWdleHAgcGF0dGVybicpXHJcbiAgICAgIC5zZXREZXNjKCdUaGlzIGlzIHRoZSByZWdleHAgcGF0dGVybiB5b3UgdXNlIHRvIG1hcmsgdG9waWNzIHNvbWVvbmUgaGFzIHByb21pc2VkIHRvIGRlbGl2ZXIgdG8gbWUuJylcclxuICAgICAgLmFkZFRleHQodGV4dCA9PiB0ZXh0XHJcbiAgICAgICAgLnNldFBsYWNlaG9sZGVyKCcjKHByb21pc2VkVG8pJylcclxuICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucHJvbWlzZWRUb1JlZ2V4cFN0cmluZylcclxuICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5wcm9taXNlZFRvUmVnZXhwU3RyaW5nID0gdmFsdWU7XHJcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuICAgICAgICB9KSk7ICAgICAgICBcclxuXHJcbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgLnNldE5hbWUoJ1NvbWVkYXkgTWF5YmUgcmVnZXhwIHBhdHRlcm4nKVxyXG4gICAgICAuc2V0RGVzYygnVGhpcyBpcyB0aGUgcmVnZXhwIHBhdHRlcm4geW91IHVzZSB0byBtYXJrIGFjdGlvbnMgd2l0aG91dCBhIGRlYWRsaW5lLicpXHJcbiAgICAgIC5hZGRUZXh0KHRleHQgPT4gdGV4dFxyXG4gICAgICAgIC5zZXRQbGFjZWhvbGRlcignIyhzb21lZGF5KScpXHJcbiAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnNvbWVkYXlNYXliZVJlZ2V4cFN0cmluZylcclxuICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zb21lZGF5TWF5YmVSZWdleHBTdHJpbmcgPSB2YWx1ZTtcclxuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xyXG4gICAgICAgIH0pKTsgICAgICAgIFxyXG4gIFxyXG5cdH1cclxufSIsImltcG9ydCB7IEFwcCwgUGx1Z2luLCBQbHVnaW5NYW5pZmVzdCwgVEZpbGUsIFdvcmtzcGFjZUxlYWYsIH0gZnJvbSAnb2JzaWRpYW4nO1xyXG5pbXBvcnQgeyBWSUVXX1RZUEVfVE9ETyB9IGZyb20gJy4vY29uc3RhbnRzJztcclxuaW1wb3J0IHsgVG9kb0l0ZW1WaWV3LCBUb2RvSXRlbVZpZXdQcm9wcyB9IGZyb20gJy4vdWkvVG9kb0l0ZW1WaWV3JztcclxuaW1wb3J0IHsgVG9kb0l0ZW0sIFRvZG9JdGVtU3RhdHVzIH0gZnJvbSAnLi9tb2RlbC9Ub2RvSXRlbSc7XHJcbmltcG9ydCB7IFRvZG9JbmRleCB9IGZyb20gJy4vbW9kZWwvVG9kb0luZGV4JztcclxuaW1wb3J0IHtERUZBVUxUX1NFVFRJTkdTLCBBY3Rpb25UcmFja2VyU2V0dGluZ3MsIEFjdGlvblRyYWNrZXJTZXR0aW5nVGFifSBmcm9tICcuL3NldHRpbmdzJztcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBY3Rpb25UcmFja2VyUGx1Z2luIGV4dGVuZHMgUGx1Z2luIHtcclxuICBwcml2YXRlIHRvZG9JbmRleDogVG9kb0luZGV4O1xyXG4gIHByaXZhdGUgdmlldzogVG9kb0l0ZW1WaWV3O1xyXG4gIHNldHRpbmdzOiBBY3Rpb25UcmFja2VyU2V0dGluZ3M7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBtYW5pZmVzdDogUGx1Z2luTWFuaWZlc3QpIHtcclxuICAgIHN1cGVyKGFwcCwgbWFuaWZlc3QpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgb25sb2FkKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgY29uc29sZS5sb2coJ2xvYWRpbmcgcGx1Z2luJyk7XHJcbiAgICBcclxuICAgIGF3YWl0IHRoaXMubG9hZFNldHRpbmdzKCk7XHJcblxyXG4gICAgY29uc3QgcHJvcHMgPSB7XHJcbiAgICAgIHBlcnNvblJlZ2V4cDogbmV3IFJlZ0V4cCAodGhpcy5nZXRTZXR0aW5nVmFsdWUoJ3BlcnNvblJlZ2V4cFN0cmluZycpKSxcclxuICAgICAgcHJvamVjdFJlZ2V4cDogbmV3IFJlZ0V4cCAodGhpcy5nZXRTZXR0aW5nVmFsdWUoJ3Byb2plY3RSZWdleHBTdHJpbmcnKSksXHJcbiAgICAgIGRhdGVSZWdleHA6IG5ldyBSZWdFeHAgKHRoaXMuZ2V0U2V0dGluZ1ZhbHVlKCdkYXRlUmVnZXhwU3RyaW5nJykpLFxyXG4gICAgICBkaXNjdXNzV2l0aFJlZ2V4cDogbmV3IFJlZ0V4cCAodGhpcy5nZXRTZXR0aW5nVmFsdWUoJ2Rpc2N1c3NXaXRoUmVnZXhwU3RyaW5nJykpLFxyXG4gICAgICB3YWl0aW5nRm9yUmVnZXhwOiBuZXcgUmVnRXhwICh0aGlzLmdldFNldHRpbmdWYWx1ZSgnd2FpdGluZ0ZvclJlZ2V4cFN0cmluZycpKSxcclxuICAgICAgcHJvbWlzZWRUb1JlZ2V4cDogbmV3IFJlZ0V4cCAodGhpcy5nZXRTZXR0aW5nVmFsdWUoJ3Byb21pc2VkVG9SZWdleHBTdHJpbmcnKSksXHJcbiAgICAgIHNvbWVkYXlNYXliZVJlZ2V4cDogbmV3IFJlZ0V4cCAodGhpcy5nZXRTZXR0aW5nVmFsdWUoJ3NvbWVkYXlNYXliZVJlZ2V4cFN0cmluZycpKSxcclxuICAgIH1cclxuICAgIFxyXG4gICAgdGhpcy50b2RvSW5kZXggPSBuZXcgVG9kb0luZGV4KHRoaXMuYXBwLnZhdWx0LCB0aGlzLnRpY2suYmluZCh0aGlzKSxwcm9wcyk7XHJcblxyXG4gICAgdGhpcy5yZWdpc3RlclZpZXcoVklFV19UWVBFX1RPRE8sIChsZWFmOiBXb3Jrc3BhY2VMZWFmKSA9PiB7XHJcbiAgICAgIGNvbnN0IHRvZG9zOiBUb2RvSXRlbVtdID0gW107XHJcbiAgICAgIGNvbnN0IHByb3BzID0ge1xyXG4gICAgICAgIHRvZG9zOiB0b2RvcyxcclxuICAgICAgICBvcGVuRmlsZTogKGZpbGVQYXRoOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoZmlsZVBhdGgpIGFzIFRGaWxlO1xyXG4gICAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLnNwbGl0QWN0aXZlTGVhZigpLm9wZW5GaWxlKGZpbGUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdG9nZ2xlVG9kbzogKHRvZG86IFRvZG9JdGVtLCBuZXdTdGF0dXM6IFRvZG9JdGVtU3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnRvZG9JbmRleC5zZXRTdGF0dXModG9kbywgbmV3U3RhdHVzKTtcclxuICAgICAgICB9LFxyXG4gICAgICB9O1xyXG4gICAgICB0aGlzLnZpZXcgPSBuZXcgVG9kb0l0ZW1WaWV3KGxlYWYsIHByb3BzKTtcclxuICAgICAgcmV0dXJuIHRoaXMudmlldztcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgQWN0aW9uVHJhY2tlclNldHRpbmdUYWIodGhpcy5hcHAsIHRoaXMpKTtcclxuXHJcbiAgICBpZiAodGhpcy5hcHAud29ya3NwYWNlLmxheW91dFJlYWR5KSB7XHJcbiAgICAgIHRoaXMuaW5pdExlYWYoKTtcclxuICAgICAgYXdhaXQgdGhpcy5wcmVwYXJlSW5kZXgoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC53b3Jrc3BhY2Uub24oJ2xheW91dC1yZWFkeScsIHRoaXMuaW5pdExlYWYuYmluZCh0aGlzKSkpO1xyXG4gICAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKCdsYXlvdXQtcmVhZHknLCBhc3luYyAoKSA9PiBhd2FpdCB0aGlzLnByZXBhcmVJbmRleCgpKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvbnVubG9hZCgpOiB2b2lkIHtcclxuICAgIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoVklFV19UWVBFX1RPRE8pLmZvckVhY2goKGxlYWYpID0+IGxlYWYuZGV0YWNoKCkpO1xyXG4gIH1cclxuXHJcbiAgaW5pdExlYWYoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5hcHAud29ya3NwYWNlLmdldExlYXZlc09mVHlwZShWSUVXX1RZUEVfVE9ETykubGVuZ3RoKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRSaWdodExlYWYoZmFsc2UpLnNldFZpZXdTdGF0ZSh7XHJcbiAgICAgIHR5cGU6IFZJRVdfVFlQRV9UT0RPLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBwcmVwYXJlSW5kZXgoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBhd2FpdCB0aGlzLnRvZG9JbmRleC5pbml0aWFsaXplKCk7XHJcbiAgfVxyXG5cclxuICB0aWNrKHRvZG9zOiBUb2RvSXRlbVtdKTogdm9pZCB7XHJcbiAgICB0aGlzLnZpZXcuc2V0UHJvcHMoKGN1cnJlbnRQcm9wczogVG9kb0l0ZW1WaWV3UHJvcHMpID0+IHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5jdXJyZW50UHJvcHMsXHJcbiAgICAgICAgdG9kb3M6IHRvZG9zLFxyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBsb2FkU2V0dGluZ3MoKSB7XHJcblx0XHR0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9TRVRUSU5HUywgYXdhaXQgdGhpcy5sb2FkRGF0YSgpKTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIHNhdmVTZXR0aW5ncygpIHtcclxuXHRcdGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XHJcblx0fVxyXG5cclxuICBnZXRTZXR0aW5nVmFsdWU8SyBleHRlbmRzIGtleW9mIEFjdGlvblRyYWNrZXJTZXR0aW5ncz4oc2V0dGluZzogSyk6IEFjdGlvblRyYWNrZXJTZXR0aW5nc1tLXSB7XHJcbiAgICByZXR1cm4gdGhpcy5zZXR0aW5nc1tzZXR0aW5nXVxyXG4gIH1cclxufVxyXG5cclxuXHJcbiJdLCJuYW1lcyI6WyJJdGVtVmlldyIsIk1hcmtkb3duUmVuZGVyZXIiLCJURmlsZSIsIlBsdWdpblNldHRpbmdUYWIiLCJTZXR0aW5nIiwiUGx1Z2luIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXVEQTtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDbkcsUUFBUSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDdEcsUUFBUSxT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
