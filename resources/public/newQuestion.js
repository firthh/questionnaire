/** @jsx React.DOM */

var Answer = React.createClass({
    render: function() {
        return (
                <div>
                {this.props.id}. {this.props.children}
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
        answer.id = this.state.answers.length + 1;
        var newAnswers = this.state.answers.concat(answer);
        this.setState({answers: newAnswers});
    },
    render: function() {
        var answers = this.state.answers.map(function(answer){
            return (
                    <Answer id={answer.id}>{answer.text}</Answer>
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
        var answers = this.refs.answers.getValue();
        console.log(answers);
        if (!text || !author || (answers.length === 0)) {
            return;
        }
        this.props.onAddQuestionSubmit({author: author, text: text, answers: answers});
        this.refs.author.getDOMNode().value = '';
        this.refs.text.getDOMNode().value = '';
        this.refs.answers.clearState();
        return;
    },

    render: function() {
        return (
                <form className="commentForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Your name" ref="author" />
                <input type="text" placeholder="Your question..." ref="text" />
                <input type="submit" value="Post" />
                <NewAnswerList ref="answers"/>
                </form>
        );
    }
});
