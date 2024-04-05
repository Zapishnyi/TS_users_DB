"use strict";
const form = document.querySelector("form");
const saveUpdate = document.querySelector(".save_update");
// --------------Save/Update
saveUpdate.addEventListener("click", (event) => {
    event.preventDefault();
    const { userName, userAge } = form;
    if (saveUpdate.innerText === "Update") {
        if (!isNaN(+userAge.value)) {
            UserEdit.updateUser({
                userName: userName.value,
                userAge: +userAge.value,
            });
        }
        else {
            userAge.classList.add("alert");
            setTimeout(() => userAge.classList.remove("alert"), 400);
        }
    }
    else {
        if (!isNaN(+userAge.value)) {
            UserEdit.createUser({
                userName: userName.value,
                userAge: +userAge.value,
            });
        }
        else {
            userAge.classList.add("alert");
            setTimeout(() => userAge.classList.remove("alert"), 400);
        }
    }
});
// ------------UserEdit class
class UserEdit {
    // GET
    static _getUsers() {
        return JSON.parse(localStorage.getItem(this._userKey) || "[]");
    }
    // CREATE
    static createUser(data) {
        let id = 1;
        const users = this._getUsers();
        users.sort((a, b) => a.id - b.id);
        if (users.length) {
            for (let i = 1; i <= users[users.length - 1].id + 1; i++) {
                if (users.findIndex((e) => e.id === i) === -1) {
                    id = i;
                    break;
                }
            }
        }
        else {
            id = 1;
        }
        users.push({ id, ...data });
        this.writeToStorage(users.sort((a, b) => a.id - b.id));
        this.renderHtml(users);
    }
    // UPDATE
    static updateUser(user) {
        const users = this._getUsers();
        users.splice(users.findIndex((e) => e.id === this._userId), 1, { id: this._userId, ...user });
        this.renderHtml(users);
        this.writeToStorage(users);
        saveUpdate.innerText = "Save";
    }
    // RENDER
    static renderHtml(users) {
        const usersContainer = document.querySelector(".user_container");
        const pEmpty = document.createElement("p");
        pEmpty.innerText = "There are no users in database";
        usersContainer.innerHTML = "";
        const usersHTMLcoll = users.map((el) => {
            const userDiv = document.createElement("div");
            userDiv.classList.add("user");
            userDiv.innerHTML = `<p> ${el.id} - User name : ${el.userName} <br> &nbsp &nbsp &nbsp &nbsp User age : ${el.userAge}</p>`;
            const buttonsBox = document.createElement("div");
            userDiv.appendChild(buttonsBox);
            const deleteBtn = document.createElement("button");
            deleteBtn.innerText = "Delete";
            const updateBtn = document.createElement("button");
            updateBtn.innerText = "Update";
            buttonsBox.append(deleteBtn, updateBtn);
            deleteBtn.addEventListener("click", () => {
                users = this._getUsers().filter((e) => e.id !== el.id);
                this.renderHtml(users);
                this.writeToStorage(users);
            });
            updateBtn.addEventListener("click", () => {
                const { userName, userAge } = form;
                this._userId = el.id;
                userName.value = el.userName;
                userAge.value = el.userAge.toString();
                saveUpdate.innerText = "Update";
            });
            return userDiv;
        });
        usersHTMLcoll.length
            ? usersContainer.append(...usersHTMLcoll)
            : usersContainer.append(pEmpty);
    }
    // WRITE TO STORAGE
    static writeToStorage(data) {
        localStorage.setItem(this._userKey, JSON.stringify(data));
    }
}
UserEdit._userKey = "users";
UserEdit.renderHtml(UserEdit._getUsers());
