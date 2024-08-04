#!/bin/bash
read -p "Are you sure? " -n 1 -r
echo    # (optional) move to a new line
if [[ ! $REPLY =~ ^[Yy]$ ]]
    mkdir -p src/lib/components/models/shapes/
    for file in static/models/shapes/*.gltf; do
        echo $file
        name=${file##*/}
        base=${name%.gltf}

        bunx @threlte/gltf "$file" -k -P -t -u -r /models/shapes/ &
    done

    wait
    mv *.svelte src/lib/components/models/shapes
    exit 0
then
    [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1 # handle exits from shell or function but don't exit interactive shell
fi
