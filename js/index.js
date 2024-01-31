
/*

#loginError - Error for login modal
#registerError - Error for register modal


*/

async function makeRequest(endPoint, data) {
    return new Promise((resolve, reject) => {
        $.post(endPoint, data, (data) => {
            resolve(data);
        });
    });
}

function login(email, password, showError) {
    makeRequest("/login", { email: email, password: password }).then((data) => {
        if (data.success) {
            $('#loginError').text("");
            localStorage.setItem('UserId', data.UserId.toString());
            localStorage.setItem('token', data.tokenData.token);
            window.location.href = "profile.html";
        }
        else if (showError) {
            $('#loginError').text("Error: " + data.error);
        }
        // redirect
    });
}

function getUserData(redirect) {
    let userID = localStorage.getItem('UserId');
    let token = localStorage.getItem('token');

    makeRequest("/api/getUserData", { userID: userID, token: token }).then((data) => {
        if (data.success) {
            $('#loginMenu').text("My Profile");
            $("#logoutButton").show();
            $("#signupButton").hide();
            $("#signUpMenu").hide();
            if (redirect) {
                window.location.href = "profile.html";
            }
        }
        console.log(data);
    });
}

function loginPageEvents() {
    getUserData(false);
    $("#logoutButton").hide();

    $("#loginPassword").on("keyup", (e) => {
        if(e.key === 'Enter')
        {
            $('#loginButton').trigger("click");
        }
    });

    $('#registerPassword2').on("keyup", (e) => {
        if(e.key === 'Enter')
        {
            $('#registerButton').trigger("click");
        }
    });

    $('#loginMenu').on("click", () => {
        getUserData(true);
    });

    $('#loginButton').on("click", () => {
        const email = $('#loginEmail').val();
        const password = $('#loginPassword').val();
        login(email, password, true);
    });

    $('#logoutButton').on("click", () => {
        localStorage.removeItem('UserId');
        localStorage.removeItem('token');
        $('#loginMenu').text("Login");
        $("#logoutButton").hide();
        $("#signupButton").show();
        $("#signUpMenu").show();

    });

    $('#registerButton').on("click", () => {
        const email = $('#registerEmail').val();
        const password = $('#registerPassword').val();
        const password2 = $('#registerPassword2').val();
        const name = $('#registerName').val();

        if (password.length < 8) {
            $('#registerError').text("Error: Password is less than 8 characters.");
            return;
        }

        if (password !== password2) {
            $('#registerError').text("Error: Passwords do not match.");
            return;
        }

        makeRequest("/register", { email: email, password: password, name: name}).then((data) => {
            console.log(data);
            if (data.success) {
                $('#registerError').text("");
                login(email, password, true);
            }
            else {
                $('#registerError').text("Error: " + data.error);
            }
        }, (err) => {
            $('#registerError').text("Error: Connection to the server was rejected.");
        });
    });
}

function scheduleEvents(){
    let data = [
        /*
        {id: "timelineTeamBuilding", title: "Team Building Event", date: " ⁠— Fri 17:00 - 20:00",
            desc: `This event will be for finding other group members to add to your team. `},
        {id: "timelineInduction", title: "Induction  ", date: " ⁠— Sat 11:00 - 12:00",
            desc: `This will be a presentation in 1W 2.101 with our committee and sponsors. We will give important information about the event and facilities.`},
        {id: "timelineStart", title: "Hacking Starts!", date: " ⁠— Sat 12:00",
            desc: `This is when the hacking officially begins!`},
        {id: "timelineEndTalk", title: "End of Hacking Talk", date: " ⁠— Sun 10:00",
            desc: `A talk to let you know how to submit your work and start the end of the hack!`},
        {id: "timelineEnd", title: "Hacking Ends", date: " ⁠— Sun 12:00",
            desc: `Hacking ends at midday on Sunday, so make sure you get everything submitted!`},
            */
        {id: "timelineRegistration", title: "Registration", date: " Sat 10:00 - 11:00",
            desc: `This will be the time to arrive and get signed in.`},
        {id: "timelineWelcome", title: "Welcome and Track introductions", date: " Sat 11:00 - 12:00",
            desc: `This will be the welcome presentation and introduction to our tracks.`},
        {id: "timelineStart", title: "Hacking Begins!", date: " Sat 12:00",
            desc: `This is when the hacking officially begins!`},
        {id: "timelineNetworking", title: "Networking Fair and Dinner", date: " Sat 16:30 - 18:30",
            desc: `Your opportunity to talk to employers and have dinner.`},
        {id: "timelineEndTalk", title: "How to use Devpost", date: " Sun 11:00 - 11:30",
            desc: `This presentation will cover the basics of using Devpost to submit your work.`},
        {id: "timelineEnd", title: "Hacking Ends", date: " Sun 12:00",
            desc: `Hacking ends at midday on Sunday, so make sure you get everything submitted!`},
        {id: "timelineLunch2", title: "Lunch", date: " Sun 12:00 - 12:30",
            desc: `Lunch!`},
        {id: "timelinePresentations", title: "Presentations", date: " Sun 12:30 - 13:30",
            desc: `This event will allow you to show off your solutions and discover solutions that others have made.`},
        {id: "timelineJudging", title: "Judging and Talks", date: " Sun 13:30 - 14:30",
            desc: `During this time there will be talks while solutions are judged for the track prizes.`},
        {id: "timelinePrizes", title: "Prizes", date: " Sun 14:30 - 15:30",
            desc: `Winners will be announced and prizes distributed!`},
        // {id: "timelineJudge", title: "Judging/Showcase", date: "Sun 14:30 - 15:30",
    
        //     desc: `During this window, we will play all the demo videos over the livestream so the other groups can see what has been made.
        // <br><br>While we do this, the judges will make their way around various Discord voice channels, asking a couple of questions about the project.
        // This is another chance for you to show off, so please do make sure you're in a free voice channel while the judging is taking place!`},
        // {id: "timelineWinners", title: "Announce winners/Closing Ceremony", date: "Sun 15:20",
        //     desc: `Once judging has been finalised, we will announce the winners on the livestream, and then bring the hackathon to a close.
        // <br><br>We hope you've had a good time!`},
    ];

    data.forEach(e => {
        $(`#timeline-items`).append(`
        <a id="${e.id}" data-dismiss="modal" data-toggle="modal"
        data-target="#timelineModal">
            <li class="timeline-item" data-date="${e.date}">
                ${e.title}
            </li>
        </a>
        `);
        $(`#`+e.id).on("click", () => {
            $(`#timeline-modal-header`).html(e.title);
            $(`#timeline-modal-body`).html(e.desc);
        });
    });
}

$(function() { 
    loginPageEvents();
    scheduleEvents();
});