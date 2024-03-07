---
layout: default
title: Model 5 Mesh (.md5mesh)
parent: File Formats
grand_parent: Engine Documentation
nav_order: 4
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
`.md5mesh` files are ascii (plain text) files that contain mesh and skeletal data.

# Model Format Syntax

---

## Filetype Specific Parameters

This section contains filetype specifc parameters. The filetype specific parameters make up the second section in the file.
In the case of MD5Mesh the filetype specific parameters are as such…

```cpp
numJoints <integer>
numMeshes <integer>
```
- `numJoints`: An integer that defines the number of bones in the model.
- `numMeshes`: An integer that defines the number of meshes in the model.

## Ordered Lists

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
In the case of MD5Mesh there are two ordered lists.

## Joints

Each element of the joints ordered list is structured like so...

```cpp
"[boneName]"   [parentIndex] ( [xPos] [yPos] [zPos] ) ( [xOrient] [yOrient] [zOrient] )
```

- `boneName`: The name of this bone.
- `parentIndex`: The index of this bone’s parent.
- `xPos`: The X component of this bone’s XYZ position.
- `yPos`: The Y component of this bone’s XYZ position.
- `zPos`: The Z component of this bone’s XYZ position.
- `xOrient`: The X component of this bone’s XYZ orentation quaternion.
- `yOrient`: The Y component of this bone’s XYZ orentation quaternion.
- `zOrient`: The Z component of this bone’s XYZ orentation quaternion.

The number of elements is dependant on the number of joints.
For instance, if there are five joints, there should be five joint descriptors listed.

## Mesh

The mesh ordered list contains 3 indexed lists: vertices, triangles, and weights.

```cpp
// meshes: [meshName]
shader "[materialName]"
```
- `meshName`: The name of the mesh.
- `materialName`: The material shader to apply to this mesh.

{: .etqw}
> After the parameters, an extra ordered list follows for specifying extra flags.

## Flags

{: .etqw}
> This type of ordered list only exists in ET:QW. 

The ordered list should be defined even when empty. Each line may specify one of the following known flags:

```cpp
noAnimate
vertexColor
```

## Vert

```cpp
numverts <integer>
vert [vertIndex] ( [texU] [texV] ) [weightIndex] [weightElem]
```
- `numverts`: The number of vertices. Coorisponds to the number of elements to follow in the list.
- `vertIndex`: The index of this vertex.
- `texU`: The U component of the UV texture coordinates.
- `texV`: The V component of the UV texture coordinates.
- `weightIndex`: The index into the weight array where this vertex’s first weight is located.
- `weightElem`: The number of elements in the weight array that apply to this vertex.

## Tri

```cpp
numtris <integer>
tri [triIndex] [vertIndex1] [vertIndex2] [vertIndex3]
```
- `numtris`: The number of triangles. Corrisponds to the number of elements to follow in the list.
- `triIndex`: The index of this triangle.
- `vertIndex1`: The index of the first vertex for this triangle.
- `vertIndex2`: The index of the second vertex for this triangle.
- `vertIndex3`: The index of the third vertex for this triangle.

## Weight

```cpp
numweights <integer>
weight [weightIndex] [jointIndex] [weightValue] ( [xPos] [yPos] [zPos] )
```
- `numweights`: The number of weights. Corrisponds to the number of elements to follow in the list.
- `weightIndex`: The index of this weight.
- `jointIndex`: The index of the joint to which this weight applies.
- `weightValue`: The value of the weight.
- `xPos`: The X component of this weight’s XYZ position.
- `yPos`: The Y component of this weight’s XYZ position.
- `zPos`: The Z component of this weight’s XYZ position.

The number of mesh ordered lists is dependant on the number of meshes.