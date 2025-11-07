---
description: Ascii Scene Export (.ase)
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Ascii Scene Export (.ase)

---

## Overview

---
ASE stands for Ascii Scene Export. This is an ascii text based format associated with 3DS Max. It is not limited to that application, but support in other applications is dependent on import/export scripts or plugins.

The Doom 3 engine uses the ASE format for static meshes.

## Export

---
- iddevnet model export page
- Maya can export ASE’s using the ActorX plugin.
- Blender via [export plugin](https://github.com/FriskTheFallenHuman/D3ModdingKit/tree/master/blender)

## File Format Syntax

---
**Format:** The format is based on identifiers, as in:

```cpp
    *AN_IDENTIFIER
```

This is followed by zero or more values, or a subset of more identifiers surrounded by curly braces.

Most of the time when working with ASE’s, you will find that you have to open them to manually link the materials to a specified material shader. For example, the format for the material list may look like this when exported from actorx:

```cpp
    *MATERIAL_LIST {
        *MATERIAL_COUNT 2
        *MATERIAL 0 {
            *MATERIAL_NAME "myMaterial"
            *MATERIAL_CLASS "Standard"
            *MAP_DIFFUSE {
                *MAP_CLASS "Bitmap"
                *BITMAP "None"
            }
        }
    }
```

Where it says:

```cpp
    *BITMAP "none"
```

You must replace this with a reference to a doom material shader, like so:

```cpp
    *BITMAP "//base/models/mapobjects/myModel/myShader"
```

Occasionally, for some unknown reason this reference doesn’t work in which case you should try…

```cpp
    *BITMAP "//purgatory/purgatory/models/mapobjects/myModel/myShader"
```
…or…

```cpp
    *BITMAP "//doom3/base/models/mapobjects/myModel/myShader"
```

:::tip[Changes in different branchs]

<Tabs>
  <TabItem value="quake4" label="Quake IV">
      Quake IV hardcode its path unlike Doom 3 where they just hardcode the mod folder name, so something like this:

      `//base` or `//purgatory/purgatory`

      it is now:

      `C:\Ritual\Q4ritual\game\q4base` and `*BITMAP "C:\Ritual\Q4ritual\game\q4base\material\name"`
  </TabItem>
  <TabItem value="etqw" label="Enemy Territory:QW">
      Unlike Quake IV, ET:QW reverted the approach that Quake IV did and instead of hardcode paths
      it now uses:

      `*MATERIAL_NAME "material/name"` eg: `*MATERIAL_NAME "textures/models/mymodel"`

      meaning they just references the shader (texture) and skips the mod folder at al.
  </TabItem>
</Tabs>

:::

:::note

- Subpatch a.k.a. subdivision surfaces are **NOT** supported.
- Models must be composed entirely of triangles.
- Smoothing groups are ignored by the engine.

:::

## Further information

---
Format Specification, a bit more complete than above: [Inofficial File Format Specification at BeyondUnreal](https://wiki.beyondunreal.com/Legacy:ASE_File_Format)
