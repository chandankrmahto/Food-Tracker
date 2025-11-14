
// NAVIGATION

function showSection(sectionId, clickedLink) {
    
    const sections = document.querySelectorAll('.container');
    sections.forEach(sec => sec.classList.remove('active'));

    // Show clicked section
    document.getElementById(sectionId).classList.add('active');

    // Remove active highlight from navbar links
    const navLinks = document.querySelectorAll('#navbar a');
    navLinks.forEach(link => link.classList.remove('active'));
    clickedLink.classList.add('active');

    // Hide hero section except on Home
    const hero = document.getElementById("hero");
    if (sectionId === "home") {
        hero.style.display = "flex";  // show hero
    } else {
        hero.style.display = "none";  // hide hero
    }
}


// Default section
showSection("home", document.querySelector("nav a"));



// POPUP NOTIFICATION

function popup(msg) {
    const p = document.getElementById("popup");
    p.innerText = msg;
    p.style.display = "block";

    setTimeout(() => {
        p.style.display = "none";
    }, 2200);
}



// DARK MODE

document.getElementById("themeToggle").onclick = () => {
    document.body.classList.toggle("dark");
    popup("Theme changed!");
};



// FOOD TRACKING

let foodList = JSON.parse(localStorage.getItem("foods")) || [];
renderList();

function addFood() {
    let food = document.getElementById("foodInput").value.trim();
    let date = document.getElementById("dateInput").value;

    if (!food || !date) {
        popup("Fill all fields");
        return;
    }

    foodList.push({ food, date });
    saveFoods();
    renderList();
    popup("Food Added!");

    document.getElementById("foodInput").value = "";
    document.getElementById("dateInput").value = "";
}

function saveFoods() {
    localStorage.setItem("foods", JSON.stringify(foodList));
}

function renderList() {
    const list = document.getElementById("foodList");
    list.innerHTML = "";

    const today = new Date();

    foodList.forEach((item, i) => {
        const li = document.createElement("li");

        let diff = (new Date(item.date) - today) / (1000 * 60 * 60 * 24);

        if (diff < 0) li.classList.add("expired");
        else if (diff <= 3) li.classList.add("soon");

        li.innerHTML = `
            <span>${item.food} - ${item.date}</span>
            <span class="actions">
                <button onclick="editItem(${i})">✏️</button>
                <button onclick="deleteItem(${i})">🗑️</button>
            </span>
        `;

        list.appendChild(li);
    });
}

function deleteItem(i) {
    foodList.splice(i, 1);
    saveFoods();
    renderList();
    popup("Deleted!");
}

function editItem(i) {
    const newFood = prompt("Edit Food", foodList[i].food);
    const newDate = prompt("Edit Date", foodList[i].date);

    if (newFood && newDate) {
        foodList[i].food = newFood;
        foodList[i].date = newDate;
        saveFoods();
        renderList();
        popup("Updated!");
    }
}



// MESSAGE/DASHBOARD SYSTEM

let messages = JSON.parse(localStorage.getItem("messages")) || [];

function loadMessages() {
    const box = document.getElementById("messagesBox");
    box.innerHTML = "";

    if (messages.length === 0) {
        box.innerHTML = "<p>No messages yet.</p>";
        return;
    }

    messages.forEach(msg => {
        const div = document.createElement("div");
        div.className = "message-card";

        div.innerHTML = `
            <h3>${msg.name}</h3>
            <p><strong>Email:</strong> ${msg.email}</p>
            <p>${msg.message}</p>
            <small>${msg.time}</small>
        `;

        box.appendChild(div);
    });
}

// CONTACT FORM SUBMIT
document.getElementById("contactForm").onsubmit = (e) => {
    e.preventDefault();

    const name = document.getElementById("nameInput").value;
    const email = document.getElementById("emailInput").value;
    const message = document.getElementById("msgInput").value;

    const newMsg = {
        name,
        email,
        message,
        time: new Date().toLocaleString()
    };

    messages.push(newMsg);
    localStorage.setItem("messages", JSON.stringify(messages));

    popup("📨 New message received!");
    loadMessages();

    e.target.reset();
};
