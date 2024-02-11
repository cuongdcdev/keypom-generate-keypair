const { KeyPair } = require("near-api-js");
const { hashPassword, generateKeys } = require("@keypom/core");
const cors = require("cors");
const express = require('express')
const app = express()
app.use(cors())
const PORT = 8080

app.listen(PORT, () => {
    console.log(`API listening on PORT ${PORT} `)
})

app.get('/keypair/:num/:string?/:drop_id?', async (req, res) => {
    console.log("req key:", req.params.num);
    let n = req.params.num ? parseInt(req.params.num) : 1
    if (n > 50) n = 50;
    let rootEntropy = req.params.string ? req.params.string : undefined;
    let dropId = req.params.drop_id ? req.params.drop_id : "";
    let metaEntropy = Array.from({ length: n }, (_, i) => `${dropId}_${i}`);

    let params = rootEntropy ? {
        numKeys: n,
        rootEntropy,
        metaEntropy
    } : {
        numKeys: n
    };
    let { keyPairs, publicKeys, secretKeys } = await generateKeys(params);
    let keyPairObject = [];
    for (i = 0; i < n; i++) {
        keyPairObject.push({
            "pub": publicKeys[i],
            "priv": secretKeys[i]
        });
    }

    console.log("keyPairObject:", keyPairObject);
    res.send(JSON.stringify(keyPairObject));
})

app.get('/hashpw/:str/:bool?', async (req, res) => {
    console.log("req key:" + req.params.str + " hashedPw pass: " + req.params.bool);
    let inputString = req.params.str ? req.params.str : "";
    let fromHex = req.params.bool === "true" ? true : false

    let hashedPw = await hashPassword(inputString, fromHex);

    res.send(JSON.stringify({ "pw": hashedPw }));
})
