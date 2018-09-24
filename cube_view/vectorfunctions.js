// Auxiliary functions for vector manipulation

function vectorNeg(vector) {
	// receives a vector and changes sign of all elements
	let result = vector.slice();

	for (let i = 0; i < vector.length; i++) {
		if (result[i] != 0) {
			result[i] = - result[i];
		}
	}
	return result;
}

function vectorSum(vector1, vector2) {
	// Receives two vectors and sums element to element
	// The two vectors are supposed to have equal length
	let result = [];
	for (let i = 0; i < vector1.length; i++) {
		result.push(vector1[i] + vector2[i]);
	}
	return result;
}

function vectorProduct(vector1, vector2) {
	// computes the vector product of two given vectors
	let result = [];
	let utils = [[0, 0, 0], vector1.slice(), vector2.slice()];
	result.push(matrixDet(matrixMinor(utils, 0, 0)));
	result.push(- matrixDet(matrixMinor(utils, 0, 1)));
	result.push(matrixDet(matrixMinor(utils, 0, 2)));

	return result;
}

function vectorCol(vector) {
	// Returns the matrix that represents the vector as a column
	let result = [];
	for (let i = 0; i < vector.length; i++) {
		result.push([vector[i]]);
	}
	return result;
}

function vectorScalar(num, vector) {
	// Multiply the number by the vector
	let result = [];
	for (let i = 0; i < vector.length; i++) {
		result.push(num * vector[i]);
	}
	return result;
}
