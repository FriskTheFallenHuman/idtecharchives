---
layout: default
title: In-Depth Overview
parent: Area Awareness System (AAS)
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

# AAS Files and functions breakdown.
{: .fs-9 }
{:aasoverwiev}

---

| DOOM 3                                           | DOOM 3: BFG EDITION
|:-------------------------------------------------|:--------------------------------|
| ../neo/tools/compilers/aas/AASBuild.cpp          | Same localization               |
| ../neo/tools/compilers/aas/AASBuild_file.cpp     | Same localization               |
| ../neo/tools/compilers/aas/AASBuild_gravity.cpp  | Same localization               |
| ../neo/tools/compilers/aas/AASBuild_ledge.cpp    | Same localization               |
| ../neo/tools/compilers/aas/AASBuild_merge.cpp    | Same localization               |
| ../neo/tools/compilers/aas/AASCluster.cpp        | Same localization               |
| ../neo/tools/compilers/aas/AASReach.cpp          | Same localization               |
| ../neo/tools/compilers/aas/Brush.cpp             | Same localization               |
| ../neo/tools/compilers/aas/BrushBSP.cpp          | Same localization               |
| ../neo/tools/compilers/aas/AASFile.cpp           | ../neo/aas/AASFile.cpp          |
| ../neo/tools/compilers/aas/AASFileManager.cpp    | ../neo/aas/AASFileManager.cpp   |
| ../neo/tools/compilers/aas/AASFile_optimize.cpp  | ../neo/aas/AASFile_optimize.cpp |
| ../neo/tools/compilers/aas/AASFile_sample.cpp    | ../neo/aas/AASFile_sample.cpp   |

# Filename: AASBuild.cpp
{: .fs-9 }
{:aasbuild}

---

This file is involved in the construction and compilation of the Automated Area Awareness System (AAS) used for AI pathfinding in the game. It contains the logic for analyzing map geometry, creating navigable areas (areas where AI can move), and calculating connections between these areas, known as reachabilities. The file plays a crucial role in generating the AAS files from map data, which are then used by the game engine to facilitate AI navigation in a precomputed spatial environment.

<details markdown="block">
<summary>Technical Review</summary>

## idAASBuild Class

- **Constructor & Destructor:** Initializes and cleans up an `idAASBuild` instance, managing resources like the AAS file and processing nodes.
- **Shutdown:** Cleans up resources and prepares the instance for deletion or reuse.
- **ParseProcNodes & LoadProcBSP:** These functions deal with parsing and loading the processed BSP (Binary Space Partitioning) tree from a `.proc` file, which is used for optimizing rendering and collision detection in game levels.
- **DeleteProcBSP:** Frees memory allocated for the processed BSP tree nodes.
- **ChoppedAwayByProcBSP:** Determines if a given area is excluded from pathfinding due to being obstructed or otherwise inaccessible, based on the BSP tree.
- **ClipBrushSidesWithProcBSP:** Adjusts the geometry of pathfinding obstacles based on the BSP tree, ensuring accurate navigation mesh generation.
- **ContentsForAAS:** Translates game content flags into area contents flags used in the AAS system.
- **AddBrushesForMapBrush/Patch:** Generates pathfinding obstacles (brushes) from map geometry, including brushes and patches (curved surfaces), and transforms them according to the map entity's position and orientation.
- **CreateBrushFromTriangle:** Utility function to create a pathfinding obstacle from a triangle, used for more complex geometry.
- **AddBrushesForStaticMesh:** Adds brushes for static mesh models in the game level to the pathfinding system.
- **FindOpenSpaces & ConnectOpenSpaces:** These functions are used to identify open areas in the game level that are navigable and to create connections between them for pathfinding.
- **AddBrushesForMapEntity:** Adds all relevant pathfinding obstacles for a specific map entity to the AAS system.
- **Build:** The main function that orchestrates the entire process of generating the AAS file from a map file, including brush processing, BSP tree operations, reachability calculations, and cluster building.
- **BuildReachability:** Similar to `Build`, but specifically focused on recalculating reachability information within an already existing AAS file, allowing for updates to pathfinding data without a full rebuild.

## Utility Functions

- **ParseOptions, RunAAS_f, RunAASDir_f, RunReach_f:** These functions parse command-line arguments and execute the AAS building process for individual maps, directories of maps, or just recalculating reachability, based on specified options.

</details>

# Filename: AASBuild_file.cpp
{: .fs-9 }
{:aasbuildfile}

---

{: .todo }
> Give a proper overview about this file!

<details markdown="block">
<summary>Technical Review</summary>

## SetupHash & ShutdownHash

- **SetupHash:** Initializes hash tables for vertices and edges. These hash tables are used to efficiently find and store unique vertices and edges during the AAS file creation process.
- **ShutdownHash:** Cleans up and deletes the hash tables initialized by `SetupHash`, freeing the memory allocated for them.

## ClearHash

- Clears the existing data in vertex and edge hash tables and recalculates the hash bounds based on the new geometry bounds. This is necessary when starting the processing of a new map or when resetting the AAS data.

## HashVec

- Converts a 3D vector position into a hash key based on its spatial location. This function is used to insert and retrieve vertex positions from the hash table, ensuring that duplicate vertices are not stored in the AAS file.

## GetVertex & GetEdge

- **GetVertex:** Attempts to find a vertex in the hash table; if not found, it adds the vertex to the AAS file's vertex list and the hash table. This ensures that each unique vertex is only stored once.
- **GetEdge:** Similar to `GetVertex`, but for edges. It checks if an edge (defined by two vertex indices) exists; if not, it adds the edge to the AAS file and updates the edge hash table.

## GetFaceForPortal & GetAreaForLeafNode

- **GetFaceForPortal:** Generates a face (a polygon defined by edges) for a portal (an opening between two areas) in the BSP tree. It ensures that the face is stored only once and assigns it to the corresponding portal.
- **GetAreaForLeafNode:** Creates an area (a convex polygon space) for a leaf node in the BSP tree. It gathers all the faces defining the area's boundary and adds them to the AAS file.

## StoreTree_r

- Recursively processes the BSP tree, converting it into a format suitable for the AAS file. It creates nodes, areas, and links them based on the BSP tree structure.

## GetSizeEstimate_r & SetSizeEstimate

- These functions estimate the size of the AAS data structures based on the BSP tree's complexity. This estimate is used to preallocate memory for the AAS file, improving memory management and performance during the AAS file creation.

## StoreFile

- Orchestrates the entire process of converting the BSP tree into an AAS file. It sets up the necessary data structures, processes the BSP tree to extract navigational data, and finally stores this data in an AAS file format.

</details>

# Filename: AASBuild_gravity.cpp
{: .fs-9 }
{:aasbuildgravity}

---

{: .todo }
> Give a proper overview about this file!

<details markdown="block">
<summary>Technical Review</summary>

## SetPortalFlags_r

- This recursive function iterates through the BSP tree nodes to identify and flag portals (transitions between different areas in the game world) based on their relation to solid areas and the direction of gravity. Portals adjacent to solid areas and aligned with the game's gravity are flagged as floor portals, while others may receive different flags based on their characteristics.

## PortalIsGap

- Determines whether a portal represents a gap, like a ledge or an opening an AI could potentially fall through, based on its orientation relative to the game's gravity and its adjacency to solid areas. This function helps identify navigational hazards that need to be considered during the pathfinding process.

## GravSubdivLeafNode

- Analyzes a leaf node in the BSP tree to detect complex navigational situations, such as areas that combine both walkable floors and gaps (ledges, cliffs, etc.). It attempts to subdivide these areas into simpler, more easily navigable sections by identifying potential dividing planes. This function is vital for ensuring AI can accurately understand and navigate complex terrain.

## GravSubdiv_r

- Recursively traverses the BSP tree, applying gravitational subdivision to leaf nodes. This process refines the navigational data by breaking down complex areas into simpler, more understandable segments for the AI, improving pathfinding accuracy and efficiency.

## GravitationalSubdivision

- Initiates the gravitational subdivision process on the BSP tree. This function sets up initial conditions, such as flagging portals based on their characteristics, then recursively subdivides the tree to enhance the navigational data's quality. This subdivision is crucial for creating an accurate and detailed AAS file, which AI entities use for navigation.

## Additional Notes

- **FACE_CHECKED** and other flags are used to mark the state of portals during processing to ensure efficient and accurate analysis.
- **GRAVSUBDIV_EPSILON** defines a small tolerance value used in geometric calculations to handle floating-point precision issues.
- These functions highlight the intricate relationship between the game's physical geometry (BSP tree) and the abstracted navigational data (AAS) that AI entities use. This process ensures that AI can effectively understand and interact with the game world, accounting for obstacles, gaps, and other navigational challenges.

</details>

# Filename: AASBuild_ledge.cpp
{: .fs-9 }
{:aasbuildledge}

---

{: .todo }
> Give a proper overview about this file!

<details markdown="block">
<summary>Technical Review</summary>

## idLedge Class

- **idLedge Constructors:** Two constructors initialize a `idLedge` object. The first is a default constructor, and the second initializes the ledge with specific start and end points, gravity direction, and the BSP node it belongs to, calculating four planes that define the ledge based on these parameters.

- **AddPoint:** Expands the ledge by adjusting its start and end points if the given point extends beyond the current bounds of the ledge.

- **CreateBevels:** Adjusts the ledge's planes to include bevels based on the direction of gravity, ensuring that the ledge representation is accurate and can interact properly with the game's physics.

- **Expand:** Expands the ledge's representation by a given bounding box and a maximum step height, adjusting the planes to represent this expanded volume. This is important for ensuring that ledges are navigable or avoidable by AI.

- **ChopWinding:** Uses the ledge's planes to clip a winding (polygon), effectively determining the part of the winding that intersects with the ledge. This is useful for analyzing how ledges intersect with other navigational elements.

- **PointBetweenBounds:** Checks if a point lies within the horizontal bounds of the ledge, used to merge ledges or determine ledge influence.

## idAASBuild Methods

- **LedgeSubdivFlood_r:** Recursively floods through the BSP tree from a given node, subdividing areas that intersect with a specified ledge. This process helps in refining the AAS by accurately marking areas affected by ledges.

- **LedgeSubdivLeafNodes_r:** Recursively finds all leaf nodes starting from a given node that are or could be affected by a specified ledge. This method ensures that all relevant areas are considered for ledge-related subdivisions.

- **LedgeSubdiv:** Initiates the process of subdividing the BSP tree based on ledges identified in the game world. It prepares ledges for processing, finds all nodes that need to be subdivided because of ledges, and performs the necessary subdivisions.

- **IsLedgeSide_r:** Determines if a side of a portal can be considered a ledge by checking if it is solid from one side and not from the other, indicative of a potential navigational hazard for AI.

- **AddLedge:** Adds a new ledge or merges it with existing ledges if possible. This method is essential for building a comprehensive representation of all ledges in the game world.

- **FindLeafNodeLedges:** Identifies ledges within a specific leaf node of the BSP tree, contributing to the overall process of ledge detection and representation.

- **FindLedges_r:** Recursively traverses the BSP tree to find and process all ledges within the game world. This comprehensive search ensures that all ledges are accounted for in the AAS.

- **WriteLedgeMap:** Prepares for writing out a map visualization of ledges, useful for debugging and visual analysis of how ledges are represented within the AAS data.

- **LedgeSubdivision:** Coordinates the entire process of ledge subdivision, from finding ledges to subdividing the BSP tree based on these ledges. This method is crucial for ensuring that the AAS data accurately represents the game world, including potentially complex navigational features like ledges.

</details>

# Filename: AASBuild_merge.cpp
{: .fs-9 }
{:aasbuildmerge}

---

{: .todo }
> Give a proper overview about this file!

<details markdown="block">
<summary>Technical Review</summary>

## idAASBuild::AllGapsLeadToOtherNode

This function checks if all gap portals (areas where AI cannot stand and must jump or fall) in a given BSP node (`nodeWithGaps`) lead directly to another specific BSP node (`otherNode`). This is used to ensure that when considering merging two leaf nodes, any movement through gaps from one leads directly to the other, maintaining navigational integrity.

## idAASBuild::MergeWithAdjacentLeafNodes

Attempts to merge a BSP node with its adjacent leaf nodes. The merging criteria are strict: the nodes must have the same contents (e.g., both solid or non-solid), must either both be near ledges or not, and if they contain floor or gap areas, the gaps must lead into each other. This function ensures that the game world's navigational mesh is as simplified as possible without losing important geometric or navigational details, such as the distinction between floor and gap areas.

## idAASBuild::MergeLeafNodes_r

This recursive function traverses the BSP tree, attempting to merge leaf nodes where possible by calling `MergeWithAdjacentLeafNodes` on each leaf node it encounters. Nodes that have been processed are marked as done to prevent repeated processing. This method works its way through the tree, gradually simplifying the AAS data by reducing the number of leaf nodes, which represent discrete navigable areas in the game world.

## idAASBuild::MergeLeafNodes

Initiates the leaf node merging process by starting the recursive `MergeLeafNodes_r` function at the root of the BSP tree. It keeps track of the number of successful merges through the `numMergedLeafNodes` counter, printing progress to the console. This function is a high-level orchestrator for condensing the AAS data, making it more efficient for the game engine to use for AI navigation by reducing the complexity of the navigational mesh.

</details>

# Filename: AASCluster.cpp
{: .fs-9 }
{:aascluster}

---

{: .todo }
> Give a proper overview about this file!

<details markdown="block">
<summary>Technical Review</summary>

## idAASCluster::UpdatePortal

- This function updates portal information for a specific area that is part of a cluster. It finds the portal associated with the area and updates the cluster information for the portal. If the portal is already associated with the specified cluster, or if the portal's clusters are updated successfully, it returns true. If the portal cannot be associated with another cluster because it's already linked to two different clusters, it removes the cluster portal flag from the area and returns false.

## idAASCluster::FloodClusterAreas_r

- A recursive function that marks areas as belonging to a specific cluster. It uses both area faces and reachabilities to flood-fill through the map, marking areas with their corresponding cluster numbers. If it encounters an area marked as a cluster portal, it calls `UpdatePortal` to handle the portal area correctly. This function ensures all reachable areas and portals are correctly associated with their clusters, facilitating efficient AI navigation across the map.

## idAASCluster::RemoveAreaClusterNumbers

- Clears the cluster numbers from all areas, essentially resetting the clustering information. This is likely used before re-computing clusters to ensure clean data.

## idAASCluster::NumberClusterAreas

- Assigns cluster area numbers to areas and portals within a cluster, differentiating between areas with reachabilities (walkable or flyable areas) and those without. This organization allows the pathfinding system to understand which areas and portals belong to a cluster and how they are interconnected, improving navigation calculations.

## idAASCluster::FindClusters

- The main function responsible for identifying clusters within the AAS file. It removes any existing cluster numbers from areas, creates portals for areas marked as cluster portals, and then uses flood-fill algorithms to group areas into clusters based on connectivity. It ensures that the AAS data is correctly organized into clusters for efficient AI navigation.

## idAASCluster::CreatePortals

- Initializes portal structures for areas marked as cluster portals. This setup is crucial for managing connections between clusters, allowing the pathfinding system to understand how different clusters are interconnected through specific areas.

## idAASCluster::TestPortals

- Verifies the integrity of portals after cluster formation, ensuring that each portal correctly connects two clusters without inconsistencies. It checks for situations where portals might not correctly separate clusters, adjusting the AAS data as needed to ensure valid navigation paths.

## idAASCluster::RemoveInvalidPortals

- Identifies and removes invalid portals, which are portals that do not lead to a significant number of different areas or incorrectly mark areas as cluster portals. This cleanup process ensures that only meaningful and correctly functioning portals are used in navigation calculations.

## idAASCluster::Build and idAASCluster::BuildSingleCluster

- These functions drive the clustering process, either by generating multiple clusters based on area connectivity (Build) or by creating a single cluster encompassing all areas (`BuildSingleCluster`). They manage the overall process of organizing the map's navigable areas into clusters, improving the efficiency of AI pathfinding by reducing the complexity of navigation data.

</details>

# Filename: AASFile.cpp
{: .fs-9 }
{:aasfile}

---

This file manages the loading, parsing, and accessing of AAS files, which are precomputed navigation data used by AI agents within the game. It defines the structures and classes necessary to handle different components of the AAS data, such as areas, edges, nodes, and reachabilities. The functionalities provided in this file are essential for AI pathfinding, as they enable the game to quickly and efficiently query the navigation mesh at runtime.

<details markdown="block">
<summary>Technical Review</summary>

## idReachability

- **Reachability_Write/Read:** These functions serialize and deserialize reachability information to and from files. Reachabilities are connections between areas that an AI can use for navigation.
- **idReachability::CopyBase:** Copies basic reachability attributes from one reachability object to another.

## idReachability_Special

- **Reachability_Special_Write/Read:** Handle the serialization and deserialization of special reachabilities, which have additional properties stored in a dictionary. This could involve unique movement types or conditions specific to certain game scenarios.

## idAASSettings

- **idAASSettings Constructors and Member Functions:** Manage configuration settings for the AAS, including bounding boxes for navigation, physics settings like gravity, and various thresholds for AI movement capabilities (e.g., max step height, max fall height). These settings influence how the AAS data is generated and used for pathfinding.
- **FromParser, FromFile, FromDict:** Functions to initialize AAS settings from different sources: a parser object, a file, or a dictionary containing key-value pairs.
- **WriteToFile:** Serializes AAS settings to a file, making it possible to save configured settings for reuse or distribution.

## idAASFileLocal

- **Constructor/Destructor:** Initialize and clean up an AAS file instance, managing resources like memory allocations for reachabilities and other AAS components.
- **Clear, Load, Write:** Functions to reset the AAS data, load it from a file, or write it to a file. These are crucial for both generating AAS data from level geometry and utilizing it for AI navigation in the game.
- **ParseXXX Functions:** Each ParseXXX function reads specific parts of the AAS file format, such as vertices, edges, faces, areas, and clusters. This parsing is necessary to reconstruct the navigation mesh and related data from AAS files.
- **FinishAreas, ReportRoutingEfficiency:** Post-processing functions for AAS data. FinishAreas calculates additional properties for areas once the AAS file is loaded, and ReportRoutingEfficiency provides metrics on the routing capabilities and potential memory usage of the AAS data.
- **MemorySize, PrintInfo:** Utility functions for debugging and analysis, providing information on the memory footprint of the AAS file and a summary of its contents.
- **DeleteReachabilities, DeleteClusters:** Cleanup functions to remove dynamically allocated reachabilities and reset cluster data, ensuring that the AAS file can be re-initialized or updated without memory leaks.

## Features Bits

{: .quake4 }
> This feature is only avaliable in Quake IV!
> > {: .todo }
> > Give a explanation of what these bits do.

```cpp
// feature bits
#define FEATURE_COVER        BIT(0)    // provides cover
#define FEATURE_LOOK_LEFT      BIT(1)    // attack by leaning left
#define FEATURE_LOOK_RIGHT      BIT(2)    // attack by leaning right
#define FEATURE_LOOK_OVER      BIT(3)    // attack by leaning over the cover
#define FEATURE_CORNER_LEFT      BIT(4)    // is a left corner
#define FEATURE_CORNER_RIGHT    BIT(5)    // is a right corner
#define FEATURE_PINCH        BIT(6)    // is a tight area connecting two larger areas
#define FEATURE_VANTAGE        BIT(7)    // provides a good view of the sampled area as a whole
```

</details>

# Filename: AASFile_optimize.cpp
{: .fs-9 }
{:aasfileoptimize}

---

{: .todo }
> Give a proper overview about this file!

<details markdown="block">
<summary>Technical Review</summary>

## Overview

The `Optimize` function iterates through areas, faces, edges, and vertices within the AAS file to perform several optimization tasks. These include removing duplicate vertices, edges, and faces, as well as reindexing these elements to ensure a compact and efficient data structure.

## Process

- **Initialization**: It starts by setting up remapping lists for vertices, edges, and faces. These lists will be used to track new indices of these elements after optimization.
- **Vertex and Edge Remapping**: As it iterates through areas and their associated faces and edges, the function checks if a vertex or edge has already been remapped. If not, it appends these to the new list of vertices or edges and updates the remap list with the new index. This process effectively removes duplicate vertices and edges.
- **Face Processing**: For each face, it checks if the face has already been processed. If a face hasn't been processed, it's appended to a new list of faces. If the face is not relevant (e.g., doesn't have certain flags set), its edges are not processed further. Otherwise, its edges are processed as described above.
- **Area Processing**: The function updates each area's first face index and the number of faces, now pointing to the optimized list of faces.
- **Reachability Edge Remapping: For each area's reachabilities, the function updates the edge numbers to correspond to the new, optimized list of edges.
- **Finalizing**: The original lists of vertices, edges, edge indexes, faces, and face indexes in the AAS file are replaced with the newly optimized lists.

## Outcome

The optimization process results in a more compact and efficient AAS file. By removing duplicates and unnecessary data, the AI system can navigate the game world using fewer resources, potentially leading to faster AI computations and reduced memory usage. This optimization is crucial for maintaining the performance of the game, especially in complex levels where AI pathfinding calculations can become intensive.

</details>

# Filename: AASFile_sample.cpp
{: .fs-9 }
{:aasfilesample}

---

{: .todo }
> Give a proper overview about this file!

<details markdown="block">
<summary>Technical Review</summary>

## Environment Sampling Overview

Environment sampling within the AAS file involves calculating geometric and spatial properties of edges, faces, and areas defined in the AAS data. These properties include centers, bounds, and whether specific points or areas are reachable under certain conditions.

## Key Functions

- **EdgeCenter**: Calculates the center point of an edge specified by its index. This is used to find the midpoint of a line segment defined by two vertices.
- **FaceCenter**: Computes the center point of a face (a polygon) given by its index. It averages the positions of all vertices that compose the face.
- **AreaCenter**: Determines the centroid of an area (a collection of faces) by averaging the center points of all faces within the area.
- **AreaReachableGoal**: Identifies a reachable goal position within an area. This function is crucial for AI pathfinding, as it helps determine where within an area an AI entity can move to accomplish its navigation goals.
- **EdgeBounds, FaceBounds, and AreaBounds**: These functions compute the bounding boxes for edges, faces, and areas, respectively. Bounding boxes are useful for collision detection, visibility calculations, and more.
- **PointAreaNum**: Given a point in space, this function finds the area (if any) that contains the point. This is essential for determining an AI entity's location within the navigation mesh.
- **PointReachableAreaNum**: Similar to `PointAreaNum`, but with additional constraints. It finds an area reachable from a given point, considering specified area flags and excluding areas based on travel flags. This allows for more nuanced pathfinding, taking into account the navigability of different types of terrain.
- **BoundsReachableAreaNum and BoundsReachableAreaNum_r**: These functions extend `PointReachableAreaNum` to work with bounding boxes instead of points, allowing for area searches within a specified volume.
- **PushPointIntoAreaNum**: Adjusts a point's position to ensure it is within the navigable bounds of an area. This is used to correct for minor inaccuracies in positioning AI entities or goals within the navigation mesh.
- **Trace**: Performs a trace (raycast) from one point to another, checking for collisions with the AAS environment. This function is essential for line-of-sight calculations, reachability tests, and more.
- **AreaContentsTravelFlags**: Determines the types of movement (e.g., walking, flying, swimming) allowed within an area based on its contents. This helps AI entities decide how they can navigate through different areas.
- **MaxTreeDepth and MaxTreeDepth_r**: These functions compute the maximum depth of the AAS tree, providing insights into the complexity of the navigation mesh structure.

</details>

# Filename: AASReach.cpp
{: .fs-9 }
{:brushes}

AASReach identifies and categorizes different types of movements (such as walking, flying, swimming, or jumping) that AI entities can use to move from one point to another within the game's environments.

<details markdown="block">

## Functions:

- **idAASReach::ReachabilityExists**: This function checks if there is an existing reachability link from one area (`fromAreaNum`) to another (`toAreaNum`). It iterates through all reachabilities of the starting area to see if a direct connection to the target area already exists, returning true if so and false otherwise.
- **idAASReach::CanSwimInArea**: Determines whether an area (`areaNum`) contains water, indicating if an AI entity can swim there. This is done by checking if the area's contents flag includes `AREACONTENTS_WATER`.
- **idAASReach::AreaHasFloor**: Checks if an area (`areaNum`) has a floor by examining if the area's flags include `AREA_FLOOR`, which suggests it's walkable for AI entities.
- **idAASReach::AreaIsClusterPortal**: Identifies if an area (`areaNum`) serves as a cluster portal, used in the game's navigation mesh to facilitate pathfinding between different clusters or sections of the map. This is indicated by the `AREACONTENTS_CLUSTERPORTAL` flag.
- **idAASReach::AddReachabilityToArea**: Adds a new reachability link (reach) to an area (`areaNum`), effectively linking it to another area and updating the total count of reachabilities (numReachabilities).
- **idAASReach::Reachability_Fly**: Generates flying reachabilities for an area (`areaNum`), enabling AI entities to navigate through air or spaces that don't require walking. This involves iterating through the area's faces and creating new `idReachability_Fly` objects for adjacent areas that can be flown to.
- **idAASReach::Reachability_Swim**: Similar to flying, but for swimming, this function adds swimming reachabilities between water-containing areas, allowing AI entities to navigate through water.
- **idAASReach::Reachability_EqualFloorHeight**: Creates walkable reachabilities between areas of equal floor height, ensuring AI entities can walk from one to another without needing to jump or climb.
- **idAASReach::Reachability_Step_Barrier_WaterJump_WalkOffLedge**: A complex function that handles multiple types of movement reachabilities including stepping over low obstacles, jumping over barriers, jumping through water, and walking off ledges. It checks various geometric and environmental conditions to determine the possible movements between two areas.
- **idAASReach::Reachability_WalkOffLedge**: Specifically handles the scenario where an AI entity can walk off a ledge from one area to another, considering factors like the maximum fall height an entity can survive.
- **idAASReach::FlagReachableAreas**: Marks areas in the navigation mesh as reachable based on their characteristics, such as having a floor, containing water, or being accessible by flying, which is essential for pathfinding.
- **idAASReach::Build**: The main function that orchestrates the generation of reachabilities for the entire map. It goes through all areas in the game level, applying the various reachability functions to create a comprehensive network of possible movements for AI navigation.

</details>

---

# Filename: Brush.cpp, BrushBSP.cpp
{: .fs-9 }
{:brushes}

---

These files are part of the map processing and collision detection system in the Doom 3 engine. They deal with the representation and manipulation of brushes, which are convex shapes used to construct the geometry of game levels. The Brush.cpp file likely handles the basic operations on brushes, such as creation, editing, and geometric calculations. BrushBSP.cpp extends this functionality to include Binary Space Partitioning (BSP) operations on brushes, which is a method for subdividing space for efficient rendering and collision detection.

<details markdown="block">
<summary>Execution Flow</summary>

```
RunAAS_f
│
└──> LoadMapFile (Loads and parses the map file to be processed for AAS)
│    │
│    └──> ParseEntities (Extracts entities from the map file)
│    └──> CreateBrushesFromEntities (Creates brushes for map geometry)
│
└──> InitAASBuildSettings (Initializes settings for AAS building based on map and game requirements)
│
└──> BuildAASForMap (Main function to start AAS building process)
     │
     ├──> CleanupMapBrushes (Pre-processes and cleans up map brushes for AAS generation)
     │
     ├──> BuildGeometryBSP (Constructs a BSP tree for the map geometry to optimize AAS processing)
     │    │
     │    ├──> AddBrushesToBSP (Adds brushes to the BSP tree)
     │    └──> SplitBrushes (Splits brushes to fit into the BSP tree nodes)
     │
     ├──> CreateAASAreas (Defines navigable areas from the BSP tree for AI pathfinding)
     │    │
     │    └──> ConvertBSPToAAS (Converts BSP geometry into AAS area and edge data)
     │
     ├──> ConnectAASAreas (Identifies and creates connections between AAS areas, called reachabilities)
     │    │
     │    ├──> CalculateAreaReachabilities (Calculates ways AI can move from one area to another)
     │    └──> OptimizeAreaConnections (Optimizes connections for efficient pathfinding)
     │
     └──> SaveAASFile (Saves the generated AAS data into a file for use by the game engine)
          │
          └──> WriteAASAreas (Writes area data to the AAS file)
          └──> WriteAASReachabilities (Writes reachability data to the AAS file)
```

</details>
 
## Core AAS Data Structures

- **idReachability:** Represents a pathway or connection between two areas in the game world that AI can use to navigate. Each subclass (Walk, BarrierJump, WaterJump, WalkOffLedge, Swim, Fly, Special) represents different types of movements AI entities might need to perform to traverse from one area to another, such as walking, jumping over barriers, jumping into water, walking off ledges, swimming, flying, or special scripted movements.
- **aasIndex_t:** A simple type definition for indexing AAS data structures. It helps manage the indices of various AAS elements efficiently.
- **aasVertex_t:** Represents a vertex in the AAS data. Vertices are used to define the geometry of the navigable space.
- **aasEdge_s:** Defines an edge in the AAS data, which is a line segment between two vertices. Edges are used to construct the boundaries of faces and areas.
- **aasFace_s:** Represents a face in the AAS data, which is a polygonal boundary of an area. Faces are used to define the perimeter of navigable areas and their connections to other areas.
- **aasArea_s:** Defines a navigable area in the AAS data. Areas are convex polygons that AI entities can move within. They contain information about their geometry, connections to other areas (via reachabilities), and various attributes like flags, contents, and cluster data for hierarchical organization.
- **aasNode_s:** Nodes are part of the BSP (Binary Space Partitioning) tree structure used to organize AAS data spatially. Each node divides the space into two, helping quickly locate areas and their connections.
- **aasPortal_s:** Represents a portal between two clusters in the AAS data. Portals are used to connect large regions (clusters) of navigable space, allowing for efficient pathfinding over large distances.
- **aasCluster_s:** A cluster is a collection of interconnected areas. Clustering helps manage large maps by grouping areas into higher-level structures, improving pathfinding performance.
- **aasTrace_s:** Used for tracing movement paths through the world, considering the environment's geometry and AAS data. This structure helps determine whether a path is blocked or clear, supporting AI decision-making in navigation.

## Settings and Configuration

- **idAASSettings:** Encapsulates configuration settings for AAS generation and AI physics. It includes parameters for collision detection, bounding boxes for different entity sizes, gravity settings, maximum heights for various actions (like jumping or falling), and specific travel times for actions. This class ensures that AAS data aligns with the game's physical rules and AI capabilities.

## AAS Build Overview

- **RunAAS_f** is a command function that likely initiates the AAS compilation process for a given map. This process involves loading the map geometry, processing it into a BSP tree, generating the AAS data from the BSP tree, and then saving the AAS data in a format that can be used by the game's AI systems. The precise steps can vary based on the map's complexity and the specific configurations set for the AAS generation.

## Step-by-Step Process

- **Command Invocation:** The process begins when `RunAAS_f` is called, typically from the game console or during the game's initialization phase for a specific map.
- **Map Loading:** The specified map is loaded into memory. This involves parsing the map file (.map or .proc file) and loading all relevant geometry and entity data.

### BSP Tree Construction:

- The loaded map geometry is used to construct a BSP (Binary Space Partitioning) tree. This process organizes the map's geometry into a tree structure that allows for efficient spatial queries and visibility determination.
- The construction process involves selecting splitter planes (using functions like `FindSplitter` and `BuildBrushBSP_r`) to divide the space into convex leaf nodes, which contain the actual geometry.
- During this phase, operations like chopping (with `Chop`), merging (with `Merge`), and potentially pruning (with `PruneTree`) optimize the BSP tree structure.

### AAS Data Generation:

- With the BSP tree constructed, the next step is to generate the AAS data. This involves traversing the BSP tree and determining navigable areas, connections between these areas, and additional metadata required for AI navigation.
- This step calculates walkable surfaces, jump points, and other navigational features that AI entities can use to move through the game world.

### Portalization and Optimization:

- The AAS generation process may involve further optimization steps, such as portalization (with `Portalize`), which establishes connections between different areas of the map.
- Additional optimizations, like melting portals (with `MeltPortals`) and removing unnecessary nodes (with further pruning), ensure that the AAS data is as efficient and compact as possible.

### AAS Data Saving:

- Once the AAS data is generated and optimized, it's saved to a file (typically with an .aas extension). This file stores all the information needed by the game's AI systems to navigate the map effectively.

### Cleanup:

- After the AAS data is saved, any temporary data structures or memory allocations used during the process are cleaned up. This ensures that the game's memory usage remains efficient.

##  Technical Review

<details markdown="block">
<summary>Brush.cpp Technical Review</summary>

## Brush Geometry Overview

Brush geometry in Doom 3 is used for defining solid volumes in the game world. These volumes are crucial for level design, collision detection, and environmental interaction.

## Key Components and Functionalities

- **idBrushSide:** Represents a side of a brush. It contains information about the side's plane, winding, and flags. It supports operations like copying and splitting based on a plane.
- **idBrush:** Represents a brush, which is a convex polyhedron in the game world. It contains a list of brush sides (`idBrushSide`), as well as content flags and bounding box information. It supports operations such as creation from sides, windings, bounds, transformations, volume calculation, subtraction, merging, splitting, and bevel addition for axial boxes.
- **idBrushList:** Manages a list of brushes (`idBrush`). It supports adding brushes to the head or tail of the list, merging, chopping (CSG operations), setting flags on brush sides facing a given plane, and exporting the brush list to a map file.
- **idBrushMap:** Provides functionality to write brush data to a .map file, which is a format used for storing geometric descriptions of game levels. It supports writing individual brushes or an entire list of brushes to the file.

## Operations and Utility Functions

- **Brush Creation and Manipulation:** Brushes can be created from sides, windings, or bounding boxes. They can be transformed, expanded for axial boxes, and have their volume calculated.
- **CSG Operations:** Brushes support constructive solid geometry (CSG) operations, such as subtraction (`Subtract`) and merging (`TryMerge`). These operations allow for complex geometric constructions and modifications.
- **Bevels and Expansion:** Functions like `AddBevelsForAxialBox` and `ExpandForAxialBox` are used to modify brushes to account for bevels and expansion, improving the interaction with axial bounding boxes.
- **Exporting Brush Data:** The `idBrushMap` class facilitates exporting brush and brush list data to .map files, which are useful for level design and debugging purposes.

## Function List

### `idBrushSide` Functions

---

- `idBrushSide()` **(Constructors)**: Initialize a brush side, potentially with a given plane and plane number. Set flags to 0 and winding to NULL.
- `~idBrushSide()` **(Destructor)**: Cleans up the winding associated with the brush side if it exists.
- `Copy()`: Creates and returns a deep copy of the brush side, including its winding if present.
- `Split(const idPlane &splitPlane, idBrushSide **front, idBrushSide **back)`: Splits the brush side by a given plane, producing potentially new brush sides for the front and back parts relative to the split plane. This is used in CSG operations and when refining brush geometry.

### `idBrush` Functions

---

- `idBrush()` **(Constructor)**: Initializes a new brush with default values, clearing contents, flags, bounds, and setting windings as not valid.
- `~idBrush()` **(Destructor)**: Cleans up by deleting all sides of the brush, which also cleans up the windings associated with each side.
- `RemoveSidesWithoutWinding()`: Iterates through the brush sides, removing any that do not have a winding. This is part of cleaning up or finalizing a brush after operations that may alter its geometry.
- `CreateWindings()`: Generates windings for each brush side based on the brush's current geometry. It's essential for visualizing the brush in an editor or for further geometric computations. This method also updates the brush's bounding box.
- `BoundBrush()`: Calculates and updates the brush's bounding box based on its windings. It's crucial for spatial operations, including visibility and collision detection.
- `FromSides(idList<idBrushSide *> &sideList)`: Constructs a brush from a list of sides. This is a foundational operation for creating brushes from geometric descriptions.
- `FromWinding(const idWinding &w, const idPlane &windingPlane)`: Initializes a brush based on a winding and a plane. This method is useful for creating brushes from more abstract geometric representations, such as convex hulls or simplified shapes.
- `FromBounds(const idBounds &bounds)`: Creates a brush that corresponds to an axis-aligned bounding box. This is useful for creating blockout geometry or collision volumes.
- `Transform(const idVec3 &origin, const idMat3 &axis)`: Applies a transformation to the brush, moving it to a new origin and rotating it according to the specified axis. This is essential for positioning brushes in the game world.
- `GetVolume()`: Calculates the volume enclosed by the brush, which can be used for physical simulations or gameplay mechanics that depend on spatial properties.
- `Subtract(const idBrush *b, idBrushList &list)`: Performs a Boolean subtraction operation with another brush, modifying the original brush's geometry. This is part of the Constructive Solid Geometry (CSG) operations allowing complex shapes to be created by subtracting one brush from another.
- `TryMerge(const idBrush *brush, const idPlaneSet &planeList)`: Attempts to merge the brush with another brush if they share a common plane. This is used to reduce the complexity of brush geometry by combining adjacent brushes.
- `Split(const idPlane &plane, int planeNum, idBrush **front, idBrush **back)`: Splits the brush into two brushes along a plane, used in CSG operations and when refining the level geometry.
- `AddBevelsForAxialBox()`: Adds bevel planes to a brush that represents an axis-aligned bounding box, improving collision detection and response.
- `ExpandForAxialBox(const idBounds &expansionBounds)`: Expands the brush by a specified bounding box, useful for creating offset or enlarged collision volumes.
- `Copy()`: Creates a deep copy of the brush, including all its sides and their windings.

### `idBrushList` Functions

---

- `idBrushList() / ~idBrushList()`: Constructor and destructor for managing lists of brushes, initializing and cleaning up resources as needed.
- `GetBounds()`: Calculates the bounding box enclosing all brushes in the list, useful for spatial queries and level bounds calculations.
- `AddToTail(idBrush *brush) / AddToFront(idBrush *brush)`: Adds a brush to the end or beginning of the list, respectively. These operations are essential for managing collections of brushes in map editing.
- `Remove(idBrush *brush)`: Removes a specific brush from the list without deleting it, allowing for reorganization of brush collections.
- `Delete(idBrush *brush)`: Removes and deletes a specific brush from the list, freeing its resources.
- `Copy()`: Creates a deep copy of the brush list, including copies of all brushes within it.
- `Free()`: Frees all resources associated with the brush list, deleting all brushes it contains.
- `Split(const idPlane &plane, int planeNum, idBrushList &frontList, idBrushList &backList, bool useBrushSavedPlaneSide)`: Splits each brush in the list by a plane, organizing the resulting brushes into 'front' and 'back' lists based on their spatial relation to the plane.
- `Chop(bool (*ChopAllowed)(idBrush *b1, idBrush *b2))`: Performs CSG subtraction operations between brushes in the list based on a provided predicate function, allowing for complex geometry modifications.
- `Merge(bool (*MergeAllowed)(idBrush *b1, idBrush *b2))`: Attempts to merge brushes in the list based on a provided predicate function, reducing geometric complexity.
- `SetFlagOnFacingBrushSides(const idPlane &plane, int flag)`: Marks brush sides facing a specified plane with a flag, useful for tagging geometry for certain processing or rendering operations.
- `CreatePlaneList(idPlaneSet &planeList)`: Compiles a list of unique planes from all brushes in the list, supporting efficient CSG operations and plane management.

### `idBrushMap` Functions

---

- `idBrushMap(const idStr &fileName, const idStr &ext) / ~idBrushMap()`: Constructor and destructor for handling the export of brushes to a .map file, facilitating level serialization.
- `WriteBrush(const idBrush *brush)`: Writes a single brush's definition to the map file, translating its geometry into a format suitable for level editors.
- `WriteBrushList(const idBrushList &brushList)`: Writes an entire list of brushes to the map file, supporting bulk export of level geometry.

</details>

<details markdown="block">
<summary>BrushBSP.cpp Technical Review</summary>

# `idBrushBSPPortal` Class

---

- Constructor/Destructor: Initializes or cleans up a BSP portal, including its winding and connections between BSP nodes.
- Portal Operations: Methods like `AddToNodes`, `RemoveFromNode`, `Flip`, and `Split` manage portal connections between nodes, handle portal orientation, and split portals by planes, facilitating the construction and manipulation of the BSP tree.

# `idBrushBSPNode` Class

---

- Constructor/Destructor: Manages a BSP node, including its brush list, volume, child nodes, and portals.
- Node Operations: Functions such as `SetContentsFromBrushes`, `GetPortalBounds`, `TestLeafNode`, and `Split` are essential for determining node contents, handling node volumes, testing leaf properties, and splitting nodes by planes.

# `idBrushBSP` Class

---

- BSP Construction and Optimization: The core of BSP operations, including building the BSP tree from brushes (Build), creating portals (`MakeOutsidePortals`, `MakeTreePortals_r`), and optimizing the tree through methods like `MergePortals`, `MeltPortals`, and `PruneTree`.
- Portal and Node Processing: Functions like `MakeNodePortal`, `SplitNodePortals`, and `SetPortalPlanes` focus on constructing and refining the connections (portals) between nodes to accurately represent the level geometry's spatial partitioning.
- Leak Detection and Entity Flooding: `LeakFile` and `FloodFromEntities` detect map leaks and mark nodes reachable by entities, critical for gameplay and level design validation.
- Optimization Techniques: The implementation includes advanced BSP optimization techniques, such as melting vertices (`MeltPortals`), merging leaf nodes (`TryMergeLeafNodes`), and removing unnecessary geometry (`RemoveOutside`).

 
# `idBrushBSPPortal` Class Functions

---

### `idBrushBSPPortal::idBrushBSPPortal`

- Constructor initializing a BSP portal with default values, including setting the plane number to -1 and initializing pointers to null.

### `idBrushBSPPortal::~idBrushBSPPortal`

- Destructor that cleans up by deleting the portal's winding if it exists.

### `idBrushBSPPortal::AddToNodes`

- Adds the portal to the provided front and back nodes, updating the linked list of portals for each node to include this portal.

### `idBrushBSPPortal::RemoveFromNode`

- Removes the portal from a specified node's portal list, ensuring the linked list integrity is maintained without this portal.

### `idBrushBSPPortal::Flip`

- Reverses the portal's orientation by swapping its front and back nodes, reversing its winding order, and flipping its plane.

### `idBrushBSPPortal::Split`

- Splits the portal's winding by a specified plane, producing front and back windings if the split occurs, and generating new portal objects for these if necessary.

# `idBrushBSPNode` Class Functions

---

### `idBrushBSPNode::idBrushBSPNode`

- Constructor for a BSP node, setting initial values including clearing contents, flags, setting volume to null, and ensuring no child nodes or portals are associated yet.

### `idBrushBSPNode::~idBrushBSPNode`

- Destructor that frees up resources associated with the node, including deleting its brush list, volume brush, and any portals linked to this node.

### `idBrushBSPNode::SetContentsFromBrushes`

- Determines the node's contents based on the union of the contents of all brushes within the node.

### `idBrushBSPNode::GetPortalBounds`

- Calculates and returns the axis-aligned bounding box that encloses all portals associated with the node.

### `idBrushBSPNode::TestLeafNode`

- Tests if the node is effectively a leaf node by ensuring all portals fully enclose the node's space without leaks.

### `idBrushBSPNode::Split`

- Splits the node by a given plane, assigning child nodes and distributing brushes to these children based on their spatial relation to the split plane.

### `idBrushBSPNode::PlaneSide`

- Determines which side of a given plane the node's portal windings predominantly lie on, aiding in tree construction and spatial queries.

### `idBrushBSPNode::RemoveFlagFlood`

- Recursively removes a specified flag from the node and floods this removal through connected nodes via portals.

### `idBrushBSPNode::RemoveFlagRecurse`

- Recursively removes a specified flag from the node and all its children, without considering portal connections.

### `idBrushBSPNode::RemoveFlagRecurseFlood`

- A combination method that removes a flag from the node and its children, and if reaching a leaf node, floods the removal through portal connections.

# `idBrushBSP` Class Functions

---

### `idBrushBSP::idBrushBSP`

- Initializes the idBrushBSP object, setting the root and outside pointers to null and initializing counters for BSP operations.

### `idBrushBSP::~idBrushBSP`

- Cleans up the idBrushBSP instance, including potentially removing multiple references to the same leaf node and freeing the entire BSP tree structure.

### `idBrushBSP::RemoveMultipleLeafNodeReferences_r`

- Recursively traverses the BSP tree to ensure that each leaf node is uniquely referenced, avoiding multiple references to the same leaf node which can occur after certain BSP operations like merging.

### `idBrushBSP::Free_r`

- Recursively frees memory used by the BSP tree starting from a given node, including all child nodes, effectively deleting the entire BSP tree.

### `idBrushBSP::IsValidSplitter`

- Checks if a given brush side is a valid splitter, meaning it hasn't been used as a splitter before and isn't marked to avoid splitting.

### `idBrushBSP::BrushSplitterStats`

- Evaluates a potential splitter plane against the brushes in a node, gathering statistics like the number of front/back splits, splits caused, etc., to help decide if it's a good splitter.

### `idBrushBSP::FindSplitter`

- Searches for the best splitter plane among the brush sides in a node based on various criteria like minimizing splits, balancing the tree, etc., using the stats collected by BrushSplitterStats.

### `idBrushBSP::SetSplitterUsed`

- Marks the plane of a brush side used as a splitter to avoid its reuse and updates flags accordingly on brushes affected by the split.

### `idBrushBSP::BuildBrushBSP_r`

- Recursively constructs the BSP tree from a list of brushes, selecting splitter planes, and partitioning brushes until leaf nodes are reached.

### `idBrushBSP::ProcessGridCell`

- Processes a single grid cell of the BSP tree, potentially splitting it further based on geometric and content criteria to optimize the BSP structure.

### `idBrushBSP::BuildGrid_r`

- Initiates the construction of the BSP tree by dividing the space into grid cells and then further processing each cell with `ProcessGridCell`.

### `idBrushBSP::Build`

- Main entry point to build the BSP tree from a list of brushes, setting up initial conditions, creating grid cells, and processing each to construct the BSP.

### `idBrushBSP::WriteBrushMap`

- Sets up writing a brush map file which can be used for debugging or analysis, indicating which parts of the map are included based on their contents.

### `idBrushBSP::PruneTree_r`

- Recursively prunes the BSP tree, removing nodes that do not contribute to the final structure based on their contents, optimizing the BSP tree.

### `idBrushBSP::PruneTree`

- Initiates the pruning of the BSP tree to remove unnecessary nodes, based on specific content flags.

### `idBrushBSP::BaseWindingForNode`

- Creates a base winding for a BSP node, which represents the polygonal shape of the space partitioned by the node's plane.

### `idBrushBSP::MakeNodePortal`

- Creates a portal for a BSP node, defining the boundaries of the node based on its spatial partitioning and the surrounding geometry.

### `idBrushBSP::SplitNodePortals`

- Splits the portals of a node when the node is split by a new partitioning plane, ensuring the portal geometry accurately reflects the new spatial subdivisions.

### `idBrushBSP::MakeTreePortals_r`

- Recursively creates portals for all nodes in the BSP tree, ensuring each spatial partition has correctly defined boundaries.

### `idBrushBSP::MakeOutsidePortals`

- Creates portals around the outside of the BSP tree, defining the boundaries between the tree's outermost nodes and the "outside" world.

### `idBrushBSP::Portalize`

- Initiates the process of creating portals for the entire BSP tree, defining the spatial relationships and boundaries between all nodes in the tree.

</details>