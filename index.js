
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const connection = require("./config/db");
const { authenticate } = require("./Auth/Authencation");
const { userModel } = require("./Model/userModel");


const app = express();
app.use(cors({
    origin : "*"
}))

app.use(express.json());

const port = 8080;


app.post("/register", async (req, res) => {
    const { email, password, confirmPassword } = req.body;
    const alreadyExit = await userModel.findOne({ email })
    if (alreadyExit) {
        res.json({ message: " User already exit please login" })
        
    }
    bcrypt.hash(password, 8, async function (err, hash) {
        await userModel.create({ email, password: hash })
        return res.json({ message: "user successfully registered" })
    })

    
});


app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.json({ message: "Please signup" });
    }

    const hashedPassword = user?.password
    bcrypt.compare(password, hashedPassword, function (err, result) {
        if (result) {
            const token = jwt.sign({ userId: user._id }, 'mockSecret');
             return res.json({ message: " Login Successful" , token : token });
        } else {
            return res.json({ message: "Invalid Credentials" });
        }
    }) 
})

// app.use(authenticate);


app.get('/profile',  (req, res) => {
  const user = userModel.find((user) => user.email === req.user.email);
  res.json(user);
});


app.post('/calculate', (req, res) => {
 const { installment_amount, interest_rate, years } = req.body;

    const i = interest_rate / 100;
    const n = years;

    const total_investment_amount = installment_amount * years;
    const maturity_value =
        (installment_amount * (((1 + i) ** n) - 1)) / i;
    const total_interest_gained = maturity_value - total_investment_amount;

    const result = {
        total_investment_amount,
        total_interest_gained,
        maturity_value,
    };

    res.json(result);
});




app.listen(port, async() => {
    try {
        await connection;
        console.log(` listing on ${port}`);
    } catch (error) {
        console.log(error); 
    }
})
