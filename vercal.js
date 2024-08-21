{
    "version": 2,
    "builds": [
      {
        "src": "*.js",
        "use": "@vercel/node"
      }
    ],
    "routes": [
      {
         "src": "/(.*)",
         "dest": "/",
          "methods": ["GET","POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
          "headers": {
             "Access-Control-Allow-Origin": "*",
             "Access-Control-Allow-Credentials": "true",
             "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
         }
     }
   ]
}