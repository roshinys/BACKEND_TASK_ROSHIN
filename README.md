This project demonstrates the use of socketio and redis to increase the efficiency of the server, this is designed through TypeScript,expressjs,vanillajs,mongodb,socketio and redis

//steps to follow

1. create a .env file write PORT , PRIVATEKEY for jwt token signing and verification and finally store a MONGO_URL from cloud for initial setups
2. mongo url should be of like : "mongodb+srv://<username>:<Password>@cluster0.ykb15te.mongodb.net/<DBNAME>?retryWrites=true&w=majority"
3. now on your terminal run command npm i , to make sure you install all the necessary dependecies
4. make sure you have installed redis server on your terminal if not download and install it , after installing it on the terminal run command -> redis-server , to create a cache server
5. now to run the app in a new terminal type "npm run"

// How to use the website

1. Open your vs code use liveserver to start the server go to "http://127.0.0.1:5500/frontend/html/register.html",register yourself after registering it will redirect to login page => "http://127.0.0.1:5500/frontend/html/login.html"
2. after loggin you can add todos and play around

//Learnings from this project

1. you will be able to use redis server more effeciently and you can also see the power of redis
2. you will able to understand socketio
3. Understanding how to move items from redis server to mongodb
