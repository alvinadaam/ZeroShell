// Minimal ZSLang parser (v0.1)

export function parse(code) {
  // Split code into non-empty, non-comment lines
  return code
    .split('\n')
    .map(line => line.replace(/#.*$/, '').trim())
    .filter(line => line.length > 0);
}
