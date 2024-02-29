---
layout: default
title: Format Specifications
parent: Collision Model Manager (CM)
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

The .cm (Collision Model) file format organizes data into sections for vertices, edges, nodes, polygons, and brushes to comprehensively define collision geometry in a game environment.

# Version File
---
The `"CM"` section on the `.cm` file indicates the version of wich this map/model was made on.

{: .doom3 }

> ```cpp
>  CM "1.00"
> ```

{: .prey06 }

> ```cpp
>  CM "1.00"
> ```

{: .quake4 }

> ```cpp
>  CM "3"
> ```


# Cyclic redundancy check (CRC)
---
This line is used for checksum purposes, this line is bitwise XOR of all entities's CRC, It is used to tell if the map is outdated
compared to the .map file.

```cpp
115442973
```

# Collision Model
---
This is the meat and bones of the Collision system, this inlines models for collision purposes, mostly `func_` entities, a basic look of
`collisionModel`:
```cpp
  collisionModel "func_static_1" {
    /** Irrelevant Code **/
  }
```
There's a special code for `collisionModel` that handles worldmap collision:
```cpp
  collisionModel "worldMap" {
    /** Irrelevant Code **/
  }
```
`collisionModel` also contains 5 subgroups: `"vertices"`, `"edges"`, `"nodes"`, `"polygons"` and `"brushes"`.

## Vertices
A list of vertices used to define the shape of the collision model. Each vertex is represented by a coordinate in 3D space `(x, y, z)`.
```cpp
    vertices { /* numVertices = */ numverts
    /* vertnum */ ( x y z )
    }
```
* `numverts` = The number vertices that are in this group.
* `vertnum` = The vertice that's being proccesed currently.
* `x, y` and `z` = The position to where this vertex is locate at.

## Edges
Defines the edges between vertices. Each edge connects two vertices and is defined by their indices.
Optionally, additional information can be provided, such as edge direction or properties.
```cpp
    edges { /* numEdges = */ numedgs
    /* edgenum */ ( start end ) internal numpolys
    }
```
* `numEdges` = The number edges that are in this group.
* `edgenum` = The edge that's being proccesed currently.
* `start` = The start position to draw the edge from.
* `end` = The end position to where the edge ends.
* `internal` = Tells this edge that it shouldn't collide with internal edges.
* `numpolys` = X many times this edge is used by poly.

## Nodes
This section typically describes the nodes in the collision model's spatial partitioning structure, such as a BSP (Binary Space Partitioning) tree. Nodes are used to efficiently organize and query the collision geometry.
```cpp
    nodes {
    ( index frontindex backindex ) <optional>
    }
```
* `index` = The plane index.
* `frontindex` = The front node index used for the BSP tree.
* `backindex` = The back node index used for the BSP tree.

{: .note }

> Nodes are used for spatial partitioning (e.g., in a BSP tree). The exact format can vary depending on the specifics of the partitioning system used.

## Polygons 
Lists the polygons that make up the collision surfaces. Each polygon is defined by its vertices (or edges) and has additional attributes such as the normal vector, plane equation, and texture information.
```cpp
    polygons {
    numverts ( index1 index2 ... ) ( normvectx normvecty normvectz ) distance ( bboxmin ) ( bboxmax ) "texture"
    }
```
* `numverts` = The plane indexThe number of vertices this poly has.
* `index1, index2, ect` = The indexes used to conform the polygon.
* `normvectx, normvecty` and `normvectz` = Tells the direction of this vector's normal in the X/Y/Z.
* `distance` = The distance between the polys and the bounding box.
* `bboxmin` and `bboxmax` = The Min/Max of the bounding box.
* `texture` = The texture that's assigned to this polygon.

## Brushes
Brushes are convex shapes used to define solid areas for collision. Each brush is defined by a set of planes, and each plane is defined by a normal vector and a distance from the origin. Brushes are particularly useful for defining static architecture and level boundaries.
```cpp
    brushes {
      numplanes {
        ( planenormx planenormy planenormz ) distance
      } ( bboxmin ) ( bboxmax ) <optional>
    }
```
* `numplanes` = The current brush's plane that's being processed.
* `planenormx, planenormy` and `planenormz` = Tells the direction of this plane normal in the X/Y/Z.
* `distance` = The distance between the polys and the bounding box.
* `bboxmin` and `bboxmax` = The Min/Max of the bounding box.

**Brushes**: define solid volumes through planes. Each plane in a brush contributes to the definition of a convex volume.