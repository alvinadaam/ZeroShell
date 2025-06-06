function parse(input) {
  // Normalize common typos
  input = input.replace(/\bcd\.\./g, "cd ..")
               .replace(/\bls\.\b/g, "ls .")
               .replace(/\bcd\.\//g, "cd ./");

  // Split chained commands
  const commands = [];
  for (const part of input.split("&&")) {
    // Supports quoted arguments: touch "file with spaces.txt"
    const regex = /"([^"]+)"|[^\s"]+/g;
    const tokens = [];
    let match;
    while ((match = regex.exec(part.trim())) !== null) {
      tokens.push(match[1] !== undefined ? match[1] : match[0]);
    }
    if (tokens.length > 0) {
      const command = tokens.shift() || '';
      commands.push({ command, args: tokens });
    }
  }
  return commands;
}

export default parse;
