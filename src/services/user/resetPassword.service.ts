import ResetPasswordIdModel, { resetPasswordCreateInput, resetPasswordFilter } from "../../models/resetPassword.model";

export async function createResetPassword(input: resetPasswordCreateInput) {
    try {
        const resetPasswordIdObject = await ResetPasswordIdModel.create(input);
        return resetPasswordIdObject;
    } catch (e) {
        return null;
    }
}

export async function findResetPassword(query: resetPasswordFilter) {
    try {
        const resetPasswordIdObject = await ResetPasswordIdModel.findOne(query).lean();
        return resetPasswordIdObject;
    } catch (e) {
        return null;
    }
}

export async function deleteResetPassword(query: resetPasswordFilter) {
    try {
        const deleteStatus = await ResetPasswordIdModel.deleteOne(query);
        return deleteStatus;
    } catch (e) {
        return null;
    }
}
