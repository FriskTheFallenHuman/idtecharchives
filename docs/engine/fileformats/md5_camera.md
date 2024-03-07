---
layout: default
title: Model 5 Camera (.md5camera)
parent: File Formats
grand_parent: Engine Documentation
nav_order: 6
---

{: .no_toc }

<details open markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
- TOC
{:toc}
</details>

# Overview

---

`.md5camera` files are ascii (plain text) files that contain camera path data. This data controls the position, rotation, and field of view for cinematic cameras.

# Model Format Syntax

---

## Filetype Specific Parameters

This section contains filetype specifc parameters. The filetype specific parameters make up the second section in the file.
In the case of `.md5camera` the filetype specific parameters are as such...

```cpp
numFrames <integer>
frameRate <integer>
numCuts <integer>
```
- `numFrames`: An integer that defines the total number of frames in the animation.
- `frameRate`: An integer that defines the rate of playback in frames per second.
- `numCuts`: An integer that defines the number of cuts in the animation.

Ordered Lists

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
In the case of `.md5camera` there are two ordered lists.

## Cuts

Each element of the cuts ordered list is structured like so...

```cpp
[frameNumber]
```
- `frameNumber`: An integer that defines the frame where a cut takes place.

The number of elements is dependant on the number of cuts.
For instance, if there are five cuts, there should be five frame indexes listed.
Camera

Each element of the camera ordered list is structured like so...

```cpp
( [X Pos] [Y Pos] [Z Pos] ) ( [Orientation] ) [FOV]
```
- `X Pos`: a floating point number that defines the position of the camera on the X axis.
- `Y Pos`: a floating point number that defines the position of the camera on the Y axis.
- `Z Pos`: a floating point number that defines the position of the camera on the Z axis.
- `Orientation`: a rotational quaternion that defines the orientation of the camera. (Only the X, Y, and Z components are stored. W is calculated on the fly.)
- `FOV`: a floating point number that defines the field of view of the camera.

The number of elements is dependant on the number of frames.
If there are five frames total, there should be five camera keyframes listed.