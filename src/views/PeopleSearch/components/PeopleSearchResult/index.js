import React, { Component } from 'react';
// import { withStyles } from '@material-ui/core/styles';
// import classnames from 'classnames';
import Grid from '@material-ui/core/Grid';
// import Card from '@material-ui/core/Card';
// import CardContent from '@material-ui/core/CardContent';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import user from '../../../../services/user';
import Divider from '@material-ui/core/Divider';
import { Link } from 'react-router-dom';
import './peopleSearchResult.css';

export default class PeopleSearchResult extends Component {
  constructor(props) {
    super(props);

    this.state = {
      avatar: null,
      prefImage: null,
      defImage: null,
    };
  }

  componentDidUpdate(newProps) {
    if (this.props.Person.AD_Username !== newProps.Person.AD_Username) {
      this.loadAvatar();
    }
  }

  componentWillMount() {
    this.loadAvatar();
  }

  async loadAvatar() {
    this.setState({ avatar: null });
    const [{ def: defaultImage, pref: preferredImage }] = await Promise.all([
      await user.getImage(this.props.Person.AD_Username),
    ]);
    const avatar = preferredImage || defaultImage;
    this.setState({ avatar });
  }

  render() {
    const { Person } = this.props;
    let personClassJobTitle, personType, nickname;

    console.log('person: ', Person);
    // CHECK FOR PERSON TYPE
    if (Person.PersonType === 'stualufac' && Person.JobTitle !== undefined) {
      personType = Person.Type;
      personClassJobTitle = Person.JobTitle;
    } else if (Person.PersonType === 'stualu') {
      personType = 'Student';
      if (
        Person.NickName != null &&
        Person.NickName !== '' &&
        Person.FirstName !== Person.NickName
      ) {
        nickname = '(' + Person.NickName + ')';
      }
    } else if (Person.PersonType === 'alu') {
      personType = 'Alum';
      if (
        Person.NickName != null &&
        Person.NickName !== '' &&
        Person.FirstName !== Person.NickName
      ) {
        nickname = '(' + Person.NickName + ')';
      }
      personClassJobTitle = 'Class of ' + Person.PreferredClassYear;
    } else if (Person.PersonType === 'stu') {
      personType = 'Student';
      if (
        Person.NickName != null &&
        Person.NickName !== '' &&
        Person.FirstName !== Person.NickName
      ) {
        nickname = '(' + Person.NickName + ')';
      }
    }

    if (Person.PersonType === 'fac' && Person.JobTitle !== undefined) {
      personClassJobTitle = Person.JobTitle;
      personType = Person.Type;
      if (
        Person.NickName !== null &&
        Person.NickName !== '' &&
        Person.FirstName !== Person.NickName
      ) {
        nickname = '(' + Person.NickName + ')';
      }
    } else if (Person.Type === 'Student') {
      switch (Person.Class) {
        case '1':
          personClassJobTitle = 'Freshman';
          break;
        case '2':
          personClassJobTitle = 'Sophomore';
          break;
        case '3':
          personClassJobTitle = 'Junior';
          break;
        case '4':
          personClassJobTitle = 'Senior';
          break;
        case '5':
          personClassJobTitle = 'Graduate Student';
          break;
        case '6':
          personClassJobTitle = 'Undergraduate Conferred';
          break;
        case '7':
          personClassJobTitle = 'Graduate Conferred';
          break;
        default:
          personClassJobTitle = '--';
          break;
      }
    }

    return (
      <section>
        <Divider />
        <Link to={`profile/${Person.AD_Username}`}>
          <Grid
            container
            direction="row"
            alignItems="center"
            spacing={16}
            style={{
              padding: '1rem',
            }}
          >
            <Grid item xs={1}>
              <img className="avatar" src={`data:image/jpg;base64,${this.state.avatar}`} alt="" />
            </Grid>
            <Grid item xs={3}>
              <Typography>
                {Person.FirstName} {nickname}{' '}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography>{Person.LastName}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography>{personType}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography>{personClassJobTitle}</Typography>
            </Grid>
          </Grid>
        </Link>
        <Divider />
      </section>
    );
  }
}

PeopleSearchResult.propTypes = {
  person: PropTypes.shape({
    First_Name: PropTypes.string.isRequired,
    Last_Name: PropTypes.string.isRequired,
    Email: PropTypes.string.isRequired,
  }).isRequired,
};
