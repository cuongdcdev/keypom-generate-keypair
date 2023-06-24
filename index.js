const { KeyPair } = require("near-api-js");
const {hashPassword} = require("@keypom/core");
const cors = require("cors");
const express = require('express')
const app = express()
app.use(cors())
const PORT = 4000

app.listen(PORT, () => {
    console.log(`API listening on PORT ${PORT} `)
})

app.get('/keypair/:num', (req, res) => {
    console.log("req key:", req.params.num);
    let n = req.params.num ? parseInt(req.params.num) : 1  ;
    let keyPairObject = [];

    if(n > 50 ) n = 50;

    for( i = 0 ; i < n ; i++ ){
        let keypair = KeyPair.fromRandom('ed25519');
        keyPairObject.push({
            "pub": keypair.publicKey.toString(),
            "priv": keypair.secretKey
        });
    }
    
    console.log("akeypairs:", keyPairObject);
    res.send( JSON.stringify( keyPairObject ) );
})

app.get('/hashpw/:str', async (req, res) => {
    console.log("req key:", req.params.str);
    let inputString = req.params.str ? req.params.str : ""  ;
    
    let hashedPw = await hashPassword(inputString);
    
    res.send( JSON.stringify( {"pw": hashedPw} ) );
})

// Export the Express API
module.exports = app