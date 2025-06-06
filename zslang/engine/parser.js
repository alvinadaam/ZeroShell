// ZSL Parser and Tokenizer

function parseLines(code) {
  return code
    .split('\n')
    .map(line => line.replace(/#.*$/, '').trim())
    .filter(line => line.length > 0);
}

function tokenize(line) {
  const tokens = [];
  let current = '';
  let inString = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inString = !inString;
      current += c;
    } else if (/\s/.test(c) && !inString) {
      if (current) tokens.push(current);
      current = '';
    } else {
      current += c;
    }
  }
  if (current) tokens.push(current);
  return tokens;
}

export { parseLines, tokenize };
