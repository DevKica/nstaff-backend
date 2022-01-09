import path from 'path'
const localDirname = __dirname

export const defaultUserPhotoName = 'default.jpg'
export const usersPhotosDirName = path.join(localDirname,'..','upload','usersProfilePhotos')
export const userPhotoSizes = {
    thumbnail:[56, 56],
    small:[168, 168],
    medium:[360, 360],
    large:[720, 720],
}