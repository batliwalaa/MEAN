const generateRandomCharacters = async (length: number): Promise<string> => {
    return new Promise((resolve, _) => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return resolve(result);
    });
};

export default generateRandomCharacters;
