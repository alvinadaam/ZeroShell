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

## 📦 Project Structure

- **`index.html`** - The main HTML file to launch ZeroShell.
- **`/scripts`** - Contains all the JavaScript, HTML, and CSS files for ZeroShell.
  - **`/commands`** - Custom commands for the shell.
  - **`/ide`** - Code for the ZSL Studio IDE.
  - **`/tools`** - Compiler and language tools.
  - **`/ui`** - User interface components.
  - **`/zslang`** - ZSL libraries and frameworks.
- **`/assets`** - Images, icons, and other assets.
- **`/docs`** - Documentation and project notes.
- **`/tests`** - Automated tests for ZeroShell.

---

## 🧑‍💻 Authors & License

- **Author:** Adam Baqili (aka alvinadaam)
- **GitHub:** [alvinadaam](https://github.com/alvinadaam)
- **Copyright:** © 2023-2024 Adam Baqili
- **License:** MIT License

---

## 📝 Wiki & Documentation

For detailed documentation, tutorials, and examples, visit the [ZeroShell Wiki](https://github.com/alvinadaam/ZeroShell/wiki).

---

## 📢 Legal & Usage

ZeroShell is free and open-source software released under the MIT License.  
You may use, modify, and distribute this project for personal, educational, or commercial purposes, provided you retain the copyright.

---

## 🌐 Hosting & Deployment

- ZeroShell is fully client-side and can be hosted on any static web server or GitHub Pages.
- To deploy:
  1. Clone or download this repository.
  2. Open `index.html` in your browser, or upload the project to your web host.
  3. For GitHub Pages, push to your repo and enable Pages in repo settings.

---

## 🤝 Contributing

We welcome contributions, ideas, and feedback from everyone!

- Open an issue on GitHub for bugs, feature requests, or questions.
- Submit a pull request to propose code changes or improvements.
- For major changes, please discuss them in an issue first.
- If you have suggestions for documentation or examples, feel free to update the README or add files.

**Let's build ZeroShell together!**

---

## ⭐️ Star & Share

If you like ZeroShell, please star the repo and share it with others!

---

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

- The README.md is up to date for GitHub, with author, license, usage, and contribution info.
- All major features, usage, and project structure are documented.
- The file is ready for open-source hosting and onboarding new users/contributors.

---

## Advanced Features (Planned / In Progress)

- Async/background jobs
- Events and hooks
- Custom command system
- Compilation mode
- More data structures (maps, sets, etc.)
- More frameworks (UI, networking, etc.)

---

**If you find any missing or outdated info, you can update this README at any time.**
