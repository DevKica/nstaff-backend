export const messageFormat = (message: string | string[], status: number) => {
    if (typeof message == "string") return { message: [message], status };
    return { message, status };
};
