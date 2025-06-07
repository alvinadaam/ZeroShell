// ZSLang interpreter core (v0.4) - fix math parentheses, array methods, and array length

import { parse } from './parser.js';
import { stdlib } from './stdlib/index.js';
import { showInputModal } from '../../scripts/ui/inputModal.js';

// Add: Import support for .zs files in VFS
async function importLibrary(libName, vars, execLineAsync) {
  // Try to resolve VFS path for the library
  let vfsPath = libName.endsWith('.zs') ? libName : `scripts/zslang/${libName}.zs`;
  if (typeof window !== "undefined" && window.vfsManager) {
    const node = await window.vfsManager.getNode(vfsPath);
    if (node && node.type === "file") {
      // Parse and execute the imported file in the current variable scope
      const code = node.content;
      const lines = parse(code);
      vars.__zslang_funcs__ = vars.__zslang_funcs__ || {};
      let i = 0;
      while (i < lines.length) {
        const line = lines[i].trim();
        const funcMatch = line.match(/^func\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*(.*)$/);
        if (funcMatch) {
          const fname = funcMatch[1];
          const params = funcMatch[2] ? funcMatch[2].split(/\s+/).filter(Boolean) : [];
          let body = [];
          i++;
          while (i < lines.length && !/^end\s*$/.test(lines[i].trim())) {
            body.push(lines[i]);
            i++;
          }
          // Register as a callable JS function in vars.__zslang_funcs__
          vars.__zslang_funcs__[fname] = function(...callArgs) {
            // Local scope for function
            let localVars = Object.assign({}, vars);
            params.forEach((p, idx) => localVars[p] = callArgs[idx]);
            let ret = undefined;
            for (let j = 0; j < body.length; j++) {
              const bline = body[j].trim();
              if (bline.startsWith('return ')) {
                ret = evalExpr(bline.slice(7));
                break;
              } else if (bline === 'return') {
                break;
              } else {
                // Only support let, print, and nested function calls for now
                const btokens = bline.split(/\s+/);
                if (btokens[0] === 'let' && btokens[2] === '=') {
                  localVars[btokens[1]] = evalExpr(btokens.slice(3).join(' '));
                } else if (btokens[0] === 'print') {
                  let msg = evalExpr(btokens.slice(1).join(' '));
                  if (Array.isArray(msg)) msg = JSON.stringify(msg);
                  defaultTermOut(msg);
                } else if (btokens[0].match(/^[a-zA-Z_][a-zA-Z0-9_]*\(/)) {
                  evalExpr(bline);
                }
              }
            }
            return ret;
          };
        }
        i++;
      }
      // Also execute any top-level code (for side effects)
      for (let j = 0; j < lines.length; j++) {
        if (!/^func /.test(lines[j].trim())) {
          await execLineAsync(lines[j], vars);
        }
      }
      return true;
    }
  }
  return false;
}

export function runZSL(code, options = {}) {
  const lines = parse(code);
  const vars = {};
  function defaultTermOut(msg) {
    if (typeof window !== "undefined") {
      const termDiv = document.getElementById('terminal-output');
      if (termDiv) {
        const line = document.createElement('div');
        line.className = 'zs-output-line';
        line.textContent = msg;
        termDiv.appendChild(line);
        termDiv.scrollTop = termDiv.scrollHeight;
        return;
      }
    }
    console.log(msg);
  }
  const termOut =
    (options && typeof options.outputCb === 'function')
      ? options.outputCb
      : defaultTermOut;

  async function getInput(promptMsg) {
    if (options && typeof options.inputCb === 'function') {
      return await options.inputCb(promptMsg);
    }
    if (typeof showInputModal === "function") {
      return await showInputModal({ prompt: promptMsg, mode: "inline" });
    }
    if (typeof window !== "undefined" && window.showInputModal) {
      return await window.showInputModal({ prompt: promptMsg, mode: "inline" });
    }
    return prompt(promptMsg);
  }

  // Patch: Support calling imported ZSLang functions and capturing their return values for print
  function evalExpr(expr) {
    expr = expr.trim();

    // Parentheses
    if (expr.startsWith('(') && expr.endsWith(')')) {
      return evalExpr(expr.slice(1, -1));
    }

    // Function call: funcName(args...)
    let funcCall = expr.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\((.*)\)$/);
    if (funcCall) {
      const fname = funcCall[1];
      const argStr = funcCall[2];
      // Split args by comma, but allow for nested parentheses
      let args = [];
      let depth = 0, last = 0;
      for (let i = 0; i < argStr.length; i++) {
        if (argStr[i] === '(') depth++;
        if (argStr[i] === ')') depth--;
        if (argStr[i] === ',' && depth === 0) {
          args.push(argStr.slice(last, i).trim());
          last = i + 1;
        }
      }
      if (argStr.trim() !== '') args.push(argStr.slice(last).trim());

      // Try to find function in vars (imported ZSLang functions)
      if (vars.__zslang_funcs__ && typeof vars.__zslang_funcs__[fname] === "function") {
        return vars.__zslang_funcs__[fname](...args.map(evalExpr));
      }
      // Try to find function in stdlib
      let fn = (typeof stdlib === "object" && stdlib[fname]);
      if (typeof fn === "function") {
        return fn(...args.map(evalExpr));
      }
      // Fallback: just return as string
      return `${fname}(${args.join(",")})`;
    }

    // Array access: arr[0]
    let arrMatch = expr.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\[(\d+)\]$/);
    if (arrMatch) {
      let arr = vars[arrMatch[1]];
      let idx = Number(arrMatch[2]);
      if (Array.isArray(arr)) return arr[idx];
      return 0;
    }
    // Array length: arr.length
    let lenMatch = expr.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\.length$/);
    if (lenMatch) {
      let arr = vars[lenMatch[1]];
      if (Array.isArray(arr)) return arr.length;
      return 0;
    }
    // Array push/pop: arr.push(val), arr.pop()
    let pushMatch = expr.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\.push\((.+)\)$/);
    if (pushMatch) {
      let arr = vars[pushMatch[1]];
      let val = evalExpr(pushMatch[2]);
      if (Array.isArray(arr)) {
        arr.push(val);
        return arr;
      }
      return [];
    }
    let popMatch = expr.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\.pop\(\)$/);
    if (popMatch) {
      let arr = vars[popMatch[1]];
      if (Array.isArray(arr)) {
        arr.pop();
        return arr;
      }
      return [];
    }
    // Math: a + b, a - b, a * b, a / b, a % b (with parentheses support)
    // Operator precedence: *, /, % before +, -
    // Handle + and - (lowest precedence)
    let depth = 0, idx = -1, op = null;
    for (let i = expr.length - 1; i >= 0; i--) {
      if (expr[i] === ')') depth++;
      if (expr[i] === '(') depth--;
      if (depth === 0 && (expr[i] === '+' || expr[i] === '-') && i > 0) {
        op = expr[i];
        idx = i;
        break;
      }
    }
    if (idx !== -1) {
      const left = evalExpr(expr.slice(0, idx));
      const right = evalExpr(expr.slice(idx + 1));
      return op === '+' ? left + right : left - right;
    }
    // Handle *, /, %
    depth = 0; idx = -1; op = null;
    for (let i = expr.length - 1; i >= 0; i--) {
      if (expr[i] === ')') depth++;
      if (expr[i] === '(') depth--;
      if (depth === 0 && (expr[i] === '*' || expr[i] === '/' || expr[i] === '%')) {
        op = expr[i];
        idx = i;
        break;
      }
    }
    if (idx !== -1) {
      const left = evalExpr(expr.slice(0, idx));
      const right = evalExpr(expr.slice(idx + 1));
      if (op === '*') return left * right;
      if (op === '/') return left / right;
      if (op === '%') return left % right;
    }
    // Array literal
    if (/^\[.*\]$/.test(expr)) {
      try {
        return JSON.parse(expr.replace(/'/g, '"'));
      } catch {
        return [];
      }
    }
    // String literal
    if (/^".*"$/.test(expr)) return expr.replace(/^"|"$/g, '');
    // Number
    if (!isNaN(Number(expr))) return Number(expr);
    // Variable
    if (expr in vars) return vars[expr];
    return expr;
  }

  // Async execLine to support import
  async function execLineAsync(line, varsOverride) {
    const tokens = line.trim().split(/\s+/);
    const localVars = varsOverride || vars;
    if (tokens[0] === 'print') {
      let msg = tokens.slice(1).join(' ');
      msg = evalExpr(msg);
      if (Array.isArray(msg)) msg = JSON.stringify(msg);
      termOut(msg);
    } else if (tokens[0] === 'let' && tokens.length >= 4 && tokens[2] === '=') {
      const varName = tokens[1];
      let value = tokens.slice(3).join(' ');
      value = evalExpr(value);
      localVars[varName] = value;
    } else if (tokens[0] === 'input' && tokens.length >= 2) {
      const varName = tokens[1];
      const promptMsg = tokens.slice(2).join(' ') || `Input for ${varName}:`;
      const val = await getInput(promptMsg);
      localVars[varName] = val;
    } else if (tokens[0] === 'import' && tokens.length >= 2) {
      // import mathlib
      await importLibrary(tokens[1].replace(/['"]/g, ''), localVars, execLineAsync);
    } else if (tokens[0].includes('.') && tokens[0].includes('(')) {
      evalExpr(line);
    } else if (vars.__zslang_funcs__ && typeof vars.__zslang_funcs__[tokens[0]] === "function") {
      // Support: add(10, 5) as a statement
      const callExpr = line.trim();
      const result = evalExpr(callExpr);
      // If not assigned or printed, output result to terminal for user feedback
      if (typeof result !== "undefined") {
        termOut(result);
      }
    }
    // ...future: control flow, functions, etc.
  }

  async function exec() {
    for (let i = 0; i < lines.length; i++) {
      await execLineAsync(lines[i]);
    }
  }

  return exec();
}
