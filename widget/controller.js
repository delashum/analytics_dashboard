angular.module('app', [])

.controller('main', ['$scope', function ($scope) {
    $scope.Init = function () {
        chrome.runtime.sendMessage({
            request: "popupData"
        }, function (response) {
            $scope.data = response;
            $scope.$apply();
        });
    }

    $scope.ParseTime = function (unix) {
        return moment(unix).format("mm:ss");
    }
}]);