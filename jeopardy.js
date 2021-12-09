// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

const width = 5;
const height = 5;

let categories = [];
let randomQuestions = [];
let categoryIds = [];
let boardArr = [];

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
	// use "random question" on api and access catgory ID of each to create array of random category Id's

	for (let i = 0; i < width; i++) {
		let response = await axios.get('http://jservice.io/api/random');
		console.log(response.data[0].category_id);
		randomQuestions.push(response.data);
		categoryIds.push(response.data[0].category_id);
	}

	for (id of categoryIds) {
		getCategory(id);
	}
}

function clearData() {}

getCategoryIds();

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
	let response = await axios.get(`https://jservice.io/api/clues?&category=${catId}`);
	let randIndexes = [];
	let column = [];
	let clues = response.data;

	while (randIndexes.length < width) {
		// collect random unique index numbers to
		let random = Math.floor(Math.random() * clues.length);
		if (randIndexes.indexOf(random) === -1) {
			randIndexes.push(random);
		}
	}
	for (num of randIndexes) {
		// return 5 random questions from category
		column.push(clues[num]);
	}

	boardArr.push(column);
}

// for (let i = 0; i < categoryIds.length; i++) {
// 	getCategory(categoryIds[i]);
// }

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {}

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

	for (let i = 0; i < width; i++) {
		// create row
		let row = $('<tr>');
		for (let j = height - 1; j >= 0; j--) {
			if (!boardArr[j][i]) {
				alert(`board array j ${j} and i ${i} does not exist`);
			}
			// loop through
			// use cat.[i][j].question
			let $td = $('<td>', {
				id: `${i}${j}`
			}).html(`${boardArr[j][i].question}`);

			//

			row.append($td);
		}

		$('table').append(row);
	}

	$('td').addClass('hidden');

	$('table').on('click', 'td', function(e) {
		$(this).removeClass('hidden');
		console.log('clicked');
		let indexes = e.target.id.split('').map(Number);
		console.log(indexes);
		console.log(e.target.id);
		setTimeout(function() {
			e.target.innerHTML = `${boardArr[indexes[1]][indexes[0]].answer}`;
		}, 2000);
	});
}

function makeStartButton() {
	let startButton = document.createElement('button');
	startButton.innerText += 'Start';
	startButton.addEventListener('click', function(e) {
		e.preventDefault();
		buildHTMLBoard();
		$('button').remove();
		makeClearButton();
	});
	document.body.append(startButton);
	// remove button or some alternative
}

function makeClearButton() {
	let clearButton = document.createElement('button');
	clearButton.innerText += 'Clear';
	clearButton.addEventListener('click', function(e) {
		e.preventDefault();
		$('table').remove();
		$('button').remove();

		makeStartButton();
	});
	document.body.append(clearButton);
}

makeStartButton();

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
	// use Jquery event delegation to the PARENT element (table) to add .on('click') to all <td>s
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO
