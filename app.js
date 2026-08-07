const supabaseUrl = "https://jsqeidcgaafajsticsvl.supabase.co";

const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzcWVpZGNnYWFmYWpzdGljc3ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxMjY2NzMsImV4cCI6MjEwMTcwMjY3M30.RScqRFieydVv5XTH5Q18Bnetr8iFimYB5Mnch4y_oS8";

const db = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

let tickets = [];

async function loadTickets() {
    const { data, error } = await db
        .from("tickets")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    tickets = data;
    render();
}

function openModal() {
    document.getElementById("modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

async function createTicket() {

    const ticket = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        assigned_to: document.getElementById("assigned_to").value,
        priority: document.getElementById("priority").value,
        deadline: document.getElementById("deadline").value,
        status: "todo"
    };

    const { error } = await db
        .from("tickets")
        .insert(ticket);

    if (error) {
        console.error(error);
        return;
    }

    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("assigned_to").value = "";
    document.getElementById("priority").value = "Low";
    document.getElementById("deadline").value = "";

    closeModal();
    loadTickets();
}

async function moveTicket(id, newStatus) {

    const { error } = await db
        .from("tickets")
        .update({
            status: newStatus
        })
        .eq("id", id);

    if (error) {
        console.error(error);
        return;
    }

    loadTickets();
}

async function deleteTicket(id) {

    const { error } = await db
        .from("tickets")
        .delete()
        .eq("id", id);

    if (error) {
        console.error(error);
        return;
    }

    loadTickets();
}

function render() {

    document.querySelectorAll(".tickets")
        .forEach(x => x.innerHTML = "");

    tickets.forEach(ticket => {

        const card = document.createElement("div");

        card.className =
            "ticket priority-" + ticket.priority.toLowerCase();

        card.innerHTML = `

        <h3>${ticket.title}</h3>

        <p>${ticket.description || ""}</p>

        <b>Assigned:</b> ${ticket.assigned_to || "Nobody"}

        <br>

        <b>Priority:</b> ${ticket.priority}

        <br>

        <b>Deadline:</b> ${ticket.deadline || "None"}

        <br><br>

        ${
            ticket.status !== "todo"
            ? `<button onclick="moveTicket('${ticket.id}','todo')">
            To Do
            </button>`
            : ""
        }

        ${
            ticket.status !== "progress"
            ? `<button onclick="moveTicket('${ticket.id}','progress')">
            Progress
            </button>`
            : ""
        }

        ${
            ticket.status !== "done"
            ? `<button onclick="moveTicket('${ticket.id}','done')">
            Done
            </button>`
            : ""
        }

        <button onclick="deleteTicket('${ticket.id}')">
        Delete
        </button>

        `;

        document
            .querySelector(`#${ticket.status} .tickets`)
            .appendChild(card);

    });
}

loadTickets();