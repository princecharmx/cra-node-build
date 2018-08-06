import React from 'react';
import { connect } from 'react-redux';
import { internalNotesPost, getSingleVoucher } from '../../../../actions';
import cookie from 'react-cookies';

class SPCDHelper extends React.Component {
  state = {
    notesPayload: {
      note: '',
      byName: cookie.load('userName'),
      showNotes: false
    }
  };

  toggleShowNotes = () => {
    this.setState({
      showNotes: !this.state.showNotes
    });
  };
  handleNoteCloseClick = () => {
    this.setState({
      showNotes: !this.state.showNotes,
      notesPayload: {
        ...this.state.notesPayload,
        note: ''
      }
    });
  };

  handleNoteAddClick = voucherID => {
    if (this.state.notesPayload.note !== '') {
      this.props
        .internalNotesPost(this.state.notesPayload, voucherID)
        .then(data => {
          this.setState(
            {
              notesPayload: {
                ...this.state.notesPayload,
                note: ''
              },
              showNotes: !this.state.showNotes
            },
            () => {
              this.props.getSingleVoucher(voucherID, 'purchase');
            }
          );
        })
        .catch(error => {
          alert(
            error.response && error.response.data && error.response.data !== null
              ? error.response.data.error.message
              : 'Something went wrong, please try again!'
          );
        });
    }
  };

  onChangeHandler = value => {
    this.setState({
      notesPayload: {
        ...this.state.notesPayload,
        note: value
      }
    });
  };

  getStateAndHelper() {
    return {
      handleNoteAddClick: this.handleNoteAddClick,
      state: this.state,
      handleNoteCloseClick: this.handleNoteCloseClick,
      onChangeHandler: this.onChangeHandler,
      toggleShowNotes: this.toggleShowNotes
    };
  }

  render() {
    return this.props.children(this.getStateAndHelper());
  }
}

export default connect(null, { internalNotesPost, getSingleVoucher })(SPCDHelper);
