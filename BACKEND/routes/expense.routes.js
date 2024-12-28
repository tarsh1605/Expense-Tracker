const express=require('express')
const expenseRouter=express.Router();
const {createExpense,updateExpense, deleteExpense, getALlExpense}=require("../controller/expense.controller.js")
const authMiddleware=require('../middleware/auth.middleware.js')

expenseRouter.use(authMiddleware)
expenseRouter.route("/").post(createExpense);
expenseRouter.route("/:id").put(updateExpense)
expenseRouter.route("/:id").delete(deleteExpense)
expenseRouter.route("/").get(getALlExpense)
module.exports=expenseRouter;