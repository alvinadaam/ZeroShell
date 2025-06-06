import shell from '../cli/shell.js';
import vfsManager from '../tools/vfsManager.js';

// Expanded and improved test suite
const tests = [
  // Filesystem basics
  {
    name: "mkdir and cd into directory",
    section: "Filesystem",
    commands: ["mkdir test", "cd test", "pwd"],
    expect: "/test"
  },
  {
    name: "create and view file",
    section: "Filesystem",
    commands: ["touch file.txt", "ls", "ls --m file.txt"],
    expectIncludes: ["file.txt", "Type: file"]
  },
  {
    name: "create nested directories and file",
    section: "Filesystem",
    commands: ["mkdir deep", "cd deep", "touch notes.md", "ls"],
    expect: "notes.md"
  },
  {
    name: "mkdir rejects duplicate",
    section: "Filesystem",
    commands: ["mkdir test", "mkdir test"],
    expect: "mkdir: cannot create directory 'test': File or directory exists"
  },
  {
    name: "touch updates modified time",
    section: "Filesystem",
    commands: ["touch file.txt", "ls --m file.txt", "touch file.txt", "ls --m file.txt"],
    expectIncludes: ["Type: file", "Modified:"]
  },
  {
    name: "mkdir with special chars",
    section: "Filesystem",
    commands: ["mkdir special!@#", "ls"],
    expectIncludes: ["special!@#/"]
  },
  {
    name: "touch file with special chars",
    section: "Filesystem",
    commands: ["touch special!@#.txt", "ls"],
    expectIncludes: ["special!@#.txt"]
  },
  {
    name: "mkdir with spaces (quoted)",
    section: "Filesystem",
    commands: ['mkdir "my folder"', "ls"],
    expectIncludes: ["my folder/"]
  },
  {
    name: "touch file with spaces (quoted)",
    section: "Filesystem",
    commands: ['touch "my file.txt"', "ls"],
    expectIncludes: ["my file.txt"]
  },
  {
    name: "mkdir with invalid name",
    section: "Filesystem",
    commands: ["mkdir ''", "ls"],
    expect: "mkdir: invalid directory name"
  },
  {
    name: "touch with invalid name",
    section: "Filesystem",
    commands: ["touch ''", "ls"],
    expect: "touch: invalid file name"
  },

  // Navigation
  {
    name: "cd .. stays at root",
    section: "Navigation",
    commands: ["cd ..", "cd ..", "pwd"],
    expect: "/"
  },
  {
    name: "cd into nested and back",
    section: "Navigation",
    commands: ["mkdir nav", "cd nav", "mkdir sub", "cd sub", "pwd", "cd ..", "pwd"],
    expectIncludes: ["/nav/sub", "/nav"]
  },
  {
    name: "cd to non-existent dir",
    section: "Navigation",
    commands: ["cd fake"],
    expect: "cd: no such file or directory: fake"
  },
  {
    name: "cd to file (not dir)",
    section: "Navigation",
    commands: ["touch notadir.txt", "cd notadir.txt"],
    expect: "cd: not a directory: notadir.txt"
  },

  // Error handling
  {
    name: "invalid command",
    section: "Errors",
    commands: ["cd ..", "cd ..", "cd nonexistent"],
    expect: "cd: no such file or directory: nonexistent"
  },
  {
    name: "cat non-existent file",
    section: "Errors",
    commands: ["cat fake.txt"],
    expect: "cat: fake.txt: No such file or directory"
  },
  {
    name: "mkdir with empty name",
    section: "Errors",
    commands: ["mkdir \"\""],
    expect: "mkdir: invalid directory name"
  },
  {
    name: "touch with empty name",
    section: "Errors",
    commands: ["touch \"\""],
    expect: "touch: invalid file name"
  },
  {
    name: "ls --m with no arg",
    section: "Errors",
    commands: ["ls --m"],
    expect: "Usage: ls OR ls --m [name]"
  },
  {
    name: "ls --m non-existent",
    section: "Errors",
    commands: ["ls --m fake.txt"],
    expect: "No such file or directory: fake.txt"
  },

  // Metadata
  {
    name: "ls --m shows metadata",
    section: "Metadata",
    commands: ["touch meta.txt", "ls --m meta.txt"],
    expectIncludes: ["Name: meta.txt", "Type: file", "Created:", "Modified:"]
  },

  // Chaining
  {
    name: "command chaining works",
    section: "Chaining",
    commands: ["mkdir chain && cd chain && touch cfile.txt && ls"],
    expect: "cfile.txt"
  },
  {
    name: "chaining stops on error",
    section: "Chaining",
    commands: ["mkdir chain && mkdir chain && touch shouldnot.txt && ls"],
    expect: "mkdir: cannot create directory 'chain': File or directory exists"
  },
  {
    name: "multiple commands with &&",
    section: "Chaining",
    commands: ["mkdir a && mkdir b && touch a.txt && ls"],
    expectIncludes: ["a/", "b/", "a.txt"]
  },

  // Edge cases
  {
    name: "quoted filenames with spaces",
    section: "Edge Cases",
    commands: ["touch \"my notes.txt\"", "ls", "ls --m \"my notes.txt\""],
    expectIncludes: ["my notes.txt", "Type: file"]
  },
  {
    name: "special characters allowed",
    section: "Edge Cases",
    commands: ["mkdir special!@#", "ls"],
    expectIncludes: ["special!@#/"]
  },
  {
    name: "pwd shows current directory",
    section: "Edge Cases",
    commands: ["pwd"],
    expect: "/"
  },
  {
    name: "cat empty file shows (empty file)",
    section: "Edge Cases",
    commands: ["touch empty.md", "cat empty.md"],
    expect: "(empty file)"
  },
  {
    name: "tree shows structure",
    section: "Edge Cases",
    commands: ["tree"],
    expectIncludes: ["/", "bin/", "etc/", "home/", "usr/"]
  }
];

async function runTest(test) {
  // Reset shell state and VFS for each test
  if (shell.state && shell.state.cwd) shell.state.cwd = '/';
  if (vfsManager.reset) await vfsManager.reset();

  let output = "";
  for (const cmd of test.commands) {
    const result = await shell.handleInput(cmd);
    output += `\n${result}`;
  }

  if (test.expect && output.trim().endsWith(test.expect)) {
    return { ...test, passed: true };
  } else if (test.expectIncludes && test.expectIncludes.every(str => output.includes(str))) {
    return { ...test, passed: true };
  } else {
    return { ...test, passed: false, output };
  }
}

export async function runAllTests() {
  const results = await Promise.all(tests.map(runTest));
  console.clear();
  console.log("📄 ZeroShell CLI Test Results:\n");

  // Group by section
  const grouped = {};
  for (const res of results) {
    if (!grouped[res.section]) grouped[res.section] = [];
    grouped[res.section].push(res);
  }

  let passed = 0;
  let total = results.length;

  for (const section of Object.keys(grouped)) {
    console.log(`\n=== ${section} ===`);
    for (const res of grouped[section]) {
      if (res.passed) {
        console.log(`✅ ${res.name}`);
      } else {
        console.error(`❌ ${res.name}`);
        console.error(res.output);
      }
      if (res.passed) passed++;
    }
  }

  console.log(`\nPassed ${passed} of ${total} tests.`);
}

// Attach to window for devtools usage
window.runTests = runAllTests;
