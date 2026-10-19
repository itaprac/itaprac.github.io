class Todo {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem("tasks")) || [
      { text: "Kupić mleko i kawę", date: "" },
      { text: "Zrobić lab B z IS", date: "2026-12-01T18:00" },
      { text: "Oddać książkę do biblioteki", date: "2026-12-15T12:00" },
      { text: "Nakarmić kota", date: "" },
    ];
    this.term = "";
    this.editing = null;
  }

  draw() {
    const list = document.getElementById("list");
    list.innerHTML = "";

    for (const task of this.getFilteredTasks()) {
      const index = this.tasks.indexOf(task);
      const li = document.createElement("li");

      if (index === this.editing) {
        const textInput = document.createElement("input");
        textInput.type = "text";
        textInput.id = "edit-text";
        textInput.value = task.text;

        const dateInput = document.createElement("input");
        dateInput.type = "datetime-local";
        dateInput.id = "edit-date";
        dateInput.value = task.date;

        li.append(textInput, dateInput);
      } else {
        const date = document.createElement("small");
        date.textContent = task.date.replace("T", " ");

        li.append(this.highlight(task.text), date);
      }

      const button = document.createElement("button");
      button.textContent = "Usuń";
      button.onclick = (event) => {
        event.stopPropagation();
        this.remove(index);
      };

      li.append(button);
      li.onclick = (event) => {
        event.stopPropagation();
        this.startEdit(index);
      };

      list.append(li);
    }

    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  getFilteredTasks() {
    if (this.term.length < 2) {
      return this.tasks;
    }
    return this.tasks.filter((task) => task.text.includes(this.term));
  }

  highlight(text) {
    const span = document.createElement("span");
    span.textContent = text;

    if (this.term.length >= 2) {
      span.innerHTML = text.replaceAll(this.term, "<mark>" + this.term + "</mark>");
    }
    return span;
  }

  isValid(text, date) {
    if (text.length < 3 || text.length > 255) {
      alert("Zadanie musi mieć od 3 do 255 znaków.");
      return false;
    }
    if (date !== "" && new Date(date) <= new Date()) {
      alert("Data musi być pusta albo w przyszłości.");
      return false;
    }
    return true;
  }

  add(text, date) {
    if (!this.isValid(text, date)) {
      return false;
    }
    this.tasks.push({ text: text, date: date });
    this.draw();
    return true;
  }

  remove(index) {
    this.tasks.splice(index, 1);
    this.editing = null;
    this.draw();
  }

  edit(index, text, date) {
    if (this.isValid(text, date)) {
      this.tasks[index] = { text: text, date: date };
    }
    this.draw();
  }

  startEdit(index) {
    if (this.editing === index) {
      return;
    }
    this.stopEdit();
    this.editing = index;
    this.draw();
  }

  stopEdit() {
    if (this.editing === null) {
      return;
    }
    const index = this.editing;
    const text = document.getElementById("edit-text").value.trim();
    const date = document.getElementById("edit-date").value;

    this.editing = null;
    this.edit(index, text, date);
  }
}

const todo = new Todo();
document.todo = todo;
todo.draw();

document.getElementById("search").oninput = (event) => {
  todo.term = event.target.value;
  todo.draw();
};

document.getElementById("add-form").onsubmit = (event) => {
  event.preventDefault();
  const textInput = document.getElementById("new-text");
  const dateInput = document.getElementById("new-date");

  if (todo.add(textInput.value.trim(), dateInput.value)) {
    textInput.value = "";
    dateInput.value = "";
  }
};

document.onclick = () => {
  todo.stopEdit();
};
