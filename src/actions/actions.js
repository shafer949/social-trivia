import * as types from './actionTypes';

export function submitAnswer(answer) {
    return {
        type: types.SUBMIT_ANSWER,
        answer
    };
} 