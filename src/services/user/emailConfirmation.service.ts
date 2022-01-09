import EmailConfirmationModel, { emailConfirmationCreateInput, emailConfirmationFilter } from "../../models/emailConfirmation.model";

export async function createEmailConfirmation(input: emailConfirmationCreateInput) {
    try {
        const emailConfirmationObject = await EmailConfirmationModel.create(input);
        return emailConfirmationObject;
    } catch (e) {
        return null;
    }
}

export async function findEmailConfirmation(query: emailConfirmationFilter) {
    try {
        const emailConfirmationObject = await EmailConfirmationModel.findOne(query).lean();
        return emailConfirmationObject;
    } catch (e) {
        return null;
    }
}

export async function deleteEmailConfirmation(query: emailConfirmationFilter) {
    try {
        const deleteStatus = await EmailConfirmationModel.deleteOne(query);
        return deleteStatus;
    } catch (e) {
        return null;
    }
}
