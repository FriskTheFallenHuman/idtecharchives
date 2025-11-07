---
description: LightWave Object (.lwo)
---

# LightWave Object (.lwo)

---

## Overview

---
LWO: LightWave Object file format is a propriatary binary file format and is the standard export format used with LightWave 3D and Modo . Support in other applications is dependant on import/export scripts or plugins. LWO files cannot be editied outside of a 3D application that supports the format, i.e. they cannot be edited in Notepad or similar.

The id Tech 4 engine uses the LWO format for static meshes.

More information on the LWO format can be found in the LightWave SDK .

:::note

- The id Tech 4 engine uses the LWO format for static meshes.

:::

# Export

---

## Static Models

---
Getting a static model (like a trash can or a shrubery) in to the game is really easy. The engine reads lwo (lightwave) and ase (3dsmax) files natively so you simply save out the model in one of those two formats and you can use it in the game.

The material that is used in game is the diffuse texture specified in the model.

The relative material name is determined by searching for `"base"` in the texture path. For example, if the texture specified in the .ase is `"C:\Doom\base\textures\base_trim\red1.tga"` Then it would use the material named `"textures\base_trim\red1"`

If you are running a custom mod, then it will look for the mod name if it can't find `"base"` so `"C:\Doom\jailbreak\textures\base_trim\red1.tga"` would also work in the jailbreak mod.

The path cannot have spaces in it. Doom 3 should be installed in `"C:\Doom\"` or some other place without spaces. If Doom 3 is in the default location of `"C:\Program Files\Doom 3\"` it will not work because of the space in `"Program Files"` and the space in `"Doom 3"`

Generally speaking, as long as you keep all your assets in the final directory that it will be in, then you should just be able to use it in game without having to touch anything. Problems tend to arise if you edit your assets in one directory, then move them in to the base directory or your mod directory after you export.

If you are working on a new chair, you should work on it in

```cpp
C:\Doom3\mymod\models\mapobjects\chairs\mychair\
```
rather than working on it in

```cpp
C:\My Stuff\Models\Cool Models\Stuff For My Mod\Chair
```

then moving to the proper directory after it's been exported.

Spaces in file names are bad.

## Animated Models

---
Animated models are quite a bit more complex. The only animation system supported in Doom 3 is skeletal (no vertex animation like in Quake), and the only file format supported is `.mb` (Maya binary). The files have to be processed using a built in tool to convert the Maya files to `.md5mesh` and `.md5anim` files.

:::note[Note For 3DStudio Max Users]

- Although Doom 3 does not support animated models from max "out of the box", the people over at Doom3World wrote some nice importers and exporters, which you can find here.

:::

This built in tool is `exportModels`. By default, it will export any models that have been modified since the last time the command was run, but you can pass it a `.def` file and it will only export the models defined in that def file. You can speed up the exportModels command by using the `g_exportMask` cvar and specifying some magic string after the export declaration (as we will see later). Setting `g_exportMask fred` will only export fred's animations, skipping all the others.

You must have Maya installed on the machine that you are exporting on otherwise it won't do anything.

The syntax for an export section looks complex at first, but is actually quite simple when you break it down into the different parts. Unlike some other declarations, the commands in an export block are executed as they are encountered. This means the order DOES matter.

There are two systems at work when you export a file. The first is the actual exporter, this is the piece that does all the work. The second is what I'm going to call the `parser`. This piece reads the export sections and passes the commands to the exporter for actual exportation.

The parser only has 5 commands, and they are really very simple:

| Command      | Input     | Options         | Description  |
| :-           | :-:       | :-:             | -: |
| options      | None      | **[options]**   | Stores default options that will be used for all future export actions. Note that an options command will override any previously set options. |
| addoptions   | None      | **[options]**   | Adds a default option to the current set of default options. This is very similar to the options command, but it appends rather than overwriting the current options. |
| mesh         | MB File   | **[options]**   | Exports a object from a .mb file. The options specified here will be appended to the options specified previously with "options" or "addoptions" commands. |
| anim         | MB File   | **[options]**   | Same has mesh, except its for animations. |
| camera       | MB File   | **[options]**   | Same has mesh, except its for camera (cinematics) |

Here is a list of all the options along with a brief description of what they do:

| Option                            | Arguments                 | Description |  Notes |
| :-                                | :-:                       | :-: | :-: |
|-force                             | None                      | Ignored | |
|-game                              | [game folder]             | Specify the mod name, which is where the relative paths are defined from. | This is set automatically in version 1.2  |
|-rename                            | [joint name] [new name]   | Rename a joint | |
|-prefix                            | [joint prefix]            | If you have multiple characters/objects in your scene, you can give them each their own prefix so the exporter can distinguish which goes to which. | Example: ZSEC \_ IMP _ ENV_ |
|-parent                            | [joint name] [new parent] | Reparent a joint | |
|-sourcedir                         | [directory]               | Tell exporter where to get files from | |
|-destdir                           | [directory]               | Tell exporter where to put files after export | |
|-dest                              | [filename]                | Give a new name to the file you are exporting. | Default will be the same name as the Maya file. |
|-range                             | [start frame] [end frame] | Frame range for what you would like to export. | Example: -range 1 10 |
|-cycleStart                        | [first frame of cycle]    | Shift the cycle to start on a different frame. | Example: Frame 1 has left foot forward, and frame 10 has right foot forward. So if you would like your cycle to start with the right foot forward, use -cycleStart 10 to shift the cycle. |
|-scale                             | [scale amount] | Scale up or down your character during export. | Example: -scale 2 will double the size of the character (scaled up from the origin). |
|-align                             | [joint name] | Will align your animation to a certain bone. | |
|-rotate                            | [yaw] | Allows you to manually rotate your animation. | Example: -rotate 90 |
|-nomesh                            | None | | |
|-clearorigin                       | None | | |
|-clearoriginaxis                   | None | | |
|-ignorescale                       | None | Ignore any scales you may have on some bones. | |
|-xyzprecision                      | [precision] | Will take even tiny movements (translations) into consideration if you make this number lower. | The default will try to compress down the animations, getting rid of tiny movements. | |
|-quatprecision                     | [precision] | Will take even tiny movements (rotations) into consideration if you make this number lower. | The default will try to compress down the animations, getting rid of tiny movements. | |
|-jointthreshold                    | [min joint weight] | | |
|-skipmesh                          | [name of mesh] | Allows you to skip certain models during export. | |

:::note

- A LWO to MD5 conversion utitlity can be obtained at ~~www.doom3world.org~~ dead link.
- An MD5camera export script can be downloaded from ~~www.pcgamemods.com~~ dead link.
- Subpatch a.k.a. subdivision surfaces are not supported.
- Surface properties are not parsed by Doom 3.
- Models must be composed entirely of triangles.
- All mesh data must be on a single layer.
- Each mesh must have exactly one UV map. Doom 3 will not crash if you have more, but textures will behave in unexpected ways, mixing UV maps, using the wrong UV map, etc.
- Smoothing angle is not supported. In game, smoothing occurs across welded triangles. Seams must be created manually by unwelding vertices.
- The surface name of each surface in LightWave 3D must match the name of the corresponding material shader in Doom 3.

:::
