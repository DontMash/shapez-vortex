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

    mkdir -p src/lib/components/models/
    for file in static/models/*.gltf; do
        echo $file
        name=${file##*/}
        base=${name%.gltf}

        bunx @threlte/gltf "$file" -s -k -P -t -u -r /models/ &
    done

    wait
    mv *.svelte src/lib/components/models
    exit 0
then
    [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1 # handle exits from shell or function but don't exit interactive shell
fi
