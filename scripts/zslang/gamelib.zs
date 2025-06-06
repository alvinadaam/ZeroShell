# gamelib.zs - Game helpers for ZSL (uses mathlib and gfxlib)

import "zslang/mathlib.zs"
import "zslang/gfxlib.zs"

func drawPlayer x y
  gfx.drawCircle x y 10 0 255 0
  drawFrame (x-10) (y-10) 20 20 0 200 0
end

func drawEnemy x y
  gfx.drawRect x y 16 16 255 0 0
  drawFrame x y 16 16 100 0 0
end

func randomColor n
  return mod(n * 77, 255)
end

func drawScore score
  drawTextColor "Score: " + score 10 20 255 255 0
end

func drawHealth hp
  drawTextColor "HP: " + hp 10 40 255 100 100
end

func drawGameOver
  drawTextColor "GAME OVER" 100 120 255 0 0
end

func drawWin
  drawTextColor "YOU WIN!" 100 120 0 255 0
end
