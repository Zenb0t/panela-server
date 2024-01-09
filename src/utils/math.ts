export function fractionToDecimal(fraction: string): number {
	const [numerator, denominator] = fraction.split("/").map(Number);
	return numerator / denominator;
}

export function multiplyExpression(expression: string): number {
	const [factor1, factor2] = expression.split(" x ").map(Number);
	return factor1 * factor2;
}
