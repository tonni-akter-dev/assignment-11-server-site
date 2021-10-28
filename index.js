const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 4000;
const app = express();
app.use(cors());
app.use(express.json());







app.get('/',(req,res)=>{
    res.send('Runnig the surver')
})
app.listen(port,()=>{
   console.log('hitting the port',port)
})