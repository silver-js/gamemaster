## to consider:  
- heartbeat  
- buffer undelivered messages  
- message routing  
- broadcast  
- handling backpuessure  
- auto reconnection
- msg acknowledgements
- encryptions
- multiplexing
- fallback(http long polling)

- horizontal scaling is the way(investigate load balancer)
- backplane?
- data syncronization
- conn state syncronization
- redundant backplane
- load shedding
- restoring connections

## About  

- This should be a simple comunication layer
- websocket based
- can create rooms
- with usersdb and posibility to allow guests

### theorical commands  

in(cmd, data):
- input, data
- msg, txt
- create, name
- join, id
- leave
- exit

out(type, data):
- init, data
- room, data
- rooms, data
- roomMsg, txt
- dm, data
- game, data