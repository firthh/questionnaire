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

var NewAnswerList = React.createClass({

});

var NewAnswer = React.createClass({
    getValue: function() {
        return this.refs.answer.getDOMNode().value.trim();
    },
    render: function() {
        return(
                <input type="text" placeholder="answer" ref="answer" />
        );
    }
});

var NewQuestion = React.createClass({
    getInitialState: function() {
        return({
            author:"",
            text:"",
            answers:[]
        });
    },
    handleSubmit: function(e) {
        e.preventDefault();
        alert(this.refs.answer.getValue());
        var author = this.refs.author.getDOMNode().value.trim();
        var text = this.refs.text.getDOMNode().value.trim();
        if (!text || !author) {
            return;
        }
        this.props.onAddQuestionSubmit({author: author, text: text});
        this.refs.author.getDOMNode().value = '';
        this.refs.text.getDOMNode().value = '';
        return;
    },

    render: function() {
        return (
                <form className="commentForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Your name" ref="author" />
                <input type="text" placeholder="Say something..." ref="text" />
                <input type="submit" value="Post" />
                <NewAnswer ref="answer" />
                </form>
        );
    }
});

React.renderComponent(
        <Questionnaire url="questions.json" pollInterval={2000} />,
    document.getElementById('content')
);
