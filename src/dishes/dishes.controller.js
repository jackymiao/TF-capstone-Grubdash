const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

function dishExist(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find((d) => d.id === dishId);
  if (foundDish) {
    res.locals.dish = foundDish;
    next();
  } else {
    next({
      status: 404,
      message: `Cannot find dish id ${dishId}`,
    });
  }
}

// function validateProperty(property) {
//   return (req, res, next)=>{
//     const {data={}} = req.body;
//     if (!data[property]) {
//       next({
//         status: 400,
//         message: `Dish must include a ${property}`,
//       });
//     } else {
//       next();
//     }
//   };
// }
// function bodyDataHas(propertyName) {
//   return function (req, res, next) {
//     const { data = {} } = req.body;
//     if (data[propertyName]) {
//       return next();
//     }
//     next({
//         status: 400,
//         message: `Must include a ${propertyName}`
//     });
//   };
// }

function validatePrice(req, res, next) {
  const { price } = req.body.data;
  if (price <= 0 || !isFinite(price)) {
    next({
      status: 400,
      message: "Dish must have a price that is an integer greater than 0",
    });
  } else {
    next();
  }
}

const list = (req, res, next) => {
  res.json({ data: dishes });
};

const create = (req, res, next) => {
  const { name, description, price, image_url } = req.body.data;
  const newDish = {
    name:name,
    description:description,
    price:price,
    image_url:image_url,
    id:nextId()
  }
  // console.log(newDish)
  dishes.push(newDish)
  res.status(201).json({
    data: newDish
  });
};

const update = (req, res, next) => {
  const { name, description, price, image_url } = req.body.data;
  const updateDish = res.locals.dish;
  updateDish.name = name;
  updateDish.description = description;
  updateDish.price = price;
  updateDish.image_url = image_url;
  res.status(200).json({
    data: updateDish,
  });
};

const read = (req, res, next) => {
    res.status(200).json({data:res.locals.dish})
};

module.exports = {
  list,
  create:create,
  update: [dishExist, validatePrice, update],
  read: [dishExist, read]
};
// create: [validateProperty, validatePrice, create],