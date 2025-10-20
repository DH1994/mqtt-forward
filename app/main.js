const fs = require('fs');
const mqtt = require("mqtt");

fs.readFile("config/config.json", "utf-8", (err, data) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }


    let config = JSON.parse(data);
    console.log(config);

    const clientSource = mqtt.connect(config.source.host, config.source.options);
    const clientDest = mqtt.connect(config.destination.host, config.destination.options);

    // Subscribe to each topic from the configuration
    config.source.topics.forEach(topic => {
        clientSource.subscribe(topic.source + "#", (err) => {
            if (err) {
                console.log(`Error subscribing to ${topic.source}: ${err}`);
            } else {
                console.log(`Subscribed to ${topic.source}`);
            }
        });
    });

    clientSource.on("connect", () => {
        console.log("Connected to source broker");
    });

    clientSource.on("message", (topic, message) => {
        console.log(`Received message from ${topic}: ${message.toString()}`);

        // Forward the message to the destination broker
        const topicMapping = config.source.topics.find(t => topic.startsWith(t.source));
        if (topicMapping) {
            // Construct destination topic by replacing source prefix with destination prefix
            const destTopic = topic.replace(topicMapping.source, topicMapping.dest);

            // Publish the message to the corresponding destination broker
            clientDest.publish(destTopic, message, (err) => {
                if (err) {
                    console.log(`Error publishing to ${destTopic}: ${err}`);
                } else {
                    console.log(`Forwarded message to ${destTopic}`);
                }
            });
        } else {
            console.log(`No mapping found for ${topic}`);
        }
    });

    clientDest.on("connect", () => {
        console.log("Connected to destination broker");
    });

    clientDest.on("error", (err) => {
        console.log(`Destination connection error: ${err}`);
    });
});
