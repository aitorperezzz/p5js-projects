// Auxiliary functions for matrix manipulation

function matrixInverse(matrix) {
	// the matrix is supposed to be squared
	let n = matrix.length;
	let result = [];
	let det = matrixDet(matrix);
	if (det != 0) {
		for (let i = 0; i < n; i++) {
			let newLine = [];
			for (let j = 0; j < n; j++) {
				newLine.push(Math.pow(-1, 2 + i + j) * matrixDet(matrixMinor(matrix, j, i)) / det);
			}
			result.push(newLine);
		}

		return result;
	}
}

function matrixDet(matrix) {
	// supposes the input is a square matrix
	let det = 0;
	if (matrix.length == 1) {
		// return that element itself
		det = matrix[0][0];
	}
	else {
		for (let i = 0; i < matrix.length; i++) {
			det += Math.pow(-1, 2 + i) * matrix[0][i] * matrixDet(matrixMinor(matrix, 0, i));
		}
	}
	return det;
}

function matrixMinor(matrix, i, j) {
	// Returns the minor of the matrix, corresponding to
	// indices i and j
	// Remove the i-th row in the first place
	let result = matrixCopy(matrix);
	result.splice(i, 1);

	// remove the j-th element in each row
	for (let k = 0; k < result.length; k++) {
		result[k].splice(j, 1);
	}
	return result;
}

function matrixProduct(matrix1, matrix2) {
	let result = [];
	for (let i = 0; i < matrix1.length; i++) {
		let newLine = [];
		for (let j = 0; j < matrix2[0].length; j++) {
			let newElement = 0;
			for (let k = 0; k < matrix1[0].length; k++) {
				newElement += matrix1[i][k] * matrix2[k][j];
			}
			newLine.push(newElement);
		}
		result.push(newLine);
	}
	return result;
}

function matrixCopy(matrix) {
	// this function is needed because the assignment operator, when used with
	// arrays, copies references and not values. I use slice() method on each
	// of the lines of the original matrix so that the original matrix is
	// not affected by changes to a copy of it
	let result = [];

	// deep copy every subarray into the newly created result array
	for (let i = 0; i < matrix.length; i++) {
		let newline = matrix[i].slice();
		result.push(newline);
	}
	return result;
}

function matrixBasis(vector1, vector2, vector3) {
	// Receives three vectors and outputs a matrix where each column is
	// one of the vectors, in the order specified
	let utils = [vector1, vector2, vector3];
	let result = [];
	let n = vector1.length;

	for (let i = 0; i < n; i++) {
		let newLine = [];
		for (let j = 0; j < n; j++) {
			newLine.push(utils[j][i]);
		}
		result.push(newLine);
	}
	return result;
}
