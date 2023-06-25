const { KeyPair } = require("near-api-js");
const {hashPassword, generateKeys} = require("@keypom/core");
const cors = require("cors");
const express = require('express')
const app = express()
app.use(cors())
const PORT = 4000

app.listen(PORT, () => {
    console.log(`API listening on PORT ${PORT} `)
})

app.get('/keypair/:num/:string/drop_id', (req, res) => {
    console.log("req key:", req.params.num);
    let n = req.params.num ? parseInt(req.params.num) : 1  
    if(n > 50 ) n = 50;
    let rootEntropy = req.params.string ? req.params.string : "rootEntropy"  ;
    let dropId = req.params.drop_id ? req.params.drop_id : ""  ;
    let keyPairObject = [];
    // Array of [0, 1, 2, ... , n-1]
    // allows keyId to be used as metaentropy later
    let metaEntropy =  Array.from({length: n}, (_, i) => `${dropId}_${i}`);

    let {keyPairs, publicKeys, secretKeys} = generateKeys({
        numKeys: n,
        rootEntropy,
        metaEntropy
    })

    for( i = 0 ; i < n ; i++ ){
        keyPairObject.push({
            "pub": publicKeys[i],
            "priv": secretKeys[i]
        });
    }
    
    console.log("akeypairs:", keyPairObject);
    res.send( JSON.stringify( keyPairObject ) );
})

app.get('/hashpw/:str/:bool', async (req, res) => {
    console.log("req key:", req.params.str);
    let inputString = req.params.str ? req.params.str : ""  ;
    let fromHex = req.params.bool ? req.params.bool : false 
    
    let hashedPw = await hashPassword(inputString, fromHex);
    
    res.send( JSON.stringify( {"pw": hashedPw} ) );
})