# mathlib.zs - Essential math utilities for ZSLang

func add a b
  return a + b
end

func sub a b
  return a - b
end

func mul a b
  return a * b
end

func div a b
  if b == 0
    return 0
  end
  return a / b
end

func mod a b
  return a % b
end

func abs x
  if x < 0
    return 0 - x
  end
  return x
end

func max a b
  if a > b
    return a
  end
  return b
end

func min a b
  if a < b
    return a
  end
  return b
end

func pow a b
  let r = 1
  for i = 1 to b
    let r = r * a
  end
  return r
end

func clamp x lo hi
  if x < lo
    return lo
  end
  if x > hi
    return hi
  end
  return x
end

func avg a b
  return (a + b) / 2
end

func sign x
  if x > 0
    return 1
  end
  if x < 0
    return -1
  end
  return 0
end
