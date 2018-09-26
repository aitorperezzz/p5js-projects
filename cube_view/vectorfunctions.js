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

function vectorRow(vector) {
	// Receives a column vector and returns a row vector
	let result = [];
	result.push(vector[0][0]);
	result.push(vector[1][0]);
	result.push(vector[2][0]);
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

function vectorNorm(vector) {
	// Receives a vector and outputs the norm
	let norm = 0;
	for (let i = 0; i < vector.length; i++) {
		norm += Math.pow(vector[i], 2);
	}
	return Math.sqrt(norm);
}

function vectorNormalize(vector) {
	// Receives a vector and normalizes it
	let norm = vectorNorm(vector);
	return vectorScalar(1/norm, vector);
}
