# GrubDash

You've been hired as a backend developer for a new startup called **GrubDash**! As another developer works on the design and frontend experience, you have been tasked with setting up an API and building out specific routes so that the frontend developers can demo some initial design ideas for the big bosses.

## Learning Objectives

This project will test your ability to build APIs with complex validation. Before taking on this project, you should be comfortable with the following:

- Running tests from the command line
- Using common middleware packages
- Receiving requests through routes
- Accessing relevant information through route parameters
- Building an API following RESTful design principles
- Writing custom middleware functions

_Note: You won't need to make any edits to HTML or CSS for this project._

## GrubDash Frontend

While not mandatory, if you're keen to see this project connected to a frontend application, visit this repository:

[Starter code: GrubDash frontend](#)

Instructions on how to get the frontend application up and running are included in the repository.

> Remember to sync this Qualified project with your local machine. This will let you commit it to GitHub in the next lesson.

### Setting Up

After navigating to the Qualified assessment, you will be prompted to choose if you want to solve the challenge using the web-based IDE or your own IDE. Opt for the **Start in your IDE** option and follow the prompts to link Qualified to your local IDE.

## Tasks

### Dishes

1. In the `src/dishes/dishes.controller.js` file:
    - Add handlers and middleware functions to create, read, update, and list dishes. 
    > Note: dishes cannot be deleted.

2. In the `src/dishes/dishes.router.js` file:
    - Add two routes: `/dishes` and `/dishes/:dishId`.
    - Attach the handlers (create, read, update, and list) exported from `src/dishes/dishes.controller.js`.

### Orders

1. In the `src/orders/orders.controller.js` file:
    - Add handlers and middleware functions to create, read, update, delete, and list orders.

2. In the `src/orders/orders.router.js` file:
    - Add two routes: `/orders` and `/orders/:orderId`.
    - Attach the handlers (create, read, update, delete, and list) exported from `src/orders/orders.controller.js`.

### Utilities

- Anytime you need to assign a new id to an order or dish, use the `nextId` function exported from `src/utils/nextId.js`.
