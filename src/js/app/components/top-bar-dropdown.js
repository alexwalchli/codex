import React, { Component } from 'react'

export default class TopBarDropdown extends Component {
  constructor (props) {
    super(props)
    this.state = {
      listVisible: false
    }

    this.hide = this.hide.bind(this)
  }

  select (item) {
    const { onItemSelected } = this.props
    this.props.selected = item
    onItemSelected(item)
  }

  show () {
    this.setState({ listVisible: true })
    document.addEventListener('click', this.hide)
  }

  hide () {
    this.setState({ listVisible: false })
    document.removeEventListener('click', this.hide)
  }

  render () {
    return (
      <div>
        <div className={'dropdown-container' + (this.state.listVisible ? ' show' : '')}>
          <div className={'dropdown-display' + (this.state.listVisible ? ' clicked' : '')} onClick={() => this.show()}>
            <a><i className={this.props.iconCss} /></a>
          </div>
          <div className='dropdown-list'>
            <div>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderListItems () {
    var items = []
    for (var i = 0; i < this.props.list.length; i++) {
      var item = this.props.list[i]
      items.push(<div onClick={() => this.select(item)}>
        <span style={{ color: item.hex }}>{item.name}</span>
      </div>)
    }
    return items
  }
}

// var Dropdown = React.createClass({
  // getInitialState: function() {
  //   return {
  //     listVisible: false
  //   };
  // },

  // select: function(item) {
  //   this.props.selected = item;
  // },

  // show: function() {
  //   this.setState({ listVisible: true });
  //   document.addEventListener("click", this.hide);
  // },

  // hide: function() {
  //   this.setState({ listVisible: false });
  //   document.removeEventListener("click", this.hide);
  // },

//   render: function() {
//     return <div className={"dropdown-container" + (this.state.listVisible ? " show" : "")}>
//       <div className={"dropdown-display" + (this.state.listVisible ? " clicked": "")} onClick={this.show}>
//         <span style={{ color: this.props.selected.hex }}>{this.props.selected.name}</span>
//         <i className="fa fa-angle-down"></i>
//       </div>
//       <div className="dropdown-list">
//         <div>
//           {this.renderListItems()}
//         </div>
//       </div>
//     </div>;
//   },

//   renderListItems: function() {
//     var items = [];
//     for (var i = 0; i < this.props.list.length; i++) {
//       var item = this.props.list[i];
//       items.push(<div onClick={this.select.bind(null, item)}>
//         <span style={{ color: item.hex }}>{item.name}</span>
//       </div>);
//     }
//     return items;
//   }
// });

