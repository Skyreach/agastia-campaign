# MCP Testing Guide

**Purpose:** Document test harness approach and test coverage for custom MCP servers

**Status:** REFERENCE - Testing approach for Phase 2 MCPs

**Last Updated:** 2025-10-12

---

## Test Harness Approach

### Why We Need Test Harnesses

MCP servers communicate via stdio using the Model Context Protocol. They can't be tested with simple bash commands because they:
- Expect JSON-RPC 2.0 formatted requests on stdin
- Return JSON-RPC 2.0 formatted responses on stdout
- Use persistent bidirectional communication
- Require proper protocol initialization handshake

### Test Harness Architecture

**Option 1: Node.js MCP Client Test Harness**

```javascript
// .config/test/mcp_test_harness.js
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';

class MCPTestHarness {
  constructor(serverPath) {
    this.serverPath = serverPath;
    this.client = null;
    this.transport = null;
  }

  async connect() {
    const serverProcess = spawn('node', [this.serverPath]);
    this.transport = new StdioClientTransport({
      command: 'node',
      args: [this.serverPath]
    });

    this.client = new Client({
      name: 'mcp-test-harness',
      version: '1.0.0'
    });

    await this.client.connect(this.transport);
  }

  async listTools() {
    return await this.client.listTools();
  }

  async callTool(name, args) {
    return await this.client.callTool({ name, arguments: args });
  }

  async disconnect() {
    await this.client.close();
  }
}

// Usage example
async function testFormatValidator() {
  const harness = new MCPTestHarness('.config/mcp-servers/format-validator/server.js');

  try {
    await harness.connect();
    console.log('✅ MCP server connected');

    // List available tools
    const tools = await harness.listTools();
    console.log('Available tools:', tools.tools.map(t => t.name));

    // Test validate_document_format
    const result = await harness.callTool('validate_document_format', {
      file_path: './test/fixtures/PC_Invalid.md',
      entity_type: 'PC'
    });

    console.log('Validation result:', JSON.parse(result.content[0].text));

  } finally {
    await harness.disconnect();
  }
}
```

**Option 2: Python MCP Client Test Harness**

```python
# .config/test/mcp_test_harness.py
import subprocess
import json
import sys

class MCPTestHarness:
    def __init__(self, server_path):
        self.server_path = server_path
        self.process = None

    def start(self):
        self.process = subprocess.Popen(
            ['node', self.server_path],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

    def send_request(self, method, params=None):
        request = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": method,
            "params": params or {}
        }

        self.process.stdin.write(json.dumps(request) + '\n')
        self.process.stdin.flush()

        response = self.process.stdout.readline()
        return json.loads(response)

    def call_tool(self, tool_name, arguments):
        return self.send_request('tools/call', {
            'name': tool_name,
            'arguments': arguments
        })

    def stop(self):
        if self.process:
            self.process.terminate()
            self.process.wait()

# Usage
harness = MCPTestHarness('.config/mcp-servers/format-validator/server.js')
harness.start()

result = harness.call_tool('validate_document_format', {
    'file_path': './test/fixtures/PC_Invalid.md',
    'entity_type': 'PC'
})

print(result)
harness.stop()
```

**Option 3: Integration Test via Claude Desktop**

1. Restart Claude Desktop to load new MCPs
2. In a test conversation, manually invoke tools
3. Verify responses match expected behavior
4. Document results in test log

**Recommended:** Start with Option 3 (manual integration test), then build Option 1 harness if automation needed.

---

## Test Coverage Requirements

### format-validator MCP

**Test Suite 1: validate_document_format - Basic Validation**

**Test 1.1: Valid PC File**
- **Fixture:** `test/fixtures/PC_Valid.md`
- **Entity Type:** PC
- **Expected Result:**
  ```json
  {
    "valid": true,
    "errors": [],
    "warnings": [],
    "info": [...]
  }
  ```
- **Validates:**
  - All required frontmatter fields present
  - Correct status value
  - Valid semantic version
  - All required sections present
  - No HTML tags

**Test 1.2: Missing Frontmatter**
- **Fixture:** `test/fixtures/PC_No_Frontmatter.md`
- **Expected Result:**
  ```json
  {
    "valid": false,
    "errors": ["No YAML frontmatter found..."],
    "warnings": [],
    "info": []
  }
  ```

**Test 1.3: Invalid Status Value**
- **Fixture:** `test/fixtures/PC_Invalid_Status.md`
- **Frontmatter:** `status: Running` (invalid)
- **Expected Result:**
  ```json
  {
    "valid": false,
    "errors": ["Invalid status value \"Running\". Must be one of: Active, Inactive, Dead"],
    ...
  }
  ```

**Test 1.4: Missing Required Section**
- **Fixture:** `test/fixtures/PC_Missing_Section.md`
- **Missing:** "Current Goals" section
- **Expected Result:**
  ```json
  {
    "valid": false,
    "errors": ["Missing required section: Current Goals"],
    ...
  }
  ```

**Test 1.5: Forbidden HTML Tags**
- **Fixture:** `test/fixtures/NPC_With_HTML.md`
- **Contains:** `<details><summary>Stats</summary>...</details>`
- **Expected Result:**
  ```json
  {
    "valid": false,
    "errors": ["Contains forbidden HTML tag: /<details>/i. Use Notion toggles instead..."],
    ...
  }
  ```

**Test 1.6: Invalid Version Format**
- **Fixture:** `test/fixtures/Faction_Bad_Version.md`
- **Frontmatter:** `version: "v1.2"` (not semantic)
- **Expected Result:**
  ```json
  {
    "valid": false,
    "errors": ["Invalid version format \"v1.2\". Must be semantic versioning (X.Y.Z)"],
    ...
  }
  ```

**Test 1.7: Information Firewall Violation**
- **Fixture:** `test/fixtures/NPC_No_Player_Summary.md`
- **Has:** DM Notes section
- **Missing:** Player Summary section
- **Expected Result:**
  ```json
  {
    "valid": true,
    "warnings": ["Has DM Notes but no Player Summary - consider adding player-facing content"],
    ...
  }
  ```

**Test 1.8: Location Type Mismatch**
- **Fixture:** `test/fixtures/Location_Invalid_Type.md`
- **Frontmatter:** `location_type: Village` (invalid)
- **Expected Result:**
  ```json
  {
    "valid": false,
    "errors": ["Invalid location_type \"Village\". Must be one of: City, District, Region, Town, Wilderness, Dungeon"],
    ...
  }
  ```

**Test Suite 2: quick_format_check - Fast Validation**

**Test 2.1: Quick Check Passing**
- **Fixture:** `test/fixtures/PC_Valid.md`
- **Expected Result:**
  ```json
  {
    "passed": true,
    "checks": {
      "has_frontmatter": true,
      "has_h1_title": true,
      "has_forbidden_html": false,
      "has_version": true
    },
    "suggestion": null
  }
  ```

**Test 2.2: Quick Check Failing**
- **Fixture:** `test/fixtures/PC_No_Frontmatter.md`
- **Expected Result:**
  ```json
  {
    "passed": false,
    "checks": {
      "has_frontmatter": false,
      "has_h1_title": true,
      "has_forbidden_html": false,
      "has_version": false
    },
    "suggestion": "Run full validation for detailed errors"
  }
  ```

**Test Suite 3: Sub-Agent Integration**

**Test 3.1: Sub-Agent Validation Request**
- **Input:** `validate_document_format(file_path, entity_type, use_subagent=true)`
- **Expected Result:**
  ```json
  {
    "use_subagent": true,
    "instructions": "Launch a general-purpose sub-agent with this prompt:\n\n\"Read the file at ... and validate...\""
  }
  ```
- **Validates:** Returns instructions instead of performing validation

**Test 3.2: Sub-Agent Deep Validation**
- **Manual Test:** Actually launch sub-agent per instructions
- **Expected:** Sub-agent returns detailed compliance report with score
- **Validates:** End-to-end sub-agent workflow

### workflow-enforcer MCP

**Test Suite 4: Workflow State Management**

**Test 4.1: Start Workflow**
- **Call:** `start_workflow(workflow_type="session_generation")`
- **Expected Result:**
  ```json
  {
    "workflow_id": "session_generation_1234567890",
    "current_stage": "present_options",
    "required_next_stage": "user_selection",
    "message": "Workflow started: session_generation. You must present options..."
  }
  ```
- **Validates:**
  - Workflow ID generated
  - Initial stage is present_options
  - .workflow_state.json created with workflow entry

**Test 4.2: Valid Transition**
- **Setup:** Start workflow, get workflow_id
- **Call:** `transition_workflow(workflow_id, next_stage="user_selection")`
- **Expected Result:**
  ```json
  {
    "allowed": true,
    "workflow_id": "...",
    "current_stage": "user_selection",
    "valid_next_stages": ["generate_content", "present_options"],
    "message": "Transitioned to user_selection"
  }
  ```
- **Validates:**
  - Transition allowed
  - Stage updated in state file
  - History entry added

**Test 4.3: Invalid Transition**
- **Setup:** Workflow in present_options stage
- **Call:** `transition_workflow(workflow_id, next_stage="save_content")`
- **Expected Result:**
  ```json
  {
    "allowed": false,
    "error": "Invalid transition from present_options to save_content. Valid transitions: user_selection",
    "current_stage": "present_options",
    "valid_next_stages": ["user_selection"]
  }
  ```
- **Validates:** Invalid transitions rejected

**Test 4.4: Nonexistent Workflow**
- **Call:** `transition_workflow(workflow_id="fake_id", next_stage="user_selection")`
- **Expected Result:**
  ```json
  {
    "allowed": false,
    "error": "Workflow not found: fake_id. Start a new workflow first."
  }
  ```

**Test 4.5: Get Workflow Status**
- **Setup:** Workflow in generate_content stage
- **Call:** `get_workflow_status(workflow_id)`
- **Expected Result:**
  ```json
  {
    "found": true,
    "workflow_id": "...",
    "type": "session_generation",
    "current_stage": "generate_content",
    "valid_next_stages": ["user_approval", "present_options"],
    "created_at": "2025-10-12T...",
    "context": {...},
    "history": [...]
  }
  ```

**Test 4.6: List Active Workflows**
- **Setup:** 2 workflows started, 1 completed
- **Call:** `list_active_workflows()`
- **Expected Result:**
  ```json
  {
    "active_workflows": [
      {
        "workflow_id": "...",
        "type": "npc_creation",
        "current_stage": "user_selection",
        "created_at": "..."
      },
      {
        "workflow_id": "...",
        "type": "session_generation",
        "current_stage": "generate_content",
        "created_at": "..."
      }
    ],
    "count": 2
  }
  ```
- **Validates:** Only non-completed workflows returned

**Test 4.7: Complete Workflow**
- **Setup:** Workflow in save_content stage
- **Call:** `complete_workflow(workflow_id)`
- **Expected Result:**
  ```json
  {
    "success": true,
    "message": "Workflow ... completed successfully"
  }
  ```
- **Validates:**
  - Workflow marked with completed_at timestamp
  - Workflow excluded from list_active_workflows

**Test 4.8: Complete Workflow - Wrong Stage**
- **Setup:** Workflow in user_selection stage
- **Call:** `complete_workflow(workflow_id)`
- **Expected Result:**
  ```json
  {
    "success": false,
    "error": "Cannot complete workflow in stage user_selection. Must be in save_content"
  }
  ```

**Test 4.9: Validate Tool Call - Allowed**
- **Setup:** Workflow in generate_content stage
- **Call:** `validate_tool_call(tool_name="generate_npc", workflow_id, expected_stage="generate_content")`
- **Expected Result:**
  ```json
  {
    "allowed": true,
    "workflow_id": "...",
    "current_stage": "generate_content"
  }
  ```

**Test 4.10: Validate Tool Call - Wrong Stage**
- **Setup:** Workflow in present_options stage
- **Call:** `validate_tool_call(tool_name="generate_npc", workflow_id, expected_stage="generate_content")`
- **Expected Result:**
  ```json
  {
    "allowed": false,
    "error": "Tool generate_npc requires stage generate_content, but workflow is in present_options",
    "current_stage": "present_options",
    "expected_stage": "generate_content"
  }
  ```

**Test Suite 5: State Persistence**

**Test 5.1: State File Creation**
- **Action:** Start workflow
- **Validation:** Check `.workflow_state.json` exists
- **Expected Content:**
  ```json
  {
    "workflows": {
      "session_generation_1234": {
        "type": "session_generation",
        "current_stage": "present_options",
        "created_at": "...",
        "context": {},
        "history": [...]
      }
    },
    "last_updated": "..."
  }
  ```

**Test 5.2: State File Updates**
- **Action:** Transition workflow through stages
- **Validation:** After each transition, read state file
- **Expected:** File reflects current stage, history grows

**Test 5.3: State File Survives Restart**
- **Action:**
  1. Start workflow, transition to user_selection
  2. Simulate server restart (kill and restart MCP)
  3. Call get_workflow_status
- **Expected:** Workflow state restored from file

**Test 5.4: Context Preservation**
- **Action:** Transition with context: `{user_choice: "Option 2"}`
- **Validation:** get_workflow_status shows context
- **Expected:** Context merged, not replaced

---

## Test Fixtures Required

### Directory Structure
```
.config/test/
├── fixtures/
│   ├── PC_Valid.md
│   ├── PC_No_Frontmatter.md
│   ├── PC_Invalid_Status.md
│   ├── PC_Missing_Section.md
│   ├── NPC_With_HTML.md
│   ├── NPC_No_Player_Summary.md
│   ├── Faction_Bad_Version.md
│   ├── Location_Invalid_Type.md
│   └── README.md
├── mcp_test_harness.js
├── test_format_validator.js
├── test_workflow_enforcer.js
└── run_all_tests.sh
```

### Fixture Examples

**PC_Valid.md:**
```markdown
---
name: Test Character
type: PC
player: Test Player
race: Human
class: Fighter
level: 3
status: Active
version: "1.0.0"
tags: [pc, fighter, human]
---

# Test Character

## Player Summary
A brave fighter.

### Basic Information
- **Player:** Test Player
- **Race:** Human
- **Class:** Fighter
- **Level:** 3

### Appearance
Tall and strong.

### Known Personality Traits
- Brave
- Loyal

## Current Goals

### Active Goals
- **Defeat the dragon** [Campaign] - Main quest

## Relationships

### Party Members
- **Wizard:** Friend

## Special Items & Abilities
Magic sword

## Session History

### Session 1 (2025-01-01)
Joined the party
```

**PC_No_Frontmatter.md:**
```markdown
# Test Character

This file has no frontmatter.
```

**NPC_With_HTML.md:**
```markdown
---
name: Test NPC
type: NPC
status: Active
version: "1.0.0"
tags: [npc]
---

# Test NPC

## Player Summary
An NPC

<details>
<summary>Combat Stats</summary>
AC: 15, HP: 30
</details>

## DM Notes
Secret stuff
```

---

## Running Tests

### Manual Testing (Recommended for First Pass)

**Step 1: Restart Claude Desktop**
```bash
# Kill Claude Desktop process
pkill -f "Claude Desktop"

# Restart Claude Desktop
# (Launch from Applications menu)
```

**Step 2: Open Test Conversation**
Create new conversation, verify MCPs loaded:
```
List all available MCP servers and their tools
```

Expected to see:
- `format-validator` with tools: `validate_document_format`, `quick_format_check`
- `workflow-enforcer` with tools: `start_workflow`, `transition_workflow`, etc.

**Step 3: Test format-validator**
```
Use format-validator to validate Player_Characters/PC_Manny.md as type PC
```

Expected: Validation report showing valid/invalid with specific errors/warnings

**Step 4: Test workflow-enforcer**
```
Start a new session_generation workflow using workflow-enforcer
```

Expected: Workflow ID returned, initial stage is present_options

```
Transition the workflow to user_selection stage
```

Expected: Successful transition

```
Try to transition directly to save_content stage (should fail)
```

Expected: Error about invalid transition

**Step 5: Document Results**
Create `.config/test/manual_test_results.md` with outcomes

### Automated Testing (Future Implementation)

**Step 1: Create Test Harness**
```bash
cd .config/test
npm init -y
npm install @modelcontextprotocol/sdk
```

**Step 2: Write Test Suite**
Implement test files using harness from examples above

**Step 3: Run Tests**
```bash
node .config/test/run_all_tests.js
```

**Step 4: CI Integration**
Add to GitHub Actions workflow for automated testing on push

---

## Success Criteria

**format-validator:**
- ✅ Correctly identifies valid entity files
- ✅ Detects all 8 classes of format violations
- ✅ Returns actionable error messages
- ✅ Sub-agent integration works end-to-end

**workflow-enforcer:**
- ✅ Enforces valid state transitions
- ✅ Rejects invalid transitions
- ✅ Persists state across server restarts
- ✅ Tracks multiple concurrent workflows
- ✅ Context preserved through transitions

---

## Next Steps After Testing

1. **If tests pass:** Mark Phase 2 complete, proceed to Phase 3
2. **If tests fail:** Debug issues, fix bugs, re-test
3. **Document bugs:** Create issues in `.config/test/known_issues.md`
4. **Iterate:** Fix, test, verify until all tests pass

---

## Phase 3 Preview: Format Validation Automation

**Objective:** Automate format validation and provide fix suggestions

**Planned Features:**
1. **Pre-commit Format Check:**
   - Run format-validator on all staged .md files
   - Block commit if format violations found
   - Generate compliance report

2. **Automated Fix Suggestions:**
   - Detect common violations
   - Suggest specific fixes
   - Example: "Missing frontmatter field 'version'. Add: version: \"1.0.0\""

3. **Bulk Format Audit:**
   - Scan all entity files
   - Generate compliance report
   - Prioritize files needing fixes

4. **Format Auto-Repair (Safe Cases):**
   - Add missing version field (default to "1.0.0")
   - Convert HTML details tags to Notion toggles
   - Fix heading hierarchy issues

5. **Integration with Pre-Commit Hook:**
   - Add format validation layer (after naming validation)
   - Report format violations with file:line references
   - Suggest running format-validator for details

**Implementation Plan:**
1. Create `.config/format_compliance_check.py`
2. Add format validation to `.git/hooks/pre-commit`
3. Create `.config/auto_fix_format.py` for safe repairs
4. Add bulk audit script `.config/audit_all_formats.py`
5. Update CLAUDE.md with format validation protocol

**Estimated Tasks:** 5 major tasks, ~3-4 hours implementation

---

## Phase 4 Preview: Workflow Enforcement Architecture

**Objective:** Make workflow enforcement fully automatic and cross-session persistent

**Planned Features:**
1. **Automatic Workflow Detection:**
   - Detect when user requests content generation
   - Auto-start workflow if not present
   - Warn if trying to skip stages

2. **Cross-Session Workflow Recovery:**
   - Load active workflows on session start
   - Resume interrupted workflows
   - Ask user to continue or abandon

3. **Approval Checkpoint Integration:**
   - Modify generation tools to check workflow stage
   - Refuse to generate if not in correct stage
   - Provide clear error messages

4. **Workflow Reporting:**
   - Show active workflows in session startup
   - Weekly workflow audit (abandoned workflows cleanup)
   - Workflow completion metrics

5. **CLAUDE.md Integration:**
   - Add mandatory workflow checks to session startup
   - Enforce workflow protocol in all generation tasks

**Implementation Plan:**
1. Update generation tool handlers to validate workflow_id
2. Create `.config/workflow_recovery.py` for session startup
3. Add workflow reporting to SESSION_STARTUP_CHECK.sh
4. Create workflow cleanup script
5. Update CLAUDE.md with enforcement rules

**Estimated Tasks:** 5 major tasks, ~4-5 hours implementation

---

## Summary

**Testing Phase 2 MCPs requires:**
- Test harness (manual or automated)
- 27 specific test cases across 5 test suites
- 8 test fixtures covering violation types
- Integration testing via Claude Desktop restart

**Phase 3 Focus:** Format validation automation with pre-commit checks
**Phase 4 Focus:** Full workflow enforcement with cross-session persistence

**Total remaining work:** ~7-9 hours across Phases 3-4
