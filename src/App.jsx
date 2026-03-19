import { Component } from "react";
import { Footer } from "./Footer";
import { Question } from "./Question";

let questionsRequest;

const fetchQuestions = async () => {
  if (!questionsRequest) {
    questionsRequest = fetch("/api/questions")
      .then((response) => response.json())
      .then(({ data = [] }) => data)
      .catch((error) => {
        questionsRequest = undefined;
        throw error;
      });
  }

  return questionsRequest;
};

export class App extends Component {
  state = {
    questions: [],
    currentQuestion: 0,
    loading: true,
  };

  componentDidMount() {
    fetchQuestions()
      .then((questions) => {
        this.setState({ questions, loading: false });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ questions: [], loading: false });
      });
  }

  setQuestion = (index) => {
    this.setState({ currentQuestion: index });
  };

  render() {
    if (this.state.loading) {
      return (
        <div className="question">
          <div className="card">
            <p>Loading questions...</p>
          </div>
        </div>
      );
    }

    const question = { ...this.state.questions[this.state.currentQuestion] };

    return (
      <div>
        <Question
          index={this.state.currentQuestion}
          totalNumberOfQuestions={this.state.questions.length}
          {...question}
          setQuestion={this.setQuestion}
        />
        <Footer />
      </div>
    );
  }
}
