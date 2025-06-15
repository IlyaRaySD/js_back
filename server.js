const express = require('express');
const {MongoClient, ObjectId} = require('mongodb');

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.static('public'));

async function get_db_coll(db_add, db_name, db_col_name){
	const client = new MongoClient(db_add);
	await client.connect();
	const db = client.db(db_name);
	return db.collection(db_col_name);
}

app.get('/tasks', async function(req, res) {
	const collection = await get_db_coll('mongodb://127.0.0.1', 'todoapp', 'tasks');
	const data = await collection.find({}).toArray();
	res.send(data);
});

app.get('/tasks/:id', async function(req, res) {
	const collection = await get_db_coll('mongodb://127.0.0.1', 'todoapp', 'tasks');
	const data = await collection.findOne({_id: new ObjectId(req.params.id)});
	res.send(data);
});

app.post('/tasks', async function(req, res) {
	const task = {...req.body, done: false};
	const collection = await get_db_coll('mongodb://127.0.0.1', 'todoapp', 'tasks');
	await collection.insertOne(task);
	res.send(task);
});

app.patch('/tasks/:id', async function(req, res) {
	const collection = await get_db_coll('mongodb://127.0.0.1', 'todoapp', 'tasks');
	const data = await collection.updateOne({_id: new ObjectId(req.params.id)},
											{'$set': req.body}
	);
	res.send({});
});

app.delete('/tasks/:id', async function(req, res) {
	const collection = await get_db_coll('mongodb://127.0.0.1', 'todoapp', 'tasks');
	await collection.deleteOne({_id: new ObjectId(req.params.id)});
	res.send({});
});


app.listen(port, function() {
	console.log('Server is started.')
});