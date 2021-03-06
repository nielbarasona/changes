function init(){
	console.log("script initialized");
	asdf = document.querySelector("#dropbox");
	card_list = document.querySelector("#card_list");
}

init()

// File is added to File List
function handleFiles(evt) {
	// console.log(evt)
	const reader = new FileReader()
	reader.onload = function() {
		Papa.parse(reader.result, {
			complete: (results, file) => {
				process(results)
			}
		});
	}
	reader.readAsText(evt[0])
}

// File Dropbox from UIKit
var dropbox;

dropbox = document.getElementById("dropbox");
dropbox.addEventListener("dragenter", dragenter, false);
dropbox.addEventListener("dragover", dragover, false);
dropbox.addEventListener("drop", drop, false);

function dragenter(e) {
	e.stopPropagation();
	e.preventDefault();
}

function dragover(e) {
	e.stopPropagation();
	e.preventDefault();
}

function drop(e) {
	e.stopPropagation();
	e.preventDefault();

	var dt = e.dataTransfer;
	var files = dt.files;

	handleFiles(files);
}

// Processing

function process(csv) {
	list = new Change_List(csv.data)

	if (document.querySelector(".uk-table").hasAttribute("hidden")) {
		document.querySelector(".uk-table").removeAttribute("hidden")
	}

	for (let change in list.changes) {
		add_change_to_page(list.changes[change])
	}
}

function add_change_to_page(change) {
	let table, new_row, change_number, start_time, description

	table = document.querySelector("tbody")

	new_row = document.createElement("tr")
	
	change_number = document.createElement("td")
	change_number.textContent = change.change_number
	change_number.classList.add("uk-text-nowrap")

	start_time = document.createElement("td")
	start_time.textContent = change.time_until
	setInterval(function() {
		start_time.textContent = change.time_until
	}, 1000)
	start_time.classList.add("uk-text-nowrap")

	description = document.createElement("td")
	description.textContent = change.description

	new_row.appendChild(change_number)
	new_row.appendChild(start_time)
	new_row.appendChild(description)

	if (change.start_time.isBefore()) {
		new_row.classList.add("uk-background-secondary")
	}

	table.appendChild(new_row)
}

// Change List Object
function Change_List(change_list) {
	this.changes = [];

	for (i = 0; i < change_list.length - 1; i++) {
		this.changes[i] = new Change(change_list[i])
	}

	this.changes.sort(function(a, b) {
		return a.start_time.diff(b.start_time)
	})

	function Change(change_record) {
		let date_format = function(string) {
			let start_time = string.split("  ");
			let hour

			let date_split = start_time[0].split("/")
			let time_split = start_time[1].split(":")

			time_split[0] = time_split[0].trim() 

			if (time_split[2].indexOf("PM") > -1) {
				hour = parseInt(time_split[0]) + 12
				if (hour == 24) {
					hour = 12
				}
			} else {
				hour = parseInt(time_split[0])
				if (hour == 12) {
					hour = 0
				}
			}

			let year = 	parseInt(date_split[2]),
				month = parseInt(date_split[0]),
				day = 	parseInt(date_split[1]),
				min = 	parseInt(time_split[1]);
			return(year + "-" + month + "-" + day + " " + hour + ":" + min)
		}

		this.change_number = change_record[19],
		this.start_time = moment(date_format(change_record[35]))
		this.end_time = moment(date_format(change_record[36]))
		this.manager = change_record[33]
		this.assignee = change_record[34]
		this.description = change_record[37]

		Object.defineProperty(this, 'time_until', {
			get: function() {
				let hours = this.start_time.diff(moment(), 'hours')
				// if (hours < 10) {
				// 	hours = "0" + hours
				// }
				let minutes = this.start_time.diff(moment(), 'minutes') % 60
				// if (minutes < 10) {
				// 	minutes = "0" + hours
				// }
				let seconds = this.start_time.diff(moment(), 'seconds') % 60
				// if (seconds < 10) {
				// 	seconds = "0" + hours
				// }
				return (hours + "h " + minutes + "m " + seconds + "s")
			}
		});
	}
}

/*-----TODO-----
Processing
	Allow for uploading multiple files.

Appearance
	Make the uploader change appearance when a file is added.
		Possibly will have to upload multiple files.
	Make Countdown until change is in effect.
	Change color of card to Red when Change in Effect.
	Grey Out (Or otherwise make less visual) change when it has
		been completed.
	Change time to time remaining once change has started.
	Once Change is Complete change time to "COMPLETED" and stop
		timer

Considerations
	The time section currently has a bootleg way of converting 
		from 12HR to 24HR. Possibly look into changing this so
		the time format handles this so there's no possibility
		of errors.
*/