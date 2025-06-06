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
```

---

## ✅ Minimal Working Example

- Only `print` statements are supported for now.
- Example:
  ```
  print "Hello, ZeroShell!"
  ```

---

## Next Steps

- Expand parser and interpreter for variables, math, control flow, etc.
- Add tests and documentation as features are added.

---

**Stay tuned for the next generation of ZSLang!**
