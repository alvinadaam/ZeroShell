# stringlib.zs - String utilities for ZSLang

func len s
  return s.length
end

func upper s
  # Converts to uppercase (ASCII only)
  let out = ""
  for i = 0 to s.length - 1
    let c = s[i]
    if c >= "a" && c <= "z"
      let code = c.charCodeAt(0) - 32
      out = out + String.fromCharCode(code)
    else
      out = out + c
    end
  end
  return out
end

func lower s
  # Converts to lowercase (ASCII only)
  let out = ""
  for i = 0 to s.length - 1
    let c = s[i]
    if c >= "A" && c <= "Z"
      let code = c.charCodeAt(0) + 32
      out = out + String.fromCharCode(code)
    else
      out = out + c
    end
  end
  return out
end

func startsWith s prefix
  return s[0:prefix.length] == prefix
end

func endsWith s suffix
  return s[s.length-suffix.length:] == suffix
end

func contains s sub
  # Returns 1 if sub is in s, else 0
  let i = 0
  while i <= s.length - sub.length
    if s[i:i+sub.length] == sub
      return 1
    end
    let i = i + 1
  end
  return 0
end
