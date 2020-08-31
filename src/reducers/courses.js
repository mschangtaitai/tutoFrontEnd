import {combineReducers} from 'redux'
import omit from 'lodash/omit';
import includes from 'lodash/includes'

import * as types from '../types/courses';


const byId = (state = {}, action) => {
    switch(action.type) {
        case types.COURSE_FETCH_COMPLETED: {
            const { entities, order } = action.payload;
            const newState = { ...state };
            order.forEach(id => {
                newState[id] = {
                    ...entities[id],
                    isConfirmed: true,
                };
            });

            return newState;
        }
        case types.COURSE_ADD_STARTED: {
            const newState = { ...state };
            newState[action.payload.id] = {
                ...action.payload,
                isConfirmed: false,
            };
            return newState;
        }
        case types.COURSE_ADD_COMPLETED: {
            const { oldId, course } = action.payload;
            const newState = omit(state, oldId);
            newState[course.id] = {
                ...course,
                isConfirmed: true,
            };
            return newState;
        }
        case types.COURSE_REMOVE_STARTED: {
            return omit(state, action.payload.id);
        }
        default: {
            return state;
        }
    }
};

const order = (state = [], action) => {
    switch(action.type) {
        case types.COURSE_FETCH_COMPLETED: {
            return [...state, ...action.payload.order.filter(newElement => !includes(state, newElement))];
        }
        case types.COURSE_ADD_STARTED: {
            return [...state, action.payload.id];
        }
        case types.COURSE_ADD_COMPLETED: {
            const { oldId, course } = action.payload;
            return state.map(id => id === oldId ? course.id : id);
        }
        case types.COURSE_REMOVE_STARTED: {
            return state.filter(id => id !== action.payload.id);
        }
        default: {
            return state;
        }
    }
};

const selected = (state = null, action) => {
    switch (action.type) {
        case types.COURSE_SELECTED: {
            return action.payload.id
        }
        case types.COURSE_DESELECTED: {
            return null
        }
        default:{
            return state
        }
    }
}

const isFetching = (state = false, action) => {
    switch(action.type) {
        case types.COURSE_FETCH_STARTED: {
            return true;
        }
        case types.COURSE_FETCH_COMPLETED: {
            return false;
        }
        case types.COURSE_FETCH_FAILED: {
            return false;
        }
        default: {
            return state;
        }
    }
};

const error = (state = null, action) => {
    switch(action.type) {
        case types.COURSE_FETCH_FAILED: {
            return action.payload.error;
        }
        case types.COURSE_FETCH_STARTED: {
            return null;
        }
        case types.COURSE_FETCH_COMPLETED: {
            return null;
        }
        default: {
            return state;
        }
    }
};


export default combineReducers({
    byId,
    order,
    selected,
    isFetching,
    error,
});

export const getCourseByID = (state, id) => state.byId[id];
export const getCourseOrder = (state) => state.order;
export const getAllCourses = (state) =>state.order.map(id => getCourseByID(state, id));
export const getSelectedCourse = (state) => getCourseByID(state, state.selected);
export const getIsFetching = (state) => state.isFetching;