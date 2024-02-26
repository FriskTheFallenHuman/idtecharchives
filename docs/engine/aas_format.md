---
layout: default
title: Format Specifications
parent: Area Awareness System (AAS)
grand_parent: Engine Documentation
nav_order: 2
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

# AAS File Format.
{: .fs-9 }
{:aasfile}

---

The settings section defines general parameters for the AI navigation mesh:

- `bboxes`: Bounding boxes for navigation areas.
- `usePatches`: Determines whether patches (curved surfaces) are considered in navigation.
- `writeBrushMap`: Indicates whether a brush map is written.
- `playerFlood`: A flag to enable flooding from the player's area.
- `fileExtension`: The extension used for the AAS file, here it is `"aas48"`.
- `gravity`: The gravity vector applied in the game world.
- `maxStepHeight`, `maxBarrierHeight`, `maxWaterJumpHeight`, `maxFallHeight`: Parameters defining movement constraints for AI.
- `minFloorCos`: The minimum cosine of the angle for a surface to be considered walkable.
- `tt_*`: Various time-to-travel parameters for different movement actions.

## Example:

```cpp
settings {
    bboxes { (-24 -24 0)-(24 24 82) }
    usePatches = 0
    writeBrushMap = 0
    playerFlood = 1
    fileExtension = "aas48"
    gravity = (0 0 -1050)
    maxStepHeight = 16
    maxBarrierHeight = 32
    maxWaterJumpHeight = 20
    maxFallHeight = 64
    minFloorCos = 0.6999999881
    tt_barrierJump = 100
    tt_startCrouching = 100
    tt_waterJump = 100
    tt_startWalkOffLedge = 100
}
```

## Planes

Planes are defined by their normal vector and a distance from the origin. The format for each plane is:

```cpp
planes <count> {
    <index> ( <normal x> <normal y> <normal z> <distance> )
    ...
}
```

## Vertices

Vertices are points in 3D space used to define the geometry of the navigation mesh:

```cpp
vertices <count> {
    <index> ( <x> <y> <z> )
    ...
}
```

## Edges

Edges connect two vertices, defining the boundaries of faces:

```cpp
edges <count> {
    <index> ( <vertex index 1> <vertex index 2> )
    ...
}
```

## EdgeIndex

The edge index is a list that indexes the edges for quick lookup:

```cpp
edgeIndex <count> {
    <edge index>
    ...
}
```

## Faces

Faces are polygons (usually triangles) that make up the surfaces of the navigation mesh:

```cpp
faces <count> {
    <index> ( <plane index> <edge index list...> )
    ...
}
```

## FaceIndex

Indexes the faces, similar to how edgeIndex works for edges:

```cpp
faceIndex <count> {
    <face index>
    ...
}
```

## Areas

Areas represent navigable spaces within the navigation mesh:

```cpp
areas <count> {
    <index> ( <attribute values...> ) <node index> {
        // Area-specific data
    }
    ...
}
```

## Nodes

Nodes are part of the BSP tree structure for organizing the navigation mesh spatially:

```cpp
nodes <count> {
    <index> ( <plane index> <front node index> <back node index> )
    ...
}
```

## Portals

Portals represent connections between areas, allowing for the passage of AI:

```cpp
portals <count> {
    <index> ( <area 1 index> <area 2 index> <vertices...> )
    ...
}
```

## PortalIndex

Similar to edgeIndex and faceIndex, portalIndex provides quick lookup for portals:

```cpp
portalIndex <count> {
    <portal index>
    ...
}
```

## Clusters

Clusters group multiple areas for efficient pathfinding and spatial organization:

```cpp
clusters <count> {
    <index> ( <cluster attributes...> )
    ...
}
```

## Features

{: .quake4 }
> This feature is only avaliable in Quake IV!

Features tells the AI do something specifict in a section of the map (Take Cover/Look Left or Rigth),
or tell the AI that sertain part of the map needs some special behavior (Pinch Area, Vantage Point):

```cpp
 features <count> {
     <index> ( <feature flags> <size_x> <size_y> <size_z> <x> <y> <z> )
     ...
 }
```