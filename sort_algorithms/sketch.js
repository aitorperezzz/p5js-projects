// select the number of elements to use in the visualization
var number = 50;

// create an array with space for 1that number of elements
var list = [number];

// declare arrays to store the results of computation
var ordBub = [number];
var ordIns = [number];
var ordSel = [number];
var ordMer = [number];

function setup() {
	createCanvas(800, 600);

	// put random integer numbers inside the array (use random and round)
	for (i = 0; i < number; i++) {
		list[i] = Math.round(random(1, 100));
	}

	console.log('Initial list: ', list);
	ordBub = bubbleSort(list);
	ordIns = insertionSort(list);
	ordSel = selectionSort(list);
	ordMer = mergeSort(list);
	console.log('ordered by Bubble: ', ordBub);
	console.log('Bubble and Insertion give same results', areEqual(ordBub, ordIns));
	console.log('Bubble and Selection give same results', areEqual(ordBub, ordSel));
	console.log('Bubble and Merge give same results', areEqual(ordBub, ordMer));
}

function draw() {
	// visualization still not implemented
}

function areEqual(list1, list2) {
	// receives two lists and checks if they are equal element to element
	// assumes the length of both are the same
	var n = list1.length;
	for (i = 0; i < n; i++) {
		if (list1[i] != list2[i]) {
			return false;
		}
	}
	return true;
}

function bubbleSort(list) {
	// implements bubble sort algorithm
	var n = list.length;
	var carrier;

	for (i = n - 2; i > 0; i--) {
		for (j = 0; j < i + 1; j++) {
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

function insertionSort(list) {
	// implements insertion sort algorithm
	var n = list.length;
	var selected;

	for (i = 1; i < n; i++) {
		selected = list[i];
		for (j = 0; j < i; j++) {
			// compare to the first part, which is already sorted and insert where
			// it corresponds
			if (selected < list[j]) {
				// first move all the content in the rest of the ordered array, to the right
				for (k = i; j < k; k--) {
					list[k] = list[k - 1];
				}
				// now insert the selected element in the freed up place for it
				list[j] = selected;
			}
		}
	}
	return list;
}

function selectionSort(list) {
	// implements selection sort algorithm
	var n = list.length;
	var smallest;

	for (i = 0; i < n; i++) {
		smallest = list[i];
		for (j = i; j < n; j++) {
			if (list[j] < smallest) {
				smallest = list[j];
			}
		}
		list[i] = smallest;
	}
	return list;
}



// function mergeSort and utils related to it
function mergeSort(list) {
	// merge sort recursive algorithm
	var list1;
	var list2;
	var list1ord;
	var list2ord;
	var middle;
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
	var newList = [end - beg];
	for (i = 0; i < end - beg; i++) {
		newList[i] = list[beg + i];
	}
	return newList;
}

function merge(list1, list2) {
	// go through each of the lists comparing element to element
	var n = list1.length;
	var m = list2.length;
	var pointer1 = 0;
	var pointer2 = 0;
	var newList = [n + m];

	for (i = 0; i < n + m; i++) {
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
	var leftAt = pointer1 + pointer2;
	
	if (pointer1 == n) {
		// append the second array as is to what we already have
		for (j = pointer2; j < m; j++) {
			newList[leftAt + j] = list2[j];
		}
	}
	else if (pointer2 == m) {
		// append the first array as is to what we already have
		for (j = pointer1; j < n; j++) {
			newList[leftAt + j] = list1[j];
		}
	}
	return newList;
}
