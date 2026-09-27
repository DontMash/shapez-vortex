#!/bin/bash
read -p "Are you sure? " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]; then
    mkdir -p src/lib/components/models/buildings/
    for file in static/models/buildings/*.gltf; do
        echo $file
        name=${file##*/}
        base=${name%.gltf}

        pnpm dlx @threlte/gltf "$file" -s -k -P -t -u -r /models/buildings/ &
    done

    wait
    mv *.svelte src/lib/components/models/buildings

    perl -i -0pe '
      s|(<script\n  module\n  lang="ts"\n>)\n(?!  // \@ts-nocheck)|$1\n  // \@ts-nocheck\n|;
      s|(<script lang="ts">)\n(?!  // \@ts-nocheck)|$1\n  // \@ts-nocheck\n|;
    ' src/lib/components/models/buildings/*.svelte

    mkdir -p src/lib/components/models/
    for file in static/models/*.gltf; do
        echo $file
        name=${file##*/}
        base=${name%.gltf}

        pnpm dlx @threlte/gltf "$file" -s -k -P -t -u -r /models/ &
    done

    wait
    mv *.svelte src/lib/components/models

    perl -i -0pe '
      s|(<script\n  module\n  lang="ts"\n>)\n(?!  // \@ts-nocheck)|$1\n  // \@ts-nocheck\n|;
      s|(<script lang="ts">)\n(?!  // \@ts-nocheck)|$1\n  // \@ts-nocheck\n|;
    ' src/lib/components/models/*.svelte
    exit 0
else
    [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1 # handle exits from shell or function but don't exit interactive shell
fi
