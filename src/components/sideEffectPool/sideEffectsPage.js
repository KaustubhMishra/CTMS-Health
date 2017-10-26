import React, {PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import {browserHistory, Link} from 'react-router';
import Header from '../common/Header';
import Leftmenu from '../common/Leftmenu';
import Footer from '../common/Footer';
import { Conditional } from 'react-conditional-render';
import * as RolesandPermission from '../common/RolesandPermission';
import SideEffectsList from './sideEffectsList';
import * as sideEffectsActions from '../../actions/sideEffectsActions';
import Pagination from "react-js-pagination";
import toastr from 'toastr';

let search = {
  params: {
    "pageNumber": 1,
    "pageSize": 10
  }
};

class sideEffectsPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state ={
      search:search
    };

    this.sideEffectData = '';
    this.getAllSideEffectsList(search);
    this.deleteSource = this.deleteSource.bind(this);
    this.ConfirmDelete = this.ConfirmDelete.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }
  
  handlePageChange(pageNumber) {
    console.log(pageNumber)
    this.setState({activePage: pageNumber});
    this.state.search.params.pageNumber = pageNumber;
    this.getAllSideEffectsList(this.state.search);
  } 
  
  getAllSideEffectsList(search) {
    this.props.actions.loadSideEffects(search);
  }

  ConfirmDelete(){

     if(this.sideEffectData)
      {
        this.props.actions.deleteSideEffect(this.sideEffectData)
        .then(() => 
          this.redirect(),
          toastr.success('Side Effect Deleted SuccessFully.')
        )
        .catch(error => {
          toastr.error(error);
          this.setState({saving: false});
        });
      }
      else {
        return false;
      }

  }

   redirect() {
    this.setState({saving: false});
    this.state.search.params = {
            "pageNumber": 1,
            "pageSize": 10,
            "sortBy": "createdAt",
            "sortOrder": "desc"
        }

    this.getAllSideEffectsList(this.state.search);
  }

  deleteSource(sideEffect) {
    this.sideEffectData = sideEffect;
    console.log(this.sideEffectData);
     
  }

    render() {
        return (
      <div>
            <Header/>
            <div className="modal fade" id="deleteModal" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                  <h4 className="modal-title">Delete Side Effect</h4>
                </div>
                <div className="modal-body">
                  <p>Are You Sure You Want To Delete Side Effect ?</p>
                </div>
                <div className="modal-footer">
                  <div className="btn-group">
                     <button type="button" className="btn blue set-width" data-dismiss="modal" onClick={this.ConfirmDelete} >Delete </button> 
                     <button type="button" className="btn blue set-width" data-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
            <section id="container" className="container-wrap">
                <Leftmenu/>
                <section className="container-fluid">
                  <section className="page-title">
                    <div className="pull-left">
                      <h1>Side Effect Pool</h1>
                      <div className="breadcrumbs">
                       <span>Side Effect Pool</span><a>side Effects </a>
                      </div>
                    </div>
                   <div className="pull-right right-head">
                    <Conditional condition={RolesandPermission.permissionCheck("SIDE_EFFECT_ADD_UPDATE") ==true}>
                      <Link className="btn btn-border pull-left" to="/sideEffect">Add Side Effects <i className="fa fa-plus-circle"></i> 
                      </Link>
                    </Conditional>                       
                  </div> 
                  </section>
                  <section className="box-trials">
                    <div className="head">
                      <h2>Side Effects</h2>
                    </div>
                    <div className="pt-data-table">
                      <SideEffectsList sideEffects={this.props.sideEffects} onDeletesideEffect={this.deleteSource}/>
                    </div>
                    <div className="pull-right">
                      <Conditional condition={this.props.sideEffectsCount > 10}>
                        <Pagination
                          activePage={this.state.search.params.pageNumber}
                          itemsCountPerPage={this.state.search.params.pageSize}
                          totalItemsCount={this.props.sideEffectsCount}
                          pageRangeDisplayed={5}
                          onChange={this.handlePageChange}
                        />
                      </Conditional>
                    </div>
                  </section>
                </section>
                <Footer/>
              </section>
            </div>
        );
    }
}

sideEffectsPage.propTypes = {
  actions: PropTypes.object.isRequired,
  sideEffects: PropTypes.array.isRequired,
  onDeletesideEffect: PropTypes.func.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    sideEffects: !_.isUndefined(state.sideEffects.rows) ? state.sideEffects.rows : state.sideEffects,
    sideEffectsCount: !_.isUndefined(state.sideEffects.count) ? state.sideEffects.count : state.sideEffects.count
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(sideEffectsActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(sideEffectsPage);
