# { AR 8thWall ~ Three.js } Vite.js Template ⚡

## Description

Minimal reusable template project: AR 8thwall + Three.js made with Vite.js

![Screenshot 2022-08-10 154837](https://user-images.githubusercontent.com/4311684/183917872-75d8d990-56f4-40fe-9443-a5e8174dd152.png)

## Setup

1. Create `.env.local` file in the project root and add your 8th Wall key inside:

```
VITE_8THWALL_APP_KEY=xxxxxxxxxxxxxxxxxxxxxxxxx
```

2. Run the following commands:

```bash
# Install dependencies (only the first time)
yarn

# Run the local server
yarn dev

# Build for production in the dist/ directory
yarn build
```

_NOTE_: if there is an issue with custom shaders, bloom effect etc.. try to downgrade the Three.js version (latest tested Three.js version working was 0.145.0 I just did update the project with three@0.160.0)
