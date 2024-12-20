const words = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty'
];
words[30] = 'Thirty';
words[40] = 'Forty';
words[50] = 'Fifty';
words[60] = 'Sixty';
words[70] = 'Seventy';
words[80] = 'Eighty';
words[90] = 'Ninety';

const amountToWords = (amount: number | string) : string => {
    const parts = amount.toString().split('.');
    const amountPart = parts[0].split(',').join();
    const decimalPart = parts.length === 2 ? parts[1] : '';
    const receivedArray = amountPart.split('');
    const decimalReceivedArray = decimalPart.split('');
    const tensArray = [0, 2, 4, 7];

    let dArr: Array<number>;
    let arr: Array<number>;    
    let value: number = 0;
    let amtAsWords: string = '';

    if (decimalReceivedArray.length === 1) decimalReceivedArray.push('0');

    const normalizedArray = (array: Array<number>, checkArray: Array<number>): Array<number> => {
        for (let i = 0; i < array.length; i++) {
            if (checkArray.includes(i)) {
                if (array[i] === 1) {
                    array[i+1] = 10 + array[i+1];
                    array[i] = 0;
                }
            }
        }

        return array
    }

    const mapArray = (from: Array<any>, size: number): Array<number> => {
        const array: Array<number> = Array.apply(null, Array(size)).map(() => 0);
        const reverse = from.reverse();

        for (let i = 0; i < reverse.length; i++) {
            array[(array.length - 1) - i] = Number(reverse[i]);
        }

        return array;
    }
    const fnCrores = (value: number, array: Array<number>, index: number): string => {
        if (value !== 0) {
            if ((index === 1) || (index === 0 && array[1] === 0)) {
                return 'Crore ';
            }
        }
        return '';
    }
    const fnLakhs = (value: number, array: Array<number>, index: number): string => {
        if (value !== 0) {
            if ((index === 3) || (index === 2 && array[3] === 0)) {
                return 'Lakh ';
            }
        }
        return '';
    }
    const fnThousand = (value: number, array: Array<number>, index: number): string => {
        if (value !== 0) {
            if ((index === 5) || (index === 4 && array[5] === 0)) {
                return 'Thousand ';
            }
        }
        return '';
    }

    const fnHundred = (value: number, index: number): string => {
        if (value !== 0 && index === 6) {
            return 'Hundred ';
        }
        return '';
    }
    arr = mapArray(receivedArray, 9);
    dArr = mapArray(decimalReceivedArray, 2);

    arr = normalizedArray(arr, tensArray);
    dArr = normalizedArray(dArr, [0]);

    const hasMain = arr.filter(i => i > 0).length > 0;
    const hasFraction = dArr.filter(i => i > 0).length > 0;

    if (!hasMain && !hasFraction) return 'Rupees Zero Only';

    if (hasMain) amtAsWords = 'Rupees ';
    
    for (let i = 0; i < arr.length; i++) {
        value = arr[i] * (tensArray.includes(i) ? 10 : 1);
        if (value != 0) {
            amtAsWords += words[value] + ' ';
        }

        amtAsWords += fnCrores(value, arr, i) + fnLakhs(value, arr, i) + fnThousand(value, arr, i) + fnHundred(value, i);
    }

    if (!hasFraction) {
        return amtAsWords + 'And Paisa Zero Only';
    }

    if(hasFraction) {
        if (hasMain) amtAsWords += 'And '
        amtAsWords += 'Paisa ';
    }

    for (let i = 0; i < dArr.length; i++) {
        value = dArr[i] * (i === 0 ? 10 : 1);
        if (value != 0) {
            amtAsWords += words[value] + ' ';
        }
    }
    return amtAsWords + 'Only';
}

export default (amount: number | string) => amountToWords(amount);
