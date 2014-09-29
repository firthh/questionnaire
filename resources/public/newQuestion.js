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
        setInterval(this.loadQuestionsFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
                <div className="questionare">
                <h1>Questions</h1>
                <QuestionList data={this.state.data}/>
                <NewQuestion onAddQuestionSubmit={this.handleAddNewQuestion} url={this.props.url} />
                </div>
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

var Answer = React.createClass({
    render: function() {
        return (
                <div>
                <input type="checkbox" />{this.props.children}
                </div>
        );
    }
});

var Question = React.createClass({
    render: function() {
        var answers = this.props.answers.map(function(answer){
            return (
                    <Answer>{answer.text}</Answer>
            );
        });
        return (
                <div className="question">
                <h2 className="questionAuthor">{this.props.id}. {this.props.children}?</h2>
                <p>{this.props.author}</p>
                {answers}
                </div>
        );
    }
});


React.renderComponent(
        <Questionnaire url="questions.json" pollInterval={2000} />,
    document.getElementById('content')
);
