export const fractionPattern = /(\d+(?:\.\d+)?\/\d+)/;
export const rangePattern = /(\d+-\d+)/;
export const decimalPattern = /(\d+\.\d+)/;
export const mixedFractionPattern = /(\d+\s+\d+\/\d+)/;
export const multiplicationPattern = /(\d+ x \d+)/;
export const unicodeFractionPattern = /([¼½¾⅓⅔⅛⅜⅝⅞])/;
export const wholeNumberPattern = /(\d+)/;

export const masterPattern =
	/(\d+(?:\.\d+)?\/\d+|\d+-\d+|\d+\.\d+|\d+\s*\d*\/\d*|\d+ x \d+|[¼½¾⅓⅔⅛⅜⅝⅞]|\d+)/;

export const combinedPattern = new RegExp(
	`(${fractionPattern.source}|${rangePattern.source}|${decimalPattern.source}|${mixedFractionPattern.source}|${multiplicationPattern.source}|${unicodeFractionPattern.source}|${wholeNumberPattern.source})`
);
