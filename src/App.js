import React, { Component } from "react";
import { Question } from './Question';

export class App extends Component {
  state = {
    questions: [],
    currentQuestion: 0,
    loading: true
  }

  componentDidMount() {
    fetch('questions.json')
      .then(data => data.json())
      .then(({ questions }) => this.setState({ questions: this.shuffle(questions), loading: false }))
      .catch(e => console.error(e));
  }

  setQuestion = (index) => {
    this.setState({ currentQuestion: index });
  }

  shuffle = (array) => {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {

      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  render() {
    if (this.state.loading) return <div />;

    const question = { ...this.state.questions[this.state.currentQuestion] };

    return (
      <div>
        <Question index={this.state.currentQuestion} totalNumberOfQuestions={this.state.questions.length} {...question} setQuestion={this.setQuestion} />
      </div>
    );
  }
}