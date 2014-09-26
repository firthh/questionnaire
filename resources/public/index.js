/** @jsx React.DOM */
var data = [
    {author: "Pete Hunt", text: "This is one comment"},
    {author: "Jordan Walke", text: "This is *another* comment"}
];

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
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(question),
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
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
                <NewQuestion onAddQuestionSubmit={this.handleAddNewQuestion}/>
                </div>
        );
    }
});

var QuestionList = React.createClass({
    render: function() {
        var commentNodes = this.props.data.map(function(comment) {
            return(
                <Question author={comment.author}>{comment.text}</Question>
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
        return (
                <div className="question">
                <h2 className="questionAuthor">{this.props.author}</h2>
                {this.props.children}
            </div>
        );
    }
});

var Answer = React.createClass({
    render: function() {
        return (
                <div>
                {this.props.text}
            </div>
        );
    }
});

var NewAnswerList = React.createClass({
    getInitialState: function() {
        return { answers: [] };
    },
    getValue: function(){
        return this.state.answers;
    },
    clearState: function() {
        this.setState( { answers: [] } );
    },
    handleNewAnswer: function (answer){
        var newAnswers = this.state.answers.concat(answer);
        this.setState({answers: newAnswers});
    },
    render: function() {
        var answers = this.state.answers.map(function(answer){
            return (
                    <Answer text={answer}/>
            );
        });
        return (
                <div className="answerList">
                {answers}
                <div>
                <NewAnswer handleNewAnswer={this.handleNewAnswer} />
                </div>
                </div>
        );
    }
});

var NewAnswer = React.createClass({
    handleNewAnswer: function() {
        var text = this.refs.answer.getDOMNode().value.trim();
        if(!text) { return; }
        this.props.handleNewAnswer({ text: text });
        this.refs.answer.getDOMNode().value = '';
        return;
    },
    render: function() {
        return(
                <div>
                <input type="text" placeholder="answer" ref="answer" />
                <input type="button" text="new answer" value="new answer" onClick={this.handleNewAnswer}/>
                </div>
        );
    }
});

var NewQuestion = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        var author = this.refs.author.getDOMNode().value.trim();
        var text = this.refs.text.getDOMNode().value.trim();
        if (!text || !author) {
            return;
        }
        this.props.onAddQuestionSubmit({author: author, text: text});
        this.refs.author.getDOMNode().value = '';
        this.refs.text.getDOMNode().value = '';
        this.refs.answers.clearState();
        return;
    },

    render: function() {
        return (
                <form className="commentForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Your name" ref="author" />
                <input type="text" placeholder="Say something..." ref="text" />
                <input type="submit" value="Post" />
                <NewAnswerList ref="answers"/>
                </form>
        );
    }
});

React.renderComponent(
        <Questionnaire url="questions.json" pollInterval={2000} />,
    document.getElementById('content')
);
