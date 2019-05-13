import React from 'react';

export class MessagesBoard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <ul>
          <li>{this.props.displayedMsg}</li>
        </ul>
      </div>
    );
  }
}
