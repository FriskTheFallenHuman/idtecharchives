---
description: MD5 (.md5)
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# MD5 (.md5)

---

## Overview

---

Not be consufed by [MD5](https://en.wikipedia.org/wiki/MD5) used in hashing.

MD5 is a proprietary but open format specific to any Idtech4 game and allows models to be animated by the use of an internal skeleton. Generally two files are needed to make a functional MD5 model; `md5mesh` and `md5anim`. The 3rd, `md5camera`, allows the creation and use of complex camera paths used during cut scenes. See the different pages for syntax explanation

## . MD5MESH
Low resolution polygonal mesh exported from a 3D application.

## . MD5ANIM
Contains animation sequence data, the positions of bones etc. during animation.

## . MD5CAMERA
Animated cameras for use in cut scenes.

:::note[Binarize File Formats]

<Tabs>
  <TabItem value="bfg" label="Doom 3 BFG">
      - `MD5MESH` compressed into a binary format. (.BMD5MESH)
      - `MD5ANIM` compressed into a binary format. (.BMD5ANIM)
  </TabItem>
  <TabItem value="etqw" label="Enemy Territory: Quake Wars">
      Unlike Quake IV, ET:QW reverted the approach that Quake IV did and instead of hardcode paths
      it now uses:

      `*MATERIAL_NAME "material/name"` eg: `*MATERIAL_NAME "textures/models/mymodel"`

      meaning they just references the shader (texture) and skips the mod folder at al.
  </TabItem>
</Tabs>

:::

## MD5 Header

All MD5 format files start with the MD5 header, regardless the specific filetype. The header is the first section in the file and is as such...

```cpp
MD5Version <integer>
commandline "<string>"
```
- `MD5Version`: An integer that defines the current MD5 specification version. This should always read 10.
- `commandline`: A string that contains the command line parameters passed to the exportmodels console command.

## Export

Maya 4.5 was the 3D package primarily used for the creation of animated characters during the development of Doom 3, Quake 4, and possibly Prey. Models were saved in `.mb (Maya Binary)` format and converted through the use of an export declaration , the console command `exportModels` , and a DLL by the name of `MayaImportx86`.

It goes without saying that you stand the best chance for success if you follow the same workflow. However, there are third party tools and alternative versions of MayaImportx86.dll listed below you can use should you be working with a package other than Maya version 4.5.

It’s also important to note that the alternate versions of `MayaImportx86.dll` were intended for use with Doom 3 and there have been reports that they do not function correctly with other Idtech4 engine based games. In other words, if you only have Quake 4 or Prey at your disposal, you may encounter some compatibility issues that have yet to be resolved. You may be forced to borrow a copy of Doom 3 for export purposes.
