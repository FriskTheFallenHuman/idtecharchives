---
layout: default
title: Collision Model Manager (CM)
parent: Engine Documentation
has_children: true
nav_order: 2
---

# Overview.
{: .fs-9 }
{:overview}

---

Since Doom 1, ID software has relied on BSP trees to increase the performance of its engines. BSP trees are very useful in both rendering and collision detection. The doom3 engine stores the rendering bsp tree in the.proc file and the collision bsp tree in the.cm file. Oh yeah, the collision bsp can also be used for creating AI pathfinding systems (also known as the Area Awareness System (AAS) in Doom 3).

Hmm, it sounds like this might be helpful with creating AI for Quake Wars: Enemy Territory. 😉

So what's collision detection exactly? Without a collision detection system, the player would be able to walk right through every wall on the map. If you want to experience a game without a collision system, simply enable Noclip in Doom 3. Such a system will calculate whether or not the player (among other objects) makes contact with solid surfaces. If the player does, the system will then prevent the player from passing through. duh!

Simple enough, right? Well, imagine a map with 4,000 brushes, or roughly 24,000 brush faces. Looping through all 24,000 faces in each frame to determine whether or not the player is in contact with one of them is not very efficient. This is where the BSP tree comes in. In short, instead of looping through all 24,000 faces, a BSP tree allows us to eliminate huge chunks of brushes almost instantly. With just a few calculations, a properly configured BSP tree can narrow down the 24,000 brush faces to just a handful! quite an improvement, I'd say.
For much more on BSP's, check out this nice tutorial: ~~http://www.oracledbaexpert.com/BSPTrees/Trees.html~~ dead link.

# In a nutshell

`.cm` files store collision model data. Collision models are a binary space partitioning based format used for collision detection.
They are most commonly used with maps but can also be used with moveable physics objects.

# Export

The creation of a collision model for use with a map is done automatically by the engine upon compile with the `dmap` console command.
To create a collision model for use with a moveable physics object, from within the level editor, you must select the brushes and/or model. Then click `Selection > Export > to CM`.
From this point the `.cm` file must be named and placed in the same directory as the map or model.

# Note

{: .etqw}
> Enemy Territory: Quake Wars binarizes its files so its hard to see what change and what not.
> Binarize models has the post fix of `b` in this case `.cmb`

{: .wolf09}
> This system is deprecated in Wolfstein (2009)