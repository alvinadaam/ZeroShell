# gfxlib.zs - Optimized graphics helpers for ZSL

func clear r g b
  gfx.clear r g b
end

func drawBox x y w h r g b
  gfx.drawRect x y w h r g b
end

func drawPixel x y r g b
  gfx.setPixel x y r g b
end

func drawText txt x y
  gfx.text txt x y 16 255 255 255
end

func drawTextColor txt x y r g b
  gfx.text txt x y 16 r g b
end

func drawCircle x y radius r g b
  gfx.drawCircle x y radius r g b
end

func drawLine x1 y1 x2 y2 r g b
  gfx.drawLine x1 y1 x2 y2 r g b
end

func fillScreen r g b
  gfx.clear r g b
end

func drawFrame x y w h r g b
  drawLine x y (x+w) y r g b
  drawLine (x+w) y (x+w) (y+h) r g b
  drawLine (x+w) (y+h) x (y+h) r g b
  drawLine x (y+h) x y r g b
end
