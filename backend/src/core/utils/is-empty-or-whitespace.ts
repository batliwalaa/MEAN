const isEmptyOrWhitespace = (value: any): boolean => {
    return value === undefined || value === null || (/^ *$/).test(value);
};

export default isEmptyOrWhitespace;
