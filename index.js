const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const process = require("process");
const PORT = 8080;

const APP_ID = 'App ID from agora project console'
//process.env.APP_ID;
const APP_CERTIFICATE ='App certificate from agora project console'
// process.env.APP_CERTIFICATE;
const app = express();

const nocache = (req, resp, next) => {
    resp.header('Cache-Control','private,no-cache,no-store, must-revalidate');
    resp.header('Expires', '-1');
    resp.header('Pragma', 'no-cache');
    next ();
}

const generateAccessToken = (req,resp) => {
    // console.log("......",req.query.channelName,req.query.role,req.query.uid);
// set response header
resp.header('Acess-Control-Allow-Origin','*');
// set channel name
const channelName = req.query.channelName;
if (!channelName){
    return resp.status(500).json({
        'error' : 'channel is required'   })
};
// get uid
let uid= req.query.uid;
if(!uid || uid == ''){
    uid =0;
} 
// get role
let role = RtcRole.SUBSCRIBER;
if(req.query.role== 'publisher'){
    role = RtcRole.PUBLISHER
}
// get the expire time
let expireTime = req.query.expireTime;
if (!expireTime || expireTime == ''){
    expireTime = 3600;
}else {
    expireTime = parseInt(expireTime, 10);
}
const currentTime = Math.floor(Date.now() / 1000);
const privilageExpireTime = currentTime + expireTime;
//build the token
// appID, appCertificate, channelName, uid, role, privilegeExpiredTs
const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName,uid,role)
//return the token
return resp.json({'token':token})
}

app.get('/access_token',nocache,generateAccessToken);

app.listen(PORT, () => {
   console.log(`listening on port: ${PORT}`); 
});