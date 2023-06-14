const path = require("path");
const FruitData = require(path.resolve(__dirname, "fruit-data"));
const ErrorService = require(path.resolve(__dirname, "error-gen-service"));

/*
 * Service responsible for handling all shopping cart related actions.
 * For simplicity this is a static class with all static async methods, to avoid considerations about
 * instantiations and multi instance management.
 */
class CartService {
  /**
   * constructor - since a class with static async methods basically a no op.
   **/
  CartService() {}

  /**
   * Handles the purchasing transaction for a shopping cart filled with fruit. This
   * transaction is "asynchronous" @see async and needs to be invoked with that in mind.
   *
   * @param fruitBill a javascript object of key value. The fruit is the key and
   *                  quantity requested to be purchased is the value.
   * @example {
   *            "Apple": 1,
   *            "Banana": 4,
   *            "Avacado": 3
   *          }
   *
   * @throws @see Error - When the payment processing system is down
   * @throws @see SecurityError - When the users token has expired and needs to relogin
   * @throws @see TypeError - When a fruitBill was not provided or contains no entries
   * @throws @see SyntaxError - When a fruitBill contains a non existince fruit { "Tomato": 3 }
   * @throws @see OutOfStockError - When a fruit no has no more inventory @see fruit-data.json @example Peaches
   *
   * @returns true when purchase is successfully processed and false when payment fails to process (payment declined).
   *          @note Every user has a hard coded limit of 10 dollars, if the amount of total fruit price goes over payments decline
   */
  static async purchase(fruitBill) {
    // simulate at random the processing payment being down
    ErrorService.simulatePaymentProcessingDown();

    // simulate a security error with user token expired at random
    ErrorService.simulateExpiredToken();

    if (!fruitBill || Object.keys(fruitBill).length === 0) {
      throw new TypeError("You need atleast one fruit required for purchase!");
    }

    // hardcoded payment limit for all users
    const userAccountLimit = 10;

    // the current bill cost amount
    let billAmount = 0;

    for (const [key, value] of Object.entries(fruitBill)) {
      const fruit = FruitData.inventory[key];

      if (!fruit) {
        throw new SyntaxError("Fruit provided is invalid!");
      }

      if (fruit.quantity === 0) {
        throw ErrorService.throwOutOfStockError(key);
      }

      // add to the bill the price of the fruit times the pieces of fruit requested
      billAmount = billAmount + fruit.price * value;
    }

    // user needs enough money to cover bill.
    if (billAmount > userAccountLimit) {
      return false;
    }

    return true;
  }
}

module.exports = CartService;
