---
layout: default
title: Style Guide
nav_order: 2
---

# Code Style Guide.
{: .fs-9 }

---

Naming Conventions:
{: .fs-6 }

---

- Variables: Use camelCase for local variables. Prefix global variables with `g_` and static class variables with `s_`, followed by camelCase:
    
    ```cpp
        int countEnts;
        int g_globalData;
        bool s_mapParse;
    ```

- Functions and Methods: Use camelCase, starting with a verb that describes the function's action:

    ```cpp
        void IdActor::myAwesomeFunction() {
            /* Some code goes here */
        }
    ```

- Classes and Structs: Use PascalCase. Prefix interfaces with I and abstract classes with Abstract:

    ```cpp
        struct idStructExample {
            int structVariable;
        };
    ```

    {: .note }
    > Official release idtech4 codebases names their interfaces/Classes with different names `hh` for HumanHead (Prey 2006) and `rv` for RavenSoftware (Quake 4).

- Constants and Enums: Use `UPPER_CASE` with underscores between words:

    ```cpp
        typedef enum {
            ENUM_ONE,
            ENUM_TWO,
            ENUM_THREE
        } enumListType_t;
    ```


- Files: Source files (.cpp) and header files (.h) should match the class name they define. Use lower_case with underscores for non-class-specific files:

    ```
    +-- ..
    |-- (Doom 3 GPL Release)
    |
    |-- game
    |   |-- Entity.cpp
    |   |-- Entity.h
    |   |-- Game_Local.h
    |   |-- Game_Something.h
    |
    +-- ..
    ```

Formatting and Style:
{: .fs-6 }

---

- Brace Style: Use the [K&R BSD KNF style](https://en.wikipedia.org/wiki/Indentation_style#K&R_style), with open brace on the same line:

    ```cpp
        void IdActor::SetFOV( float fov ) {
        }
    ```

- Pointer and Reference Symbols: Attach to the type, not the variable name.
- One Statement Per Line: Avoid multiple statements on the same line to enhance readability.
- Indentation: Use tabs, not space, with a size of 2 tabs per indentation level.
- Spaces: Use spaces around operators and after commas to improve readability.
- Line Length: Try to keep lines under 80 characters when possible, breaking longer lines logically.

Comments and Documentation:
{: .fs-6 }

---

- Use doxygen-style comments for documenting classes, methods, and functions:

    ```cpp
        /*
        =====================
        idCameraView::Stop
        =====================
        */
    ```

- Place brief descriptions on the same line as the comment start, and detailed descriptions on subsequent lines:

    ```cpp
        /*
        ================
        idGameEdit::ParseSpawnArgsToRenderEntity

        parse the static model parameters
        this is the canonical renderEntity parm parsing,
        which should be used by dmap and the editor
        ================
        */
    ```

- Comment every class, public method, and complex block of code to explain intent, not how the code works.

Best Practices:
{: .fs-6 }

---

- Initialize all variables upon declaration:

    ```cpp
        class idActor : public idAFEntity_Gibbable {
            /* IdActor code goes here... */

            bool dontBleed;

            /* IdActor code goes here... */
        }

        class idActor::IdActor() {
            dontBleed = false;
        }
    ```

- Prefer const correctness. Use const wherever possible.
- Explicitly define copy constructors and assignment operators for classes managing resources.
- Prefer C++ casts over C-style casts.
- Use nullptr instead of NULL or 0 for pointer initialization and comparison.
- Adhere to the Rule of Three/Five, providing custom copy constructor, copy assignment operator, and destructor when you manually manage resource allocation.
- Organize class definitions with public members first, followed by protected, then private.
- Prefer prefix over postfix increment/decrement operators for non-primitive types.

File Organization:
{: .fs-6 }

---

- Header files should start with a guard to prevent multiple inclusions and include only necessary headers to minimize dependencies.
- Group include directives logically, starting with standard library headers, followed by third-party libraries, and then project-specific headers.