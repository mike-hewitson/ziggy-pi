var appRouter = function(app) {

 app.get("/", function(req, res) {
    res.send("Hello World");
});

app.post("/transfer", function(req, res) {
	 console.log(req.body.amount);
	 console.log(req.body.balance);
	 
});

};

module.exports = appRouter;

