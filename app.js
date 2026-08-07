let tickets = JSON.parse(localStorage.getItem("tickets")) || [];


function save() {
    localStorage.setItem("tickets", JSON.stringify(tickets));
}


function openModal(){
    document.getElementById("modal").style.display="flex";
}


function closeModal(){
    document.getElementById("modal").style.display="none";
}


function createTicket(){

    let ticket = {

        id: Date.now(),

        title:
        document.getElementById("title").value,

        description:
        document.getElementById("description").value,

        priority:
        document.getElementById("priority").value,

        deadline:
        document.getElementById("deadline").value,

        status:"todo"

    };


    tickets.push(ticket);

    save();

    render();

    closeModal();

}



function moveTicket(id,newStatus){

    let ticket =
    tickets.find(t=>t.id===id);

    ticket.status=newStatus;

    save();

    render();

}



function deleteTicket(id){

    tickets =
    tickets.filter(t=>t.id!==id);

    save();

    render();

}



function render(){

    document.querySelectorAll(".tickets")
    .forEach(x=>x.innerHTML="");


    tickets.forEach(ticket=>{


        let card=document.createElement("div");

        card.className=
        "ticket priority-"+ticket.priority.toLowerCase();


        card.innerHTML=`

        <h3>${ticket.title}</h3>

        <p>${ticket.description}</p>

        <b>Priority:</b> ${ticket.priority}

        <br>

        <b>Deadline:</b> ${ticket.deadline || "None"}

        <br><br>


        ${
        ticket.status !== "todo"
        ?
        `<button onclick="moveTicket(${ticket.id},'todo')">
        To Do
        </button>`
        :""
        }


        ${
        ticket.status !== "progress"
        ?
        `<button onclick="moveTicket(${ticket.id},'progress')">
        Progress
        </button>`
        :""
        }


        ${
        ticket.status !== "done"
        ?
        `<button onclick="moveTicket(${ticket.id},'done')">
        Done
        </button>`
        :""
        }


        <button onclick="deleteTicket(${ticket.id})">
        Delete
        </button>

        `;


        document
        .querySelector(`#${ticket.status} .tickets`)
        .appendChild(card);


    });

}


render();