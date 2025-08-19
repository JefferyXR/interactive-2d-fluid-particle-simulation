# Interactive Fluid Simulation (JavaScript Canvas)

This project is a **particle-based fluid-like simulation** built with **JavaScript** and the HTML5 `<canvas>` element.  
It simulates water-like motion using hundreds of interacting particles influenced by gravity, collisions, and user interaction.

---

## Features
- **Fluid-like particle system** with repulsion and collisions
- **Mouse interaction**:
  - Repulsion can be triggered by **click** or **hover** (toggleable)
- **Customizable controls**:
  - Adjust particle **count**
  - Change particle **size**
  - Switch **gravity direction** (down, up, left, right)
- **Responsive canvas** — automatically resizes with the window
- **Optimized physics** with speed clamping, friction, and bounce handling

---

## Controls
At the top of the simulation page:
- **Particles** – Slider to increase/decrease the number of particles
- **Size** – Slider to make particles larger or smaller
- **Gravity** – Dropdown to switch gravity direction
- **Repulsion Mode** – Toggle between *Click* and *Hover* interaction

---

## How It Works
- Each particle is represented as an object with position, velocity, and radius.
- Physics forces include:
  - **Gravity** – pulls particles in a set direction
  - **Friction** – gradually slows particle velocity
  - **Bounce** – prevents particles from escaping canvas bounds
  - **Repulsion** – pushes particles away from mouse interaction
- The simulation updates using `requestAnimationFrame` for smooth 60 FPS rendering.

---

## Author
Developed by me with help from ChatGPT as part of my personal website design.
