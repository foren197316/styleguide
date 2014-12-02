app.controller('WtEmployerApplicationDocumentConfirmModalController', function($scope, $http) {
  $scope.SubmitConfirmForm = function(activity) {
    $http.post(
      $scope.confirm_modal_data.action,
      {
        activity: activity
      }
    )
    .success(function(data) {
      $scope.reloadPage();
    })
    .error(function(data) {
      $("[ng-controller='WtEmployerApplicationDocumentConfirmModalController'] button[type='submit']").removeAttr('disabled');
      $scope.ResetConfirmFormErrors(activity);

      angular.forEach(data.errors, function(errors, field) {
        $scope.activity_form[field].$error   = errors.join(', ');
        $scope.activity_form[field].$invalid = true;
      });
    });
  }

  $scope.CloseConfirmForm = function(activity) {
    $scope.CloseConfirmModal();
    $scope.ResetConfirmForm();
    $scope.ResetConfirmFormErrors(activity);
  }

  $scope.ResetConfirmForm = function() {
    $scope.activity = {
      status:     "accepted",
      expires_at: null
    };
  }

  $scope.ResetConfirmFormErrors = function(activity) {
    for(key in activity) {
      if($scope.activity_form[key].$error) {
        $scope.activity_form[key].$error   = null;
        $scope.activity_form[key].$invalid = false;
      }
    }
  }

  $scope.ResetConfirmForm();
});
