## A simple [three.js](https://threejs.org/) STL Loader demo

![Screenshot 2023-04-17 at 10 36 31 AM](https://user-images.githubusercontent.com/121207468/232538193-ce1b55c1-e34e-46b6-83e9-313cd6395120.png)

This script loads 2 STL files, applies different materials to them, and adds colored lights to the scene for a nice look.

The 2 objects are animated:
- `hand_low_poly.stl` moves smoothly up and down the Y axis.
- `wrench.stl` spins about the Y axis.

For an interesting visual effect, the camera moves as a function of the cursor position on the document window.

You may enable full orbital controls by uncommenting certain lines in `script.js`.

## How to run

1. `npx vite` to start the development environment
2. Open `http://localhost:5173/` on a browser
