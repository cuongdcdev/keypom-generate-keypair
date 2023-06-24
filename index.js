const { KeyPair } = require("near-api-js");
const cors = require("cors");
import { hashPassword } from "@keypom/core";
const express = require('express')
const app = express()
app.use(cors())
const PORT = 4000

app.listen(PORT, () => {
    console.log(`API listening on PORT ${PORT} `)
})

app.get('/:num', (req, res) => {
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
    
    console.log("keypairs:", keyPairObject);
    res.send( JSON.stringify( keyPairObject ) );
})

app.get('/hashpw/:string', (req, res) => {
    console.log("req key:", req.params.string);
    let inputString = req.params.string ? req.params.string : ""  ;
    
    let hashedPw = hashPassword(inputString)
    
    console.log("keypairs:", keyPairObject);
    res.send( JSON.stringify( {"pw": hashedPw} ) );
})

// Export the Express API
module.exports = app