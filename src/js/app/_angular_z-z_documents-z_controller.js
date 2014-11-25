app.controller('WtEmployerApplicationDocumentsController', function($scope) {
  $scope.confirm_modal_data = {};

  $scope.ShowConfirmModal = function(attributes) {
    $scope.confirm_modal_data = JSON.parse(attributes);
    $('#wt-employer-application-document-confirm-modal').modal('show');
  }

  $scope.CloseConfirmModal = function() {
    $('#wt-employer-application-document-confirm-modal').modal('hide');
    $scope.confirm_modal_data = {};
  }

  $scope.ShowHistoryModal = function(attributes) {
    $scope.history_modal_data = JSON.parse(attributes);
    $('#wt-employer-application-document-history-modal').modal('show');
  }

  $scope.CloseHistoryModal = function() {
    $('#wt-employer-application-document-history-modal').modal('hide');
    $scope.history_modal_data = {};
  }

  $scope.reloadPage = function() {
    window.location = window.location.href.split(/\?|#/)[0];
  }
});
