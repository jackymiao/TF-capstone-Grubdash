const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

// Middleware: Check if the order with the given ID exists
function orderExist(req, res, next) {
  const { orderId } = req.params;
  const foundOrder = orders.find((o) => o.id === orderId);
  if (foundOrder) {
    res.locals.order = foundOrder;
    next();
  } else {
    next({
      status: 404,
      message: `Could not find order id ${orderId}`,
    });
  }
}

// Middleware: Ensure required order properties are provided
function validateProperties(req, res, next) {
  let properties = ["deliverTo", "mobileNumber", "dishes"];
  for (let property of properties) {
    if (!req.body.data[property]) {
      next({
        status: 400,
        message: `Order must include a ${property}`,
      });
    }
  }
  next();
}

// Middleware: Ensure the order has valid dishes
function validateDishes(req, res, next) {
  const { dishes } = req.body.data;

  if (Array.isArray(dishes) && dishes.length > 0) {
    next();
  } else {
    next({
      status: 400,
      message: "Order must include at least one dish",
    });
  }
}

// Middleware: Check each dish in the order for a valid quantity
function validateDishQuantity(req, res, next) {
  const { dishes } = req.body.data;
  for (let index in dishes) {
    if (!dishes[index].quantity || typeof dishes[index].quantity !== "number") {
      next({
        status: 400,
        message: `Dish ${index} must have a quantity that is an integer greater than 0`,
      });
    }
  }
  next();
}

// Middleware: Ensure the order ID in request matches the route ID
function checkOrderId(req, res, next) {
  if (req.body.data.id === req.params.orderId) {
    next();
  } else if (!req.body.data.id) {
    next();
  } else {
    next({
      status: 400,
      message: `Order id does not match route id. Order: ${req.body.data.id}, Route: ${req.params.dishId}`,
    });
  }
}

// Middleware: Validate the status of the order
function validateStatus(req, res, next) {
  const { status } = req.body.data;
  res.locals.status = status;
  if (!status || status === ""||status==="invalid") {
    next({
      status: 400,
      message:
        "Order must have a status of pending, preparing, out-for-delivery, delivered",
    });
  }else{
    next()
  }
}

// Middleware: Ensure the status isn't "delivered", as such orders can't be modified
function validateDeliveredStatus(req, res, next){
    const {status} = req.body.data;
    if(status==="delivered"){
        next({
            status:400,
            message:"A delivered order cannot be changed"
        })
    }else{
        next()
    }
}

// Middleware: Check if the order is still pending (only pending orders can be deleted)
function checkStatus(req, res, next){
    const status = res.locals.order.status;
    if(status!=="pending"){
        next({
            status:400,
            message:"An order cannot be deleted unless it is pending."
        })
    }else{
        next()
    }
}

// Handler: Return a list of all orders
const list = (req, res, next) => {
  res.json({ data: orders });
};

// Handler: Get details of a specific order
const read = (req, res, next) => {
  res.json({ data: res.locals.order });
};

// Handler: Update an existing order
const update = (req, res, next) => {
  const { deliverTo, mobileNumber, status, dishes } = req.body.data;
  const order = res.locals.order;
  order.deliverTo = deliverTo;
  order.mobileNumber = mobileNumber;
  order.status = status;
  order.dishes = dishes;
  res.json({ data: order });
};

// Handler: Create a new order
const create = (req, res, next) => {
  const { deliverTo, mobileNumber, dishes } = req.body.data;
  const newOrder = {
    deliverTo: deliverTo,
    mobileNumber: mobileNumber,
    dishes: dishes,
    id: nextId(),
  };
  orders.push(newOrder);
  res.status(201).json({
    data: newOrder,
  });
};

// Handler: Delete an existing order
const destroy = (req, res, next)=>{
  const indexOfOrder = orders.findIndex(o=>o.id===res.locals.order.id)
  orders.splice(indexOfOrder, 1);
  res.status(204).json()
}



module.exports = {
  list,
  read: [orderExist, read],
  update: [
    orderExist,
    validateProperties,
    validateDishes,
    validateDishQuantity,
    validateStatus,
    validateDeliveredStatus,
    checkOrderId,
    update,
  ],
  create: [validateProperties, validateDishes, validateDishQuantity, create],
  delete:[orderExist, checkStatus, destroy]
};
