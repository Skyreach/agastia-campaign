Enable comprehensive todo tracking with dual-system persistence to prevent topic loss.

**CRITICAL REQUIREMENTS:**

1. **TodoWrite Tool (Memory Tracking):**
   - ALWAYS use TodoWrite tool for all active tasks
   - Update todo status in real-time (pending → in_progress → completed)
   - Mark tasks completed IMMEDIATELY when done
   - ONLY ONE task can be in_progress at any time
   - Never batch completions - update after each task finishes

2. **Persistent File Tracking:**
   - Maintain `.working/TODO_SESSION.md` for session persistence
   - Update file whenever todos change (add/complete/modify)
   - Include timestamps for when each todo was added
   - Format: Task description + Status + Added timestamp + Completion timestamp (if done)
   - Group by: Active Tasks | Completed Tasks | Future Topics

3. **Comprehensiveness Over Brevity:**
   - Be specific and detailed in task descriptions
   - Include context about why the task exists
   - Reference related files/topics/decisions
   - Include enough detail that task is actionable after being derailed
   - Examples:
     - ❌ BAD: "Fix encounter"
     - ✅ GOOD: "Fix Shadow Creature encounter in Session_1_Caravan_to_Ratterdan.md - add Tucker's Kobolds tactics and resource drain mechanics as discussed"

4. **Goal Verification Agent:**
   - Run verification sub-agent every 5-8 todos added
   - Agent checks: Are we capturing all discussion points? Missing any implied tasks?
   - Agent reviews: Recent conversation + current todo list
   - Agent reports: Missing goals, ambiguous tasks, or topics we haven't captured
   - Use Task tool with subagent_type="general-purpose"

5. **Session Recovery Support:**
   - If `.working/TODO_SESSION.md` exists from previous session, load it first
   - Present existing todos to user and ask which are still relevant
   - Archive old session todos to `.working/archive/TODO_[date].md`
   - This ensures continuity across sessions

**File Format Example:**

```markdown
# Session TODO List
Last updated: 2025-11-16 14:32

## 🚨 Active Tasks

### In Progress
- [ ] [14:30] Fix Shadow Creature encounter in Session_1 - add Tucker's Kobolds tactics
  - Context: User wants challenging encounter with resource drain mechanics
  - Files: Sessions/Session_1_Caravan_to_Ratterdan.md
  - References: .config/ENCOUNTER_EXPECTATIONS.md

### Pending
- [ ] [14:28] Generate patron options for Nikki's blood target quest
  - Context: Need 3-4 patron options following CONTENT_GENERATION_WORKFLOW
  - Must be Decimate Project members from Faction_Decimate_Project.md
  - Decision needed before Session 1

## ✅ Completed Tasks
- [x] [14:15 → 14:25] Created Decimate Project faction file
  - Context: New faction for patrons supporting PC goals
  - File: Factions/Faction_Decimate_Project.md
  - Synced to Notion: https://notion.so/...

## 📋 Future Topics (Not Started Yet)
- [ ] [14:31] Design revelation system for Session 2
  - Context: 3-3-3-1 web structure mentioned in planning notes
  - Low priority until Session 1 finalized
```

**Process:**

1. When /todo is invoked:
   - Check for existing `.working/TODO_SESSION.md`
   - If exists, read and present to user
   - Ask which todos are still relevant
   - Archive old file if new session
   - Initialize TodoWrite tool with active tasks

2. During work:
   - Update TodoWrite tool in real-time
   - Update `.working/TODO_SESSION.md` after each todo change
   - Add timestamps to new tasks
   - Move completed tasks to completion section with completion timestamp

3. Every 5-8 new todos:
   - Run verification agent
   - Agent prompt: "Review the last 20 messages of conversation and the current todo list. Are we missing any implied tasks, discussion points, or goals that should be tracked? Are any existing todos too ambiguous to be actionable later?"
   - If agent finds missing items, add them to todo list
   - Report findings to user

4. End of session:
   - Present final todo list to user
   - Ask if any tasks should be moved to "Future Topics"
   - Confirm all active work is captured
   - Leave `.working/TODO_SESSION.md` for next session

**Benefits:**
- Memory tracking via TodoWrite tool (visible in UI)
- File persistence across sessions (survives crashes/restarts)
- Comprehensive details prevent ambiguity after context switches
- Verification agent catches missing goals
- Recovery mechanism prevents lost work

**Output:**
Enable todo tracking mode. Report: "Todo tracking enabled. Active tasks: [count], Completed: [count], Future: [count]"
