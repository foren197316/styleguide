var JobOfferGroupsIndex = React.createClass({
  mixins: [SetUrlsMixin],

  render: function () {
    return (
      <div className="row">
        <div className="col-md-3">
          <SearchFilter title="Search" searchOn="participant_names" actions={JobOfferGroupActions} />
          <BooleanFilter title="Participant Agreement" label="All Signed" action={JobOfferGroupActions.toggleAllSigned} />
          <CheckBoxFilter title="Program" store={ProgramStore} actions={ProgramActions} />
          <CheckBoxFilter title="Employer" store={EmployerStore} actions={EmployerActions} />
          <CheckBoxFilter title="Coordinator" store={StaffStore} actions={StaffActions} />
        </div>
        <div className="col-md-9">
          <JobOfferGroupsPanel />
        </div>
      </div>
    )
  }
});
