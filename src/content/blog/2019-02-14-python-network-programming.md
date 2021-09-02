---
title: "Network Programming in Python"
description: ""
author: "John Paul"
date: "2019-02-14"
categories: ["programming", "python"]
---

In this post, we are going to expore network programming concepts in python by
building our own client and server from the ground up using only the modules
provided natively by python.

First, we have to understand what a client and a server are. Put simply, a
server is a piece of software or hardware that provides a "service" needed by
one or more clients. It's function is to continuous wait for requests from
clients, respond to those requests, and then wait for more requests. Servers
are usually meant to run indefinitely. For our case, a server will be a python
program that interacts with and provides functionality to a client program.

Clients contact a server, issue a request sending any necessary data and wait
for a reply. Each request made by a client to a server is a separate transaction.

Servers are fundamental to modern networks and provide services such as
filesharing, authentication, databases, webpage information, etc.

Before communication can take place, communication endpoints have to be
created. In networking, these endpoints are called **sockets**.

Sockets are grouped into address families. The most used address family is the
**AF_INET(6)** which stands for _address family_: Internet. When post-pended
with the number 6, the socket is used for IPV6 addressing.

Sockets have to be identified by addresses. The address is comprised of a host
name and a port number. Valid port numbers range from 0-65535. Port numbers
less than 1024 are usually reserved for the system.

Regardless of which address type you are using there are two different types
of socket connections: connection oriented and connectionless.

Connection oriented sockets are implemennted using the TCP protocol. To create
a TCP socket, you must use **SOCK_STREAM** as the connection type. TCP sockets
are used to offer reliable, unduplicated delivery of data.

Connectionless sockets are implemented using **UDP** (User Datagram Protocol). To
create a UDP socket, use **SOCK_DGRAM** as the socket type

## Creating a Server

One simple way to create a server in Python is via the socket module. This
module provides a set of methods which enable socket based network
communication.

The table below provides a summary of some of the methods.

| Name    | Description                                                                         |
| ------- | ----------------------------------------------------------------------------------- |
| socket  | Create a new socket using the given address family, socket type and protocol number |
| bind    | Bind the socket to an address                                                       |
| listen  | Enable a server to accept communications                                            |
| accept  | Accept a connection. Must be bound to an address and listening for connections      |
| connect | Connect to a remote socket at address                                               |
| sendall | Send data to the socket. The socket must be connected to a remote                   |
|         | socket. Continues to send data until all data has been sent or an error occurs.     |
| recv    | Receive data from the socket. Must be given a buffer size e.g 1024                  |
| close   | Mark the socket closed                                                              |

#

The `socket.socket()` method has the following signature:

`socket.socket(socket_family, socket_type, protocol=0)`

The `socket_family` is either **AF_INET** or **AF_UNIX**. The `socket_type` is
either **SOCK_STREAM** or **SOCK_DGRAM**. The protocol is usually left out
defaulting to 0.

### TCP Server

Before jumping into the code, I will first provide some general pseudocode
that shows how a typical server may be created. The snippet below provides the
general steps that are followed when creating a server. Bear in mind that is
not the only way you could create a server.

```python

# First create a server socket
server_sock = socket.socket()

# Bind the socket to an address. Address is a (host, port) pair.
server_sock.bind(address)

# Listen for connections
server_sock.listen()

# Start the server infinite loop
while True:

    # Accept client connection. A new socket object is returned together
    # with the socket address by the accept() method. The new socket object
    # is what is used to carry out communication.
    client_sock = server_sock.accept()

    # Start communication loop: receive and send data to client
    while True:
        # Receive/ send data
        client_sock.recv()/client_sock.send()

    # Close client socket
    client_sock.close()

# Optionally close server socker
server_sock.close()

```

Let us now build a real server. This server will accept messages from clients
and return the same messages prepended with a timestamp. The script for this
server is shown below:

```python

# server.py

from time import ctime
import socket

HOST = '0.0.0.0'
PORT = 21567
BUFSIZE = 1024
ADDR = (HOST, PORT)

# Set up the server
server_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_sock.bind(ADDR)
server_sock.listen(5)

while True:
    print('waiting for connection...')
    client_sock, client_addr = server_sock.accept()
    print('...connected from: ', addr)

    while True:
        data = client_sock.recv(BUFSIZE)
        if not data:
            break
        client_sock.send('[{}] {}'.format(ctime(), data))
    client_sock.close()
server_sock.close()

```

### TCP Client

The socket module also has tools for writing client programs. You will find
that creating clients is much simpler than building servers.

The python script below is a client program that prompts a user for messages
to send to the server and displays the data returned from the server to the user.

```python

# client.py

import socket

HOST = '0.0.0.0'
PORT = 21567
BUFSIZE = 1024
ADDR = (HOST, PORT)

client_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client_sock.connect(ADDR)

while True:
    data = raw_input('> ')
    if not data:
        break
    client_sock.send(data)
    data = client_sock.recv(BUFSIZE)
    if not data:
        break
    print(data)

client_sock.close()

```

### Running the client and server

Start by first running the server then the client. You should see an output
such as the examples in the screen-shots below.

Screen-shot of server running from the terminal.

![Running server]({{'/assets/img/server.png' | relative_url }})

Screen-shot of client running from the terminal.

![Running client]({{ '/assets/img/client.png' | relative_url }})
