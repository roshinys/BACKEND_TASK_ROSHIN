"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const socket = io("http://localhost:5000/", {
    transports: ["websocket"],
});
const token = localStorage.getItem("token");
const todoForm = document.getElementById("todo-form");
const todoBtn = document.getElementById("addTodo");
const todos = document.getElementById("todos");
window.addEventListener("DOMContentLoaded", () => {
    if (!token || token.length == 0) {
        alert("please log back in");
        return;
    }
    fetchAll();
});
function fetchAll() {
    return __awaiter(this, void 0, void 0, function* () {
        todos.innerHTML = "";
        const result = yield axios.get("http://localhost:5000/fetchAll", {
            headers: { Authorization: token },
        });
        const alltodos = result.data.todosList;
        alltodos.forEach((todo) => {
            addToList(todo);
        });
        //using sockets
        // socket.emit("get-todos", { token });
        // socket.on("receive-todos", (result: any) => {
        //   todos.innerHTML = "";
        //   const allTodos = result.todosList;
        //   allTodos.forEach((todo: string) => {
        //     addToList(todo);
        //   });
        // });
    });
}
todoBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const newtodo = document.getElementById("newtodo");
    const todo = newtodo.value;
    newtodo.value = "";
    socket.emit("new-todo", { todo, token });
    socket.on("added-new-todo", (result) => {
        console.log(result);
    });
    addToList(todo);
});
function addToList(todo) {
    const todos = document.getElementById("todos");
    const newTodoELement = document.createElement("li");
    // newTodoELement.classList = "todos-item";
    newTodoELement.innerText = `${todo}`;
    todos.appendChild(newTodoELement);
}
