import {Types} from "./index"
import {actionChannel, take, call} from "redux-saga/effects"
import { AddUploadAction, FileInfo } from "./types"
import { Video } from "../../util/models"
import videoHttp from "../../util/http/video-http"

export function* uploadWatcherSaga() {
    const newFilesChannel = yield actionChannel(Types.ADD_UPLOAD) 

    while(true) {
        const {payload}: AddUploadAction = yield take(newFilesChannel)
        for (const fileInfo of payload.files) {
            yield call(uploadFile, {video: payload.video, fileInfo: fileInfo})
        }
        
        console.log(payload)
    }
}

function* uploadFile({video, fileInfo}: {video: Video, fileInfo: FileInfo}) {
    yield call(sendUpload, {id: video.id, fileInfo})
}

function* sendUpload({id, fileInfo}: {id: string, fileInfo: FileInfo}) {
    videoHttp.update(id, {
        [fileInfo.fileField]: fileInfo.file 
    }, {
        config: {
            onUploadProgress(event){
                console.log(event)
            }
        }
    })
}