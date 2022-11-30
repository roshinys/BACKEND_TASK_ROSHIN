const socket = io("http://localhost:5000/", {
  transports: ["websocket"],
});

const token = localStorage.getItem("token") as string;
const todoForm = document.getElementById("todo-form") as HTMLFormElement;
const todoBtn = document.getElementById("addTodo") as HTMLElement;
const todos = document.getElementById("todos") as HTMLElement;

window.addEventListener("DOMContentLoaded", () => {
  if (!token || token.length == 0) {
    alert("please log back in");
    return;
  }
  fetchAll();
});
async function fetchAll() {
  todos.innerHTML = "";
  const result: any = await axios.get("http://localhost:5000/fetchAll", {
    headers: { Authorization: token },
  });
  const alltodos: Array<string> = result.data.todosList;
  alltodos.forEach((todo: string) => {
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
}

todoBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const newtodo = document.getElementById("newtodo") as HTMLInputElement;
  const todo = newtodo.value;
  newtodo.value = "";
  socket.emit("new-todo", { todo, token });
  socket.on("added-new-todo", (result: any) => {
    console.log(result);
  });
  addToList(todo);
});

function addToList(todo: string) {
  const todos = document.getElementById("todos") as HTMLElement;
  const newTodoELement = document.createElement("li");
  // newTodoELement.classList = "todos-item";
  newTodoELement.innerText = `${todo}`;
  todos.appendChild(newTodoELement);
}
