/* @flow */
'use strict';
let Reflux = require('reflux');
let actions = require('../actions');
let axios = require('axios');

let JobOfferGroupStore = Reflux.createStore({
  resourceName: 'jobOfferGroups',
  listenables: actions.JobOfferGroupActions,

  create (data) {
    return axios({
      url: '/job_offer_groups.json',
      method: 'post',
      data: { job_offer_group: data },
    });
  },

  destroy (jobOfferGroupId) {
    return axios({
      url: `/job_offer_groups/${jobOfferGroupId}.json`,
      method: 'post',
      data: '_method=DELETE',
    })
    .then(() => {
      this.data = this.data.filter(jobOfferGroup => (
        jobOfferGroup.id !== jobOfferGroupId
      ));
      this.trigger(this.data);
    }, () => {
      global.location = global.location;
    });
  }
});

module.exports = JobOfferGroupStore;
