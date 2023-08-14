const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

function orderExist(req, res, next){
    const {orderId} = req.params;
    const foundOrder = orders.find(o=>o.id===orderId);
    if(foundOrder){
        res.locals.order = foundOrder;
        next();
    }else{
        next({
            status:404,
            message:`Could not find order id ${orderId}`
        })
    }
}

const list = (req, res, next) =>{
    res.json({data:orders})
}

const read = (req, res, next)=>{
    res.json({data:res.locals.order})
}

const update = (req, res, next)=>{
 const {deliverTo, mobileNumber, status, dishes} = req.body.data;
 const order = res.locals.order;
 order.deliverTo = deliverTo;
 order.mobileNumber = mobileNumber;
 order.status = status;
 order.dishes = dishes;
 res.json({data:order})
}

// const create = (req, res, next)=>{

// }

// const destroy = (req, res, next)=>{

// }


module.exports = {
    list,
    read:[orderExist, read],
    update:[orderExist, update],
    // create,
    // delete:[orderExist, destroy]
}