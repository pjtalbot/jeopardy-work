const width = 6;
const height = 5;

let categories = [];
let randomQuestions = [];
let categoryIds = [];
let boardArr = [];

async function getCategoryIds() {
	if (!document.getElementById('load')) {
		showLoadingView();
	}
	// use "random question" on api and access catgory ID of each to create array of random category Id's
	// Stores these Ids in "categoryIds" array

	for (let i = 0; i < width; i++) {
		let response = await axios.get('http://jservice.io/api/random');
		randomQuestions.push(response.data);
		categoryIds.push(response.data[0].category_id);
	}

	// loops thought categoryIds array, retreives clues from API with getClues function that accepts
	for (id of categoryIds) {
		getClues(id);
	}
}

async function getClues(catId) {
	let response = await axios.get(`https://jservice.io/api/clues?&category=${catId}`);

	// Makes start button only after data is loaded

	if (!document.getElementById('start')) {
		makeStartButton();
	}

	hideLoadingView();

	// This works but sometimes there are "dud" questions. A complete object, but the .question is empty = '' --fixed
	// Some values from API are returned are identicle BUT with different ids
	let randIndexes = [];
	let column = [];
	let clues = response.data;
	// answerArr is used to avoid duplicates with different ID's. before a clues is added to Column, its answer is scanned against the answers already added.
	let answerArr = [];

	let loopCounter = 0;

	while (randIndexes.length < height) {
		if (loopCounter < 300) {
			let random = Math.floor(Math.random() * clues.length);
			loopCounter++;
			if (
				randIndexes.indexOf(random) === -1 &&
				// several questions from the api are blank making them useless. This checks for empty questions
				clues[random].question !== '' &&
				// same as above, but for answers
				clues[random].answer !== '' &&
				// if the clue's answer is already in the answerArr it is a rogue duplicate
				answerArr.indexOf(clues[random].answer) === -1
			) {
				randIndexes.push(random);
				answerArr.push(clues[random].answer);
			} else {
				console.log(`error Caught at category ID ${catId} and clue ID ${clues[random].id}`);
			}
		} else {
			alert('please try again');
			break;
		}
		// collect random unique index numbers to suffle clues
	}
	for (num of randIndexes) {
		// return 5 random questions from category
		column.push(clues[num]);
	}
	boardArr.push(column);
}

function clearData() {
	categories = [];
	randomQuestions = [];
	categoryIds = [];
	boardArr = [];
}

getCategoryIds();

async function buildHTMLBoard() {
	let table = document.createElement('table');
	let gameContainer = document.createElement('div');
	document.body.appendChild(gameContainer);
	gameContainer.appendChild(table);
	table.innerHTML += `<thead> <tr></tr>     
    </thead>
    <tbody>
    </tbody>`;

	for (let cat of boardArr) {
		$('table').prepend(
			`<th class="category ${cat[0].category_id}" id="head${cat[0].category_id}">${cat[0].category.title}</th>`
		);
	}

	fillBoard();

	// builds tables and handles card click by adding event listener to the parent table
	// had trouble getting the event listener to work in a seperate function. JQuery problem? any ideas?

	$('table').on('click', 'td', function(e) {
		let classes = e.target.classList;
		let indexes = e.target.id.split('').map(Number);
		// disables event listener by adding class, then removing after answer is revealed
		if (classes.contains('frozen')) {
			return;
		}
		e.target.innerHTML = `${boardArr[indexes[1]][indexes[0]].question}`;
		$(this).removeClass('hidden');
		$('td').addClass('frozen');
		console.log('clicked');

		// seperate id of indexes, convert each character from string to Num and convert into array.

		setTimeout(function() {
			e.target.innerHTML = `${boardArr[indexes[1]][indexes[0]].answer}`;
			$('td').removeClass('frozen');
		}, 2000);
	});
}

function fillBoard() {
	for (let c = 0; c < height; c++) {
		// create row
		let row = $('<tr>');
		for (let r = width - 1; r >= 0; r--) {
			// presents alert if data is not valid
			if (!boardArr[r][c]) {
				alert(`board array j ${r} and i ${c} does not exist`);
			}
			// adding unique ID of position in the boardArr to access object methods like "question" of that specific "clue" object
			let $td = $('<td>', {
				id: `${c}${r}`
			}).html(`?`);
			row.append($td);
		}
		$('table').append(row);
	}
	$('td').addClass('hidden');
}

function makeStartButton() {
	let startButton = document.createElement('button');
	startButton.setAttribute('id', 'start');
	startButton.innerText += 'Start';
	startButton.addEventListener('click', function(e) {
		e.preventDefault();
		buildHTMLBoard();
		$('button').remove();
		makeClearButton();
	});
	document.body.append(startButton);
}

function makeClearButton() {
	let clearButton = document.createElement('button');
	clearButton.innerText += 'Clear';
	clearButton.addEventListener('click', function(e) {
		e.preventDefault();

		clearData();
		getCategoryIds();
		$('table').remove();
		$('button').remove();
	});
	document.body.append(clearButton);
}

function showLoadingView() {
	let load = document.createElement('span');
	load.innerText = 'Loading Jeopardy';
	load.setAttribute('id', 'load');
	document.body.append(load);
}

function hideLoadingView() {
	if (document.getElementById('load')) {
		$('#load').remove();
	}
}

async function setupAndStart() {}
