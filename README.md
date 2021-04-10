## Obsidian TODO Plugin

Text-based GTD in Obsidian.
Based on [larslockefeer/obsidian-plugin-todo](https://github.com/larslockefeer/obsidian-plugin-todo)

### Features
- Aggregates all outstanding TODOs in your vault and lists them in a single view
- Split out TODOs by type ("Today", "Scheduled", "Inbox", "Someday/Maybe" and "Stakeholder/Project)
- Schedule a TODO for a specific date by adding a tag #YYYY/DD/MM
- Mark a TODO as Someday/Maybe by adding a tag #someday
- Complete TODOs from the list view
- Quickly jump to the file in which a TODO is found from the list view
- Filter TODOs based on project or person. Default setting assumes [[Pepole/Name]] and [[Project/Name]] naming convention for projects and people.

### Screenshots
![](./assets/today.png)
![](./assets/scheduled.png)
![](./assets/inbox.png)
![](./assets/someday.png)

### Roadmap
- [ ] Scroll to correct line in file when jumping from list view
- [ ] (Re)schedule TODOs from the list view
- [ ] Persist cache, on reopening only reindex files changed since Obsidian was closed
- [ ] Filter items list view by tags / freeform search
- [ ] Improve UI and themeability
- [ ] Integrate with daily notes plugin to ensure unscheduled TODOs in a daily note are listed in "Today"
