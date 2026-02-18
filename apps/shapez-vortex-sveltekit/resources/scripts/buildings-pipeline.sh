#!/bin/bash
read -p "Are you sure? " -n 1 -r
echo    # (optional) move to a new line
if [[ ! $REPLY =~ ^[Yy]$ ]]
    mkdir -p src/lib/components/models/buildings/
    for file in static/models/buildings/*.gltf; do
        echo $file
        name=${file##*/}
        base=${name%.gltf}

        bunx @threlte/gltf "$file" -s -k -P -t -u -r /models/buildings/ &
    done

    wait
    mv *.svelte src/lib/components/models/buildings

    # Fix snippet ref type: bind:ref can be undefined, so the snippet type must reflect that
    for file in src/lib/components/models/buildings/*.svelte; do
        sed -i '' 's/Snippet<\[{ ref: THREE\.Group }\]>/Snippet<[{ ref: THREE.Group | undefined }]>/g' "$file"
    done

    mkdir -p src/lib/components/models/
    for file in static/models/*.gltf; do
        echo $file
        name=${file##*/}
        base=${name%.gltf}

        bunx @threlte/gltf "$file" -s -k -P -t -u -r /models/ &
    done

    wait
    mv *.svelte src/lib/components/models

    # Fix snippet ref type: bind:ref can be undefined, so the snippet type must reflect that
    for file in src/lib/components/models/*.svelte; do
        sed -i '' 's/Snippet<\[{ ref: THREE\.Group }\]>/Snippet<[{ ref: THREE.Group | undefined }]>/g' "$file"
    done
    exit 0
then
    [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1 # handle exits from shell or function but don't exit interactive shell
fi
