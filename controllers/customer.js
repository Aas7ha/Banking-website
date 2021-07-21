const Customer = require("../models/customer");
const Transfer = require("../models/transfer");

module.exports.getCustomers =  (req, res, next) =>{
    const customers = Customer.find({});
    if (!customers) {
        console.log("No Customers!");
    }
    res.render("customers.ejs", {customers});
};

module.exports.getSingleCustomer =  (req, res, next ) =>{
    const currentCustomer =  Customer.findById(req.params.id);
    const customers = Customer.find({});

    const time = new Date();
    const options = {
        day: "numeric",
        month: "long",
        year: "numeric"
    };

    const date = new Intl.DateTimeFormat("en-GB", options).format(time);

    res.render("customer",{
        title: currentCustomer.name,
        currentCustomer,
        customers,
        date,
    });
};

module.exports.postTransfer = async (req, res, next) =>{
    const sender = await Customer.findById(req.params.id);
    const receiver = await Customer.findOne({ name: req.body.customer});
    const amount = req.body.amount;

    if (amount > sender.currentBalance){
        req.flash("error","");
        return res.redirect(`/customer/${sender._id}`);
    }

    sender.currentBalance -= +amount;
    receiver.currentBalance += +amount;

    sender.movements.push(`-₹${amount}`);
    receiver.movements.push(`+₹${amount}`);

    const transfer = Transfer({
        sender: sender.name,
        receiver: receiver.name,
        amount,
    });

    await transfer.save();
    await sender.save();
    await receiver.save();
    req.flash("success"," ");
    return res.redirect("/transfers");
};

module.exports.getTransfer = async (req, res , next) => {
    const transfers = await Transfer.find({});

    res.render("transfers", { transfers });
};
