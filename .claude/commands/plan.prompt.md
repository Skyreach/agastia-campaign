Track and classify the current conversation using conversation-classifier and conversation-tracker MCPs.

Process:
1. Conversation Classification (conversation-classifier MCP):
   - Analyze current conversation thread
   - Classify type: session_planning | worldbuilding | npc_creation | encounter_design |
                    quest_development | rules_discussion | campaign_continuity | other
   - Identify primary topic and subtopics
   - Extract key themes

2. Conversation Tracking (conversation-tracker MCP):
   - Log conversation metadata (timestamp, type, participants)
   - Track decisions made during discussion
   - Record entities created/modified
   - Note action items and next steps
   - Create cross-references to related content

3. Generate Planning Summary:
   **Conversation Type:** [Classification]
   **Primary Topic:** [Main focus of discussion]
   **Duration:** [Conversation length]

   **Key Decisions:**
   - [Decision 1]
   - [Decision 2]

   **Entities Created/Modified:**
   - NPCs: [List]
   - Locations: [List]
   - Factions: [List]
   - Sessions: [List]

   **Action Items:**
   - [ ] [Action 1]
   - [ ] [Action 2]

   **Cross-References:**
   - Related sessions: [Links]
   - Related NPCs: [Links]
   - Related locations: [Links]

   **Next Steps:**
   - [Next step 1]
   - [Next step 2]

   **Campaign Continuity Notes:**
   [Important details for future reference]

4. Save Planning Notes:
   - Append to .working/planning_log.md
   - Update relevant entity files with cross-references
   - Tag with conversation classification

Output Format:
Clear, actionable summary with links to all relevant entities and files.
