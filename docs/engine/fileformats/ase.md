---
layout: default
title: Ascii Scene Export (.ase)
parent: File Formats
grand_parent: Engine Documentation
nav_order: 1
---

# Overview

---
ASE stands for Ascii Scene Export. This is an ascii text based format associated with 3DS Max. It is not limited to that application, but support in other applications is dependent on import/export scripts or plugins.

The Doom 3 engine uses the ASE format for static meshes.

# Export

---
- iddevnet model export page
- Maya can export ASE’s using the ActorX plugin.
- Blender via [export plugin](https://github.com/FriskTheFallenHuman/D3ModdingKit/tree/master/blender)

# File Format Syntax

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

{: .quake4}
>   Instead of `//base` or `//purgatory/purgatory` QuakeIV seems to use
>
>   `C:\Ritual\Q4ritual\game\q4base`
>
>   `*BITMAP "C:\Ritual\Q4ritual\game\q4base\material\name"`

{: .etqw}
>   use `*MATERIAL_NAME "material/name"`
>
>   eg `*MATERIAL_NAME "textures/models/mymodel"`

{: .note}
>   Subpatch a.k.a. subdivision surfaces are not supported.
>
>   Models must be composed entirely of triangles.
>
>   Smoothing groups are ignored by the engine.

# Further information

---
Format Specification, a bit more complete than above: [Inofficial File Format Specification at BeyondUnreal](https://wiki.beyondunreal.com/Legacy:ASE_File_Format)