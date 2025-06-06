# ZeroShell & ZSLang Comprehensive Test Plan

---

## 🖼️ Graphics Canvas Close Button Test

**Test:**  
1. Create and run a `.zs` file with graphics output, for example:
   ```
   import "zslang/gfxlib.zs"
   gfxlib.clear 0 0 0
   gfxlib.drawBox 40 40 80 80 255 0 0
   gfxlib.drawText "Hello GFXLib!" 60 140
   ```
   Run it with `run testgfx.zs`.

2. When the graphics canvas appears below the terminal, look for the **× (close) button** in the top-right corner of the canvas.

3. Click the × button.

**Expected result:**  
- The graphics canvas should disappear immediately.
- Running another graphics script should show the canvas again.

**If the close button does not appear or does not work, please note the issue here.**

---

# ZeroShell & ZSLang Custom Command System Tests

---

## 1. Define and Run a Simple Custom Command

**Test:**  
Create `/zslang/cmds/greet.zscmd` with:
```
# Greets the user by name
command greet [name]
  print "Hello, " + name
end
```
- In the shell, run: `greet Adam`
- **Expected:** Output is `Hello, Adam`

---

## 2. Arguments, Chaining, and Piping

**Test:**  
Create `/zslang/cmds/echo2.zscmd`:
```
# Echoes two arguments
command echo2 [a b]
  print a + " " + b
end
```
- Run: `echo2 foo bar`
- **Expected:** Output is `foo bar`

---

## 3. Hot-Reloading

**Test:**  
- Edit `/zslang/cmds/greet.zscmd` to:
  ```
  # Greets the user with excitement
  command greet [name]
    print "Hello, " + name + "!"
  end
  ```
- Run: `greet Adam`
- **Expected:** Output is `Hello, Adam!` (change is immediate, no restart needed)

---

## 4. Command Listing and Help

**Test:**  
- Run: `help --u`
- **Expected:** Lists all user-defined commands (`greet`, `echo2`, etc.) with docstrings.

---

## 5. Command Conflict

**Test:**  
- Try to create `/zslang/cmds/ls.zscmd`:
  ```
  # Custom ls
  command ls
    print "This is my ls"
  end
  ```
- Run: `ls`
- **Expected:** User-defined `ls` runs if allowed, or a warning/prompt is shown about conflict.

---

## 6. Command Calls Another Command

**Test:**  
Create `/zslang/cmds/hello_and_echo.zscmd`:
```
# Calls greet and echo2
command hello_and_echo [x y]
  greet x
  echo2 x y
end
```
- Run: `hello_and_echo Adam Copilot`
- **Expected:**  
  ```
  Hello, Adam!
  Adam Copilot
  ```

---

## 7. VFS and Environment Access

**Test:**  
Create `/zslang/cmds/showfiles.zscmd`:
```
# Lists files in current directory
command showfiles
  native ls
end
```
- Run: `showfiles`
- **Expected:** Output is the same as `ls`

---

**Add more tests as you expand the custom command system!**
