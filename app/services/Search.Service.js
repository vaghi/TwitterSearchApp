(function () {
    'use strict';

    angular
    .module('MyTweeterApp.Services', [] )
    .service('MyTweeterApp.Services.Search.Service', SearchService);

    SearchService.$inject = ['$http'];

    function SearchService($http) {
        var service = this;

        var uri = "https://vaghiagustin.000webhostapp.com/";
        var tweets_action = "tweets_json.php";

        /** API **/
        service.GetTweets = getTweets;

        function getTweets(parameter, quantity, success, error) {

            $http({
                method : "GET",
                url : uri + tweets_action + '?q=' + parameter + '&count=' + quantity
            }).then(function mySuccess(response) {
                success(response.data);
            }, function myError(response) {
                error(response);
            });
        }
    }

})();
