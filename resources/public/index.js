/** @jsx React.DOM */

var Questionnaire = React.createClass({
    getInitialState: function() {
        return {data: []};
    },
    loadQuestionsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleAddNewQuestion : function(question) {
        var questions = this.state.data;
        var newQuestions = questions.concat([question]);
        this.setState({data: newQuestions});
    },
    componentDidMount: function() {
        this.loadQuestionsFromServer();
    },
    render: function() {
        return (
                <form className="questionare">
                <h1>Questions</h1>
                <QuestionList data={this.state.data}/>
                <input type="submit" text="submit" value="submit" />
                </form>
        );
    }
});

var QuestionList = React.createClass({
    render: function() {
        var commentNodes = this.props.data.map(function(question) {
            return(
                <Question id={question.id} author={question.author} answers={question.answers}>{question.text}</Question>
            );
        });
        return (
                <div className="questionList">
                {commentNodes}
                </div>
        );
    }
});

var Question = React.createClass({
    render: function() {
        var id = this.props.id;
        var answers = this.props.answers.map(function(answer){
            return (
                    <Answer question={id} id={answer.id}>{answer.text}</Answer>
            );
        });
        return (
                <div className="question">
                <h2 className="questionAuthor">{this.props.id} {this.props.children}</h2>
                <p>{this.props.author}</p>
                {answers}
                </div>
        );
    }
});

var Answer = React.createClass({
    render: function() {
        return (
                <div>
                <input type="radio" name={this.props.question} value={this.props.id}/>{this.props.children}
                </div>
        );
    }
});

React.renderComponent(
        <Questionnaire url="questions.json" pollInterval={2000} />,
    document.getElementById('content')
);
