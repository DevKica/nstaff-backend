const Joi = require("joi").extend(require("@joi/date"));

const timeRegex = `^([0,1]{1}[0-9]{1}|[2]{1}[0-3]{1})\:([0-5]{1}[0-9]{1})$`;

export const workDayCheck = {
    date: Joi.date().required().label("Date").format("YYYY-MM-DD").min("1900-01-01").message({
        "date.min": `"Date" must be greater than or equal to 1900-01-01`,
    }),
    startOfWork: Joi.string().required().label("Start of work").pattern(new RegExp(timeRegex)).messages({
        "string.pattern.base": `Invalid Format of "Start of work"`,
    }),
    endOfWork: Joi.string().required().label("End of work").pattern(new RegExp(timeRegex)).messages({
        "string.pattern.base": `Invalid Format of "End Of Work"`,
    }),
    tipCash: Joi.number().required().label("Tip in cash").min(0),
    tipCard: Joi.number().required().label("Tip on card").min(0),
    receipts: Joi.number().required().label("Receipts").min(0),
};

export const workDaySchema = Joi.object({
    ...workDayCheck,
});
