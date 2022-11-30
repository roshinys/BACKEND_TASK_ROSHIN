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
const formUser = document.getElementById("userForm");
const addUser = document.getElementById("addUser");
const auth = document.getElementById("auth");
addUser.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    const emailELement = document.getElementById("email");
    const passwordELement = document.getElementById("password");
    const email = emailELement.value;
    const password = passwordELement.value;
    console.log(email, password);
    if (auth.innerText == "register") {
        const result = yield axios.post("http://localhost:5000/", {
            email: email,
            password: password,
        });
        const success = result.data.success;
        if (!success) {
            alert(result.data.msg);
            return;
        }
        if (result.status == 200) {
            window.location.href = "http://127.0.0.1:5500/login.html";
        }
    }
    else {
        const result = yield axios.post("http://localhost:5000/loguser", {
            email: email,
            password: password,
        });
        const success = result.data.success;
        console.log(success);
        if (!success) {
            alert(result.data.msg);
            return;
        }
        if (result.status == 200) {
            localStorage.setItem("token", result.data.token);
            window.location.href = "http://127.0.0.1:5500/todos.html";
        }
    }
}));
