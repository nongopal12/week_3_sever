const express = require('express');
const bcrypt = require('bcrypt');
const app = express();


const con = require('./db');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//---------------------- generate password 
// http://localhost:3000/password/1111
app.get('/password/:raw',(req,res)=>{
    const raw = req.params.raw;
    bcrypt.hash(raw,10,(err,hash)=>{
        if(err){
            return res.status(500).send('Error creating password!');
        }
        res.send(hash);
    });
});


// ----------------- login ------------------
app.post('/login',(req,res)=>{
    const {username, password} = req.body;
    const sql = "SELECT * FROM users WHERE username = ?";
    con.query(sql,[username],(err,result)=>{
        if(err){
            return res.status(500).send('Database error login!');
        }
        if(result.length != 1){
            return res.status(401).send('Invalid username or password!');
        }
        bcrypt.compare(password,result[0].password,(err,same)=>{
            if(err){
                return res.status(500).send('Error comparing passwords!');
            }
            if(same){
                res.status(200).json({
                    message:"Login successful!",
                    user_id: result[0].id,
                });
            }else{
                res.status(401).send('Invalid username or password!');
            }
        })
    })
})


// ----------------- register ------------------
app.post('/register',(req,res)=>{
    const {username, password} = req.body;
        const sql = "SELECT * FROM users WHERE username = ?";
        con.query(sql,[username],(err,result)=>{
            if(err){
                return res.status(500).send('Database error!');
            }
            if(result.length > 0){
                return res.status(400).send('Username already exists!');
            }
            bcrypt.hash(password, 10,(err,hash)=>{
                if(err){
                    return res.status(500).send('Error creating password!');
                }
                const insert = "INSERT INTO users (username, password) VALUES (?, ?)";
                con.query(insert,[username, hash],(err,result)=>{
                    if(err){
                        return res.status(500).send("Database error! Can't insert new account.");
                    }
                    res.status(200).send('User registered successfully!');
                })
            })


        })
   
})




// get all expenses
app.get('/expenses/:user_id', (req, res) => {
    const userId = req.params.user_id;
    const sql = "SELECT * FROM expense WHERE user_id = ?";
    con.query(sql,[userId],(err,result)=>{
        if(err){
            return res.status(500).send('Database error!');
        }
        res.json(result);
    })
})


// get all today's expense
app.get('/expenses/today/:user_id', (req, res) => {
    const userId = req.params.user_id;
   
    const sql = "SELECT * FROM expense WHERE user_id = ? AND DATE(date) = CURDATE()";
    con.query(sql,[userId],(err,result)=>{
        if(err){
            return res.status(500).json({error: 'Database error!'});
        }
        res.json(result);
    })
})

// resarch expense
    //เขียนตรงนี้



// Add new expense
    //เขียนตรงนี้



// Delete an expense
app.delete('/expenses/:id', (req, res) => {
    const expenseId = req.params.id;

    if (!expenseId) {
        return res.status(400).json({ error: 'Expense ID is required!' });
    }

    const sql = "DELETE FROM expense WHERE id = ?";
    con.query(sql, [expenseId], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: 'Database error! Cannot delete expense.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Expense not found!' });
        }

        res.json({ message: 'Expense deleted successfully!' });
    });
});



    
app.listen(3000,()=>{
    console.log('Server is running on port 3000 ✅');
})
