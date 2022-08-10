import {
  Server,
  ServiceClientConstructor,
  loadPackageDefinition,
  ServerCredentials,
} from "@grpc/grpc-js";
import { HandleCall } from "@grpc/grpc-js/build/src/server-call";
import { loadSync } from "@grpc/proto-loader";
import assert from "assert";

const PROTO_PATH = "../chat.proto";
const SERVER_URI = "0.0.0.0:9090";

type User = { name: string };
const usersInChat: User[] = [];

// eslint-disable-next-line no-unused-vars
type Observer = { write: (arg0: unknown) => void };
const observers: ({ call: Observer } | any)[] = [];

const packageDefinition = loadSync(PROTO_PATH);
const protoDescription = loadPackageDefinition(packageDefinition);

// we'll implement the handlers here
const join: HandleCall<any, any> = (call: any, callback: any) => {
  const user = call.request;

  // check username already exists.
  const userExist = usersInChat.find((_user) => _user.name == user.name);
  if (!userExist) {
    usersInChat.push(user);
    callback(null, {
      error: 0,
      msg: "Success",
    });
  } else {
    callback(null, { error: 1, msg: "User already exist." });
  }
};

const getAllUsers: HandleCall<any, any> = (_call: any, callback: any) => {
  callback(null, { users: usersInChat });
};

const receiveMsg: HandleCall<any, any> = (call: any, _: unknown) => {
  observers.push({
    call,
  });
};

const sendMsg: HandleCall<any, any> = (call: any, callback: any) => {
  const chatObj = call.request;
  observers.forEach((observer) => {
    observer.call.write(chatObj);
  });
  callback(null, {});
};

const server = new Server();

server.addService(
  (protoDescription.ChatService as ServiceClientConstructor).service,
  {
    join,
    sendMsg,
    getAllUsers,
    receiveMsg,
  }
);

server.bindAsync(
  SERVER_URI,
  ServerCredentials.createInsecure(),
  (err: Error | null, _port: unknown) => {
    assert.ifError(err);
    server.start();
  }
);

console.log("Server is running!");
