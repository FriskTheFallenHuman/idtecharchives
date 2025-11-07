---
sidebar_position: 4
description: Pak Files (.pk4)
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Pak Files (.pk4)

---

## Overview

---

Ideally, every asset used by the idTech 4 engine is stored in a `.pk4` file (also known as a "pack" or "pak" file). Pack files are just normal `.zip` files with the `.pk4` extension - you can use WinRar, Winzip, 7-Zip or a similar utility to browse or create new `.pk4` files.

:::tip[Changes in different branchs]

<Tabs>
  <TabItem value="wolf09" label="Wolfstein (2009)">
      The `.pk4` files used in the single player component have a modified header which prevents them from being opened by a standard archive program with the exception of WinRar which seems capable of “repairing” these files, you can open them with 7-zip nowdays has it is capable of opening them.
  </TabItem>
</Tabs>

:::

If you have more than one pack file or assets in a mix of pack files and individual files here is the expected behavior of the engine:

1. Assets inside pack files that come later in alphabetical order override assets with the same name in Pack files that come earlier.
2. Assets as individual files override assets inside pack files.
3. Assets in pack files or modfolders override assets with the same name in the base folder

## Compression

---

As renamed `.zip` files, `.pk4` can have compressed files inside but also uncompressed ones by using the store option in the `.zip` format. The pack files that come with Doom 3 and the Doom 3: Resurrection of Evil expansion feature compression. Although compressed pack files increase loading times, this penalty is small while the filesize difference is significant: Doom 3’s assets are 3.6Gb uncompressed, and only 1.44Gb in their original `.pk4` form.

## Achieving Better Compression For Distribution

---

Even if you use the maximum compression possible in `.pk4` files it will never rival the compression ratios possible by WinRar for instance. However the following will:

1. Create your `.pk4` files with the store compression factor.
2. RAR all your `.pk4` files with maximum compression. (You may want to create a SFX archive, instead of straight `.rar` so people won’t have to download WinRar to open it; which can also double as an installer for your mod.)

You should now be able to distribute a much smaller file than if you had used max compression for the `.pk4` files. However, once installed your files will be as large as if not in a `.pk4` file because they are uncompressed thanks to the store option.

On a side note: 7zip's compression ratio is even better, but not as wide-spread as the WinRar format.
