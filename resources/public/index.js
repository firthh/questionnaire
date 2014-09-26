/** @jsx React.DOM */
var data = [
    {author: "Pete Hunt", text: "This is one comment"},
    {author: "Jordan Walke", text: "This is *another* comment"}
];

var Questionare = React.createClass({
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
    handleAddNewQuestion : function(comment) {
        var comments = this.state.data;
        var newComments = comments.concat([comment]);
        this.setState({data: newComments});
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(comment),
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
                <div className="commentBox">
                <h1>Questions</h1>
                <QuestionList data={this.state.data}/>
                <NewQuestion onCommentSubmit={this.handleAddNewQuestion}/>
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
                <div className="commentList">
                {commentNodes}
                </div>
        );
    }
});

var Question = React.createClass({
    render: function() {
        return (
                <div className="comment">
                <h2 className="commentAuthor">{this.props.author}</h2>
                {this.props.children}
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
        this.props.onCommentSubmit({author: author, text: text});
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
                </form>
        );
    }
});

React.renderComponent(
        <Questionare url="questions.json" pollInterval={2000} />,
    document.getElementById('content')
);
