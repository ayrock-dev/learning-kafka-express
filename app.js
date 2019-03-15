const express = require('express');
const bodyParser = require('body-parser');
const { KafkaClient, Producer, Consumer } = require('kafka-node');

const app = express();
const port = 3000;

let kafka = null;
let producer = null;
let consumer = null;

const messages = [];

app.use(bodyParser.text());

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/topic1', (req, res) => res.send(`Kafka Messages:\n${messages.join('\n')}`));

app.post('/topic1', (req, res, next) => {
    if (producer) {
        producer.send(
            [{
                topic: 'topic1',
                messages: req.body || 'empty',
                partitions: 0 // random partition
            }],
            (err, data) => {
                if (err) {
                    next(err);
                } else {
                    res.json(data);
                }
            }
        );
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);

    kafka = new KafkaClient({
        kafkaHost: 'infrastructure.test:9092'
    });

    producer = new Producer(kafka);
    
    producer.on('ready', (err, data) => {
        if (err) {
            console.log('Producer ready failed.');
        } else {
            console.log('Producer ready.');
            console.log(data);
        }

        var topicsToCreate = [{
            topic: 'topic1',
            partitions: 1
        }];
        
        producer.createTopics(topicsToCreate, (err, data) => {
            if (err) {
                console.log('Failed to create Kafka topics.');
                console.log(err);
            } else {
                console.log('Kafka topics created.');
                console.log(data);
        
                // only create consumers after topics are created
                consumer = new Consumer(
                    kafka,
                    [{ topic: 'topic1' }],
                    { autoCommit: false }
                );
                
                consumer.on('message', (message) => {
                    console.log(`Message received: ${JSON.stringify(message) || '<empty>'}`);
                    messages.push(message);
                });
            }
        });
    });
});
