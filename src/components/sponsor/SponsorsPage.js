import React, {PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import {browserHistory, Link} from 'react-router';
import * as sponsorActions from '../../actions/sponsorActions';
import SponsorList from './SponsorList';
import toastr from 'toastr';
import Header from '../common/Header';
import Leftmenu from '../common/Leftmenu';
import { Conditional } from 'react-conditional-render';
import * as RolesandPermission from '../common/RolesandPermission';
import cookies from 'react-cookie';
import Footer from '../common/Footer';
import Pagination from "react-js-pagination";

let search = {
  params: {
    "pageNumber": 1,
    "pageSize": 10
  }
};

class SponsorsPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state ={
      search:search
    };
    this.sponsorData = '';
    this.getAllSponsorList(search);
    //this.deleteSource = this.deleteSource.bind(this);
    this.ConfirmDelete = this.ConfirmDelete.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    
  }

  handlePageChange(pageNumber) {
    console.log(pageNumber)
    this.setState({activePage: pageNumber});
    this.state.search.params.pageNumber = pageNumber;
    this.getAllSponsorList(this.state.search);
  }
 
  getAllSponsorList(search) {
    this.props.actions.loadSponsors(search);
  }

  ConfirmDelete(sponsor){
    if(confirm("Are you sure you want to delete Sponsor ?")){
      if(sponsor)
      {
        this.props.actions.deleteSponsor(sponsor)
        .then(() => 
          this.redirect(),
        $('#myModal').modal("hide"))
        .catch(error => {
          toastr.error(error);
          this.setState({saving: false});
        });
      }
      else {
        return false;
      }
    }
     

  }
  /*deleteSource(sponsor) {
    this.sponsorData = sponsor;
    console.log(this.sponsorData);
     
  }*/

  redirect() {
    this.setState({saving: false});
    browserHistory.push('/sponsors');
    toastr.success('Sponsor Deleted.');
  }

  render() {
    return (
      <div>
        <Header/>
        <section id="container" className="container-wrap">
          <Leftmenu/>
          <section className="container-fluid">
            <section className="page-title">
              <div className="pull-left">
                <h1>Sponsor</h1>
                <div className="breadcrumbs">
                  <span>Sponsor</span><a>Sponsor List</a>
                </div>
              </div>
              <div className="pull-right right-head">
                <Conditional condition={RolesandPermission.permissionCheck("SPONSOR_ADD_UPDATE") ==true}>
                  <Link className="btn btn-border pull-left" to="/sponsor">Add Sponsor <i className="fa fa-plus-circle"></i> 
                  </Link>
                </Conditional>                       
              </div>
            </section>
            <section className="box-trials">
              <div className="head">
                <h2>Sponsor List</h2>
              </div>
              <div className="pt-data-table">
                <SponsorList sponsors={this.props.sponsors} onDeletSponsor={this.ConfirmDelete}/>
              </div>
              <div className="pull-right">
                <Conditional condition={this.props.sponsorsCount > 10}>
                  <Pagination
                    activePage={this.state.search.params.pageNumber}
                    itemsCountPerPage={this.state.search.params.pageSize}
                    totalItemsCount={this.props.sponsorsCount}
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

SponsorsPage.propTypes = {
  actions: PropTypes.object.isRequired,
  sponsors: PropTypes.array.isRequired,
  onDeletSponsor: PropTypes.func.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    sponsors: !_.isUndefined(state.sponsors.rows) ? state.sponsors.rows : state.sponsors,
    sponsorsCount: !_.isUndefined(state.sponsors.count) ? state.sponsors.count : state.sponsors,
    onDeletSponsor: state.sponsor
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(sponsorActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SponsorsPage);
