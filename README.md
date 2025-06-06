# ZeroShell

A modern, browser-based virtual shell, file system, and scripting environment with a custom language (ZSL), advanced IDE, graphics, and extensibility.

---

## 🚀 Features

- **Virtual File System (VFS):** Hierarchical, in-memory, supports files, directories, metadata, permissions, and modules.
- **CLI Shell:** Realistic prompt, command history, tab-completion, aliases, chaining, and scripting.
- **File Operations:** `ls`, `cd`, `cat`, `mkdir`, `touch`, `rm`, `rmdir`, `mv`, `cp`, `find`, `tree`, `pwd`, `chmod`, `stat`, `history`, `clear`, `help`, `shutdown`, `whoami`, `su`, `date`, `tour`, and more.
- **Tab Completion:** Context-aware, supports files, directories, and extensions for all relevant commands.
- **File Editor:** Popup modal for editing files with keyboard shortcuts, accessibility, and autosave.
- **File Viewer/Preview:** Popup modal for viewing text and images (PNG/JPG/GIF as base64).
- **Image Support:** Generate random PNG images (`genimg`), view images, and store as base64 in the VFS.
- **Custom Language (ZSL):** Simple, extensible scripting language for automation, learning, and games.
- **Boot/Shutdown Animation:** Professional, animated boot and shutdown screens.
- **Accessibility:** Keyboard navigation, ARIA labels, focus management.
- **Extensible:** Modular command system, easy to add new commands or language features.
- **ZSL Studio IDE:** Floating, multi-tab, syntax-highlighted IDE for ZSL with run, open/save, and integration with the shell.

---

## 📝 ZSL Language: Next-Gen Features

ZSL is evolving into a powerful scripting language with:

- **Native Commands Layer:** Direct access to shell and system commands.
- **Virtual File System Access (VFS):** Read, write, and manage files from ZSL scripts.
- **Async Tasks / Background Jobs:** Run scripts or commands in the background.
- **Modules / Import System:** Import and use libraries and frameworks.
- **Events and Hooks:** Respond to system or user events in scripts.
- **Data Structures:** Arrays, maps, and more.
- **Custom Command System:** Define your own shell commands in ZSL.
- **Scripting & Compilation Mode:** Run interactively or compile scripts for performance.
- **Built-in Help System:** Get help on commands, functions, and libraries.
- **Control Flow:** `if`, `else`, `for`, `while`, etc.
- **Functions and Arguments:** User-defined and library functions.
- **Variable System:** Local, global, and environment variables.
- **Clean & Readable Syntax:** Designed for clarity and learning.

**Frameworks and Libraries:**  
- Math, graphics, games, utilities, and more—import and use in your scripts.

---

## 📚 ZSLang Libraries & Frameworks

- Place reusable ZSL code in `scripts/zslang/` as libraries or frameworks.
- Example: `scripts/zslang/mathlib.zs`, `scripts/zslang/gfxlib.zs`, `scripts/zslang/gamelib.zs`
- Import or copy code into your `.zs` scripts to use advanced features.

---

## 🎮 GFXLib: The Graphics Library for ZSL

You can use these graphics commands in your `.zs` scripts via **GFXLib** or directly:

- `gfx.clear [r g b]` — Clear the canvas to color (default black)
- `gfx.setPixel x y [r g b]` — Draw a pixel at (x, y) with color (default white)
- `gfx.drawRect x y w h [r g b]` — Draw a filled rectangle
- `gfx.drawLine x1 y1 x2 y2 [r g b]` — Draw a line
- `gfx.drawCircle x y radius [r g b]` — Draw a filled circle
- `gfx.text "txt" x y [size r g b]` — Draw text at (x, y)

**Or use the library wrappers:**
- `gfxlib.clear r g b`
- `gfxlib.drawBox x y w h r g b`
- `gfxlib.drawPixel x y r g b`
- `gfxlib.drawText txt x y`
- `gfxlib.drawTextColor txt x y r g b`
- `gfxlib.drawCircle x y radius r g b`
- `gfxlib.drawLine x1 y1 x2 y2 r g b`
- `gfxlib.fillScreen r g b`
- `gfxlib.drawFrame x y w h r g b`

**Example: Using GFXLib**
```
import "zslang/gfxlib.zs"
gfxlib.clear 0 0 0
gfxlib.drawBox 40 40 80 80 255 0 0
gfxlib.drawText "Hello GFXLib!" 60 140
```

- The canvas will appear below the terminal when a GFXLib command is used.
- **You can close/hide the canvas at any time with the × button in the top-right corner. If you can't see the button, try scrolling up.**
- You can also clear/hide the canvas with `gfx.clear` or `gfxlib.clear`.

---

## 🧑‍💻 ZSL Studio: The ZeroShell IDE

- Launch with: `zslstudio`
- Floating, resizable, closable window above the shell
- Multi-tab support (open multiple files, switch tabs)
- Simple syntax highlighting (keywords, numbers, strings)
- Open/save files, create new files, and run code directly from the IDE
- Run code in the shell and graphics canvas while the IDE is open
- Keyboard shortcuts: <kbd>Ctrl+S</kbd> (save), <kbd>Ctrl+Enter</kbd> (run), <kbd>Ctrl+W</kbd> (close tab), <kbd>Ctrl+N</kbd> (new file)
- All IDE code is organized in `scripts/ide/`
- Future: Expand with advanced features (auto-complete, docs, drag-and-drop, etc.)

**How to test:**
1. In the shell, type `zslstudio` and press Enter.
2. The ZSL Studio window will appear.
3. Use "Open" to select a `.zs` file, or "New" to create a new one.
4. Edit your code, switch tabs, and click "Run" to execute ZSL code (output appears in the shell/graphics).
5. Use keyboard shortcuts for efficiency.
6. Close the IDE window when done.

---

## 🛠️ Extending ZeroShell

- Add new commands in `scripts/commands/base` or `scripts/commands/special`.
- Add new language features in `scripts/tools/compilerEngine.js`.
- Add new UI features in `scripts/ui/` or `scripts/ide/`.
- Build and share ZSL libraries and frameworks in `scripts/zslang/`.

---

## 📄 See `status.md` for live project status, feedback, and next steps!
