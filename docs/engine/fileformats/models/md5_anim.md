---
description: MD5 Animations (.md5anim)
---

# MD5 Animations (.md5anim)

---

## Overview

---
`.md5anim` files are ascii (plain text) files that contain skeletal animation data.

## Model Format Syntax

---

### Filetype Specific Parameters

This section contains filetype specifc parameters. The filetype specific parameters make up the second section in the file.
In the case of `.md5anim` the filetype specific parameters are as such...

```cpp
numFrames <integer>
numJoints <integer>
frameRate <integer>
numAnimatedComponents <integer>
```

- `numFrames`: The total number of frames in the animation.
- `numJoints`: The number of joints in the model.
- `frameRate`: The rate of playback in frames per second.
- `numAnimatedComponents`: The number of animated components.

### Ordered Lists

The third section in the file contains ordered lists. These lists contain data relevant to the type declared.

```cpp
<string> {
        [element 1]
        [element 2]
        [element 3]
        ... ect ...
}
```

First, the type of list is declared (`<string>`). Then the body of the list is contained within curly brackets.
The list is constructed of a series of elements each on a new line. The number of elements varies depending on type.
In the case of `.md5anim` there are three basic ordered lists followed by an ordered list for every frame in the animation.

### Hierarchy

Each element of the hierarchy ordered list is structured like so …

```cpp
"[boneName]"   [parentIndex] [numComp] [frameIndex] // [parentName] ( [tX] [tY] [tZ] [qX] [qY] [qZ] )
```

- `boneName`: The name of this bone.
- `parentIndex`: The index of this bone’s parent.
- `numComp`: a flag that defines what components are keyframed.
- `frameIndex`: index into the frame data, pointing to the first animated component of this bone
- `parentName`: The name of the parent bone
- `[tX]`: Optional placeholder just to provide a visual of what components are animated
- `[tY]`: Optional placeholder just to provide a visual of what components are animated
- `[tZ]`: Optional placeholder just to provide a visual of what components are animated
- `[qX]`: Optional placeholder just to provide a visual of what components are animated
- `[qY]`: Optional placeholder just to provide a visual of what components are animated
- `[qZ]`: Optional placeholder just to provide a visual of what components are animated

### Bounds

There is one line for each frame of the animation that holds the bounding box information at that frame.

```cpp
( [minX] [minY] [minZ] ) ( [maxX] [maxY] [maxZ] )
```

- `minX`: The X component of the frames’s minimum bounding box XYZ position.
- `minY`: The Y component of the frames’s minimum bounding box XYZ position.
- `minZ`: The Z component of the frames’s minimum bounding box XYZ position.
- `maxX`: The X component of the frames’s maximum bounding box XYZ position.
- `maxY`: The Y component of the frames’s maximum bounding box XYZ position.
- `maxZ`: The Z component of the frames’s maximum bounding box XYZ position.

### Baseframe

Each bone’s position and orientation for the baseframe is listed here.

```
( [xPos] [yPos] [zPos] ) ( [xOrient] [yOrient] [zOrient] )
```

- `xPos`: The X component of this bone’s XYZ position relative to parent bone’s position.
- `yPos`: The Y component of this bone’s XYZ position relative to parent bone’s position.
- `zPos`: The Z component of this bone’s XYZ position relative to parent bone’s position.
- `xOrient`: The X component of this bone’s XYZ orentation quaternion.
- `yOrient`: The Y component of this bone’s XYZ orentation quaternion.
- `zOrient`: The Z component of this bone’s XYZ orentation quaternion.

:::note

- **For coders:** it is not usually possible to create and render a skeleton using only the baseframe data.
- Without first applying the animated components to it from a frame (see below) the skeleton will not usually resemble the model when rendered.

:::

#### Frame 0,1,2, ect...

For each frame the animated components values are listed. Values that are not animated have the same value as their baseframe value, over the whole animation time.
Each of these 6 numbers is optional, lines don’t necessarily have to list 6 values. The `"numModComponents"` value of a joint flags which components are listed here.

[xPos] [yPos] [zPos] [xOrient] [yOrient] [zOrient]

- `xPos`: The X component of this bone’s XYZ position in relation to the baseframe.
- `yPos`: The Y component of this bone’s XYZ position in relation to the baseframe.
- `zPos`: The Z component of this bone’s XYZ position in relation to the baseframe.
- `xOrient`: The X component of this bone’s XYZ orentation quaternion in relation to the baseframe.
- `yOrient`: The Y component of this bone’s XYZ orentation quaternion in relation to the baseframe.
- `zOrient`: The Z component of this bone’s XYZ orentation quaternion in relation to the baseframe.
