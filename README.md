<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/DontMash/shapez-vortex">
    <img src="static/favicon.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Shapez Vortex</h3>

  <p align="center">
    A community-platform with tools to view, share & modify content of the game
    <a href="https://store.steampowered.com/app/2162800/shapez_2/">Shapez 2</a>.
    <br />
    <br />
    <a href="https://shapez.soren.codes">Website</a>
    ·
    <a href="https://github.com/DontMash/shapez-vortex/issues">Report Bug</a>
    ·
    <a href="https://github.com/DontMash/shapez-vortex/issues">Request Feature</a>
  </p>
</div>

<!-- PROJECT SHIELDS -->

[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Shape Viewer][product-image]][product-url]

This project started by passion for the game [Shapez 2](https://store.steampowered.com/app/2162800/shapez_2/). I wanted to provide a tool to share visual information & content with other players, therefore I created this project.

The purpose of this project is to provide a suite of tools to visualize and modify data used by or generated from the game.
You can also share content related to the game with other users.

In the current state it provides the following features:

* [shape-viewer](https://shapez.soren.codes/shape) - visualize shapes by their identifier
* [blueprint-codec](https://shapez.soren.codes/blueprint) - modify blueprint data
* [blueprint-viewer](https://shapez.soren.codes/blueprint) - visualize blueprints

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![TailwindCSS][Tailwind-badge]][Tailwind-url]
* [![three.js][threejs-badge]][threejs-url]
* [![Svelte][Svelte-badge]][Svelte-url]
* [![Typescript][Typescript-badge]][Typescript-url]
* [![Vercel][Vercel-badge]][Vercel-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

To setup, install & develop you may need some tools:

* [Bun (JavaScript runtime & toolkit)](https://bun.sh/)
* [Docker (Test & Deployment)](https://docs.docker.com/get-docker/)

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/DontMash/shapez-vortex.git
   ```

2. Install packages

    ```sh
      bun install
    ```

3. Visit [localhost:5173](http://localhost:5173)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

Visit the [project overview][project-url] to see what we are currently working.

See the [open issues][issues-url] for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

To contribute to this project, have a look at the [`CONTRIBUTING`][contributing-url] for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See [`LICENSE`][license-url] for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Sören Maschmann - [E-Mail](mailto:work@soren.codes)

[Repository Link][repo-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS -->
[repo-url]: https://github.com/DontMash/shapez-vortex
[product-url]: https://shapez.soren.codes
[product-image]: docs/images/product.png
[project-url]: https://github.com/users/DontMash/projects/2/views/1
[contributing-url]: https://github.com/DontMash/shapez-vortex/blob/main/docs/CONTRIBUTING.md

<!-- SHIELDS -->
[stars-shield]: https://img.shields.io/github/stars/DontMash/shapez-vortex.svg?style=for-the-badge
[stars-url]: https://github.com/DontMash/shapez-vortex/stargazers
[issues-shield]: https://img.shields.io/github/issues/DontMash/shapez-vortex.svg?style=for-the-badge
[issues-url]: https://github.com/DontMash/shapez-vortex/issues
[license-shield]: https://img.shields.io/github/license/DontMash/shapez-vortex.svg?style=for-the-badge
[license-url]: https://github.com/DontMash/shapez-vortex/blob/main/LICENSE

<!-- BADGES -->
[Tailwind-badge]: https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[threejs-badge]: https://img.shields.io/badge/threejs-black?style=for-the-badge&logo=three.js&logoColor=white
[threejs-url]: https://threejs.org/
[Svelte-badge]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Typescript-badge]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[Typescript-url]: https://www.typescriptlang.org/
[Vercel-badge]: https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white
[Vercel-url]: https://vercel.com/
