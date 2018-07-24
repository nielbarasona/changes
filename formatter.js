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

// File Dropbox
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

	for (let change in list.changes) {
		add_change_to_page(list.changes[change])
	}
}

function add_change_to_page(change) {
	let new_div, description, title, card_grid, start_time, header

	card_grid = document.querySelector(".uk-grid")

	new_div = document.createElement("div");
	new_div.classList.add("uk-card", "uk-card-default", "uk-width-1-1", "uk-card-body")
	
	header = document.createElement("div")
	header.classList.add("uk-card-header", "uk-margin-remove-right", "uk-margin-remove-left", "uk-padding-remove")

	title = document.createElement("h3")
	title.classList.add("uk-card-title", "uk-margin-remove-bottom", "uk-margin-remove-right", "uk-margin-remove-left")
	title.textContent = change.change_number

	start_time = document.createElement("p")
	start_time.classList.add("uk-margin-remove-top", "uk-margin-remove-right", "uk-margin-remove-left")
	start_time.textContent = change.start_time
	
	description = document.createElement("p")
	description.textContent = change.description

	header.appendChild(title)
	header.appendChild(start_time)

	new_div.appendChild(header)
	new_div.appendChild(description)

	card_grid.appendChild(new_div)
}

// Change List Object
function Change_List(change_list) {
	this.changes = [];

	for (i = 0; i < change_list.length - 1; i++) {
		this.changes[i] = create_change(change_list[i])
	}

	function create_change(change_record) {
		return {
			change_number: change_record[19],
			start_time: new Date(date_format(change_record[35])),
			end_time: new Date(date_format(change_record[36])),
			manager: change_record[33],
			assignee: change_record[34],
			description: change_record[37]
		}

		function date_format(string) {
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
				month = parseInt(date_split[1]),
				day = 	parseInt(date_split[0]),
				min = 	parseInt(time_split[1]);

			return(new Date(year, month, day, hour, min))
		}
	}
}

/* Animation and selecting
asdf = document.querySelector("#dropbox")
asdf.classList.add("uk-animmation-reverse", "uk-animation-fade")
*/

/*-----TODO-----
Processing
	Sort function
		Sort by start time.

Appearance
	Make the uploader change appearance when a file is added.
		Possibly will have to upload multiple files.

Considerations
	The time section currently has a bootleg way of converting 
		from 12HR to 24HR. Possibly look into changing this so
		the time format handles this so there's no possibility
		of errors.
*/