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
