const Expense=require('../models/Expense.js')

const createExpense=async(req,res)=>{
  const {title,amount,category,date}=req.body;
  if(!title){
    return res.status(400).json({message:'title field is empty'});
  }
  if(!amount){
    return res.status(400).json({message:'amount field is empty'});
  }
  if(!category){
    return res.status(400).json({message:'category field is empty'});
  }
  if(!date){
    return res.status(400).json({message:'date field is empty'});
  }
  const expense=new Expense({user:req.user.id,title,amount,category,date});
  await expense.save();
  return res.status(201).json({message:"Expense created Successfully",expense});
}
const updateExpense=async(req,res)=>{
  const { id } = req.params;
    const updates = req.body;
    const expense = await Expense.findOneAndUpdate({ _id: id, user: req.user.id }, updates, { new: true });
    if (!expense) return res.status(404).json({ message: 'Expense not found while updating' });
    res.json(expense);
}
const deleteExpense=async(req,res)=>{
  const { id } = req.params;
  const expense = await Expense.findOneAndDelete({ _id: id, user: req.user.id });
  if (!expense) return res.status(404).json({ message: 'Expense not found while deleting' });
  res.status(204).send()
}

const getALlExpense=async(req,res)=>{
  // const { filter, startDate, endDate } = req.query;
  const query = { user: req.user.id };
  // if (filter === 'week') query.date = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
  // if (filter === 'month') query.date = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
  // if (startDate && endDate) query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };

  const expenses = await Expense.find(query);
  res.json(expenses);
}
module.exports={createExpense,updateExpense,deleteExpense,getALlExpense};