---
layout: default
title: Language Files (.lang)
parent: File Formats
grand_parent: Engine Documentation
nav_order: 6
---

# Overview

---

`.lang` files are used for localization purposes. For every language there is a different set of files available. Each of these files contains a numbered string that is referenced from within code, GUIs or maps. Each string has to have a unique number so there are no conflicts when referenced. Language strings are simply referenced by typing `"#str_20000"` in the textfield. Replace 20000 with the intended string number.

{: .doom3bfg}
> `#font_` specify the font to be use in the sfw shell, not use in the old GUI system.
> BFG Edition does't uses hashes, instead it uses full names like `#str_adil_exis_pda_01_audio_info`

## Syntax

---

```cpp
{
    "#str_20000"    "Placeholder"
    "#str_20001"    "Placeholder2"
}
```