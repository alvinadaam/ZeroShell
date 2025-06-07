# ZeroShell & ZSLang Fresh Test Sheet

---

## 1. Math Library Import

- Script:
  ```
  import mathlib
  print add(10, 5)
  print mul(3, 4)
  print pow(2, 8)
  print abs(-7)
  print clamp(15, 0, 10)
  ```
- **Expected:** `15`, `12`, `256`, `7`, `10`
- _Result:_
/$ edit "1.zs"
Editing 1.zs...
/$ run "1.zs"
add(10, 5)
mul(3, 4)
pow(2, 8)
abs(-7)
clamp(15, 0, 10)
(program finished)
- _Comments:_


---

## 2. String Library Import

- Script:
  ```
  import stringlib
  print upper("hello")
  print lower("WORLD")
  print len("abcde")
  print contains("hello world", "world")
  ```
- **Expected:** `HELLO`, `world`, `5`, `1`
- _Result:_
/$ edit "2.zs"
Editing 2.zs...
/$ run "2.zs"
upper("hello")
lower("WORLD")
len("abcde")
contains("hello world", "world")
(program finished)
- _Comments:_


---

## 3. Array Library Import

- Script:
  ```
  import arraylib
  let arr = [1,2,3]
  print len(arr)
  print join(arr, "-")
  arr.push(4)
  print arr
  arr.pop()
  print arr
  print contains(arr, 2)
  ```
- **Expected:** `3`, `1-2-3`, `[1,2,3,4]`, `[1,2,3]`, `1`
- _Result:_
  /$ run "3.zs"
  len(arr)
  join(arr, "-")
  [1,2,3,4]
  [1,2,3]
  contains(arr, 2)
  (program finished)
- _Comments:_


---

## 4. Graphics Library Import

- Script:
  ```
  import gfxlib
  clear(0,0,0)
  drawRect(10,10,50,50,255,0,0)
  drawText("Hello GFX!", 20, 80)
  ```
- **Expected:** Graphics canvas clears, draws a red rectangle, and shows text.
- _Result:_
  /$ run "graphicstest.zs"
  (program finished)
- _Comments:_


---

## 5. Game Library Import (if present)

- Script:
  ```
  import gamelib
  drawPlayer(50, 50)
  drawEnemy(100, 100)
  drawScore(42)
  ```
- **Expected:** Player and enemy graphics, score text.
- _Result:_
  /$ run "game.zs"
  (program finished)
- _Comments:_

---

**Update this file as you test each library and feature!**
