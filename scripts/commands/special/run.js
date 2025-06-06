import { formatError, escapeHTML } from '../../tools/utils.js';
import { runZSL } from '../../tools/compilerEngine.js';

const run = async function(args, shellState, vfsManager) {
  const cwd = shellState.cwd || "/";
  const fileArg = args[0];
  if (!fileArg) return formatError("run: missing file name");
  const filePath = vfsManager.resolvePath(fileArg, cwd);
  const node = await vfsManager.getNode(filePath);

  if (!node) return formatError(`run: ${escapeHTML(fileArg)}: No such file`);
  if (node.type !== "file") return formatError(`run: ${escapeHTML(fileArg)}: Not a file`);
  if (!fileArg.endsWith('.zs') && !fileArg.endsWith('.zsl')) return formatError("run: only .zs or .zsl files are supported");

  let outputLines = [];
  await runZSL(node.content, null, (out) => outputLines.push(escapeHTML(String(out))));
  return outputLines.length ? outputLines.join('<br>') : "(program finished)";
};

export default run;
