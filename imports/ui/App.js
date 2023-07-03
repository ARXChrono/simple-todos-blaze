import { Template } from 'meteor/templating';
import { TasksCollection } from "../api/TasksCollection";
import { ReactiveDict } from 'meteor/reactive-dict';

import './App.html';
import './Task.js';
import "./Login.js";

Template.mainContainer.onCreated(function mainContainerOnCreated() {
  this.state = new ReactiveDict();
});

const HIDE_COMPLETED_STRING = "hideCompleted";

Template.mainContainer.events({
  "click #hide-completed-button"(event, instance) {
    const currentHideCompleted = instance.state.get(HIDE_COMPLETED_STRING);
    instance.state.set(HIDE_COMPLETED_STRING, !currentHideCompleted);
  }
});

const getUser = () => Meteor.user();
const isUserLogged = () => !!getUser();

Template.mainContainer.helpers({
  isUserLogged() {
    return isUserLogged();
  },
  tasks() {
    const instance = Template.instance();
    const hideCompleted = instance.state.get(HIDE_COMPLETED_STRING);
    const hideCompletedFilter = { isChecked: { $ne: true } };

    return TasksCollection.find(hideCompleted ? hideCompletedFilter : {}, {
      sort: { createdAt: -1 },
    }).fetch();
  },
  hideCompleted() {
    return Template.instance().state.get(HIDE_COMPLETED_STRING);
  },
  incompleteCount() {
    // we are filtering the results here
    const incompleteTasksCount = TasksCollection.find({ isChecked: { $ne: true } }).count();
    return incompleteTasksCount ? `(${incompleteTasksCount})` : '';
  },
});

Template.form.events({
  "submit .task-form"(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    // Insert a task into the collection
    TasksCollection.insert({
      text,
      createdAt: new Date(), // current time
    });

    // Clear form
    target.text.value = '';
  }
})