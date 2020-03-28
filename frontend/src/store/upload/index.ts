import * as Typings from './types'
import {createActions, createReducer} from 'reduxsauce'

export const {Types, Creators} = createActions<{
    ADD_UPLOAD: string,
}, {
    addUpload(payload: Typings.AddUploadAcrion['payload']): Typings.AddUploadAcrion 
}>({
    addUpload: ['payload'],
})

export const INITIAL_STATE: Typings.State = {
   uploads: []
}

const reducer = createReducer<Typings.State, Typings.Actions>(INITIAL_STATE, {
    [Types.ADD_UPLOAD]: addUpload as any
})

export default reducer

function addUpload(state = INITIAL_STATE, action: Typings.AddUploadAcrion): Typings.State {
    return {
        
    }
}