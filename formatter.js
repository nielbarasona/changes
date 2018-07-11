function init(){
	console.log("script initialized")
}

init()

<!-- File is added to File List -->
function handleFiles(evt) {
	console.log(evt)
	const reader = new FileReader()
	reader.onload = function() {
		Papa.parse(reader.result, {
			complete: (results, file) => {
				console.log("Parsing Complete:", results, file)
			}
		})
	}
	reader.readAsText(evt[0])
}

<!-- File Dropbox -->
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