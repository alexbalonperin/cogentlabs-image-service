COGENT LABS IMAGE SERVICE
--

The Image Service is responsible for receiving requests related to image processing and put them onto a RabbitMQ topic for background processing.

TECHNOLOGY
--

The service is written in NodeJS for its simplicity and good performance.
The server relies on the express library for the API definition and amqplib to communicate with RabbitMQ.


