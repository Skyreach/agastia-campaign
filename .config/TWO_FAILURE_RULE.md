# Two-Failure Escalation Rule

**Purpose:** Prevent getting stuck in repetitive failure loops by escalating to fresh context after 2 failures.

**Applies to:** All strategy-based skills and commands (todo, plan, plan-session, mystery, etc.)

---

## Core Protocol

### Stage 1: First Failure
**When a task fails the first time:**
- Note the failure in todo tracking
- Mark task status with failure indicator
- Continue attempting with current approach

### Stage 2: Second Failure (Sub-Agent Escalation)
**When the SAME task fails a second time:**
1. **Stop attempting the task immediately**
2. **Spawn a sub-agent for collaborative problem-solving**
3. **Sub-agent protocol:**
   - Provide sub-agent with fresh context (no prior assumptions)
   - Describe the specific failure and symptoms
   - Analyze WHY the problem isn't being fixed (not just what failed)
   - Solve the problem constructively IN ISOLATION:
     - ❌ NO network requests during problem-solving
     - ❌ NO integration tests during problem-solving
     - ✅ Create sample files that match the testing situation
     - ✅ Validate locally with test data
     - ✅ Only scale up to real operations after local validation succeeds
4. **Collaborate with sub-agent:**
   - Review their analysis
   - Discuss approach trade-offs
   - Agree on solution before implementing
   - Implement the agreed solution together

**Example:**
```
Task: Sync file to Notion (Failed 2x)

Sub-agent prompt:
"I've failed twice to sync Sessions/Session_2.md to Notion with these symptoms:
- Attempt 1: 400 error 'invalid block type'
- Attempt 2: Same error after fixing block types

I need help understanding:
1. Why are my block type fixes not working?
2. What am I misunderstanding about Notion's block schema?
3. How can we validate the block structure locally before calling the API?

DO NOT make network requests. Instead, help me:
1. Create a sample Notion block structure that should work
2. Validate it against the schema locally
3. Test the conversion logic with sample markdown
4. Only after local validation succeeds, try the real sync"
```

### Stage 3: Third & Fourth Failures (User Escalation)
**If you and sub-agent fail twice more (4 total failures):**
1. **Stop all attempts immediately**
2. **Document the problem thoroughly:**
   - Specific problem description and symptoms
   - All 4 attempts and their failures
   - Analysis of why each approach failed
   - Current understanding of the root cause
3. **Present to user:**
   - Clear problem statement
   - Chronological failure history (all 4 attempts)
   - 3 suggestions for how to fix (WITHOUT code implementation)
   - Ask user to guide next steps

**Example:**
```markdown
## Escalation: Failed to Sync Session File (4 Attempts)

**Problem:** Cannot sync Sessions/Session_2.md to Notion - consistently receiving 400 errors.

**Symptoms:**
- Error: "invalid block type" on toggle_heading_3 blocks
- Notion API rejects the request before processing any blocks
- Validation scripts pass but API rejects

**Failure History:**
1. Attempt 1 (Solo): Used toggle_heading_3 → 400 error
2. Attempt 2 (Solo): Changed to heading_3 with is_toggleable → 400 error
3. Attempt 3 (With sub-agent): Validated block structure locally, used sequential creation → 400 error
4. Attempt 4 (With sub-agent): Simplified to 2-level nesting only → 400 error

**Analysis:**
The Notion API documentation says heading_3 supports is_toggleable, but the API rejects it.
Our local validation passes, suggesting a schema mismatch between docs and API.

**3 Suggested Approaches (No Code):**
1. **API Version Check:** Verify we're using the correct Notion API version (2022-06-28), may need to upgrade
2. **Block Type Fallback:** Use toggle blocks instead of toggleable headings (different structure but same UX)
3. **Incremental Sync:** Sync sections individually to isolate which block type is failing

**Question:** Which approach should we pursue, or do you have another suggestion?
```

---

## Integration with Todo Tracking

**Update TodoWrite with failure tracking:**

```markdown
## Active Tasks

### In Progress
- [ ] [14:30] Sync Session_2 to Notion ⚠️ FAILED x2 - Sub-agent spawned
  - Attempt 1: 400 error 'invalid block type'
  - Attempt 2: Same error after fix
  - Status: Collaborating with sub-agent on isolated solution

### Escalated to User
- [ ] [14:15] Fix Notion sync for complex nesting ❌ FAILED x4 - User guidance needed
  - Documented all attempts and suggestions above
  - Waiting for user direction
```

---

## Why This Works

### Benefits:
1. **Fresh Context:** Sub-agent doesn't inherit your assumptions or mental model
2. **Isolated Problem-Solving:** Validating locally is cheaper and faster than repeated API calls
3. **Expert Collaboration:** Two AI agents thinking through the problem catches more issues
4. **Prevents Waste:** Stops after 4 failures instead of infinite loops
5. **User Control:** User can guide when automated approaches fail

### Anti-Patterns Prevented:
- ❌ Repeating the same failed approach 10+ times
- ❌ Making expensive network calls during debugging
- ❌ Assuming the problem without testing the assumption
- ❌ Continuing when clearly stuck
- ❌ Not escalating when help is needed

---

## Decision Tree

```
Task Attempt
    ↓
  Success? → Mark completed, continue
    ↓ No
  First failure? → Note it, try again with adjusted approach
    ↓ No
  Second failure? → STOP. Spawn sub-agent for collaboration
    ↓
  Sub-agent helps create isolated test
    ↓
  Local validation passes?
    ↓ Yes
  Try real operation
    ↓
  Success? → Mark completed, continue
    ↓ No
  Third failure? → Sub-agent re-analyzes
    ↓
  Try adjusted approach
    ↓
  Success? → Mark completed, continue
    ↓ No
  Fourth failure? → STOP. Escalate to user with full report
```

---

## Implementation Checklist

When a task fails:
- [ ] Is this the first failure? → Note it, adjust approach
- [ ] Is this the second failure? → Spawn sub-agent with fresh context
- [ ] Did we validate locally before scaling up? → Required for sub-agent attempts
- [ ] Is this the fourth failure? → Document thoroughly and escalate to user
- [ ] Did we provide 3 suggestions (without code) when escalating? → Required

---

## Examples by Skill Type

### Todo Tracking (/todo command)
**Task:** Add new todo item with complex formatting
- Failure 1: Markdown not rendering correctly
- Failure 2: Same issue after escaping characters
- **Escalate to sub-agent:** Create sample markdown locally, test rendering, validate before updating file

### Planning (/plan command)
**Task:** Classify complex multi-topic conversation
- Failure 1: MCP tool returns "unknown" classification
- Failure 2: Same result after providing more context
- **Escalate to sub-agent:** Analyze conversation structure locally, identify why classification logic fails, test with sample conversations

### Session Planning (plan-session skill)
**Task:** Integrate deferred module into session structure
- Failure 1: Module coupling doesn't fit session flow
- Failure 2: Same issue after adjusting timing
- **Escalate to sub-agent:** Map out session flow on paper, identify where coupling actually exists, validate integration points before generating content

### Mystery Design (mystery skill)
**Task:** Create 3 independent clues for revelation
- Failure 1: Clues require combination to reach conclusion (violates 3-clue rule)
- Failure 2: Same issue after rewriting
- **Escalate to sub-agent:** Analyze each clue in isolation, test if each proves conclusion alone, validate before adding to quest file

---

## Tracking Failures

**Use todo tracking to maintain failure history:**

```markdown
## Task Failure Log

### [Task Name]
- **Started:** 2025-01-20 14:30
- **Failure 1:** [Time] - [Symptom] - [Attempted fix]
- **Failure 2:** [Time] - [Symptom] - [Attempted fix] - **SUB-AGENT SPAWNED**
- **Failure 3:** [Time] - [Symptom] - [Attempted fix with sub-agent]
- **Failure 4:** [Time] - [Symptom] - [Attempted fix with sub-agent] - **ESCALATED TO USER**
```

This history helps identify patterns and prevents repeating failed approaches.
