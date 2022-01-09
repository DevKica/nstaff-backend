interface elementInput {
    message: string;
}

const errorsHandler = (data: []) => {
    const output: string[] = [];
    data.forEach((e: elementInput) => {
        output.push(e.message);
    });
    return output;
};

export default errorsHandler;
