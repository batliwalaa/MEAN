const delay = async (timeout: number, func: () => Promise<void>): Promise<void> => {
    return new Promise((resolve, reject) => {
        const id = setTimeout(async () => {
            try {
                await func();

                clearTimeout(id);

                resolve();
            } catch(e) {
                reject(e);
            }
        }, timeout);
    });
}

export default delay;