# ZeroShell Project Status & Feedback

---

## ⚠️ ZSLang Rebuild In Progress

- The ZSLang interpreter and all related code have been removed.
- We are starting a complete redesign and rebuild of the ZSLang language and engine.
- All previous ZSLang features, tests, and documentation are now obsolete.
- ZeroShell core (CLI, VFS, IDE, etc.) remains functional and ready for integration with the new ZSLang.

---

## Next Steps

- Design and implement a new ZSLang interpreter from scratch.
- Update documentation and tests as the new language takes shape.
- Collaborate on language design, syntax, and features before coding.

---

## 💡 ZSLang Rebuild: Ideas for New Structure

**Goal:**  
Design a clean, modular, and maintainable folder/file structure for the new ZSLang engine that is easy to integrate with `compilerEngine.js` and the rest of ZeroShell.

### Suggested Folder Structure

```
zslang/
  engine/
    index.js         # Main entry point, exports runZSL (ES6)
    parser.js        # Tokenizer and parser for ZSLang
    ast.js           # AST node definitions and helpers
    interpreter.js   # Main interpreter (core logic)
    stdlib/          # Built-in functions, math, string, array, etc.
      math.js
      string.js
      array.js
    runtime.js       # Runtime helpers, environment, variable scope
    errors.js        # Error types and error handling
    types.js         # Type system (if needed)
    utils.js         # Utility functions
  tests/
    ...              # ZSLang unit tests and script samples
```

### Integration

- `engine/index.js` should always export `runZSL` as an ES6 export:
  ```js
  export function runZSL(code, options) { ... }
  ```
- `compilerEngine.js` should import and re-export `runZSL` for compatibility:
  ```js
  import { runZSL } from '../../zslang/engine/index.js';
  export { runZSL };
  ```
- All ZSLang logic should be inside `zslang/engine/` and not leak into other folders.
- Standard library functions can be in `zslang/engine/stdlib/` for modularity.

### Benefits

- Easy to maintain and extend (add new features, stdlib, etc.).
- Clean separation between parser, interpreter, runtime, and stdlib.
- Easy to test and debug individual modules.
- Simple integration with the rest of ZeroShell and the website.

---

## 🚀 ZSLang Rebuild: New Engine Scaffolded

- New modular folder structure for ZSLang engine is created.
- Minimal interpreter is working: supports `print` statements.
- `compilerEngine.js` is linked to the new ZSLang engine.
- Next: expand parser/interpreter for variables, math, control flow, stdlib, etc.

---

**If you have ideas for the new ZSLang, add them here or in a new design doc.**
