---
layout: default
title: In-Depth Overview
parent: Collision Model Manager (CM)
grand_parent: Engine Documentation
nav_order: 1
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

# CM Files and functions breakdown.
{: .fs-9 }
{:aasoverwiev}

---

| DOOM 3                                         | DOOM 3: BFG EDITION
|:-----------------------------------------------|:--------------------------------|
| ../neo/cm/CollisionModel_contents.cpp          | Same localization               |
| ../neo/cm/CollisionModel_debug.cpp             | Same localization               |
| ../neo/cm/CollisionModel_files.cpp             | Same localization               |
| ../neo/cm/CollisionModel_load.cpp              | Same localization               |
| ../neo/cm/CollisionModel_rotate.cpp            | Same localization               |
| ../neo/cm/CollisionModel_trace.cpp             | Same localization               |
| ../neo/cm/CollisionModel_translate.cpp         | Same localization               |

# Contact Type (`contactType_t`)

This enumeration defines different types of contacts that can occur during collision detection:

- `CONTACT_NONE`: Indicates that no contact has been made. This is the default state before collision detection takes place.
- `CONTACT_EDGE`: Represents a scenario where an edge of the trace model (e.g., the moving object or hitbox) hits an edge of the static model (e.g., world geometry). This type of contact is crucial for detecting precise collisions and sliding along surfaces.
- `CONTACT_MODELVERTEX`: Occurs when a vertex from the static model intersects with a polygon of the trace model. This can be important for handling collisions against sharp corners or detailed geometry.
- `CONTACT_TRMVERTEX`: Involves a vertex from the trace model hitting a polygon of the static model. This is common in many physical interactions within the game, such as a player or moving object coming into contact with the environment.

# Contact Info (`contactInfo_t`)

This structure holds detailed information about a collision event:

- `type`: Specifies the type of contact based on the `contactType_t` enumeration.
- `point`: The exact world coordinate where the contact occurred.
- `normal`: The normal vector of the contact surface at the point of collision, which is essential for calculating bounce directions or sliding movements.
- `dist`: The distance along the contact plane.
- `contents`: Describes the material or properties of the surface at the contact point, which can influence gameplay (e.g., slippery, damaging).
- `material`: Points to the material used on the contact surface, providing access to its properties.
- `modelFeature` and `trmFeature`: Identify specific features (edges, vertices) of the static and trace models involved in the contact, useful for detailed collision responses.
- `entityNum` and `id`: Identify the entity and clip model involved in the collision, allowing for interactions with game logic.

# Trace Result (`trace_t`)

This structure encapsulates the result of a collision trace:

- `fraction`: A value between 0 and 1 indicating how far along the trace the first contact occurred; 1.0 means no contact.
- `endpos` and `endAxis`: The final position and orientation of the trace model after the collision, taking into account any movement blocked by the collision.
- `c`: The contactInfo_t structure with detailed information about the contact.

# Constants and Macros

- Various constants define limits and sizes for the collision system, such as `MAX_SUBMODELS`, which limits the number of sub-models that can be handled, and `VERTEX_HASH_SIZE`, which affects the efficiency of vertex lookups.
- Geometric and hashing configurations, like `MIN_NODE_SIZE` and `EDGE_HASH_SIZE`, optimize the spatial subdivision and edge management within the collision detection system.

# Collision Model Structures

- Structures like `cm_vertex_t`, `cm_edge_t`, `cm_polygon_t`, and others describe the geometry and features of both static and moving models in the collision system.
- These structures hold data about vertices, edges, polygons, brushes, and their relationships, enabling the collision system to perform detailed and efficient collision detection.

# Collision Detection Work Data (`cm_traceWork_t`)

- This structure is used internally during collision detection processes to store transient data, calculations, and results.
- It contains arrays for vertices, edges, and polygons of the trace model, along with details about the collision query (start/end points, direction, bounds) and results (contacts, hit fractions).

# Contents of the Collision Model File (`CollisionModel_contents.cpp`)

{: .todo }
> Give a proper overview about this file!

<details markdown="block">
<summary>Technical Review</summary>

# `TestTrmVertsInBrush`

- **Purpose**: Determines if any vertices of a trace model are inside a given brush.
- **Parameters**: A `cm_traceWork_t` structure containing trace work details, and a `cm_brush_t structure` for the brush being tested.
- **Operation**: Checks if the brush's content flags match the trace's content requirements, then tests each vertex of the trace model against the brush's planes to see if it's inside.
- **Return**: Returns true if any trace model vertex is inside the brush; otherwise, returns false.

# `CM_SetTrmEdgeSidedness`

- **Purpose**: Macro to set the sidedness of a trace model edge relative to a brush plane.
- **Parameters**: Edge, brush plane, edge plane, and bit number for caching.
- **Operation**: Calculates the sidedness based on the permuted inner product of the edge and plane, then caches this information.

# `CM_SetTrmPolygonSidedness`

- **Purpose**: Macro similar to `CM_SetTrmEdgeSidedness`, but for setting the sidedness of a trace model polygon vertex relative to a plane.

# `TestTrmInPolygon`

- **Purpose**: Checks if the trace model intersects with a given polygon.
- **Parameters**: A `cm_traceWork_t` structure for trace work and a `cm_polygon_t` structure for the polygon.
- **Operation**: Performs various geometric tests to determine if the trace model goes through the polygon or if any of the polygon's edges go through the trace model.
- **Return**: Returns true if there is an intersection; otherwise, returns false.

# `PointNode`

- **Purpose**: Finds the leaf node of the collision model tree that contains a given point.
- **Parameters**: A point in 3D space and the collision model.
- **Operation**: Traverses the collision model's BSP tree to find the leaf node containing the point.
- **Return**: The leaf `cm_node_t` node containing the point.

# `PointContents`

- **Purpose**: Determines the content flags at a specific point within a collision model.
- **Parameters**: A point in 3D space and a collision model handle.
- **Operation**: Finds the node for the point and checks against all brushes in that node to determine the contents.
- **Return**: The content flags at the point.

# `TransformedPointContents`

- **Purpose**: Determines the contents at a point within a transformed collision model.
- **Parameters**: The point, collision model handle, model origin, and model orientation.
- **Operation**: Transforms the point by the inverse of the model's transformation, then calls `PointContents`.
- **Return**: The contents at the transformed point.

# `ContentsTrm`

- **Purpose**: Determines if a trace model, when positioned at a start point and oriented by a given axis, intersects any content within a collision model.
- **Parameters**: Trace results, start position, trace model, trace model axis, content mask, collision model, model origin, and model axis.
- **Operation**: Prepares the trace model for collision detection, including rotation and translation, then traces through the collision model to detect intersection with specified contents.
- **Return**: The contents intersected by the trace model.

# `Contents`

- **Purpose**: Public interface to `ContentsTrm`, simplifying the parameters required for callers.
- **Parameters**: Start position, trace model, trace model axis, content mask, collision model, model origin, and model axis.
- **Operation**: Calls `ContentsTrm` with the provided parameters.
- **Return**: The content flags intersected by the trace model.

</details>

# Reading Collision Model File (`CollisionModel_load.cpp`)

{: .todo }
> Give a proper overview about this file!

<details markdown="block">
<summary>Technical Review</summary>

# `idCollisionModelManagerLocal::LoadCollisionModelFile`

- **Purpose**: Loads a collision model from a file.
- **Process**: It opens the specified collision model file, reads the file header, and depending on the version of the file, it loads the collision model data accordingly. It then sets up model-specific data structures like vertices, edges, and polygons.
- **Detailed Explanation**: This function acts as the entry point for loading a collision model from a disk file. It begins by opening the specified file and validating its header to ensure it matches the expected format and version supported by the game engine. The function then proceeds to read the model's data sections (such as vertices, edges, nodes, polygons, and brushes) by calling other parsing functions. Each section of the file contains specific data structures that are crucial for defining the geometric and spatial properties of the collision model. Once the data is parsed and stored in memory, the function finalizes the model's internal representation, making it ready for collision detection and physics simulations within the game engine.

# `idCollisionModelManagerLocal::ParseVertices`

- **Purpose**: Parses vertex data from the collision model file.
- **Process**: This function reads vertex positions from the file and stores them in the collision model's data structures.
- **Detailed Explanation**: This function is responsible for parsing the vertices section of a collision model file. Vertices are the fundamental components of 3D geometry, representing points in 3D space. The function reads the coordinates (x, y, z) of each vertex from the file and stores them in a data structure within the collision model. These vertices are used later to construct edges and polygons, which define the surfaces and volumes of the model.

# `idCollisionModelManagerLocal::ParseEdges`

- **Purpose**: Parses edge data from the collision model file.
- **Process**: Reads edge data, including the indices of the start and end vertices of each edge, and stores this information in the model's data structures.
- **Detailed Explanation**: Edges are defined by pairs of vertices. This function reads the indices of the start and end vertices for each edge from the collision model file. An edge is essentially a line segment between two vertices. The function stores this information, which is critical for defining the boundaries of polygons and for constructing the collision model's geometric shape.

# `idCollisionModelManagerLocal::ParseNodes`

- **Purpose**: Parses BSP tree node data from the collision model file.
- **Process**: Reads information about the nodes of the binary space partitioning (BSP) tree used for spatial organization of the collision model. This includes the plane dividing the node, the area, and child node indices.
- **Detailed Explanation**: Nodes are elements of the Binary Space Partitioning (BSP) tree, a data structure used to organize spatial information efficiently. This function parses data for each node, including the plane that splits the node and the indices of child nodes. This organization allows for fast collision queries by recursively traversing the tree and testing collision only with objects that reside in the same or adjacent spatial regions.

# `idCollisionModelManagerLocal::ParsePolygons`

- **Purpose**: Parses polygon data from the collision model file.
- **Process**: Reads polygon data, including vertex indices, edge indices, and the plane equation for each polygon, and stores it in the model.
- **Detailed Explanation**: Polygons represent the surfaces of the collision model. This function reads the data defining each polygon, including the indices of its vertices, its edges, and the equation of the plane on which it lies. This information is used to understand the model's surface geometry, enabling accurate collision detection with other objects in the game world.

# `idCollisionModelManagerLocal::ParseBrushes`

- **Purpose**: Parses brush data from the collision model file.
- **Process**: Brushes are convex volumes used for collision detection. This function reads the brush data, including planes that define the brush, and stores this information.
- **Detailed Explanation**: Brushes are convex shapes used to represent solid volumes within the collision model. They are defined by a set of planes, with each plane representing a face of the brush. This function parses the planes that define each brush and stores them, allowing the game engine to use these volumes for collision detection, especially with game environments and non-moving objects.

# `idCollisionModelManagerLocal::LoadModel`

- **Purpose**: Public interface to load a collision model by name.
- **Process**: Checks if the model is already loaded to avoid duplicates, then calls `LoadCollisionModelFile` to load the model from a file.
- **Detailed Explanation**: This is a higher-level function that serves as the public interface for loading collision models by their names. It checks if the model has already been loaded to avoid duplication and manages the cache of loaded models. If the model is not already loaded, it delegates the loading process to `LoadCollisionModelFile`, ensuring that the game engine efficiently manages its resources.

# `idCollisionModelManagerLocal::FreeModel`

- **Purpose**: Frees the memory used by a collision model.
- **Process**: Releases all resources associated with a collision model, including vertices, edges, polygons, brushes, and any other dynamically allocated memory.
- **Detailed Explanation**: When a collision model is no longer needed, this function ensures that all allocated resources for the model are properly released. This includes memory allocated for vertices, edges, polygons, brushes, and any other associated data. Proper resource management is crucial to prevent memory leaks and ensure the game engine's performance remains optimal.

# `idCollisionModelManagerLocal::PrintModel`

- **Purpose**: Prints detailed information about a collision model for debugging purposes.
- **Process**: Outputs information such as the number of vertices, edges, polygons, brushes, and other relevant data to the console or log.
- **Detailed Explanation**: This debugging function prints detailed information about a specific collision model. It outputs data such as the number of vertices, edges, polygons, and brushes, among other relevant details. This function is invaluable for developers during the game's development process, allowing them to inspect the properties of collision models and diagnose issues.

# `idCollisionModelManagerLocal::Clear`

- **Purpose**: Clears all loaded collision models.
- **Process**: Iterates through all loaded models and calls `FreeModel` on each to release their resources, effectively resetting the collision model manager's state.
- **Detailed Explanation**: This function is used to clear all loaded collision models from memory. It iterates through the cache of loaded models, calling `FreeModel` on each to release their resources. This is particularly useful for cleaning up memory between levels or during game shutdown, ensuring that the engine maintains a clean state without unnecessary resource consumption.

</details>

# Writing and Reading Collision Model File (`CollisionModel_files.cpp`)

- **Writing of collision model file**: Functions in this section (`WriteCollisionModelsToFile`, `WriteCollisionModel`, etc.) handle the serialization of collision models. They write the detailed structures of collision models, including vertices, edges, nodes, polygons, and brushes, into a file. This is essential for persisting the game's static geometry in a compact and efficient format that can be quickly loaded during gameplay or level editing.
- **Loading of collision model file**: Correspondingly, this part includes functions (`LoadCollisionModelFile`, `ParseCollisionModel`, etc.) for deserializing collision models from files. These functions read the serialized data, reconstructing the collision model structures in memory so they can be used for collision detection and physics simulations within the game engine.

<details markdown="block">
<summary>Technical Review</summary>

# Writing Collision Model Files
## `CM_GetNodeBounds`

- **Purpose**: Calculates the bounding box for a node in the collision model's BSP tree.
- **Parameters**:
    - `idBounds *bounds`: Pointer to store the calculated bounds.
    - `cm_node_t *node`: Node for which bounds are being calculated.

## `CM_GetNodeContents`

- **Purpose**: Determines the content flags for a node based on its brushes and polygons.
- **Parameters**:
        - `cm_node_t *node`: Node whose contents are being determined.

- **Returns**: An integer representing the bitwise OR of all content flags in the node.

## WriteNodes

- **Purpose**: Recursively writes the BSP tree nodes to a file.
- **Parameters**:
    - `idFile *fp`: File pointer to write data.
    - `cm_node_t *node`: Current node being written.

## CountPolygonMemory

- **Purpose**: Calculates the total memory used by polygons in a node, recursively including all child nodes.
- **Parameters**:
    - `cm_node_t *node`: Starting node for the calculation.
- **Returns**: The total memory used by polygons in bytes.

## WritePolygons

- **Purpose**: Recursively writes polygon data for each node to a file.
- **Parameters**:
    - `idFile *fp`: File pointer to write data.
    - `cm_node_t *node`: Current node whose polygons are being written.

## CountBrushMemory

- **Purpose**: Calculates the total memory used by brushes in a node, recursively including all child nodes.
- **Parameters**:
    - `cm_node_t *node`: Starting node for the calculation.

- **Returns**: The total memory used by brushes in bytes.

## WriteBrushes

- **Purpose**: Recursively writes brush data for each node to a file.
- **Parameters**:
    - `idFile *fp`: File pointer to write data.
    - `cm_node_t *node`: Current node whose brushes are being written.

## WriteCollisionModel

- **Purpose**: Writes the complete collision model data to a file, including vertices, edges, nodes, polygons, and brushes.
- **Parameters**:
    - `idFile *fp`: File pointer to write data.
    - `cm_model_t *model`: Collision model being written.

## WriteCollisionModelsToFile

- **Purpose**: Writes multiple collision models to a single file, encapsulating the entire collision data of a map.
- **Parameters**:
    - `const char *filename`: Name of the file to write.
    - `int firstModel, int lastModel`: Range of model indices to write.
    - `unsigned int mapFileCRC`: CRC checksum of the map file for verification.

# WriteCollisionModelForMapEntity

- **Purpose**: Generates and writes a collision model for a specific map entity, optionally testing the trace model.
- **Parameters**:
    - `const idMapEntity *mapEnt`: Map entity for which to generate a collision model.
    - `const char *filename`: Name of the file to write.
    - `const bool testTraceModel`: Whether to test the generated trace model for validity.

# Loading Collision Model Files

## `ParseVertices`, `ParseEdges`, `ParseNodes`, `ParsePolygons`, `ParseBrushes`

- **Purpose**: Parses different sections of the collision model file (vertices, edges, nodes, polygons, brushes) and populates the corresponding data structures in the `cm_model_t` structure.
- **Parameters**:
    - `idLexer *src`: Lexer for reading the file data.
    - `cm_model_t *model`: Collision model being populated.

## ParseCollisionModel

- **Purpose**: Parses a single collision model section within the file, integrating it into the collision model manager's data.
- **Parameters**:
    - `idLexer *src`: Lexer for reading the file data.

## LoadCollisionModelFile

- **Purpose**: Loads collision model data from a file and integrates it into the game's collision model system.
- **Parameters**:
    - `const char *name`: Name of the collision model file to load.
    - `unsigned int mapFileCRC`: CRC checksum of the map file for verification.

</details>

# Rotations of Models along Points/Edges/Polygons (`CollisionModel_rotate.cpp`)

{: .todo }
> Give a proper overview about this file!

<details markdown="block">
<summary>Technical Review</summary>

# `CM_RotatePoint`

- **Purpose**: This function rotates a point about an arbitrary axis. It's a foundational operation in 3D graphics and physics simulations, allowing objects or coordinates to be rotated in space around a defined line (axis).
- **Process**:
    The function first translates the point so that the rotation origin is at the coordinate system's origin. This simplification allows for easier mathematical manipulation.
    It projects the point onto the rotation axis and calculates the component of the point perpendicular to the axis. This step is crucial because rotation does not affect the component along the axis.
    Using trigonometric identities, it then rotates the perpendicular component around the axis. The rotation is described by the tangent of half the rotation angle, a clever trick to simplify computations involving rotations by arbitrary angles.
    Finally, the rotated point is translated back to its original position in space.

# `idCollisionModelManagerLocal::RotateEdgeThroughEdge`

- **Purpose**: Determines the exact moment (in terms of the tangent of half the rotation angle) at which one edge, rotating around an axis, would intersect with another static edge. This is crucial for detecting collisions between moving and static geometry.
- **Process**:
    The function first calculates the relative motion between the two edges as one rotates around the axis. This involves complex geometric considerations, taking into account both the direction of rotation and the orientation of the edges.
    It then formulates a quadratic equation representing the points in time (expressed as tangents of half the rotation angle) at which the rotating edge might intersect the static edge.
    Solving this equation yields potential points of intersection. The function evaluates these solutions to determine if a valid collision occurs within the rotation angle's bounds.

# `idCollisionModelManagerLocal::RotateTrmEdgeThroughPolygon`

- **Purpose**: Checks if a rotating trace model edge collides with a static polygon. This function is a part of the broader collision detection algorithm, focusing on edge-to-polygon interactions.
- **Process**:
    Iterates through each edge of the polygon, checking for potential collisions with the rotating edge.
    For each polygon edge, it calculates whether the rotating trace model edge, at any point in its rotation, intersects with the polygon edge.
    This involves calculating the rotation angle at which the two edges are closest and determining if this angle results in an actual collision within the geometric bounds of both edges.
    If a collision is detected, the function updates the trace work structure with details about the collision, including the collision point and the angle at which the collision occurs.

# `idCollisionModelManagerLocal::Rotation180`

- **Purpose**: Manages rotations up to 180 degrees, ensuring accurate collision detection within this range. For rotations exceeding 180 degrees, this function may be called multiple times to break down the rotation into smaller segments.
- **Process**:
	Determines the starting and ending angles for the rotation segment, ensuring they do not exceed 180 degrees.
	Calculates the rotation's impact on the trace model, adjusting the model's position and orientation according to the rotation.
	Performs collision detection for the rotated trace model against the static game world or object models, identifying any collisions that occur during the rotation.
	If a collision is detected within the rotation segment, the function calculates the precise angle at which the collision occurs and updates the trace results accordingly.

# `idCollisionModelManagerLocal::Rotation`

- **Purpose**: Serves as the primary entry point for rotational collision detection requests. It handles any rotation angle, potentially breaking down larger rotations into manageable segments for Rotation180.
- **Process**:
	Checks for special cases, such as zero-angle rotations (which are treated as position tests) or rotations exceeding 180 degrees (which are segmented into smaller rotations).
	For rotations within the 180-degree limit, it directly invokes `Rotation180` to perform the collision detection.
	For larger rotations, it segments the rotation into smaller parts that `Rotation180` can handle, sequentially checking each segment for collisions.
	Aggregates the results from each segment to provide a comprehensive collision detection outcome for the entire rotation.

# `CM_RotateEdge`

- **Purpose**: This function is specifically designed to rotate an edge, which is defined by its start and end points, around an arbitrary axis. The rotation is determined by the tangent of half the rotation angle, facilitating the calculation of the edge's new position after rotation.
- **Process**:
	Translation: Both the start and end points of the edge are translated relative to the rotation origin to simplify the rotation calculations.
	Rotation Calculation: The function calculates the new positions of the start and end points after rotation. This involves using the cross product to determine the perpendicular components of each point relative to the axis and then applying rotation formulas to these components.
	Re-translation: The rotated points are then translated back to their original positions relative to the rotation origin.

# `idCollisionModelManagerLocal::CollisionBetweenEdgeBounds`

- **Purpose**: Determines whether the collision between two edges, one of which is moving, occurs within the bounds of both edges. If a collision does occur, it calculates the collision point and the normal at the point of collision.
- **Process**:
	Rotation Simulation: For the moving edge, simulate its rotation around the rotation axis using the provided tangent of half the angle.
	Intersection Test: Utilize geometric calculations to test if the rotating edge intersects with the stationary edge within their bounds.
	Collision Detection: If an intersection is detected, calculate the precise point of collision and the normal to the surface at that point.

# `idCollisionModelManagerLocal::RotateEdgeThroughEdge`

- **Purpose**: Calculates at what tangent of half the rotation angle two edges (one stationary, one potentially rotating) would collide.
- **Process**:
	Geometric Analysis: Analyzes the spatial relationship between the two edges, considering one edge's rotation about a specified axis.
	Equation Formation: Forms a mathematical representation (often a quadratic equation) that describes the conditions under which the edges would intersect during rotation.
	Solution Finding: Solves the equation to find the tangent of half the angle at which the collision occurs, if at all, within the rotation limits.

# `idCollisionModelManagerLocal::EdgeFurthestFromEdge`

- **Purpose**: Determines at what tangent of half the rotation angle two edges are furthest from each other and whether they move towards or away from each other initially.
- **Process**:
	Initial Direction Calculation: Calculates the initial direction of motion for the rotating edge relative to the stationary edge to determine whether they are moving towards or away from each other.
	Max Separation Calculation: If moving away, calculates the tangent of half the rotation angle at which the edges achieve their maximum separation.
	Evaluation: Evaluates whether the edges will actually move apart or if they will collide during the rotation.

# `idCollisionModelManagerLocal::RotateTrmEdgeThroughPolygon`

- **Purpose**: Checks whether a rotating trace model edge collides with any edge of a polygon and fills in the trace structure if a collision is detected.
- **Process**:
	Iterative Edge Checking: Iterates through each edge of the polygon, checking for potential collisions with the rotating trace model edge.
	Collision Detection: For each polygon edge, it uses geometric calculations to determine if and when the rotating edge would collide within the bounds of the polygon edge.
	Trace Update: If a collision is detected, updates the trace structure with information about the collision, including the point of collision and the collision normal.

# `idCollisionModelManagerLocal::RotatePointThroughPlane`

- **Purpose**: Determines at which tangent of half the rotation angle a point will collide with a plane during a rotation.
- **Process**:
	Collision Angle Calculation: Utilizes geometric and trigonometric calculations to find the point during rotation at which the point intersects with the plane.
	Solution Determination: Solves for the tangent of half the rotation angle that results in a collision, considering the rotation's direction and magnitude.

# `idCollisionModelManagerLocal::PointFurthestFromPlane`

- **Purpose**: Identifies the tangent of half the rotation angle at which a point is furthest from a plane, useful for determining initial motion direction relative to the plane.
- **Process**:
	Direction of Motion Analysis: Determines the initial direction of motion of the point relative to the plane to assess whether the point is moving towards or away from the plane.
	Maximum Separation Calculation: If the initial motion is away from the plane, calculates the tangent of half the rotation angle at which the point achieves maximum separation from the plane.

# `idCollisionModelManagerLocal::RotatePointThroughEpsilonPlane`

- **Purpose**: Similar to `RotatePointThroughPlane`, but specifically accounts for an epsilon expansion of the plane to include a safety margin in collision calculations.
- **Process**:
	Epsilon Expansion: Expands the collision plane by a small epsilon value to create a safety margin for collision detection.
	Adjusted Collision Calculation: Performs collision detection considering the epsilon-expanded plane, calculating the tangent of half the rotation angle for collision.
	Collision Point Determination: If a collision is detected, calculates the precise point of collision on the epsilon-expanded plane.

</details>

# Collision Detection between Trace Models and Polygonal Models (`CollisionModel_trace.cpp`)

- **Trace model vs. polygonal model collision detection**: This core section implements the algorithms and logic for detecting collisions between dynamic trace models (e.g., characters, projectiles) and static or dynamic polygonal models representing the game's environment. It includes detailed collision checks (`TestTrmVertsInBrush`, `TestTrmInPolygon`), handling interactions between moving objects and the game world, ensuring realistic physics responses.
- **Contents and point contents tests**: Functions like `ContentsTrm` and `TransformedPointContents` are used to determine the contents (solid, water, etc.) at specific points or along paths in the game world. This is crucial for gameplay mechanics where interactions depend on the type of environment the objects or players are in.

<details markdown="block">
<summary>Technical Review</summary>

# High Level Overview
## `idCollisionModelManagerLocal::TraceTrmThroughNode`

- **Purpose**: Tests collisions between a trace model (`tw`, which stands for "trace work") and the brushes and polygons contained within a spatial subdivision node (`node`).
- **Process**:
    * Checks if it's a position test (`tw->positionTest`). If so, and if already colliding (`tw->trace.fraction == 0.0f`), it returns early.
      For position tests, it checks if any trace model vertices are inside a brush or stuck in any polygons.
      If it's a rotation (`tw->rotation`), it attempts to rotate the trace model through polygons.
      Otherwise, it performs a translation trace through polygons.

## `idCollisionModelManagerLocal::TraceThroughAxialBSPTree_r`

- **Purpose**: Recursively traverses the BSP tree, splitting the trace into segments that intersect the tree's nodes, to efficiently find potential collisions.
- **Process**:
    * Checks for quick exits, completed fractions, and if the current node is relevant for collision detection.
      Determines which side(s) of the node's partitioning plane the trace intersects and recursively traverses the tree down those sides.
      Handles both cases where the trace line segment crosses the plane or entirely resides on one side of it.
      The function uses spatial subdivision to avoid unnecessary collision checks by focusing only on potentially intersecting areas.

## `idCollisionModelManagerLocal::TraceThroughModel`

- **Purpose**: The entry point for tracing a model through the world or another model, handling both rotation and translation traces.
- **Process**:
    * If not a rotation, it simply traces through the BSP tree using `TraceThroughAxialBSPTree_r`.
      For rotations, it approximates the rotation by breaking it into a series of straight-line segments (the number of steps is determined based on the total angle and a predefined approximation length). Each segment is then traced through the BSP tree.
      This approach allows for complex rotational movement to be checked for collisions in a discrete manner, ensuring accuracy and efficiency.

# More detailed Breakdown
## `idCollisionModelManagerLocal::TraceTrmThroughNode`

This function is a core part of the collision detection system, tasked with evaluating potential collisions between a moving or stationary trace model and the geometry (polygons and brushes) contained within a node of the game's spatial subdivision structure.

- **Parameters**:
    * `cm_traceWork_t *tw`: This structure contains all the necessary information about the trace being performed, including start and end points, the trace model (could be a point,
      abounding box, or a more complex shape), and flags indicating the type of trace (e.g., rotation, position test).
      cm_node_t *node: Represents the current node in the spatial subdivision tree being inspected for potential collisions.

- **Process**:

  - **Position Test**: If the trace is a position test (checking if a position is inside a solid), it first checks if the trace model is already intersecting with a solid (fraction == 0.0). If so, it returns early.
      * It then checks if any vertices of the trace model intersect with brushes in the node.
      * If the trace model is a simple point (pointTrace), it stops after brush testing.
        - Otherwise, it checks for intersections with polygonal geometry in the node.
  - **Rotation**: If the trace involves a rotation, it attempts to rotate the trace model through all polygons in the node, stopping if an intersection is found.
  - **Translation**: If the trace is a simple translation (movement from one point to another), it checks for intersections between the trace model and all polygons in the node, stopping if an intersection is detected.

## `idCollisionModelManagerLocal::TraceThroughAxialBSPTree_r`

This recursive function traverses the BSP (Binary Space Partitioning) tree to narrow down the areas of the game world that need to be checked for collisions with the trace model. It significantly optimizes collision detection by focusing on relevant portions of the world.

- **Parameters**:

    Includes `cm_traceWork_t *tw`, `cm_node_t *node`, start and end fractions (`p1f`, `p2f`), and vectors (`idVec3 &p1`, `idVec3 &p2`) representing the current segment of the trace being evaluated.

- **Process**:

    * **Early Exits**: Checks for conditions that allow the function to return early, such as already having detected a closer collision or being in a quick exit scenario.
    * **Node Testing**: If the current node contains relevant collision geometry, it calls TraceTrmThroughNode to test for collisions within this node.
    * **Leaf Node**: If the current node is a leaf (end of a branch in the BSP tree), the traversal stops.
    * **Plane Intersection**: Calculates intersections with the node's partitioning plane to decide which child nodes to traverse next.
    * **Recursive Traversal**: Depending on the intersection calculations, recursively calls itself to traverse into the relevant child nodes, potentially splitting the trace into segments to accurately test collisions against the partitioning planes.

## `idCollisionModelManagerLocal::TraceThroughModel`

The function initiates the tracing of a model (like a projectile or player bounding box) through the game world or another model, accommodating both rotational and translational movements.

- **Parameters**:

    `cm_traceWork_t *tw`: Contains the trace information, similar to the previous functions.

- **Process**:

    - **Non-Rotational Trace**: Directly uses `TraceThroughAxialBSPTree_r` to perform a trace through the spatial subdivision structure for linear movements.
    - **Rotational Trace**: For rotational movements, it approximates the rotation by breaking it down into a series of linear segments based on a predefined length (`CIRCLE_APPROXIMATION_LENGTH`), effectively simulating the rotation as a series of small steps or translations. Each segment is then traced through the BSP tree as if it were a straight-line movement.
        * This approximation is necessary because directly computing collisions for rotational movements through complex environments would be computationally intensive and complex. By approximating the rotation with linear segments, the existing collision detection infrastructure can be leveraged.

</details>

# Translation & Rotations of Models (`CollisionModel_translate.cpp`)

{: .todo }
> Give a proper overview about this file!

<details markdown="block">
<summary>Technical Review</summary>

# `idCollisionModelManagerLocal::Translation`

- Purpose: This is the primary entry point for performing a translation query, which moves an object from one point to another while checking for collisions.
- Process: It sets up the translation model, including the start and end points of the translation, the model to be moved, and the model against which the collision will be checked. It then calls internal functions to perform the actual collision detection during the movement, handling the complex interactions between moving and static or dynamic geometry within the game world.
- **Detailed Explanation**: This function orchestrates the entire translation process for a given model. It initializes the translation parameters, including the start and end points, the model to move, and the clipping model (or world) against which collisions are detected. The function meticulously prepares the translation model (trm), which represents the moving object, by setting its orientation, position, and bounding box. It then iteratively checks for collisions along the translation path, adjusting the path as necessary to avoid penetrations or to slide along obstacles based on the game's physics rules.

# `idCollisionModelManagerLocal::TranslationResults`

- **Purpose**: To store and possibly return the results of a collision translation query.
- **Process**: This function or structure (depending on its implementation) captures the outcomes of a translation, including whether a collision occurred, the point of collision, the surface normal at the collision point, and any other relevant data. This information is crucial for the physics engine to accurately respond to collisions, such as stopping movement, sliding along surfaces, or applying forces.
- **Detailed Explanation**: While not a function in the traditional sense, this conceptually represents how the results of a translation query are managed. The details captured include whether the translation was completed without hitting any obstacles, the point and normal of the first collision (if any), and possibly additional data about the collision, such as the involved surfaces or entities. These results are critical for physics calculations, such as resolving collisions, applying forces, or triggering game events.

# `idCollisionModelManagerLocal::TranslateTrmEdgeThroughPolygon`

- **Purpose**: To detect collisions between a moving edge of the translating model and the polygons of the model being collided with.
- **Process**: This function checks if an edge of the moving model intersects with a polygon in the static model during the translation. It calculates the intersection point and determines if the edge would penetrate the polygon, providing detailed information for collision response.
- **Detailed Explanation**: This function is key for edge-to-polygon collision detection. It examines if an edge of the translating model intersects with any polygon in the static model during its path. It involves complex geometric calculations to project the edge's movement onto the polygon's plane, determining if and where an intersection occurs. If a collision is detected, the function calculates the collision point, normal, and penetration depth, which are essential for accurately resolving the collision in the game's physics engine.

# `idCollisionModelManagerLocal::TranslateTrmVertexThroughPolygon`

- **Purpose**: To detect collisions between a moving vertex of the translating model and the polygons of the static model.
- **Process**: Similar to edge translation, this function tests if a vertex from the moving model penetrates a polygon in the static model during movement. It's crucial for detecting precise collision points and handling vertex-based collision responses.
- **Detailed Explanation**: Focused on vertex-to-polygon interactions, this function detects if a vertex from the moving model penetrates a polygon in the static model during translation. It uses geometric analysis to project the vertex path onto the polygon plane and checks for intersection within the polygon bounds. This precise detection allows the game engine to handle collisions at even the smallest scale, ensuring realistic interactions between complex shapes.

# `idCollisionModelManagerLocal::TestTrmVertsInPolygon`

- **Purpose**: To test if vertices of the translating model are inside the polygons of the static model, which is a part of the collision detection process.
- **Process**: It verifies whether any of the vertices from the moving model end up inside the collision geometry of the static model, indicating a collision. This function is important for handling cases where the translating model starts or ends its movement within another model.
- **Detailed Explanation**: This function tests whether vertices of the translating model are positioned inside the polygons of the static model at the beginning or end of the translation. It's crucial for detecting initial interpenetrations or ensuring that a translation does not result in an object being embedded within another. The function helps maintain the physical integrity of objects in the game world by preventing impossible overlaps.

# `idCollisionModelManagerLocal::TranslateEdgeThroughEdge`

- **Purpose**: To check for collisions between moving edges of the translating model and edges of the static model.
- **Process**: This function determines if and how edges from the moving model intersect with edges of the static model during translation. Edge-to-edge collisions are less common but crucial for accurately detecting and responding to narrow or sharp object interactions.
- **Detailed Explanation**: This function deals with the rare but critical scenario of an edge-to-edge collision. It calculates if and how the path of an edge from the translating model intersects with an edge of the static model. This involves determining if the moving edge's path crosses the static edge within the bounds of their lengths and if so, calculating the intersection point and details necessary for collision resolution.

# `idCollisionModelManagerLocal::TranslatePointThroughPolygon`

- **Purpose**: To check if a point (or a very small object) moving through space collides with a polygon in the static model.
- **Process**: This specialized function handles the simplest form of collision detection, where a point (considered as a very small sphere or vertex) moves through space and may penetrate a polygon. It's used for precise collision detection scenarios, like projectile impacts.
- **Detailed Explanation**: Aimed at detecting collisions for point-like objects (or vertices) moving through space, this function checks for penetration through polygons. It's particularly relevant for projectiles or small, fast-moving objects. The function calculates if the moving point intersects with a polygon, taking into account the polygon's orientation and the point's trajectory. This allows for high-precision collision detection necessary for gameplay elements like shooting mechanics.

# `idCollisionModelManagerLocal::Rotation`

- **Purpose**: Although primarily focused on translation, this file may also include functions or references to handling rotations, integrating rotational movement into collision detection.
- **Process**: If present, such a function would handle rotating an object and detecting collisions based on that rotation, complementing the translational movement functions.
- **Detailed Explanation**: Although primarily focusing on translations, any function related to rotation would handle how an object's rotation impacts collision detection. This would involve calculating rotational movements and detecting collisions based on these movements, complementing translational detection to ensure comprehensive coverage of all possible object interactions in the game environment.

</details>

# Visualization and Debugging (`CollisionModel_debug.cpp`)

- **Visualisation code**: Although not explicitly detailed in the provided excerpts, references to functions for debugging and visualization (like drawing collision models, edges, and polygons) suggest this section would include tools for visually inspecting how collision models are interacting within the game. These tools are invaluable during development and debugging, helping to diagnose and fix issues with collision detection.
- **Speed test code**: This part likely contains utilities for benchmarking and testing the performance of the collision detection system under various conditions. By running collision detections repeatedly under controlled scenarios, developers can identify performance bottlenecks and optimize the collision detection algorithms for better runtime efficiency.

These functionalities collectively form a comprehensive system for handling collision detection in Doom 3, allowing for interactive and physically accurate gameplay experiences.`

<details markdown="block">
<summary>Technical Review</summary>

# Visualization Variables and Cvars

- `cm_contentsNameByIndex` and `cm_contentsFlagByIndex`: Arrays mapping content names (e.g., `"solid"`, `"water"`) to their corresponding flag values. These are used for filtering what types of content to visualize or test against.
- **Visualization Cvars (`cm_drawMask`, `cm_drawColor`, etc.)**: Configuration variables that control how collision models are visualized, including whether to draw filled polygons, normals, internal edges, and whether backface culling is applied.

# Visualization Functions

- `ContentsFromString` and `StringFromContents`: Convert between string representations of content flags and their integer values. These functions are used to interpret and display content types for collision model surfaces.
- `DrawEdge`, `DrawPolygon`, `DrawNodePolygons`: Functions for rendering the edges and polygons of collision models. They handle drawing based on visualization settings, such as color and whether to show normals or internal edges.
- `DrawModel`: The primary function for visualizing a collision model. It takes into account the model's position, orientation, and the viewer's position to cull backfaces and adjust the visualization based on user-defined cvars.

# Speed Test Variables and Cvars

- **Speed Test Cvars (`cm_testCollision`, `cm_testModel`, `cm_testTimes`, etc.)**: These configuration variables control parameters for running collision detection speed tests, such as the number of iterations, test model to use, and specifics of the test movement or rotation.
- **Statistics Variables (`total_translation`, `min_translation`, `max_translation`, etc.)**: Variables used to gather statistics on the performance of collision detection routines during speed tests.

# Speed Test Function

- `DebugOutput`: This function performs speed tests based on the configured parameters. It measures the performance of translational and rotational collision detection across a specified number of iterations, reporting statistics such as average time, minimum, and maximum times. The function supports testing with random movements or rotations, and can also visualize the path of the test collision model.

</details>