// select the number of elements to use in the visualization
let number = 50;

// declare an array with space for that number of elements
let initList = [];

// declare arrays to work with different algorithms
// initialize gives each one a copy of initList
let ordBub;
let ordSel;
let ordIns;
let ordMer;

let drawingInit;
let drawingBubble;
let drawingSelection;
let drawingInsertion;
let drawingMerge;

stopDrawing();
initList = giveRandom(initList);
initialize();

// initialize fps, later the user may be able to change it
let fps = 2;

// objects with the initial values for the algorithms
let init_bubble = {
	i: number - 2,
	j: 0
}

let init_selection = {
	i: 0,
	j: 0,
	smallest: ordSel[0],
	place: 0
}

let init_insertion = {
	i: 1,
	j: 0,
	selected: ordIns[1]
}

let i_bubble;
let j_bubble;
let i_selection;
let j_selection;
let smallest;
let place;
let i_insertion;
let j_insertion;
let selected;

resetValues();
startInit();

function newArray() {
	stopDrawing();
	initList = giveRandom(initList);
	initialize();
	resetValues();
	startInit();
}

function giveRandom(list) {
	// replaces/initializes the list with random values
	for (let i = 0; i < number; i++) {
		list[i] = Math.round(Math.random() * 100 + 1);
	}
	return list;
}

function initialize() {
	// gives each array a copy of initList
	ordBub = initList.slice();
	ordSel = initList.slice();
	ordIns = initList.slice();
	ordMer = initList.slice();
}

function stopDrawing() {
	// sets drawing to off, by the way this is the behaviour by default
	drawingInit = false;
	drawingBubble = false;
	drawingSelection = false;
	drawingInsertion = false;
	drawingMerge = false;
}

function startInit() {
	drawingInit = true;
}

function resetValues() {
	// resets/initializes all values to the default
	resetBubble();
	resetSelection();
	resetInsertion();
	// resetMerge();
}

function resetBubble() {
	// resets bubble's initial values for the algorithm
	i_bubble = init_bubble.i;
	j_bubble = init_bubble.j;
}

function resetSelection() {
	// resets selection's initial values for the algorithm
	i_selection = init_selection.i;
	j_selection = init_selection.j;
	smallest = init_selection.smallest;
	place = init_selection.place;
}

function resetInsertion() {
	// resets insertion's initial values for the algorithm
	i_insertion = init_insertion.i;
	j_insertion = init_insertion.j;
	selected = init_insertion.selected;
}


// create an array of buttons
let buttonNumber = 7;
let buttons = [buttonNumber];


function setup() {
	createCanvas(1200, 800);

	// create the relevant number of buttons
	let butW = (width - (buttonNumber - 1) * 20 - 40) / buttonNumber;
	for (let i = 0; i < buttonNumber; i++) {
		buttons[i] = new Button(20 + i*(butW + 20), 20, butW, i);
	}
}


function draw() {
	frameRate(fps);
	// draw the background
	background(150);

	// draw the buttons
	for (let i = 0; i < buttonNumber; i++) {
		buttons[i].draw();
	}

	if (drawingInit == true) {
		// draw the initial list
		display(initList);
	}

	else if (drawingBubble == true) {
		// draw the visialization of bubble sort algorithm
		if (i_bubble > 0) {
			if (j_bubble < i_bubble + 1) {
				if (ordBub[j_bubble] > ordBub[j_bubble + 1]) {
					// swap them
					ordBub = swap(ordBub, j_bubble, j_bubble + 1);
				}
				j_bubble++;
			}
			else {
				i_bubble--;
				j_bubble = 0;
			}
		}
		else {
			console.log('Bubble sort finished.');
			drawingBubble = false;
		}
		displayBub(ordBub, j_bubble, i_bubble);
	}

	else if (drawingSelection == true) {
		if (i_selection < number) {
			if (j_selection < number) {
				if (ordSel[j_selection] < smallest) {
					smallest = ordSel[j_selection];
					place = j_selection;
				}
				j_selection++;
			}
			else {
				swap(ordSel, i_selection, place);
				i_selection++;
				j_selection = i_selection;
				smallest = ordSel[j_selection];
				place = j_selection;
			}
		}
		else {
			console.log('Selection sort finished.');
			drawingSelection = false;
		}
		displaySel(ordSel, j_selection, place, i_selection);
	}

	else if (drawingInsertion == true) {
		if (i_insertion < number) {
			if (j_insertion < i_insertion) {
				// compare selected to j-th element
				if (selected < ordIns[j_insertion]) {
					//move all the content to the right
					for (let k = i_insertion; j_insertion < k; k--) {
						ordIns[k] = ordIns[k - 1];
					}
					// insert selected in its new place
					ordIns[j_insertion] = selected;
					j_insertion = i_insertion;
				}
				j_insertion++;
			}
			else {
				i_insertion++;
				j_insertion = 0;
				selected = ordIns[i_insertion];
			}
		}
		else {
			console.log('Insertion sort finished');
			drawingInsertion = false;
		}
		displayIns(ordIns, i_insertion, j_insertion);
	}
}

function swap(list, i, j) {
	// takes list and swaps the ith and the jth element in it
	let carrier = list[i];
	list[i] = list[j];
	list[j] = carrier;
	return list;
}

function display(list) {
	// takes a list and displays it, no colors or fancy stuff involved
	// generally used for the initial list
	for (let i = 0; i < number; i++) {
		// paint in light green
		fill(50, 205, 50);
		noStroke();
		rect(10 + i*20, height - 320 - 3*list[i], 15, 3*list[i]);
	}
}

function displayBub(list, comp, limit) {
	for (let i = 0; i < number; i++) {
		noStroke();
		if (i == comp || i == comp + 1) {
			// the ones being compared, in dark blue
			fill(25, 25, 112);
			rect(10 + i*20, height - 320 - 3*list[i], 15, 3*list[i]);
		}
		else if ( i > limit + 1) {
			// the ones already sorted, in light blue
			fill(45, 95, 225);
			rect(10 + i*20, height - 320 - 3*list[i], 15, 3*list[i]);
		}
		else {
			// the rest, not sorted, in light green
			fill(50, 205, 50);
			rect(10 + i*20, height - 320 - 3*list[i], 15, 3*list[i]);
		}


		rect(10 + i*20, height - 320 - 3*list[i], 15, 3*list[i]);
	}
}

function displaySel(list, j, place, exp) {
	// takes a list with information about selection sort and displays it
	for (let i = 0; i < number; i++) {
		noStroke();
		if (i == j) {
			// it is the column being checked, paint it dark blue
			fill(25, 25, 112);
			rect(10 + i*20, height - 320 - 3*list[i], 15, 3*list[i]);
		}
		else if (i == place) {
			// the smallest element, paint it black
			fill(0);
			rect(10 + i*20, height - 320 - 3*list[i], 15, 3*list[i]);
		}
		else if (i == exp) {
			// the one expecting to be removed, paint it red
			fill(255, 0, 0);
			rect(10 + i*20, height - 320 - 3*list[i], 15, 3*list[i]);
		}
		else {
			// paint the rest light blue
			fill(45, 95, 225);
			rect(10 + i*20, height - 320 - 3*list[i], 15, 3*list[i]);
		}
	}
}

function displayIns(list, final, check) {
	// takes the list and information about the state of insertion sort algorithm
	// and displays accordingly
	for (let i = 0; i < number; i++) {
		noStroke();
		if (i < final && i != check) {
			// belongs to the sorted part of the list, paint in light blue
			fill(45, 95, 225);
			rect(10 + i*20, height - 320 - 3*list[i], 15, 3*list[i]);
		}
		else if (i == final) {
			// the element waiting to be inserted, paint it red
			fill(255, 0, 0);
			rect(10 + i*20, height - 320 - 3*list[i], 15, 3*list[i]);
		}
		else if (i == check) {
			// the one being checked for insertion, paint it dark blue
			fill(25, 25, 112);
			rect(10 + i*20, height - 320 - 3*list[i], 15, 3*list[i]);
		}
		else {
			// rest of the elements, paint them in light green
			fill(50, 205, 50);
			rect(10 + i*20, height - 320 - 3*list[i], 15, 3*list[i]);
		}
	}
}


function mousePressed() {
	for (let i = 0; i < buttonNumber; i++) {
		if (buttons[i].beingPressed()) {
			if (i == 0) {
				// give a new array, stopd drawing and reset everything
				newArray();
			}
			if (i == 1) {
				// more fps
				fps++;
			}
			if (i == 2) {
				// less fps
				fps--;
			}
			if (i == 3) {
				drawingInit = false;
				drawingBubble = true;
			}
			if (i == 4) {
				drawingInit = false;
				drawingSelection = true;
			}
			if (i == 5) {
				drawingInit = false;
				drawingInsertion = true;
			}
			if (i == 6) {
				drawingInit = false;
				drawingMerge = true;
			}
		}
	}
}


class Button {
	constructor(x, y, w, i) {
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = 40;
		if (i == 0) {
			this.label = 'new_array'
		}
		else if (i == 1) {
			this.label = 'more_fps'
		}
		else if (i == 2) {
			this.label = 'less_fps'
		}
		else if (i == 3) {
			this.label = 'start_bubble'
		}
		else if (i == 4) {
			this.label = 'start_selection'
		}
		else if (i == 5) {
			this.label = 'start_insertion'
		}
		else if (i == 6) {
			this.label = 'start_merge'
		}
	}

	draw() {
		fill(255);
		stroke(0);
		rect(this.x, this.y, this.width, this.height);
		fill(0);
		noStroke();
		text(this.label, this.x + 20, this.y + 25);
	}

	beingPressed() {
		if (this.xInside() && this.yInside()) {
			return true;
		}
		else {
			return false;
		}
	}

	xInside() {
		return mouseX > this.x && mouseX < this.x + this.width;
	}

	yInside() {
		return mouseY > this.y && mouseY < this.y + this.height;
	}
}

// --------------------------------------------------------------------
// REVIEW THE CODE BELOW THIS LINE
// --------------------------------------------------------------------

/*
function areEqual(list1, list2) {
	// receives two lists and checks if they are equal element to element
	// assumes the length of both are the same
	let n = list1.length;
	for (let i = 0; i < n; i++) {
		if (list1[i] != list2[i]) {
			return false;
		}
	}
	return true;
}
*/

function bubbleSort(list) {
	// implements bubble sort algorithm
	let n = list.length;
	let carrier;

	for (let i = n - 2; i > 0; i--) {
		for (let j = 0; j < i + 1; j++) {
			// compare the jth and the (j+1)th element and swap them if needed
			if (list[j] > list[j + 1]) {
				// swap them
				carrier = list[j];
				list[j] = list[j + 1];
				list[j + 1] = carrier;
			}
		}
	}
	return list;
}

function selectionSort(list) {
	// implements selection sort algorithm
	let n = list.length;
	let smallest;
	let place = 0;

	for (let i = 0; i < n; i++) {
		smallest = list[i];
		place = i;
		for (let j = i; j < n; j++) {
			if (list[j] < smallest) {
				smallest = list[j];
				place = j;
			}
		}
		list[place] = list[i];
		list[i] = smallest;
	}
	return list;
}

function insertionSort(list) {
	// implements insertion sort algorithm
	let n = list.length;
	let selected;

	for (let i = 1; i < n; i++) {
		selected = list[i];
		for (let j = 0; j < i; j++) {
			// compare to the first part, which is already sorted and insert where
			// it corresponds
			if (selected < list[j]) {
				// first move all the content in the rest of the ordered array, to the right
				for (let k = i; j < k; k--) {
					list[k] = list[k - 1];
				}
				// now insert the selected element in the freed up place for it
				list[j] = selected;
			}
		}
	}
	return list;
}


//---------------------------------------------------------------------
// this code is still not being used
/*
// function mergeSort and utils related to it
function mergeSort(list) {
	// merge sort recursive algorithm
	let list1;
	let list2;
	let list1ord;
	let list2ord;
	let middle;
	if (list.length < 2) {
		return list;
	}
	else {
		// first divide by two
		middle = list.length / 2;
		if (list.length % 2 == 0) {
			// then exact division of the list into two halves
			list1 = extract(list, 0, middle);
			list2 = extract(list, middle, list.length);
		}
		else {
			list1 = extract(list, 0, Math.round(middle) + 1);
			list2 = extract(list, Math.round(middle) + 1, list.length);
		}
		list1ord = mergeSort(list1);
		list2ord = mergeSort(list2);
		return merge(list1ord, list2ord);
	}
}

function extract(list, beg, end) {
	// extract the elements in list that begin in index 'beg' (included) and
	// end in index 'end' (excluded)
	let newList = [end - beg];
	for (let i = 0; i < end - beg; i++) {
		newList[i] = list[beg + i];
	}
	return newList;
}

function merge(list1, list2) {
	// go through each of the lists comparing element to element
	let n = list1.length;
	let m = list2.length;
	let pointer1 = 0;
	let pointer2 = 0;
	let newList = [n + m];

	for (let i = 0; i < n + m; i++) {
		if (pointer1 < n && pointer2 < m) {
			// I can access the next elements in both arrays
			if (list1[pointer1] <= list2[pointer2]) {
				newList[i] = list1[pointer1];
				pointer1++;
			}
			else {
				newList[i] = list2[pointer2];
				pointer2++;
			}
		}
		else {
			// break out of the for loop because some indexes cannot be accessed
			break;
		}
	}
	// this is the last position of newList that was written
	let leftAt = pointer1 + pointer2;

	if (pointer1 == n) {
		// append the second array as is to what we already have
		for (let j = pointer2; j < m; j++) {
			newList[leftAt + j] = list2[j];
		}
	}
	else if (pointer2 == m) {
		// append the first array as is to what we already have
		for (let j = pointer1; j < n; j++) {
			newList[leftAt + j] = list1[j];
		}
	}
	return newList;
}
*/
