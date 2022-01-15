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
      .then(({ questions }) => this.setState({ questions, loading: false }))
      .catch(e => console.error(e));
  }

  setQuestion = (index) => {
    this.setState({ currentQuestion: index });
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