const Joi = require("joi").extend(require("@joi/date"));

export const rateCheck = {
    rate: Joi.number().required().label("Rate").min(0),
};

export const rateSchema = Joi.object({
    ...rateCheck,
});

export const monthlyRateCheck = {
    month: Joi.date().required().label("Month").format("YYYY-MM").min("1900-01").message({
        "date.min": `"Month" must be greater than or equal to 1900-01`,
    }),
    ...rateCheck,
};

export const monthlyRateSchema = Joi.object({
    ...monthlyRateCheck,
});
