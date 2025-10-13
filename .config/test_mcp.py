#!/usr/bin/env python3
"""
Test MCP servers via stdio protocol
"""
import json
import subprocess
import sys

def test_format_validator():
    """Test format-validator MCP"""
    print("=" * 70)
    print("TESTING FORMAT-VALIDATOR MCP")
    print("=" * 70)
    print()

    server_path = ".config/mcp-servers/format-validator/server.js"

    # Test 1: List tools
    print("Test 1: List available tools")
    print("-" * 70)
    request = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/list"
    }

    proc = subprocess.Popen(
        ["node", server_path],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    stdout, stderr = proc.communicate(json.dumps(request) + "\n")

    # Parse response
    lines = stdout.strip().split('\n')
    for line in lines:
        try:
            response = json.loads(line)
            if 'result' in response:
                print("✅ Tools list retrieved:")
                for tool in response['result'].get('tools', []):
                    print(f"   - {tool['name']}: {tool['description'][:60]}...")
        except json.JSONDecodeError:
            continue
    print()

    # Test 2: Validate valid PC file
    print("Test 2: Validate valid PC file")
    print("-" * 70)
    request = {
        "jsonrpc": "2.0",
        "id": 2,
        "method": "tools/call",
        "params": {
            "name": "validate_document_format",
            "arguments": {
                "file_path": ".config/test_fixtures/TEST_PC_Valid.md",
                "entity_type": "PC",
                "use_subagent": False
            }
        }
    }

    proc = subprocess.Popen(
        ["node", server_path],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    stdout, stderr = proc.communicate(json.dumps(request) + "\n")

    lines = stdout.strip().split('\n')
    for line in lines:
        try:
            response = json.loads(line)
            if 'result' in response:
                content = response['result'].get('content', [])
                if content:
                    result = json.loads(content[0]['text'])
                    print(f"Valid: {result.get('valid')}")
                    if result.get('errors'):
                        print(f"Errors: {result['errors']}")
                    if result.get('warnings'):
                        print(f"Warnings: {result['warnings']}")
                    print(f"Info: {result.get('info', [])[:3]}")
        except (json.JSONDecodeError, KeyError):
            continue
    print()

    # Test 3: Validate invalid PC file
    print("Test 3: Validate invalid PC file")
    print("-" * 70)
    request = {
        "jsonrpc": "2.0",
        "id": 3,
        "method": "tools/call",
        "params": {
            "name": "validate_document_format",
            "arguments": {
                "file_path": ".config/test_fixtures/TEST_PC_Invalid.md",
                "entity_type": "PC",
                "use_subagent": False
            }
        }
    }

    proc = subprocess.Popen(
        ["node", server_path],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    stdout, stderr = proc.communicate(json.dumps(request) + "\n")

    lines = stdout.strip().split('\n')
    for line in lines:
        try:
            response = json.loads(line)
            if 'result' in response:
                content = response['result'].get('content', [])
                if content:
                    result = json.loads(content[0]['text'])
                    print(f"Valid: {result.get('valid')}")
                    print(f"Errors ({len(result.get('errors', []))}):")
                    for error in result.get('errors', [])[:5]:
                        print(f"   - {error}")
        except (json.JSONDecodeError, KeyError):
            continue
    print()

def test_workflow_enforcer():
    """Test workflow-enforcer MCP"""
    print("=" * 70)
    print("TESTING WORKFLOW-ENFORCER MCP")
    print("=" * 70)
    print()

    server_path = ".config/mcp-servers/workflow-enforcer/server.js"
    workflow_id = None

    # Test 1: Start workflow
    print("Test 1: Start workflow")
    print("-" * 70)
    request = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/call",
        "params": {
            "name": "start_workflow",
            "arguments": {
                "workflow_type": "encounter_generation",
                "context": {"test": True}
            }
        }
    }

    proc = subprocess.Popen(
        ["node", server_path],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    stdout, stderr = proc.communicate(json.dumps(request) + "\n")

    lines = stdout.strip().split('\n')
    for line in lines:
        try:
            response = json.loads(line)
            if 'result' in response:
                content = response['result'].get('content', [])
                if content:
                    result = json.loads(content[0]['text'])
                    workflow_id = result.get('workflow_id')
                    print(f"✅ Workflow started: {workflow_id}")
                    print(f"Current stage: {result.get('current_stage')}")
                    print(f"Required next: {result.get('required_next_stage')}")
        except (json.JSONDecodeError, KeyError):
            continue
    print()

    if not workflow_id:
        print("❌ Failed to get workflow_id")
        return

    # Test 2: Valid transition
    print("Test 2: Valid transition (present_options → user_selection)")
    print("-" * 70)
    request = {
        "jsonrpc": "2.0",
        "id": 2,
        "method": "tools/call",
        "params": {
            "name": "transition_workflow",
            "arguments": {
                "workflow_id": workflow_id,
                "next_stage": "user_selection"
            }
        }
    }

    proc = subprocess.Popen(
        ["node", server_path],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    stdout, stderr = proc.communicate(json.dumps(request) + "\n")

    lines = stdout.strip().split('\n')
    for line in lines:
        try:
            response = json.loads(line)
            if 'result' in response:
                content = response['result'].get('content', [])
                if content:
                    result = json.loads(content[0]['text'])
                    print(f"Allowed: {result.get('allowed')}")
                    print(f"Current stage: {result.get('current_stage')}")
        except (json.JSONDecodeError, KeyError):
            continue
    print()

    # Test 3: Invalid transition
    print("Test 3: Invalid transition (user_selection → save_content)")
    print("-" * 70)
    request = {
        "jsonrpc": "2.0",
        "id": 3,
        "method": "tools/call",
        "params": {
            "name": "transition_workflow",
            "arguments": {
                "workflow_id": workflow_id,
                "next_stage": "save_content"
            }
        }
    }

    proc = subprocess.Popen(
        ["node", server_path],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    stdout, stderr = proc.communicate(json.dumps(request) + "\n")

    lines = stdout.strip().split('\n')
    for line in lines:
        try:
            response = json.loads(line)
            if 'result' in response:
                content = response['result'].get('content', [])
                if content:
                    result = json.loads(content[0]['text'])
                    print(f"Allowed: {result.get('allowed')}")
                    if result.get('error'):
                        print(f"Error: {result['error']}")
        except (json.JSONDecodeError, KeyError):
            continue
    print()

    # Test 4: Get workflow status
    print("Test 4: Get workflow status")
    print("-" * 70)
    request = {
        "jsonrpc": "2.0",
        "id": 4,
        "method": "tools/call",
        "params": {
            "name": "get_workflow_status",
            "arguments": {
                "workflow_id": workflow_id
            }
        }
    }

    proc = subprocess.Popen(
        ["node", server_path],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    stdout, stderr = proc.communicate(json.dumps(request) + "\n")

    lines = stdout.strip().split('\n')
    for line in lines:
        try:
            response = json.loads(line)
            if 'result' in response:
                content = response['result'].get('content', [])
                if content:
                    result = json.loads(content[0]['text'])
                    print(f"Found: {result.get('found')}")
                    print(f"Type: {result.get('type')}")
                    print(f"Current stage: {result.get('current_stage')}")
                    print(f"Valid next stages: {result.get('valid_next_stages')}")
        except (json.JSONDecodeError, KeyError):
            continue
    print()

if __name__ == '__main__':
    test_format_validator()
    print()
    test_workflow_enforcer()
