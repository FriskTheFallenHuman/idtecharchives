---
layout: default
title: Area Awareness System (AAS)
parent: Engine Documentation
has_children: true
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

# Overview.
{: .fs-9 }
{:overview}

---

*“The Area Awareness System (AAS) is the whole system used to provide the bot with all the information about the current state of the world. This includes information about navigation, routing and also other entities in the game. All the information is formatted and preprocessed for fast and easy access and usage by the bot. The heart of AAS is a special 3D representation of the game world. All information provided to the bot is in some way related to or linked with this 3D representationcharmachar”*

AAS uses 3D bounded hulls, called areas, with a specific property: the navigational complexity for traveling from any reachable point in an area to any other reachable point in the same area is minimal. …this means a player can move between any such two points by just walking or swimming along a straight line.

Of course only knowing this property of each area does not provide all the information required for routing and navigation. However, so called reachabilities between areas can be calculated. Such a reachability is created from one area to another if a player can easily travel from one area to the other. Calculating these reachabilities is not all that difficult because a lot of areas will touch each other. When two areas touch, it can easily be verified if a player can really travel from one area to the other. This does not cover all the possible reachabilities between areas, but as will be shown later on, calculating other reachabilities is sometimes more complex, but definitely possible.

The system, as it is presented here, is primarily focused on navigation and routing. However a lot of other information can be retrieved from or linked to this 3D representation.

# Portalisation.
{: .fs-9 }
{:portalisation}

---

*“In order to calculate reachabilities and routes between areas (as will be done later on), another representation is required for the convex hulls (areas). The BSP tree does store all the information needed, but the representation cannot easily be used to calculate relations between areas. A representation with areas that are bounded by faces would be much more suitable. These faces are polygons that either represent solid walls or lead to other areas. With such a representation adjacency of areas can easily be determined, and it is easier to find or calculate geometric properties. Such a representation can be created by portalising the BSP tree. This technique creates portals between all the leaf nodes defined by the BSP tree. These portals are the faces that bound the areas”*

We have already seen how areas store indexes to these faces. The representation of the face itself is in also in `AASFile.h`.

```cpp
// area boundary face
typedef struct aasFace_s {
    unsigned short        planeNum;   // number of the plane this face is on
    unsigned short        flags;      // face flags
    int            numEdges;   // number of edges in the boundary of the face
    int            firstEdge;  // first edge in the edge index
    short          areas[2];    // area at the front and back of this face
} aasFace_t;
```

The definition of a face contains the data necessary to define the geometric properties of the face. It is an area on a plane bounded by edges. It also stores the index of the two areas it divides. Each face also can be tagged with flags. The flags defined in `AASFile.h` are listed below.

```cpp
// face flags
#define FACE_SOLID            BIT(0)      // solid at the other side
#define FACE_LADDER           BIT(1)      // ladder surface
#define FACE_FLOOR            BIT(2)      // standing on floor when on this face
#define FACE_LIQUID           BIT(3)      // face seperating two areas with liquid
#define FACE_LIQUIDSURFACE        BIT(4)      // face seperating liquid and air
```

*“After portalisation the basic representation needed for AAS is created. However this portalised BSP tree still needs some work and the whole representation can be optimized in several ways. The BSP tree structure is also not thrown away at this point, because it is a very useful access structure to the areas of AAS, as will be shown later on. Each area, with the face boundary representation, is linked into the BSP tree at the node that represents its convex sub-space”*

I will refer you to the thesis paper if you are interested in how the bsp tree is structured and created from the world space. The bsp tree is a tree of nodes which store the index of the plane that separates the two child nodes and the indexes to those children.

Here is that node definition from `AASFile.h`:

```cpp
// nodes of the bsp tree
typedef struct aasNode_s {
    unsigned short     planeNum;  // number of the plane that splits the subspace at this node
    int        children[2]; // child nodes, zero is solid, negative is -(area number)
} aasNode_t;
```

Note that a negative index for one of the children represents the negation of an area number. Areas are leaf nodes on the tree that result when the space in the map is no longer divided by a plane. We will look at how the bsp tree is walked later in environment sampling to find these areas.
Melting things together

*“The data used for AAS is the collection of all the areas with their face boundary representation and the BSP-tree as a fast and very useful access structure to the areas. All the boundary representations of the areas will share data. The areas will share faces, edges of faces and vertices. This will allow to more easily find shared faces, edges and vertices between adjacent areas.”*

This shared data is actually stored in the idAASFile class, again, declaration in `AASFile.h`:

```cpp
class idAASFile {
    /* public functional interface removed for clarity */
protected:
        idStr               name;
        unsigned int          crc;
    
        idPlaneSet          planeList;
        idList<aasVertex_t>       vertices;
        idList<aasEdge_t>     edges;
        idList<aasIndex_t>        edgeIndex;
        idList<aasFace_t>     faces;
        idList<aasIndex_t>        faceIndex;
        idList<aasArea_t>     areas;
        idList<aasNode_t>     nodes;
        idList<aasPortal_t>       portals;
        idList<aasIndex_t>        portalIndex;
        idList<aasCluster_t>      clusters;
        idAASSettings           settings;
};
```

# Environment Sampling.
{: .fs-9 }
{:envsampling}

---

*“There are various ways to extract information from the 3D representation used for AAS. Especially the BSP tree is a very useful structure, which allows to calculate and extract certain information about the environment very easily.”*

# Finding the area a player is in.
{: .fs-9 }
{:playerlocation}

---

*“First of all it will be useful to know which area a bot is in. Using the BSP tree there is a very fast and easy way to calculate the area a bot is in. One can start at the root node of the BSP tree and calculate the side of the plane, stored at that node, the origin of the bot’s bounding box is at. Depending on the side of the plane the origin is at, one continues with one of the child nodes that represents either the sub-space at the front, or the sub-space at the back of the plane. At this child node one again calculates which side of the plane, stored at the child node, the origin of the bounding box is at, and one continues with one of it’s children accordingly. This procedure is continued until one of the areas of AAS is found. That area is the area the bot is situated in.”*

The functionality to get the area the player or any point is in is implemented in the engine. The method signatures are declared in `AASFile.h` in the `idAASFile` class:

```cpp
class idAASFile {

    /* removed irrelevant code */
    
    virtual int   PointAreaNum( const idVec3 &origin ) const = 0;
    virtual int   PointReachableAreaNum( const idVec3 &origin, const idBounds &searchBounds, const int areaFlags, const int excludeTravelFlags ) const = 0;
    virtual int   BoundsReachableAreaNum( const idBounds &bounds, const int areaFlags, const int excludeTravelFlags ) const = 0;
    
    /* removed irrelevant code */
}
```

`PointAreaNum` will return the area in the AAS system that a given point is in.
`PointReachableAreaNum`, well, brian from id said it best: *“It returns the closest reachable area to the specified point. If the point is in a reachable area already, it just returns that point, otherwise (for example if the given point is outside the world or inside some geometry) it will scan the bounding box given searching for reachable areas.”*

*“If a point is really far outside an area (it looks like the threshold is more than 12 units in all directions), then it will return 0.”* So the same idea as `PointAreaNum`, but considers whether the area is reachable in its calculations.

{: .todo }
> `BoundsReachableAreaNum` isn’t used right now but describe it anyway It is useful to know that these same methods names appear elsewhere in the sdk.

In `AAS.h` the `idAAS` class is defined:

```cpp
class idAAS {
    /* removed irrelevant code */
    
    // Returns the number of the area the origin is in.
    virtual int   PointAreaNum( const idVec3 &origin ) const = 0;
    
    // Returns the number of the nearest reachable area for the given point.
    virtual int   PointReachableAreaNum( const idVec3 &origin, const idBounds &bounds, const int areaFlags ) const = 0;
    
    // Returns the number of the first reachable area in or touching the bounds.
    virtual int   BoundsReachableAreaNum( const idBounds &bounds, const int areaFlags ) const = 0;
    
    /* removed irrelevant code */
}
```

We will look a lot more at `idAAS` as we go too. The `idAAS` definition is an interface. The actual implementation is in the class `idAASLocal` defined in `AAS_local.h` and implemented in `AAS.cpp`

```cpp
class idAASLocal : public idAAS {
    /* removed irrelevant code */
    
    virtual int PointAreaNum( const idVec3 &origin ) const;
    virtual int PointReachableAreaNum( const idVec3 &origin, const idBounds &searchBounds, const int areaFlags ) const;
    virtual int BoundsReachableAreaNum( const idBounds &bounds, const int areaFlags ) const;
    
    /* removed irrelevant code */
}
```
The implementation is just a wrapper around the `idAASFile` implementation:

```cpp
/*
============
idAASLocal::PointAreaNum
============
*/
int idAASLocal::PointAreaNum( const idVec3 &origin ) const {
    if ( !file ) {
        return 0;
    }
    return file->PointAreaNum( origin );
}
```

`PointReachableAreaNum` is actually also declared in `idAI` in `AI.h`:

```cpp
Int PointReachableAreaNum( const idVec3 &pos, const float boundsScale = 2.0f ) const;
```

If you follow the implementation all the way back down from there you will see:

```cpp
/*
=====================
idAI::PointReachableAreaNum
=====================
*/
int idAI::PointReachableAreaNum( const idVec3 &pos, const float boundsScale ) const {
    int areaNum;
    idVec3 size;
    idBounds bounds;
 
    if ( !aas ) {
        return 0;
    }
    // set up the bounding box that is used for reachability
    size = aas->GetSettings()->boundingBoxes[0][1] * boundsScale;
    bounds[0] = -size;
    size.z = 32.0f;
    bounds[1] = size;
 
    if ( move.moveType == MOVETYPE_FLY ) {
        areaNum = aas->PointReachableAreaNum( pos, bounds, AREA_REACHABLE_WALK | AREA_REACHABLE_FLY );
    } else {
        areaNum = aas->PointReachableAreaNum( pos, bounds, AREA_REACHABLE_WALK );
    }
 
    return areaNum;
}
```

At the `idAI` level the work of setting up the bounding boxes and travel flags is done. `idAI` uses its instance of pointer to idAAS to get the bounds. At some point maybe a page about AAS settings will happen.

After `idAI ::PointReachableAreaNum` does its work it calls AASLocal’s version of the same method.

```cpp
/*
============
idAASLocal::PointReachableAreaNum
============
*/
int idAASLocal::PointReachableAreaNum( const idVec3 &origin, const idBounds &searchBounds, const int areaFlags ) const {
    if ( !file ) {
        return 0;
    }
 
    return file->PointReachableAreaNum( origin, searchBounds, areaFlags, TFL_INVALID );
}
```

Which is just a wrapper around idAASFile’s version, passing in the `TFL_INVALID` flag for excluded travel flags.
Recursive subdivision by the bsp tree.

{: .todo }
> Finding the areas a trace goes through.
>
> Code dump for tracing.

```cpp
virtual bool Trace( aasTrace_t &trace, const idVec3 &start, const idVec3 &end ) const = 0;
 
// trace through the world
typedef struct aasTrace_s {
                    // parameters
    int                flags;          // areas with these flags block the trace
    int                travelFlags;        // areas with these travel flags block the trace
    int                maxAreas;       // size of the 'areas' array
    int                getOutOfSolid;      // trace out of solid if the trace starts in solid
                    // output
    float              fraction;       // fraction of trace completed
    idVec3              endpos;         // end position of trace
    int                planeNum;       // plane hit
    int                lastAreaNum;        // number of last area the trace went through
    int                blockingAreaNum;    // area that could not be entered
    int                numAreas;       // number of areas the trace went through
    int *              areas;          // array to store areas the trace went through
    idVec3 *            points;         // points where the trace entered each new area
                    aasTrace_s( void ) { areas = NULL; points = NULL; getOutOfSolid = false; flags = travelFlags = maxAreas = 0; }
} aasTrace_t;
```

*“`idAASFile::Trace` actually allows you to get an ordered list of all areas the a line goes through if you set `aasTrace_t::areas` to an integer array and `aasTrace_t::maxAreas` to the maximum number of elements in this array. The array will be filled in with the numbers of the areas the line went through and `aasTrace_t::numAreas` will be set to the number of areas. Areas a bounding box is in. In order to calculate if the bot’s bounding box can or will touch the bounding boxes of other entities in the world, it is often useful to know in which area(s) the bounding boxes of entities are. To calculate this the bounding box of the entity has to be expanded, just like the brushes are expanded for collision calculations. This expansion is necessary, because the not expanded bounding box can be outside all areas, when at the same time the bot might be able to touch the bounding box while standing in a certain area. After expansion it can be calculated in which area(s) the bounding box resides, by testing on which side of the BSP tree split planes the bounding box is situated. This works similar to how the area a bot is in, is found. However a bounding box is now used instead of a point.”*

{: .note }
> You can use `BoundsReachableAreaNum` to return the number of the first reachable area in or touching the bounds you pass to it.
> However if you want a list of the areas as described above you will have to take a look at `idAASLocal::GetBoundsAreas_r.` Before we look at it lets look at how it is used. The only place that it is called in the sdk is from `idAASLocal::AddObstacle.` The only thing to note from `AddObstacle` for now is how the bounds passed to `GetBoundsArea_r` are expanded and how the root node, 1, is passed to the `GetBoundsArea_r`. We will get into how obstacles are used later.

```cpp 
/*
============
idAASLocal::AddObstacle
============
*/
aasHandle_t idAASLocal::AddObstacle( const idBounds &bounds ) {
    idRoutingObstacle *obstacle;
 
    if ( !file ) {
        return -1;
    }
 
    obstacle = new idRoutingObstacle;
    obstacle->bounds[0] = bounds[0] - file->GetSettings().boundingBoxes[0][1];
    obstacle->bounds[1] = bounds[1] - file->GetSettings().boundingBoxes[0][0];
    GetBoundsAreas_r( 1, obstacle->bounds, obstacle->areas );
    SetObstacleState( obstacle, true );
 
    obstacleList.Append( obstacle );
    return obstacleList.Num() - 1;
}
```

Now for the actual routine. *“One starts at the root node of the BSP tree and calculates which side of the plane, stored at that node, the bounding box is at.”*

```cpp 
/*
============
idAASLocal::GetBoundsAreas_r
============
*/
void idAASLocal::GetBoundsAreas_r( int nodeNum, const idBounds &bounds, idList<int> &areas ) const {
    int res;
    const aasNode_t *node;
 
    while( nodeNum != 0 ) {
``` 

*“This procedure is continued until all the areas of AAS the bounding box is in are found.”*

```cpp 
        if ( nodeNum < 0 ) {
            areas.Append( -nodeNum );
            break;
        }
```

To understand the check above it helps to understand how the bsp tree we are navigating was built. It is quite a bit of reading, and I don’t have code to annotate for it, so I will again refer you to chapter 6 in Mr_elusive’s_thesis . The routine checks if the nodeNum is negative. It does this because nodes that have negative indexes are leaf nodes. So, when we find a negative nodeNum, we know we have found a leaf node that our bounds is in. We append the area index to the list passed in to be populated and break out of the loop.

If the nodeNum isn’t negative, we have to keep searching…

“Depending on the side of the plane the bounding box is at one continues with one of the child nodes, that represents either the sub-space at the front or the sub-space at the back of the plane.

```cpp
        node = &file->GetNode( nodeNum );
        res = bounds.PlaneSide( file->GetPlane( node->planeNum ) );
        if ( res == PLANESIDE_BACK ) {
            nodeNum = node->children[1];
        }
        else if ( res == PLANESIDE_FRONT ) {
            nodeNum = node->children[0];
        }
```

We find out which side of the splitting plane the bounding box is on and set the nodeNum to the child that represents that side of the plane for the next iteration through the loop.

*“In case the plane stored at the node splits the bounding box one continues with both children.”*

```cpp
        else {
            GetBoundsAreas_r( node->children[1], bounds, areas );
            nodeNum = node->children[0];
        }
    }
}
```

By calling `GetBoundsAreas_r` recursively we are able to divide the search down two branches of the tree.

*“At each child node one again calculates which side of the plane, stored at the child node, the bounding box is at, and one continues with one or both of it’s children accordingly.”*
In other words back to the top of the while loop.

# Reachability.
{: .fs-9 }
{:reachability}

---

*“Just the area representations are not sufficient for the bot to travel through the whole map. The bot will need to know how to travel from one area to the other, if possible at all. Therefore so-called reachabilities between areas are calculated. Such a reachability always starts in a certain area and leads to one other area. All possible reachabilities can be classified using about 12 different types.”*

- Swimming in a straight line
- Walking in a straight line
- Crouching in a straight line
- Jumping onto a barrier
- Walking of a ledge
- Jumping out of the water
- Jumping
- Teleporting
- Using an elevator
- Using a jump pad
- Using a bobbing platform
- Rocket jumping

Currently in doom 3 however: *“The Doom3 AAS compiler finds the following reachabilities:.”*

- TFL_WALK
- TFL_BARRIERJUMP
- TFL_WALKOFFLEDGE
- TFL_SWIM
- TFL_WATERJUMP
- TFL_FLY

*“although the swim and fly reachabilities are only calculated if in the AAS settings `allowSwimReachabilities` and `allowFlyReachabilities` are set respectively. There tend to be a lot of fly reachabilities so we don’t waste memory to store them if there are no flying creatures in a level. Since the Doom3 AAS format is very open and the environment sampling functionality is exposed through `idAASFile` as well it shouldn’t be too hard for third parties to write a tool that adds more reachabilities to an AAS file.”* The task of extending the AAS as described is underway; you can read about it over here .

`idReachability` is the class used to represent reachabilities in code. Its definition can be found in `AASFile.h`.

```cpp
// reachability to another area
class idReachability {
public:
    int                    travelType;     // type of travel required to get to the area
    short                  toAreaNum;      // number of the reachable area
    short                  fromAreaNum;        // number of area the reachability starts
    idVec3                  start;          // start point of inter area movement
    idVec3                  end;            // end point of inter area movement
    int                    edgeNum;        // edge crossed by this reachability
    unsigned short                travelTime;     // travel time of the inter area movement
    byte                    number;         // reachability number within the fromAreaNum (must be < 256)
    byte                    disableCount;       // number of times this reachability has been disabled
    idReachability *            next;           // next reachability in list
    idReachability *            rev_next;       // next reachability in reversed list
    unsigned short *          areaTravelTimes;    // travel times within the fromAreaNum from reachabilities that lead towards this area
public:
    void                   CopyBase( idReachability &reach );
};
```

The first data member is travelType, this will hold the travel flags we looked at earlier. In this case it represents the type of travel necessary to use the reachability to get to the next area. A reachability connects the area in the map indexed as `fromAreaNum` to the area in the map indexed as `toAreaNum`. start and end represent the actual location the reachability starts and ends as a position vector. To get from one area to another you typically cross an edge that is shared between the two areas, the index of that edge is stored in `edgeNum`. Reachabilities are weighted so the routing algorithm can find the least cost path. That weight is stored in `travelTime`. Each reachability gets an index that represents the reachability in the area. This index is used by the routing system as we will see later. Dynamic obstacles may be added to the AAS system during game play. These obstacles may effectively block reachabilities from being used, `disableCount` tracks this occurrence.

Remember the definition for area, a pointer to a reachability is used to store all reachabilities for a given direction.

```cpp 
    idReachability *            reach;              // reachabilities that start from this area
    idReachability *            rev_reach;          // reachabilities that lead to this area
} aasArea_t;
```

`idReachabilities` are linked into areas in two lists. The reach pointer above points to the first reachability that starts in the area defined and ends in another area.
The idReachability pointer `next` points to the next reachability in this list. Each reachability that leads from the area to another area is added to this list when the `idAASFile` is loaded. The same is true for `rev_reach` and `rev_next`, only for reachabilities that lead to the area are stored instead. The routing system uses the graph formed by the areas and reachabilities to search for least cost paths from one location to another. We will look at this in depth later. The `areaTravelTimes` member of idReachability is an array of travel times across an area from other reachabilities that lead towards the area the reachability ends in. These travel times are calculated when the AAS system is initialized for quick lookup later by the routing system.

# Routing.
{: .fs-9 }
{:routing}

---

Multi-level algorithm that calculates cache

*“The routing algorithm always calculates and caches routing data for a specific goal area. The routing cache stores per goal area, the travel times of areas towards this goal, and the first reachability to be used from these areas towards this goal.”*

This routing data is stored within `idAASLocal` which is declared in `AAS_local.h`:

```cpp
class idAASLocal : public idAAS {
 
/* removed unrelated code */
 
private:   // routing data
    idRoutingCache ***      areaCacheIndex;     // for each area in each cluster the travel times to all other areas in the cluster
    int                areaCacheIndexSize; // number of area cache entries
    idRoutingCache **       portalCacheIndex;   // for each area in the world the travel times from each portal
    int                portalCacheIndexSize;   // number of portal cache entries
    idRoutingUpdate *       areaUpdate;     // memory used to update the area routing cache
    idRoutingUpdate *       portalUpdate;       // memory used to update the portal routing cache
    unsigned short *      goalAreaTravelTimes;    // travel times to goal areas
    unsigned short *      areaTravelTimes;    // travel times through the areas
    int                numAreaTravelTimes; // number of area travel times
    mutable idRoutingCache *    cacheListStart;     // start of list with cache sorted from oldest to newest
    mutable idRoutingCache *    cacheListEnd;       // end of list with cache sorted from oldest to newest
    mutable int            totalCacheMemory;   // total cache memory used
    idList<idRoutingObstacle *>   obstacleList;       // list with obstacles 
```

If some of these declarations seem unclear don’t worry, we will look at when and how this data is set up soon.

Much of the data above is stored in a class named `idRoutingCache`, it is declared in the same file.

```cpp
class idRoutingCache {
    friend class idAASLocal;
 
public:
                    idRoutingCache( int size );
                    ~idRoutingCache( void );
 
    int                Size( void ) const;
 
private:
    int                type;           // portal or area cache
    int                size;           // size of cache
    int                cluster;        // cluster of the cache
    int                areaNum;        // area of the cache
    int                travelFlags;        // combinations of the travel flags
    idRoutingCache *        next;           // next in list
    idRoutingCache *        prev;           // previous in list
    idRoutingCache *        time_next;      // next in time based list
    idRoutingCache *        time_prev;      // previous in time based list
    unsigned short            startTravelTime;    // travel time to start with
    unsigned char *           reachabilities;     // reachabilities used for routing
    unsigned short *      travelTimes;        // travel time for every area
};
```

Notice how each instance will store the area number and travel flags it was created for and as mentioned in the quote above, will store the travel times and first reachability to be used from each area towards the goal area. We will take a look at how `idRoutingCache` objects are created and linked into the routing cache in detail in a bit.

Before that, let’s see how the system is initialized when a map loads. In `idGameLocal::LoadMap`:

```cpp
// load navigation system for all the different monster sizes
    for( i = 0; i < aasNames.Num(); i++ ) {
        aasList[ i ]->Init( idStr( mapFileName ).SetFileExtension( aasNames[ i ] ).c_str(), mapFile->GetGeometryCRC() );
    }
```

Each size AAS file that exists for the given map is initialized. The initialization code is `idAASLocal::Init`:

```cpp
/*
============
idAASLocal::Init
============
*/
bool idAASLocal::Init( const idStr &mapName, unsigned int mapFileCRC ) {
    if ( file && mapName.Icmp( file->GetName() ) == 0 && mapFileCRC == file->GetCRC() ) {
        common->Printf( "Keeping %s\n", file->GetName() );
        RemoveAllObstacles();
    }
    else {
        Shutdown();
 
        file = AASFileManager->LoadAAS( mapName, mapFileCRC );
        if ( !file ) {
            common->DWarning( "Couldn't load AAS file: '%s'", mapName.c_str() );
            return false;
        }
        SetupRouting();
    }
    return true;
}
```

`AASFileManager->LoadAAS` loads the `.aas` file into an instance of `idAASFile.` We looked at `idAASFile` and its lists of data earlier. After the area and reachability information is loaded into memory from the file SetupRouting is called.

```cpp
/*
============
idAASLocal::SetupRouting
============
*/
bool idAASLocal::SetupRouting( void ) {
    CalculateAreaTravelTimes();
    SetupRoutingCache();
    return true;
}
```

`CalculateAreaTravelTimes` initializes the `areaTravelTime` array of each reachability in the map. It also calculates and sets the maxAreaTravelTime for any portal areas. We will see these travel times used later. `SetupRoutingCache` initializes memory for all the routing cache data members we looked at earlier. If anyone would like more detail on these just ask.

# Routing cache and Clusters.
{: .fs-9 }
{:clusters}

---

*“The multi-level routing algorithm calculates routing caches at two levels. It calculates cache for areas in a cluster and it calculates cache for cluster portals. In a map one or more clusters with areas are created. Such a cluster is a group of connected areas. Shared bounding faces and reachabilities connect the areas. The clusters are separated by cluster portals, which are areas themselves. The only way to travel from one cluster to another is through one or more cluster portals. A cluster portal always separates no more and no less than two clusters. The cache for areas in a cluster will be called area cache, and the cache for cluster portals, portal cache. The area cache stores the travel times of all areas within a cluster, including the cluster portal areas that touch the cluster, towards goal areas that are in the same cluster. The portal cache stores the travel times of all portal areas in a map, towards a goal area which can be anywhere on the map. Such a goal area can be any area from any cluster, including cluster portal areas.”*

Yeah, so if you didn’t quite catch that, you probably want to read it again before moving into the code that does it. Maybe I will upload a picture too someday.

First we will look again at a couple of declarations from above, they should make a little more sense now. An area cache and a portal cache to store routing data at two different levels.

```cpp
idRoutingCache ***  areaCacheIndex;         
idRoutingCache **   portalCacheIndex;
```

Lets look at portalCacheIndex first. It is a pointer to a dynamically allocated array of pointers to `idRoutingCaches`. The array is indexed by goal area number. You will see it used later like this:

```cpp
else if ( cache->type == CACHETYPE_PORTAL ) {
        portalCacheIndex[cache->areaNum] = cache->next;
    }
```

The neat part is the `idRoutingCaches` pointed to by each area index is that it is actually part of a doubly linked list of `idRoutingCaches.` An instance is added to this list for each for each distinct set of travel flags requested for the area by the routing algorithm. So you will see loops like this later.

```cpp
// check if cache without undesired travel flags already exists
    for ( cache = portalCacheIndex[areaNum]; cache; cache = cache->next ) {
        if ( cache->travelFlags == travelFlags ) {
            break;
        }
    }
```

Ok, got that. One more time, a pointer to an array of pointers to doubly linked lists of idRoutingCaches, indexed per goal area, linked per travel flags. he he, you remember what it is for now? me either, here:

*“The portal cache stores the travel times of all portal areas in a map, towards a goal area which can be anywhere on the map. Such a goal area can be any area from any cluster, including cluster portal areas.”*

Good, now lets look at `areaCacheIndex`. Again, for reference:

```cpp
idRoutingCache ***  areaCacheIndex;
```

`areaCacheIndex` is a pointer to a dynamically allocated two dimensional array of pointers to `idRoutingCaches`. The first dimension of the array is indexed by cluster number. The second dimension is indexed by area number. Perhaps an example:

```cpp
// pointer to the cache for the area in the cluster
    clusterCache = areaCacheIndex[clusterNum][clusterAreaNum];
```

Try to think of it this way. What you have is an array of caches that represent the routing data for each cluster in the map. Clusters contain areas, so a clusters routing data is itself an array of routing data for areas.

Or maybe this way?

A pointer to an array (indexed by cluster number) of arrays (each indexed by area number) of pointers to `idRoutingCaches` which represent the routing data for that area in that cluster. And don’t forget, `idRoutingCaches` are themselves doubly linked lists with a link for each set of travel flags passed in by the routing algorithm.

Well, if it isn’t clear now, maybe it will be after we see it being used, and remember:

*“The area cache stores the travel times of all areas within a cluster, including the cluster portal areas that touch the cluster, towards goal areas that are in the same cluster.”*

Moving on…

*“In general not all routing cache will be calculated. Routing cache will only be calculated and stored for areas the bot has had, or still has as a goal.”*

We now know that there are actually two levels to the cache, a level for areas and a level for clusters. There are also two corresponding methods to get at this data for each level. `GetAreaRoutingCache` and GetPortalRoutingCache. We will look at `GetAreaRoutingCache` in detail and skip GetPortalRoutingCache as it is almost identical.

`GetAreaRoutingCache` is called, passing in the cluster, area, and travel flags you would like routing data for. `GetAreaRoutingCache` checks to see if the appropriate data is already cached. If not, it creates it, caches it, then returns it.

```cpp
/*
============
idAASLocal::GetAreaRoutingCache
============
*/
idRoutingCache *idAASLocal::GetAreaRoutingCache( int clusterNum, int areaNum, int travelFlags ) const {
    int clusterAreaNum;
    idRoutingCache *cache, *clusterCache;
```

If the area passed in is a cluster portal area (one of those that separate clusters) than the area actually belongs to two different clusters (the two it separates). It will have two different indexes, one that identifies it in each cluster. Areas are stored in an instance of `idList` in an `idAASFile.` The index of the area into this list is different then the index of the area that identifies it in a cluster. The call below to `ClusterAreaNum` returns the area number that represents the area in the cluster we asked for.

```cpp
    // number of the area in the cluster
    clusterAreaNum = ClusterAreaNum( clusterNum, areaNum );
```

We can now get the idRoutingCache object for the area and iterate through the linked list to find one that has the appropriate travel flags.

```cpp
    // pointer to the cache for the area in the cluster
    clusterCache = areaCacheIndex[clusterNum][clusterAreaNum];
    // check if cache without undesired travel flags already exists
    for ( cache = clusterCache; cache; cache = cache->next ) {
        if ( cache->travelFlags == travelFlags ) {
            break;
        }
    }
```

If we didn’t find a cache object, either because there wasn’t one for the area at all, or there wasn’t one with the appropriate flags, `GetAreaRoutingCache` will create it and insert it as the first node in the linked list

```cpp
    // if no cache found
    if ( !cache ) {
        cache = new idRoutingCache( file->GetCluster( clusterNum ).numReachableAreas );
        cache->type = CACHETYPE_AREA;
        cache->cluster = clusterNum;
        cache->areaNum = areaNum;
        cache->startTravelTime = 1;
        cache->travelFlags = travelFlags;
        cache->prev = NULL;
        cache->next = clusterCache;
        if ( clusterCache ) {
            clusterCache->prev = cache;
        }
        areaCacheIndex[clusterNum][clusterAreaNum] = cache;
        UpdateAreaRoutingCache( cache );
    }
    LinkCache( cache );
    return cache;
}
```

There are two methods called above that also deserve some attention. `UpdateAreaRoutingCache` and `LinkCache.` We will skip UpdateAreaRoutingCache for a moment and talk about `LinkCache` first:

Remember in the definition of `idRoutingCache`:

```cpp
idRoutingCache *    time_next;      // next in time based list
idRoutingCache *    time_prev;      // previous in time based list
```

Because there is a cap on routing cache memory we want to track of all instances of `idRoutingCache` in the order they were created. LinkCache manages this doubly linked list. This allows us to delete the oldest data in the cache to make room for new data, which we will see happen later.

`UpdateAreaRoutingCache` brings us to the next section, one of my favorites…

# Calculating routing caches.
{: .fs-9 }
{:routingcaches}

---

There are also two methods for calculating routing caches, one for each level of cache. `UpdateAreaRoutingCache` and `UpdatePortalRoutingCache.` We will look at both here.

`UpdateAreaRoutingCache` is called only from GetAreaRoutingCache which we just saw passes it an instance of `idRoutingCache` initialized with the area number for the goal area and the travel flags that may be used in calculating the routes to the area. Given this goal area `UpdateAreaRoutingCache` calculates the travel times from every other reachable area in the cluster to the goal area and stores them in the `idRoutingCache` travelTimes array. It also stores the first reachability to be used in the route from each of the areas in the reachabilities array member.

There is some initialization code before the really cool stuff happens, here are the declarations.

```cpp
/*
============
idAASLocal::UpdateAreaRoutingCache
============
*/
void idAASLocal::UpdateAreaRoutingCache( idRoutingCache *areaCache ) const {
    int i, nextAreaNum, cluster, badTravelFlags, clusterAreaNum, numReachableAreas;
    unsigned short t, startAreaTravelTimes[MAX_REACH_PER_AREA];
    idRoutingUpdate *updateListStart, *updateListEnd, *curUpdate, *nextUpdate;
    idReachability *reach;
    const aasArea_t *nextArea;
```

First we get the number of reachable areas within the cluster. As explained earlier we need to ensure that we have the area number that represents the area inside of the cluster, so a call to `clusterAreaNum` is made to fetch that. I am not clear why the `clusterAreaNum` would ever be larger than the number of reachable areas, something to look into ;)

```cpp
    // number of reachable areas within this cluster
    numReachableAreas = file->GetCluster( areaCache->cluster ).numReachableAreas;
 
    // number of the start area within the cluster
    clusterAreaNum = ClusterAreaNum( areaCache->cluster, areaCache->areaNum );
    if ( clusterAreaNum >= numReachableAreas ) {
        return;
    }
```

Next the `travelTime` for the current (goal) area is initialized to the `startTravelTime`, which was initialized to one before being passed in. the `travelTimes` array will store the travel times to this area from every area in the cluster. So 1 seems reasonable for a travel time to get to the goal position in the goal area itself.

```cpp
    areaCache->travelTimes[clusterAreaNum] = areaCache->startTravelTime;
    badTravelFlags = ~areaCache->travelFlags;
    memset( startAreaTravelTimes, 0, sizeof( startAreaTravelTimes ) );
```

The algorithm will check to make sure that each reachability it visits is valid for the current request’s travel flags. This is more easily done by flipping the bits and checking if the reachability contains travel flags that are not valid. `startAreaTravelTimes` is an array of unsigned shorts initialized to 0’s.

Next we initialize `curUpdate` which is a pointer to an `idRoutingUpdate` object. An `idRoutingUpdate` object will be appointed for each area in the cluster that is reachable via the reversed reachability links stored from the goal area. It is then used to store the travel time it takes to get from the area it is created for to the goal area specified.

```cpp
    // initialize first update
    curUpdate = &areaUpdate[clusterAreaNum];
    curUpdate->areaNum = areaCache->areaNum;
    curUpdate->areaTravelTimes = startAreaTravelTimes;
    curUpdate->tmpTravelTime = areaCache->startTravelTime;
    curUpdate->next = NULL;
    curUpdate->prev = NULL;
    updateListStart = curUpdate;
    updateListEnd = curUpdate;
```

First `curUpdate` is set to the address of the block of memory that was pre-allocated for it in `SetupRoutingCache`. This first `idRoutingUpdate` is created to represent the goal area itself, so its `areaNum` is set to the area number of the area cache we are calculating. The `areaTravelTimes` member is used to store travel times within the area from one reachability to another. It is set to all 0’s above. The `tmpTravelTime` will represent the time it takes to get from the area the routing update represents to the goal area, it is set to 1 for the goal area itself. `idRoutingUpdates` implement a linked list, the loop below processes updates in this list to flood the cluster calculating routing times. The last four lines above initialize that list to contain the newly initialized `curUpdate` as its only member. *“The breadth first algorithm starts at the goal area and uses the reversed reachability links to flood to other areas.”*

`updateListStart` has been initialized to the `idRoutingUpdate` that represents the goal area. we start flooding the cluster from this area. To do this we set `curUpdate` to the first update in the linked list and remove it from the list for processing. Below is that list management code.

```cpp
// while there are updates in the list
    while( updateListStart ) {
 
        curUpdate = updateListStart;
        if ( curUpdate->next ) {
            curUpdate->next->prev = NULL;
        }
        else {
            updateListEnd = NULL;
        }
        updateListStart = curUpdate->next;
 
        curUpdate->isInList = false;
```

For each area that we visit we will flood to all other reachable areas by following the reversed reachability links stored with that area:

```cpp
for ( i = 0, reach = file->GetArea( curUpdate->areaNum ).rev_reach; reach; reach = reach->rev_next, i++ ) {
```

Before deciding that the area the reversed reachability leads to is valid for the route, we check to see if the reachability and area it leads to require travel types that the AI requesting the route isn’t capable of, if so we do not process it any further.

```cpp
// if the reachability uses an undesired travel type
    if ( reach->travelType & badTravelFlags ) {
        continue;
    }
 
    // next area the reversed reachability leads to
    nextAreaNum = reach->fromAreaNum;
    nextArea = &file->GetArea( nextAreaNum );
 
    // if traveling through the next area requires an undesired travel flag
    if ( nextArea->travelFlags & badTravelFlags ) {
        continue;
    }
```

*“The algorithm never floods to areas outside the cluster. The algorithm does flood into cluster portals that touch the cluster.”*

```cpp
// get the cluster number of the area
    cluster = nextArea->cluster;
    // don't leave the cluster, however do flood into cluster portals
    if ( cluster > 0 && cluster != areaCache->cluster ) {
        continue;
    }
```

Remember, a negative cluster index would mean that the area is a cluster portal, hence the check for > 0.

Next a couple more checks to make sure the area we are flooding to is valid:

```cpp
// get the number of the area in the cluster
    clusterAreaNum = ClusterAreaNum( areaCache->cluster, nextAreaNum );
    if ( clusterAreaNum >= numReachableAreas ) {
        continue;  // should never happen
    }
    assert( clusterAreaNum < areaCache->size );
```

If the area has passed all the checks above we will calculate the time it takes to get from the area to the goal area. To do this we add the time it takes to travel to the goal area from the area we are already in `(curUpdate->tmpTravelTime)` and the time it takes to get from where we entered the current area across the area to the start of the reachability we are flooding through and the travel time of the reachability to get to the next area. this time is stored it t:

```cpp
// time already travelled plus the traveltime through the current area
// plus the travel time of the reachability towards the next area
t = curUpdate->tmpTravelTime + curUpdate->areaTravelTimes[i] + reach->travelTime;
```

It usually sounds better when JP says it ;): *“The reachabilities store a travel time, which is the time it takes the bot to travel along the reachability. These travel times are used in the routing algorithm. The areas are assumed to be nodes of a graph, but of course the areas are not points in space. It also takes time to travel through an area. These travel times through areas are also used in the routing algorithm. For each area a small table is used with travel times from every end point of a reachability that leads towards this area, to every start point of a reachability that starts in this area and leads to another area.”*

Now that we know the travel time from the next area to the goal area we can check if it the fastest or first route we have found to that area:

```cpp
if ( !areaCache->travelTimes[clusterAreaNum] || t < areaCache->travelTimes[clusterAreaNum] ) {
```

If it is, we store that time, and the first reachability to use to get towards the goal area in the `areaCache` object that was passed into `UpdateAreaRoutingCache` to be processed:

```cpp
areaCache->travelTimes[clusterAreaNum] = t;
areaCache->reachabilities[clusterAreaNum] = reach->number;
```

We also now need to add that area to the list of areas to be flooded through, so we initialize and `idRoutingUpdate` for that area. Notice how it is initialized to have the `tmpTravelTime` set to the time that was already calculated it would take to get to the goal area and how the `areaTravelTimes` are set to the `areaTravelTimes` that were pre-calculated for the reachability way back when in `CalculateAreaTravelTimes` when the system was initialized.

```cpp
nextUpdate = &areaUpdate[clusterAreaNum];
nextUpdate->areaNum = nextAreaNum;
nextUpdate->tmpTravelTime = t;
nextUpdate->areaTravelTimes = reach->areaTravelTimes;
```

The next step that happens is actually really cool. Sometimes a path that is the shortest isn’t always the best path to take. Paths can be weighted so that we can take more than just distance into account. A check is made to see if the area we are flooding to is near a ledge. If it is, and the AI isn’t capable of flying, this could be dangerous, so we add a penalty to this route so that if another route is available and not near a ledge, even if it is a longer route it is the better one to take.

```cpp
// if we are not allowed to fly
if ( badTravelFlags & TFL_FLY ) {
    // avoid areas near ledges
    if ( file->GetArea( nextAreaNum ).flags & AREA_LEDGE ) {
        nextUpdate->tmpTravelTime += LEDGE_TRAVELTIME_PANALTY;
    }
}
```

We then add the nextUpdate to the list of idRoutingUpdates to process and head back up to the top of the loop.

```cpp
if ( !nextUpdate->isInList ) {
    nextUpdate->next = NULL;
    nextUpdate->prev = updateListEnd;
    if ( updateListEnd ) {
        updateListEnd->next = nextUpdate;
    }
    else {
        updateListStart = nextUpdate;
    }
    updateListEnd = nextUpdate;
    nextUpdate->isInList = true;
}
```

Looking at the low level code detail by detail it is easy to miss what `UpdateAreaRoutingCache` is actually doing. Its purpose is to calculate and store the travel times from every area in the cluster to the goal area. these travel times are stored in the `idRoutingCache` passed to the routine. Each of the calculated travel times from an area is accompanied by the first `idReachability` the AI would use to take that route. Once this information is calculated it is cached for quick lookup so that future requests for the goal area do not need to recalculate the route. It does this by flooding, breadth first, through the cluster until every area that can be reached has its travel time calculated and stored in the `areaCache` object.

So, in its entirety, it should now be clear:

*“The area cache is calculated with a simple breadth first routing algorithm. The areas are assumed to be nodes of a graph and the reachabilities the reversed links between the nodes. The breadth first algorithm starts at the goal area and uses the reversed reachability links to flood to other areas. The algorithm never floods to areas outside the cluster. The algorithm does flood into cluster portals that touch the cluster. The reachabilities store a travel time, which is the time it takes the bot to travel along the reachability. These travel times are used in the routing algorithm. The areas are assumed to be nodes of a graph, but of course the areas are not points in space. It also takes time to travel through an area. These travel times through areas are also used in the routing algorithm. For each area a small table is used with travel times from every end point of a reachability that leads towards this area, to every start point of a reachability that starts in this area and leads to another area.”*

{: .todo }
> Document the next functions related to AAS:
>
> UpdatePortalRoutingCache.
>
> Obstacles Pathing: SubSampleWalkPath Debug.
>
> Goals: FindNearestGoal.
>
> Navigation: WalkPathToGoal, secondary goals.

# Further Reading.
{: .fs-9 }
{:reading}

---

This isn't a full blow explanation on every single function about AAS, for further reading please look up at **Area Awareness System (AAS): In-Depth Overview**