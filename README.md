# mqtt-forward

Simple topic forwarder. To forward only specified topics to another broker.

# Configuration

The configuration can be set by mounting the config/config.json over /app/config/config.json

```
{
    "source": {
        "host": "mqtt://source_srv",
        "options": {},
        "topics": [
            {
                "source": "msh/EU_868/2/e/LongFast/",
                "dest": "msh/8000-8045/2/e/LongFast/"
            },
            {
                "source": "msh/EU_868/2/json/LongFast/",
                "dest": "msh/8000-8045/2/json/LongFast/"
            }
        ]
    },
    "destination": {
        "host": "mqtt://mqtt-dest-server",
        "options": {
            "username": "user",
            "password": "pass"
        }
    }
}
```
