const express = require("express");
const FruitService = require("./fruit-service");
const CartService = require("./cart-service");

class FruitRoutes {

  /**
   * Setups the routes for fruit related REST api calls
   */ 
  static setup(root) {
    const fruitRouter = express.Router();

    /**
     * TODO-2 - need to expose an api that allows a caller to get a list of all fruits in the system
     *  @requirements use the @FruitService methods to interact with the fruit inventory
     *  @notes remember all methods are @see async on the FruitService
     */ 

    fruitRouter.get('/fruits',(req, res, next)=>{
    try{
       FruitService.getAllFruits().then((allFruits)=>{
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.json(allFruits ? allFruits : {});
       }).catch(next)
    }catch(err){
        throw new Error(`Error in get fruits- ${err.message ? err.message : ''}`);
    }
    });

    /**
     * TODO-3 - need to expose an api that allows a caller to get a specific fruit in the system
     *  @requirements use the @FruitService methods to interact with the fruit inventory
     *  @requirements take consideration when fruit does not exist
     *  @notes remember all methods are @see async on the FruitService
     */ 

    fruitRouter.get('/fruit/:name',(req, res, next)=>{
        const fruitName = req && req.params && req.params.name ? req.params.name : '';
    try{
        FruitService.getFruit(fruitName).then((fruits)=>{
            res.json(fruits ? fruits : {})
           }).catch(next)
        }
           catch(err){
            throw new Error(`Error in get fruit by name- ${err.message ? err.message : ''}`);
        }
     });

     fruitRouter.post('/cart/purchase',(req, res, next)=>{
        const fruitBill = req && req.body  ? req.body : null;
    try{
        CartService.purchase(fruitBill).then((isValid)=>{
            res.json({
                isvalid : isValid ? isValid : false
            }
            )
           }).catch(next)
        }
           catch(err){
            throw new Error(`Error cart purchase service- ${err.message ? err.message : ''}`);
        }
     });

    root.use(fruitRouter);
  }
}

module.exports = FruitRoutes;


