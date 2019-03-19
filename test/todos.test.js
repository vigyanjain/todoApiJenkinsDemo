const chai = require('chai');
const chaiHttp = require('chai-http');
const {MongoClient} = require('mongodb');
const app = require('../app/server');

let should = chai.should();
chai.use(chaiHttp);

let collection = undefined;
/*
 * make sure app is running (using emits)
 */
before((done)=>{
    app.on("running", ()=>{
        console.log("app is running, lets empty the database");
        MongoClient.connect(process.env.MURI, {useNewUrlParser: true}, (err, client) => {
            if(err){
                throw err;
            }
            collection = client.db(process.env.MDB).collection('todos');
            collection.drop((e,r)=>{
                console.log('attempted drop');
            });
            done();
        });
    });
});

/*
 * lets do some testing
 */
describe('Todos', () => {

    describe('POST /todos', () => {
        it("should insert 3 todo record", done => {
            chai.request(app)
                .post('/todos')
                .set('content-type', 'application/json')
                .send({title: 'title 1', desc: 'title 1 desc'})
                .end((err, res) => {
                    res.should.have.status(200);
                });

            chai.request(app)
                .post('/todos')
                .set('content-type', 'application/json')
                .send({title: 'title 2', desc: 'title 2 desc'})
                .end((err, res) => {
                    res.should.have.status(200);
                });

            chai.request(app)
                .post('/todos')
                .set('content-type', 'application/json')
                .send({title: 'title 3', desc: 'title 3 desc'})
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe("GET /todos", () => {
        it("should get all todo records", done => {
            chai.request(app)
                .get('/todos')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body['todos'].should.be.length(3);
                    done();
            });
        });
    });
});