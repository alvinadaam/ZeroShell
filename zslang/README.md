# ZeroShell Simple Language (ZSL)

---

**ZSLang is being rebuilt from scratch.**  
All previous language features, syntax, and documentation are deprecated until the new ZSLang is implemented.

---

## ⚡️ New ZSLang Engine Structure

```
zslang/
  engine/
    index.js         # Main entry point, exports runZSL (ES6)
    parser.js        # Tokenizer and parser for ZSLang
    ast.js           # AST node definitions and helpers (planned)
    interpreter.js   # Main interpreter (core logic)
    stdlib/          # Built-in functions, math, string, array, etc.
      math.js
      string.js
      array.js
    runtime.js       # Runtime helpers, environment, variable scope (planned)
    errors.js        # Error types and error handling (planned)
    types.js         # Type system (planned)
    utils.js         # Utility functions (planned)
  tests/
    ...              # ZSLang unit tests and script samples
  scripts/
    zslang/
      mathlib.zs     # Math library (ZSLang)
      stringlib.zs   # String library (ZSLang)
      arraylib.zs    # Array library (ZSLang)
      gfxlib.zs      # Graphics library (ZSLang)
```

---

## 🏗️ High-Level Design

- **Goal:**  
  ZSLang is a simple, readable, and extensible scripting language for ZeroShell, designed for automation, learning, and creative coding.
- **Philosophy:**  
  - Minimal, clear syntax (inspired by Python/BASIC).
  - One statement per line, no semicolons.
  - Easy to extend with new features and libraries.
  - Tight integration with ZeroShell's CLI, VFS, and graphics.

---

## 🔬 Low-Level Architecture

- **Parser:**  
  - Converts code into tokens and lines.
  - Will support expressions, variables, control flow, and function definitions.
- **Interpreter:**  
  - Executes parsed code line by line.
  - Handles built-in statements (print, let, if, for, etc.).
  - Calls standard library functions from `stdlib/` and `.zs` libraries from VFS.
- **AST (planned):**  
  - For more advanced features, an AST will be used for parsing and execution.
- **Runtime:**  
  - Manages variable scope, environment, and execution context.
- **Error Handling:**  
  - Graceful error messages, no crashes.
- **Extensibility:**  
  - Add new built-ins and libraries by dropping files in `stdlib/` or `scripts/zslang/`.
