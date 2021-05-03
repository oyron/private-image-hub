const jwt = require('jsonwebtoken');
const jwksRsa = require('jwks-rsa');
const logger = require("../logger");

const jwksClient = jwksRsa({
    jwksUri: 'https://login.microsoftonline.com/3aa4a235-b6e2-48d5-9195-7fcf05b459b0/discovery/v2.0/keys'
});

function getKey(header, callback){
    jwksClient.getSigningKey(header.kid, function(err, key) {
        const signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    });
}

function hasValidScope(decodedToken) {
    const readWriteScope = "Inventory.books.ReadWrite";
    const userImpersonationScope = "user_impersonation";
    return decodedToken && "scp" in decodedToken && (decodedToken.scp.includes(readWriteScope) || decodedToken.scp.includes(userImpersonationScope));
}

const validateOptions = {
    "issuer": "https://sts.windows.net/3aa4a235-b6e2-48d5-9195-7fcf05b459b0/",
    "maxAge": "1h",
    "audience": "https://api-inventory-single.playground.radix.equinor.com"
};
const authorizationUri = "https://login.microsoftonline.com/3aa4a235-b6e2-48d5-9195-7fcf05b459b0/oauth2/authorize";
const wwwAuthenticateResponseHeader = `Bearer realm="Inventory API" authorization_uri="${authorizationUri}"`;


const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (! authHeader) {
        res.set('WWW-Authenticate', wwwAuthenticateResponseHeader + ' error="missing access token"');
        res.status(401).send("Missing access token");
    }
    else{
        const token = authHeader.split(' ')[1];
        jwt.verify(token, getKey, validateOptions, function(err, decoded) {
            if (err || ! hasValidScope(decoded)) {
                const errorMessage = err ? err : "invalid scope";
                let payloadLog = '';
                if (Object.keys(req.body).length > 0) {
                    payloadLog = 'Payload: ' + JSON.stringify(req.body);
                }
                logger.warn(`${errorMessage}: ${req.method} ${req.url} ${payloadLog}`);
                res.set('WWW-Authenticate', wwwAuthenticateResponseHeader + ` error="${errorMessage}"`);
                return res.status(403).send("Invalid access token");
            }
            //req.user = decoded;
            next();
        });

    }
};

module.exports = {
    verifyToken
};