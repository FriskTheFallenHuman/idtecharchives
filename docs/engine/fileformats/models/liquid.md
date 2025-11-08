---
description: Liquid Model (.liquid)
---

import ReactPlayer from "react-player";

# Liquid Model (.liquid)

---

## Overview

---

:::note

Not to be confused by Liquid Physics, this article its for the rather unused Model Liquid

:::

Model Liquids are a rather special mode, they don't use a model mesh per say, but uses a `.liquid` file in the `liquid/` folder under
the game folder.

Liquid models are unique in the sense that they are create in runtime under the contents of the `.liquid` file:

```C
seed 1337420

size_x 256
size_y 256
verts_x 16
verts_y 16
liquid_type 2
density 0.97
drop_height 4
drop_radius 4
drop_delay 1.0
update_rate 30
shader textures/base_floor/conc_panel02
```

Would create something like this:

`testModel models/water2.liquid`

<ReactPlayer controls src='https://www.youtube.com/watch?v=uxGFbWrluTA' />
    
## Breakdown

A `.liquid` file consist of the next :

- **size_x/size_y**: In Units, defines the size of the liquid plane.
- **verts_x**: Must be at least two per axis.
- **verts_y**: `scale_y = size_y / ( verts_y - 1 )`
- **liquid_type**: defines the deform; must be 1, 2 or 3.
- **density**: The actual "density" of a liquid, but rather a percentage of time of animation in which it deforms?
- **drop_height**:
- **drop_radius**:
- **drop_delay**: In Seconds, controls how many second it takes for the liquid to rest.
- **update_rate**: Dictates how fast the animation is. in hz [60 >= val > 0].
- **shader**: The texture to be use for this liquid.
