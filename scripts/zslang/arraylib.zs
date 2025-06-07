# arraylib.zs - Array utilities for ZSLang

func len arr
  return arr.length
end

func push arr val
  arr.push(val)
  return arr
end

func pop arr
  arr.pop()
  return arr
end

func join arr sep
  let out = ""
  for i = 0 to arr.length - 1
    out = out + arr[i]
    if i < arr.length - 1
      out = out + sep
    end
  end
  return out
end

func indexOf arr val
  for i = 0 to arr.length - 1
    if arr[i] == val
      return i
    end
  end
  return -1
end

func contains arr val
  return indexOf(arr, val) != -1
end

func slice arr start end_
  let out = []
  for i = start to end_ - 1
    out.push(arr[i])
  end
  return out
end
