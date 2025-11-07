---
description: MD3 (.md3)
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# MD3 (.md3)

---

## Overview

---

MD3 is the 3D data format used in Quake 3: Arena and derivative games (Q3 mods, Return to Castle Wolfenstein, Jedi Knights 2, etc.). The file format is used to describe 3D objects in the game that move and interact with players, other objects, and/or the environment. Animation is recorded by describing the position of every vertex in the model for each frame of animation. This style of animation may also be known as "mesh deformation", "vertex animation", ???.

 The Quake series was developed and run on IA32 (x86) machines, using C. The file format shows many evidences of x86-isms and C-isms (expected byte order, word sizes, data type names, etc.). Some of these isms spill over into this document.

The MD3 format is presented here from a larger scope to smaller ones.

:::note

While Doom 3 itself never used .md3 during its development, the engine supports loading MD3 files, though its usage its not advise because of some
issues and crashes, though some source ports has fixed this issue, such source ports are:

- [Dhewm3](https://dhewm3.org/)
- [rbdoom-3-bfg](https://www.moddb.com/mods/rbdoom-3-bfg)

:::

### Data type indicator

| Datatype  | name / purpose  | Description |
| ---       |---:             |---|
| U8        | char            | 8-bit unsigned octet (character). |
| S16       | short           | Little-endian signed 16-bit integer. |
| S32       | int             | Little-endian signed 32-bit integer. |
| F32       | float           | IEEE-754 32-bit floating-point. |
| VEC3      | vec3_t          | Triplet of F32 in sequence (read 4 octets → float; read 4 → float; read 4 → float), representing a 3D vector. |
| *         | []              | Indicates sequential repeat count (homogenous aggregation, array, vector), e.g., "U8 * 16" = 16-octet array. |
| -         | -               | File/array offset to note specially. |
| !         | !               | Aggregate complex data that should be described elsewhere. |

### MD3

| Datatype        | name / purpose  | Description |
| ---             | ---:            | --- |
| -               | MD3_START       | Offset of MD3 object; usually 0 but not guaranteed. |
| S32             | IDENT           | Magic number; as 4-char string "IDP3"; little-endian 1367369843 (0x51806873); big-endian 1936228433 (0x73688051). |
| S32             | VERSION         | MD3 version number; latest known 15; use constant MD3_VERSION. |
| U8 * MAX_QPATH  | NAME            | MD3 name, usually pathname in PK3; ASCII NUL-terminated string; MAX_QPATH = 64. |
| S32             | FLAGS           | Unknown/unused field. |
| S32             | NUM_FRAMES      | Number of Frame objects; maximum MD3_MAX_FRAMES (1024). |
| S32             | NUM_TAGS        | Number of Tag objects; maximum MD3_MAX_TAGS (16). |
| S32             | NUM_SURFACES    | Number of Surface objects; maximum MD3_MAX_SURFACES (32). |
| S32             | NUM_SKINS       | Number of Skin objects; typically unused (artifact from MD2). |
| S32             | OFS_FRAMES      | Relative offset from MD3 start to Frame objects; Frames are stored sequentially. |
| S32             | OFS_TAGS        | Relative offset from MD3 start to Tag objects; Tags are stored sequentially. |
| S32             | OFS_SURFACES    | Relative offset from MD3 start to Surface objects; Surfaces are stored sequentially. |
| S32             | OFS_EOF         | Relative offset from MD3 start to end of MD3 object; no offset for Skins. |
| !               | (Frame)         | Aggregate: array of Frame objects; usually follows header but use OFS_FRAMES. |
| !               | (Tag)           | Aggregate: array of Tag objects; usually after Frames but use OFS_TAGS. |
| !               | (Surface)       | Aggregate: array of Surface objects; usually after Tags but use OFS_SURFACES. |
| -               | MD3_END         | End of MD3 object; should match MD3_START. |

### Frame

(member of MD3)

| Datatype  | name / purpose  | Description |
| ---        | ---:           | --- |
| VEC3      | MIN_BOUNDS      | First corner of the bounding box. |
| VEC3      | MAX_BOUNDS      | Second corner of the bounding box. |
| VEC3      | LOCAL_ORIGIN    | Local origin, usually 0,0,0. |
| F32       | RADIUS          | Radius of bounding sphere. |
| U8 * 16   | NAME            | Name of Frame; ASCII NUL-terminated string. |

### Tag

(member of MD3)

| Datatype        | name / purpose  | Description |
| ---             | ---:            | --- |
| U8 * MAX_QPATH  | NAME            | Name of Tag; ASCII NUL-terminated string; MAX_QPATH = 64. |
| VEC3            | ORIGIN          | Coordinates of Tag object. |
| VEC3 * 3        | AXIS            | Orientation of Tag object (three column vectors). |

### Surface

(member of MD3)

| Datatype        | name / purpose  | Description |
| ---             | ---:            | --- |
| -               | SURFACE_START   | Offset relative to start of MD3 object. |
| S32             | IDENT           | Magic number "IDP3" (0x51806873 little-endian). |
| U8 * MAX_QPATH  | NAME            | Surface name; ASCII NUL-terminated string; MAX_QPATH = 64. |
| S32             | FLAGS           | Flags (implementation-defined). |
| S32             | NUM_FRAMES      | Number of animation frames; matches MD3 header. |
| S32             | NUM_SHADERS     | Number of Shader objects; max MD3_MAX_SHADERS (256). |
| S32             | NUM_VERTS       | Number of Vertex objects per frame; max MD3_MAX_VERTS (4096). |
| S32             | NUM_TRIANGLES   | Number of Triangle objects; max MD3_MAX_TRIANGLES (8192). |
| S32             | OFS_TRIANGLES   | Offset from SURFACE_START to Triangle list. |
| S32             | OFS_SHADERS     | Offset from SURFACE_START to Shader list. |
| S32             | OFS_ST          | Offset from SURFACE_START to St (texture coord) list. |
| S32             | OFS_XYZNORMAL   | Offset from SURFACE_START to Vertex (XYZNormal) list. |
| S32             | OFS_END         | Offset from SURFACE_START to end of Surface. |
| !               | (Shader)        | List of Shader objects; use OFS_SHADERS. |
| !               | (Triangle)      | List of Triangle objects; use OFS_TRIANGLES. |
| !               | (St)            | List of TexCoord (St) objects; use OFS_ST. |
| !               | (XYZNormal)     | List of Vertex objects; total count = NUM_FRAMES * NUM_VERTS. |
| -               | SURFACE_END     | End of Surface; should match OFS_END. |

### Shader

(member of MD3)

| Datatype        | name / purpose  | Description |
| ---             | ---:            | --- |
| U8 * MAX_QPATH  | NAME            | Pathname of shader in PK3; ASCII NUL-terminated string; MAX_QPATH = 64. |
| S32             | SHADER_INDEX    | Shader index number (allocation order implementation-defined). |

### Triangle

(member of MD3)

| Datatype    | name / purpose  | Description |
| ---         | ---:            | --- |
| S32 * 3     | INDEXES         | Three vertex indices into the Vertex list that form the triangle. |

### TexCoord

(member of MD3)

| Datatype    | name / purpose  | Description |
| ---         | ---:            | --- |
| F32 * 2     | ST              | Texture coordinates (S,T) typically in [0.0 .. 1.0], may wrap. |

### Vertex

(member of MD3)

| Datatype    | name / purpose  | Description |
| ---         | ---:            | ---|
| S16         | X               | X coordinate scaled by MD3_XYZ_SCALE (multiply by MD3_XYZ_SCALE to recover). |
| S16         | Y               | Y coordinate scaled by MD3_XYZ_SCALE (multiply by MD3_XYZ_SCALE to recover). |
| S16         | Z               | Z coordinate scaled by MD3_XYZ_SCALE (multiply by MD3_XYZ_SCALE to recover). |
| S16         | NORMAL          | Encoded normal vector (see Normals section). |

## Tags

Tags are volumeless vectors. Tags are primarily used in aligning separate MD3 objects in-game. For example, the Tag object in the railgun model is called 'tag_weapon', and the position (and rotation) of this Tag gets aligned with those of the Tag named 'tag_weapon' in the player model, dragging the rest of the railgun model over with the [railgun's] Tag object. The railgun model follows its Tag positions and rotations, which in turn follows the positions and rotations of the player model Tag object (most noticeable in taunt animation). Tags are also used to line up the torso with the legs, and the head with the torso, and so on.

## Normals

### Encoding

The encoded normal vector uses a spherical coordinate system. Since the normal vector is, by definition, a length of one, only the angles need to be recorded. Each angle is constrained within [0, 255], so as to fit in one octet. A normal vector encodes into 16 bits. (XXX: more blah)

| 15 | 14 | 13 | 12 | 11 | 10 | 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |
|---:|---:|---:|---:|---:|---:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| lat | lat | lat | lat | lat | lat | lat | lat | lng | lng | lng | lng | lng | lng | lng | lng |

(Code in q3tools/common/mathlib.c:NormalToLatLong)
```C
lng <- atan2 ( y / x) * 255 / (2 * pi)
lat <- acos ( z ) * 255 / (2 * pi)
lng <- lower 8 bits of lng
lat <- lower 8 bits of lat
normal <- (lat shift-left 8) binary-or (lng)
```

Two special vectors are the ones that point up and point down, as these values for z result in a singularity for acos. The special case of straight-up is:
```C
normal <- 0
```

And the special case of straight down is:
```C
lat <- 0
lng <- 128
normal <- (lat shift-left 8) binary-or (lng)
```

or, shorter:
```C
normal <- 32768
```

### Decoding

(Code in q3tools/q3map/misc_model.c:InsertMD3Model)
```C
lat <- ((normal shift-right 8) binary-and 255) * (2 * pi ) / 255
lng <- (normal binary-and 255) * (2 * pi) / 255
x <- cos ( lat ) * sin ( lng )
y <- sin ( lat ) * sin ( lng )
z <- cos ( lng )
```
