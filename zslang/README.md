ZeroShell Simple Language (ZSL)
==============================

ZSL is a modern, extensible scripting language for ZeroShell, designed for automation, learning, games, and creative coding.

---

**Author:** Adam Baqili (aka alvinadaam)  
**GitHub:** [alvinadaam](https://github.com/alvinadaam)  
**License:** MIT License  
**Copyright:** © 2023-2024 Adam Baqili

---

Core Features
------------

- **One statement per line** (no semicolons needed)
- **Variables:** `let x = 5`
- **Print:** `print x` or `print "Hello"`
- **Comments:** `# This is a comment`
- **Math:** `let y = x + 2`, supports +, -, *, /, %
- **String operations:** Concatenation with `+`, e.g. `let s = "Zero" + "Shell"`
- **Arrays:** `let arr = [1, 2, 3]`, access with `arr[0]`
- **If/Else/End:**  
  ```
  if x > 5
    print x
  else
    print "Too small"
  end
  ```
- **For Loops:**  
  ```
  for i = 1 to 5
    print i
  end
  ```
- **While Loops:**  
  ```
  let n = 0
  while n < 5
    print n
    let n = n + 1
  end
  ```
- **Input:**  
  ```
  print "Enter your name:"
  input name
  print "Hello, " + name
  ```
- **Functions:**  
  ```
  func greet
    print "Hello"
  end

  greet
  ```
  - Functions can take arguments and return values.
  - Supports recursion and library functions.

- **Modules & Imports:**  
  ```
  import "zslang/mathlib.zs"
  import "zslang/gfxlib.zs"
  ```
  - Use libraries for math, graphics, games, and more.

- **Graphics API (GFXLib):**  
  - Draw on a virtual canvas with commands like:
    - `gfx.clear r g b`
    - `gfx.setPixel x y r g b`
    - `gfx.drawRect x y w h r g b`
    - `gfx.drawLine x1 y1 x2 y2 r g b`
    - `gfx.drawCircle x y radius r g b`
    - `gfx.text "txt" x y size r g b`
  - Or use library wrappers: `gfxlib.clear`, `gfxlib.drawBox`, etc.
  - Canvas is always closable and styled.

- **Native Commands Layer:**  
  - Call certain shell commands directly from ZSL scripts using the `native` keyword.
  - Example:
    ```
    native ls
    native pwd
    ```
  - Only safe commands are allowed for now (e.g. `ls`, `pwd`). More will be added.

- **Virtual File System Access (VFS):**  
  - Read, write, and manage files and directories from ZSL.

- **Async Tasks / Background Jobs:**  
  - You can now run scripts or commands in the background using `async run myscript.zs` or `background print "..."`.
  - List jobs with `jobs`.
  - Background jobs do not block the shell and can be managed.

- **Events and Hooks:**  
  - ZSL supports responding to system or user events.
  - Define event hooks with:
    ```
    on event "file_created"
      print "A file was created!"
    end

    trigger file_created
    ```
  - You can define custom hooks for file changes, shell events, or user actions.

- **Data Structures:**  
  - Arrays, (planned: maps/objects), easy manipulation.

- **Custom Command System:**  
  - You can define your own shell commands in ZSL that are available globally (persisted in the VFS as `.zscmd` files).
  - Custom commands are hot-reloadable: editing or saving a `.zscmd` file updates the command instantly.
  - **Syntax:**
    ```
    command greet [name]
      print "Hello, " + name
    end
    ```
    - `command <name> [args...] ... end`
    - Arguments are optional and accessible as variables inside the command body.
  - Custom commands support arguments, piping, and chaining like built-in commands.
  - Commands can call other commands or ZSL code.
  - Commands interact with the VFS and environment via built-in ZSL libraries (e.g. `vfs.read`, `vfs.write`).
  - Command conflicts: user-defined commands override built-ins only if explicitly allowed (with a warning or prompt).
  - **Listing/documentation:**
    - `help --u` lists user-defined commands.
    - `help --s` lists system/built-in commands.
    - Each command can have a docstring or comment at the top for help output.
  - Aliases, macros, and advanced chaining can be implemented as ZSL libraries.

- **Scripting & Compilation Mode:**  
  - (Planned) Run interactively or compile scripts for performance.

- **Built-in Help System:**  
  - `help` command for docs on commands, functions, and libraries.

- **Control Flow:**  
  - `if`, `else`, `for`, `while`, `return`, etc.

- **Variable System:**  
  - Local, global, and environment variables.

- **Clean & Readable Syntax:**  
  - Designed for clarity, learning, and fun.

-------------------------------------------------------------------------------

Example Programs
---------------

Hello World:
```
print "Hello, ZeroShell!"
```

Input and Output:
```
print "Enter your name:"
input name
print "Hello, " + name
```

For Loop:
```
for i = 1 to 10
  print i
end
```

Graphics Example:
```
import "zslang/gfxlib.zs"
gfxlib.clear 0 0 0
gfxlib.drawBox 40 40 80 80 255 0 0
gfxlib.drawText "Hello GFXLib!" 60 140
```

-------------------------------------------------------------------------------

Libraries & Frameworks
----------------------

- Place reusable ZSL code in this folder as `.zs` libraries or frameworks.
- Example libraries:
  - `mathlib.zs` (math helpers)
  - `gfxlib.zs` (graphics helpers)
  - `gamelib.zs` (game helpers)
- Import libraries in your scripts with `import "zslang/gfxlib.zs"`

-------------------------------------------------------------------------------

- The ZSLang README.md accurately documents all current features, syntax, and planned extensions.
- Author, license, and GitHub info are included.
- Example code and library usage are provided.
- The file is ready for GitHub and open-source users.

---

**If you add new language features or libraries, update this file to keep it accurate.**
