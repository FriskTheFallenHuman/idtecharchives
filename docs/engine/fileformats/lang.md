---
sidebar_position: 3
description: Language Files (.lang)
---

# Language Files (.lang)

---

## Overview

---

`.lang` files are used for localization purposes. For every language there is a different set of files available. Each of these files contains a numbered string that is referenced from within code, GUIs or maps. Each string has to have a unique number so there are no conflicts when referenced. Language strings are simply referenced by typing `"#str_20000"` in the textfield. Replace 20000 with the intended string number.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::tip[Changes in different branchs]

<Tabs>
  <TabItem value="bfg" label="Doom 3 BFG Edition">
      - `#font_` specify the font to be use in the sfw shell, not use in the old GUI system.
      - BFG Edition does't uses hashes, instead it uses full names like `#str_adil_exis_pda_01_audio_info`
  </TabItem>
  <TabItem value="etqw" label="Enemy Territory: Quake Wars">
      - Just like BFG Edition, ET:QW does't uses hashes, instead it uses full names like `#str_adil_exis_pda_01_audio_info`
  </TabItem>
  <TabItem value="prey" label="Prey (2006)">
      - Prey situation its a bit funny, while it uses Doom 3 style hashes, they use the hashes
      before RoE expansion, meaning that any string introduced by RoE would **NOT** work here.
  </TabItem>
</Tabs>

:::

## Syntax

---

```cpp
{
    "#str_20000"    "Placeholder"
    "#str_20001"    "Placeholder2"
}
```
